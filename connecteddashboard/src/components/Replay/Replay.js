import './Replay.css';
import React, {useState} from "react";
import {ReplayDashboard} from '../ReplayDashboard'


function Replay({name}) {
   
  const renderLive = ()=>{
    return (<div className="App">
    
    <div className="fullwidth">
      <div className="line">
            <div className="heading">Connected Kitchen <span className="subheading">dashboard</span></div>
           
      </div>
    </div>
   
    <ReplayDashboard/>

    <div className="fullwidth">
            <div style={{display:"flex", alignItems:"center", justifyContent:"center", width: "100vw", height:"80px", textAlign:"center"}}>
            <div className="message">connected kitchen</div>
            </div>
        </div>
    </div>)
  }
  return <>{renderLive()}</>
}

export default Replay;
