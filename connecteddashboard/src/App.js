import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import {
  selectExperiments,
  selectBluetoothState,
  selectExperimentName,
  selectRecording,
  setArchive,
  setExperimentName,
  handleFlow,
  handleSponge,
  handleWeight,
  record,
  stoprecording
} from './features/sensors/sensorSlice'


import {
  init
} from './features/live/liveSlice'

import {useAppDispatch } from './hooks/useRedux'
import { Longitudinal } from "./components/Longitudinal";
import {Live} from './components/Live'

const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

function App() {
  const dispatch = useAppDispatch()
  const experiments = useSelector(selectExperiments);
  const bluetooth = useSelector(selectBluetoothState);
  const experimentName = useSelector(selectExperimentName);
  const archiveData = useSelector(selectRecording);

  const [screen, setScreen] = useState("menu");
  const [showSetup, setShowSetup] = useState(false);
  const [recording, setRecording] = useState(false);

  const toggleRecording = ()=>{
    if (!recording){
      dispatch(record(experimentName));
    }else{
      dispatch(stoprecording());
    }
    setRecording(!recording);
  }
  

  useEffect(()=>{
    console.log(window.location.pathname);

    const {pathname} = window.location || "";
    if (pathname.trim() === "/live"){
      setScreen("live");
    }
    dispatch(init());
  },[window]);

  const selectArchive = (name)=>{
    dispatch(setArchive(name));
    setScreen("long");
  }
  
  const okClicked = ()=>{
    setShowSetup(false);
  }

  const cancelSetup = ()=>{
    setShowSetup(false);
  }

  const handleExperimentNameChange = (e)=>{
    dispatch(setExperimentName(e.target.value));
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
        
        dispatch(handleSponge(uBitDevice, service));
      }
  
      if (uBitDevice.name==="Adafruit Bluefruit LE"){
        const server = await uBitDevice.gatt.connect();
        const service = await server.getPrimaryService(UART_SERVICE_UUID);
        dispatch(handleWeight(uBitDevice,service));
      }
  
      if (uBitDevice.name==="Connected Tap"){
        const server = await uBitDevice.gatt.connect();
        const service = await server.getPrimaryService(UART_SERVICE_UUID);
        dispatch(handleFlow(uBitDevice,service));
      }
  
    }catch(err){
      console.log(err);
    }
  }

  const renderSetup = ()=>{
    if (!showSetup){
      return;
    }
    return <div className="experimentContainer">
      <div className="experimentBox">
          <div className="experimentForm">
              <div>name</div>
              <input className="nameInput" type="text" placeholder="experiment name" onChange={handleExperimentNameChange} value={experimentName}></input>
              <button onClick={okClicked}>ok</button>
              <button onClick={cancelSetup}>cancel</button>
          </div>
      </div>
    </div>
  }

  const renderExperiments = ()=>{
    const rows = experiments.sort().map(e=>{
      return <tr>
        <td>{`${new Date(e.ts).toLocaleString()}`}</td>
        <td>{e.name}</td>
        <td><button onClick={()=>selectArchive(e.name)}>show</button></td>
      </tr>
    });

    return <table>
        <thead>
          <tr>
            <th>time</th>
            <th>name</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
    </table>

  }

  const renderBluetooth = ()=>{
    return Object.keys(bluetooth).map(k=><div>{k} : {bluetooth[k] ? "connected": "not connected"}</div>)
  }

  const renderMenu = ()=>{
    return <>
      {showSetup && renderSetup()}
      {!recording && renderExperiments()}
      <button onClick={()=>setShowSetup(true)}>new experiment</button>
      <button onClick={()=>selectDevice()}>connect</button>  
      {experimentName && experimentName.trim() !== "" && <button onClick={toggleRecording}>{recording ? 'stop recording' : 'record'}</button>}
      {renderBluetooth()}
    </>
  }
  
  const renderLive = ()=>{
    return <Live name={experimentName}/>
  }

  const renderLongitudinal = ()=>{
    return <Longitudinal data={archiveData}/>
  }

  return (<>
      {screen==="menu" && renderMenu()}
      {screen==="live" && renderLive()}
      {screen==="long" && renderLongitudinal()}
  </>);
}

export default App;