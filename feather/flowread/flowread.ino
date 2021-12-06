
#include <Arduino.h>
#include <SPI.h>
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_SPI.h"
#include "Adafruit_BluefruitLE_UART.h"
#include "BluefruitConfig.h"

int sensorPin = A1;    // select the input pin for the potentiometer
int sensorValue = 0; //max is 1023

Adafruit_BluefruitLE_SPI ble(BLUEFRUIT_SPI_CS, BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST);

void error(const __FlashStringHelper*err) {
  Serial.println(err);
  while (1);
}

void setup() {
  while (!Serial);  
  delay(500);
  Serial.begin(115200);
  if ( !ble.begin(VERBOSE_MODE) )
  {
    error(F("Couldn't find Bluefruit, make sure it's in CoMmanD mode & check wiring?"));
  }
   ble.info();
  
  ble.verbose(false); 
 
  //while (! ble.isConnected()) {
   //   delay(500);
  //}
 
  //Serial.println(F("connected!"));
  //ble.setMode(BLUEFRUIT_MODE_DATA);
}

void loop() {
  // read the value from the sensor:
  sensorValue = analogRead(sensorPin);
   
   
  //if (sensorValue > 0){
    //ble.print(sensorValue);
    Serial.println(sensorValue);
    delay(200);
  //}
 
}
