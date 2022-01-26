import './App.css';
import React, { Suspense, useRef, useState, useMemo, useEffect } from "react";
import {Dashboard} from './components/Dashboard'
import {Gyro} from './components/Gyro'
import {
  handleSponge,
  handleWeight,
  handleFlow,
} from './features/sensors/sensorSlice'
import {useAppDispatch } from './hooks/useRedux'

console.log("GYRO IS", Gyro);
console.log("DASH IS", Dashboard);

const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

function App() {
  
  

  const [showSetup, setShowSetup] = useState(false);
  const dispatch = useAppDispatch()
 
  
  const renderSetup = ()=>{
    if (!showSetup){
      return;
    }
    return <div className="experimentContainer">
      <div class="experimentBox">
        Experiment setup!
      </div>
    </div>
  }

  const selectDevice = async()=> {
    try {
   
      const uBitDevice = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "Connected Sponge"},{ namePrefix: "Connected Tap"},{ namePrefix: "Adafruit Bluefruit LE"}],
        optionalServices: [UART_SERVICE_UUID]
      });
  
      if (uBitDevice.name==="Connected Sponge"){
        const server = await uBitDevice.gatt.connect();
        const service = await server.getPrimaryService(UART_SERVICE_UUID);
        dispatch(handleSponge(service));
        //_handleSponge(service);
      }
  
      if (uBitDevice.name==="Adafruit Bluefruit LE"){
        const server = await uBitDevice.gatt.connect();
        const service = await server.getPrimaryService(UART_SERVICE_UUID);
        dispatch(handleWeight(service));
      }
  
      if (uBitDevice.name==="Connected Tap"){
        const server = await uBitDevice.gatt.connect();
        const service = await server.getPrimaryService(UART_SERVICE_UUID);
        dispatch(handleFlow(service));
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
              <div className="menu" onClick={()=>setShowSetup(!showSetup)}>start</div>
      </div>
    </div>
    {renderSetup()}
   
    <Dashboard/>
    <div className="fullwidth">
    
            <div style={{display:"flex", alignItems:"center", justifyContent:"center", width: "100vw", height:"80px", textAlign:"center"}}>
            <div>
              {/*<Gyro rotation={(spongeData || {}).gyro}/>*/}
            </div>
            <div className="message">A message goes here!</div>
            </div>
        </div>
    </div>
  );
}

export default App;
