import './App.css';
import React, { Suspense, useRef, useState, useMemo, useEffect } from "react";
import './ColorMaterial'
import Dashboard from './Dashboard'
import Gyro from './Gyro'

const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

let uBitDevice;
let rxCharacteristic;
const BASEREADING = 17032;
const BASELINE = 260;


function App() {
  
  const [spongeData, _setSpongeData] = useState([]);

  const spongeRef = React.useRef(spongeData);


  const setSpongeData = (data)=>{
    spongeRef.current = data;
    _setSpongeData(data);
   
  } 

  const handleWeight = (service)=>{
    
    const THRESHOLD = 15;
    const lasttwo = [0,0];
    let index = 0;
    let lastreading = 0;
    let lastthresholdreading = 0;
    let totalsquirted = 0;

    try{
      rxCharacteristic =  service.getCharacteristic(
        UART_RX_CHARACTERISTIC_UUID
      ).then((characteristic)=>{
        return characteristic.startNotifications().then(char => {
          characteristic.addEventListener('characteristicvaluechanged',
                (event)=>{


                  const data = event.target.value;
                  const arr = new Uint8Array(data.buffer);
                  var string = new TextDecoder().decode(arr);
                 

                  if (string.startsWith("-")){
                    const toks = string.split(",");
                   
                    const [sign, ...number] = toks[0];
                    
                    //get rid of truncated values!
                    if (number.length >= 5){
                      const rawweight = Number(number.join(""))
                      const weight = rawweight-BASEREADING;
                      lasttwo[++index%2]= weight;
                      
                      //omly update weight if last two readings tally
                      if (lasttwo[0]==lasttwo[1] && lastreading != weight){
                        lastreading = weight;
                        console.log("seen new weight", weight);
                        if (weight > THRESHOLD){
                          if (lastthresholdreading > 0){
                            totalsquirted += Math.max(0, lastthresholdreading-weight);
                            console.log(totalsquirted);
                            setSpongeData({
                              ...spongeRef.current, 
                              ts:Date.now(), 
                              squirted:totalsquirted
                          })
                          }
                          lastthresholdreading = weight;
                        }
                        
                      }
                    }
                  }
                 
                })
        })
      });
    }catch(err){
  
    }
  }

  const MILLILITRESPERSECOND = 10.8;

  const handleFlow = (service)=>{
    let fill = 0;
    let previous = 0;

    try{
      rxCharacteristic =  service.getCharacteristic(
        UART_RX_CHARACTERISTIC_UUID
      ).then((characteristic)=>{
        return characteristic.startNotifications().then(char => {
          characteristic.addEventListener('characteristicvaluechanged',
                (event)=>{
                  const data = event.target.value;
                  const arr = new Uint8Array(data.buffer);
                  var string = new TextDecoder().decode(arr);

                  const ML = Number(string);
                  

                  if (ML > 0 || previous != 0){
                    const flow = ML * MILLILITRESPERSECOND;
                    fill += (flow / 2); // divide by two as two readings per second/
                

                    setSpongeData({
                      ...spongeRef.current, 
                      ts: Date.now(), 
                      flow,
                      fill,
                      previous,
                    });     
                    previous = flow;
                  }else{
                    previous = 0;
                  }
          })
        })
      });
    }catch(err){
  
    }
  }

  const handleSponge = (service)=>{
   
    try{
      rxCharacteristic =  service.getCharacteristic(
        UART_RX_CHARACTERISTIC_UUID
      ).then((characteristic)=>{
        return characteristic.startNotifications().then(char => {
          
          characteristic.addEventListener('characteristicvaluechanged',
                (event)=>{
                    
                    const ts = Date.now();
                    const dv = event.target.value;
                    const arr = new Uint8Array(dv.buffer)
                    var string = new TextDecoder().decode(arr);
                   
                    const toks = string.split(" ");
                    const [xa, ya, za, xg, yg, zg, pressure, temperature, mic] = toks;
                    setSpongeData({
                        ...spongeRef.current, 
                        ts, 
                        pressure: Number(pressure)-BASELINE, 
                        temperature:Number(temperature), 
                        acceleration:[Number(xa),Number(ya),Number(za)], 
                        gyro:[Number(xg), Number(yg), Number(zg)], 
                        mic
                    });      
                });
            });
        });
      }catch(err){

      }
  }


  const selectDevice = async()=> {
    try {
   
      uBitDevice = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "Connected Sponge"},{ namePrefix: "Connected Tap"},{ namePrefix: "Adafruit Bluefruit LE"}],
        optionalServices: [UART_SERVICE_UUID]
      });
  
      if (uBitDevice.name==="Connected Sponge"){
        const server = await uBitDevice.gatt.connect();
        const service = await server.getPrimaryService(UART_SERVICE_UUID);
        handleSponge(service);
      }
  
      if (uBitDevice.name==="Adafruit Bluefruit LE"){
        const server = await uBitDevice.gatt.connect();
        const service = await server.getPrimaryService(UART_SERVICE_UUID);
        handleWeight(service);
      }
  
      if (uBitDevice.name==="Connected Tap"){
        const server = await uBitDevice.gatt.connect();
        const service = await server.getPrimaryService(UART_SERVICE_UUID);
        handleFlow(service);
      }
  
    }catch(err){
      console.log(err);
    }
  }

  return (<div className="App">
    <div className="fullwidth">
      <div className="line">
              <div className="heading">Connected Kitchen <span className="subheading">dashboard</span></div>
              <div className="menu" onClick={selectDevice}>connect</div>
      </div>
    </div>
    <Dashboard data={spongeData}/>


    <div className="fullwidth">
   
            <div style={{display:"flex", alignItems:"center", justifyContent:"center", width: "100vw", height:"80px", textAlign:"center"}}>
            <div>
              <Gyro rotation={spongeData.gyro}/>
            </div>
            <div className="message">A message goes here!</div>
            </div>
        </div>
    </div>
  );
}

export default App;
