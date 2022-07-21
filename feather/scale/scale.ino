#include <Q2HX711.h>

const byte hx711_data_pin = 4;
const byte hx711_clock_pin = 5;

float cm = 201.0; // calibrated mass to be added
long x1 = 0L;
long x0 = 0L;
float avg_size = 10.0; // amount of averages for each mass measurement

Q2HX711 hx711(hx711_data_pin, hx711_clock_pin); // prep hx711
//201g
void setup() {
  Serial.begin(115200); // prepare serial port
  Serial.println("settling");
  delay(1000); // allow load cell and hx711 to settle
  Serial.println("settled");
  // tare procedure
  for (int ii=0;ii<int(avg_size);ii++){
    delay(100);
    x0+=hx711.read();
  }
  Serial.println("x0");
  Serial.println(x0);

  x0/=long(avg_size);
  Serial.println("average is");
  Serial.println(x0);
  Serial.println("Add Calibrated Mass");
  // calibration procedure (mass should be added equal to cm)
  int ii = 1;
  while(true){
    if (hx711.read()<(x0+10000)){
      Serial .print(".");
      delay(100);
    } else {
      ii++;
      delay(2000);
      for (int jj=0;jj<int(avg_size);jj++){
        x1+=hx711.read();
      }
      x1/=long(avg_size);
      break;
    }
  }
  Serial.println("Calibration Complete");
}

void loop() {
  // averaging reading
  long reading = 0;
  for (int jj=0;jj<int(avg_size);jj++){
    reading+=hx711.read();
  }
  reading/=long(avg_size);
  // calculating mass based on calibration and linear fit
  float ratio_1 = (float) (reading-x0);
  float ratio_2 = (float) (x1-x0);
  float ratio = ratio_1/ratio_2;
  float mass = cm*ratio;
  Serial.print("Raw: ");
  Serial.print(reading);
  Serial.print(", ");
  Serial.println(mass);
}
