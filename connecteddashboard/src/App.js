import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import "./index.css";

import {
  selectExperiments,
  selectBluetoothState,
  selectExperimentName,
  selectRecording,
  selectOtherData,
  selectActivity,
  setArchive,
  setActivity,
  setExperimentName,
  handleFlow,
  handleSponge,
  handleWeight,
  record,
  stoprecording,
  deleteArchive,
  fixWeight,
  reAdd,
} from './features/sensors/sensorSlice'


import {
  init
} from './features/live/liveSlice'

import {useAppDispatch } from './hooks/useRedux'
import { Longitudinal } from "./components/Longitudinal";
import {Live} from './components/Live'
import { Replay } from "./components/Replay";
const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

function App() {
  const dispatch = useAppDispatch()
  const experiments = useSelector(selectExperiments);
  const bluetooth = useSelector(selectBluetoothState);
  const experimentName = useSelector(selectExperimentName);
  const archiveData = useSelector(selectRecording);
  const otherData = useSelector(selectOtherData);
  const activity = useSelector(selectActivity);
  const [screen, setScreen] = useState("menu");
  const [showSetup, setShowSetup] = useState(false);
  const [recording, setRecording] = useState(false);

  const _setActivity = (activity)=>{
  
    dispatch(setActivity(activity));
  }

  const _deleteArchive = (name)=>{
    dispatch(deleteArchive(name));
  }

  const toggleRecording = ()=>{
    if (!recording){
      dispatch(record(experimentName));
    }else{
      dispatch(stoprecording());
    }
    setRecording(!recording);
  }
  

  useEffect(()=>{
    const {pathname} = window.location || "";
    if (pathname.trim() === "/live"){
      setScreen("live");
    }
    if (pathname.trim() === "/replay"){
      setScreen("replay");
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
              <div>new experiment name</div>
              <input className="nameInput" type="text" placeholder="experiment name" onChange={handleExperimentNameChange} value={experimentName}></input>
              <button style={{margin:10}} className="button" onClick={okClicked}>ok</button>
              <button className="button" onClick={cancelSetup}>cancel</button>
          </div>
      </div>
    </div>
  }

  const renderExperiments = ()=>{
    const rows = (experiments||[]).sort().map(e=>{
      return <tr key={e.name}>
        <td>{`${new Date(e.ts).toLocaleString()}`}</td>
        <td>{e.name}</td>
        <td><button className="button" onClick={()=>selectArchive(e.name)}>show</button></td>
        <td><button className="button red" onClick={()=>{_deleteArchive(e.name)}}>delete</button></td>
      </tr>
    });

    return <table>
        <thead>
          <tr>
            <th>time</th>
            <th>name</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
    </table>

  }

  const renderBluetooth = ()=>{
    return Object.keys(bluetooth).map(k=><div key={k} className="menuitem"><div className="bluetoothtext">{k} : {bluetooth[k] ? "connected": "not connected"}</div></div>)
  }

  const renderWoz = ()=>{
    return <div className="activitybuttons">
        <button className={`bigbutton ${activity==="surfaces" ? "red" : ""}`} onClick={()=>{_setActivity("surfaces")}}>CLEANING SURFACES</button>
        <button className={`bigbutton ${activity==="items" ? "red" : ""} `} onClick={()=>{_setActivity("items")}}>WASHING ITEMS</button>
        <button className={`bigbutton ${activity==="drying" ? "red" : ""}`} onClick={()=>{_setActivity("drying")}}>DRYING ITEMS</button>
        <button className={`bigbutton`} onClick={()=>{_setActivity()}}>NO ACTIVITY</button>
    </div>
  }

  const renderMenu = ()=>{
    return <>
            <div className="menubar">
              <div className="menuleft">
                <button className="button" onClick={()=>setShowSetup(true)}>new experiment</button>
                <button className="button" onClick={()=>selectDevice()}>connect</button>  
                {experimentName && experimentName.trim() !== "" && <button  className="button" onClick={toggleRecording}>{recording ? 'stop recording' : 'record'}</button>}
              </div>
              <div className="menuright">
                {renderBluetooth()}
              </div>
            </div>
            {showSetup && renderSetup()}
            <div className="experimentsContainer">
              <div className="expheading">recorded experiments</div>
              {!recording && renderExperiments()}
            </div>
           {/*<button className="button" onClick={()=>dispatch(reAdd({ts:1645782662394, name:"participant 4"}))}>fix experments</button>}*/}
          </>
  }
  
  const renderReplay = ()=>{
    return <Replay data={"participant1"}/>
  }

  const renderLive = ()=>{
    return <Live name={experimentName}/>
  }

  const renderLongitudinal = ()=>{
    return <Longitudinal data={archiveData} other={otherData}/>
  }

  return (<>
      {screen==="menu" && renderMenu()}
      {screen==="live" && renderLive()}
      {screen==="long" && renderLongitudinal()}
      {screen==="replay" && renderReplay()}
      {recording && renderWoz()}
  </>);
}

export default App;