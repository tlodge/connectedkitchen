/*********************************************************************
 This is an example for our nRF52 based Bluefruit LE modules

 Pick one up today in the adafruit shop!

 Adafruit invests time and resources providing this open source code,
 please support Adafruit and open-source hardware by purchasing
 products from Adafruit!

 MIT license, check LICENSE for more information
 All text above, and the splash screen below must be included in
 any redistribution
*********************************************************************/
#include <bluefruit.h>
#include <Adafruit_LittleFS.h>
#include <InternalFileSystem.h>
#include <Adafruit_LSM6DS33.h>
#include <Adafruit_LIS3MDL.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_APDS9960.h>
#include <Adafruit_BMP280.h>
#include <PDM.h>
#include <avr/dtostrf.h>
// BLE Service
BLEDfu  bledfu;  // OTA DFU service
BLEDis  bledis;  // device information
BLEUart bleuart; // uart over ble
BLEBas  blebas;  // battery

Adafruit_APDS9960 apds9960; // proximity, light, color, gesture
Adafruit_LSM6DS33 lsm6ds33; // accelerometer, gyroscope 
Adafruit_BMP280 bmp280; 

uint8_t proximity;
int sensorPin = A1;    // select the input pin for the potentiometer
int sensorValue = 0; //max is 1023
float accel_x, accel_y, accel_z;
float gyro_x, gyro_y, gyro_z;
int32_t mic;
extern PDMClass PDM;
short sampleBuffer[256];  // buffer to read samples into, each sample is 16-bits
volatile int samplesRead; // number of samples read
float temperature;

void setup()
{
  Serial.begin(115200);

//#if CFG_DEBUG
  // Blocking wait for connection when debug mode is enabled via IDE
  //while ( !Serial ) yield();
//#endif
  
  Serial.println("Bluefruit52 BLEUART Example");
  Serial.println("---------------------------\n");

  bmp280.begin();
  // Setup the BLE LED to be enabled on CONNECT
  // Note: This is actually the default behavior, but provided
  // here in case you want to control this LED manually via PIN 19
  Bluefruit.autoConnLed(true);

  // Config the peripheral connection with maximum bandwidth 
  // more SRAM required by SoftDevice
  // Note: All config***() function must be called before begin()
  Bluefruit.configPrphBandwidth(BANDWIDTH_MAX);

  Bluefruit.begin();
  Bluefruit.setTxPower(4);    // Check bluefruit.h for supported values
  Bluefruit.setName("Connected Sponge");
  //Bluefruit.setName(getMcuUniqueID()); // useful testing with multiple central connections
  Bluefruit.Periph.setConnectCallback(connect_callback);
  Bluefruit.Periph.setDisconnectCallback(disconnect_callback);

  // To be consistent OTA DFU should be added first if it exists
  bledfu.begin();

  // Configure and Start Device Information Service
  bledis.setManufacturer("Adafruit Industries");
  bledis.setModel("Bluefruit Feather52");
  
  bledis.begin();

  // Configure and Start BLE Uart Service
  bleuart.begin();

  // Start BLE Battery Service
  blebas.begin();
  blebas.write(100);

  // Set up and start advertising
  startAdv();

  Serial.println("Please use Adafruit's Bluefruit LE app to connect in UART mode");
  Serial.println("Once connected, enter character(s) that you wish to send");

  lsm6ds33.begin_I2C();

  if ( !apds9960.begin()) {
    Serial.println("APDS9960 sensor not working. Check your wiring.");
    // stop the sketch:
    while (true);
  }

  apds9960.enableProximity(true);
  PDM.onReceive(onPDMdata);
  PDM.begin(1, 16000);
}

void startAdv(void)
{
  // Advertising packet
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();

  // Include bleuart 128-bit uuid
  Bluefruit.Advertising.addService(bleuart);

  // Secondary Scan Response packet (optional)
  // Since there is no room for 'Name' in Advertising packet
  Bluefruit.ScanResponse.addName();
  
  /* Start Advertising
   * - Enable auto advertising if disconnected
   * - Interval:  fast mode = 20 ms, slow mode = 152.5 ms
   * - Timeout for fast mode is 30 seconds
   * - Start(timeout) with timeout = 0 will advertise forever (until connected)
   * 
   * For recommended advertising interval
   * https://developer.apple.com/library/content/qa/qa1931/_index.html   
   */
  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244);    // in unit of 0.625 ms
  Bluefruit.Advertising.setFastTimeout(30);      // number of seconds in fast mode
  Bluefruit.Advertising.start(0);                // 0 = Don't stop advertising after n seconds  
}

void loop()
{
  // Forward data from HW Serial to BLEUART
  //while (Serial.available())
  //{
    // Delay to wait for enough input, since we have a limited transmission buffer
    //delay(2);
    
     
    sensors_event_t accel;
    sensors_event_t gyro;
    sensors_event_t temp;
  
    lsm6ds33.getEvent(&accel, &gyro, &temp);
    
    accel_x = accel.acceleration.x;
    accel_y = accel.acceleration.y;
    accel_z = accel.acceleration.z;

    gyro_x = gyro.gyro.x;
    gyro_y = gyro.gyro.y;
    gyro_z = gyro.gyro.z;
 
    proximity = apds9960.readProximity();

    samplesRead = 0;
    mic = getPDMwave(4000);
    temperature = bmp280.readTemperature();
  
    int pressure = analogRead(sensorPin);
    char buf[32];
    sprintf(buf, "%s %s %s %s %s %s %d %s %u\n",String(accel_x).c_str(),String(accel_y).c_str() ,String(accel_z).c_str(), String(gyro_x).c_str(),String(gyro_y).c_str() ,String(gyro_z).c_str(), pressure, String(temperature).c_str(), mic);   
    bleuart.write( buf );
    delay(500);

  // Forward from BLEUART to HW Serial
  //while ( bleuart.available() )
  //{
  //  uint8_t ch;
  //  ch = (uint8_t) bleuart.read();
  //  Serial.write(ch);
 // }
}

// callback invoked when central connects
void connect_callback(uint16_t conn_handle)
{
  // Get the reference to current connection
  BLEConnection* connection = Bluefruit.Connection(conn_handle);

  char central_name[32] = { 0 };
  connection->getPeerName(central_name, sizeof(central_name));

  Serial.print("Connected to ");
  Serial.println(central_name);
}

/**
 * Callback invoked when a connection is dropped
 * @param conn_handle connection where this event happens
 * @param reason is a BLE_HCI_STATUS_CODE which can be found in ble_hci.h
 */
void disconnect_callback(uint16_t conn_handle, uint8_t reason)
{
  (void) conn_handle;
  (void) reason;

  Serial.println();
  Serial.print("Disconnected, reason = 0x"); Serial.println(reason, HEX);
}

int32_t getPDMwave(int32_t samples) {
  short minwave = 30000;
  short maxwave = -30000;

  while (samples > 0) {
    if (!samplesRead) {
      yield();
      continue;
    }
    for (int i = 0; i < samplesRead; i++) {
      minwave = min(sampleBuffer[i], minwave);
      maxwave = max(sampleBuffer[i], maxwave);
      samples--;
    }
    // clear the read count
    samplesRead = 0;
  }
  return maxwave - minwave;
}

void onPDMdata() {
  // query the number of bytes available
  int bytesAvailable = PDM.available();

  // read into the sample buffer
  PDM.read(sampleBuffer, bytesAvailable);

  // 16-bit, 2 bytes per sample
  samplesRead = bytesAvailable / 2;
}
