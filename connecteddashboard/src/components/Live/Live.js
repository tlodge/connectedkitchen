import './Live.css';
import React, {useState} from "react";
import {Dashboard} from '../Dashboard'

import {Gyro} from '../Gyro'

function Live({name}) {
   
  const renderLive = ()=>{
    return (<div className="App">
    
    <div className="fullwidth">
      <div className="line">
            <div className="heading">Connected Kitchen <span className="subheading">dashboard</span></div>
           
      </div>
    </div>
   
    <Dashboard/>

    <div className="fullwidth">
    
            <div style={{display:"flex", alignItems:"center", justifyContent:"center", width: "100vw", height:"80px", textAlign:"center"}}>
            <div>
              {/*<Gyro rotation={(spongeData || {}).gyro}/>*/}
            </div>
            <div className="message">connected kitchen</div>
            </div>
        </div>
    </div>)
  }

  
  return <>{renderLive()}</>


}

export default Live;
