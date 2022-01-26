import React, { Suspense, useRef, useState, memo, useEffect } from "react";
import "./dashboard.css";
import {Liquid} from "../Liquid";
import {Water} from "../Water";
import {Technique} from "../Technique";
import {Noise} from "../Noise";
import {Time} from "../Time";
import {Temperature} from "../Temperature";

import {
    selectData,
  } from '../../features/sensors/sensorSlice'
  import { useAppSelector, useAppDispatch } from '../../hooks/useRedux'

export function Dashboard(props) {

    const _sensordata = useAppSelector(selectData);
    

    const [sensorData, _setSensorData] = useState({weight:{},sponge:{},water:{}});
    const sensorRef = React.useRef(sensorData);
    
    useEffect(()=>{
        const {data} = _sensordata;
        sensorRef.current = data;
        _setSensorData(data);
       
       },[_sensordata])
    
    return (<svg width="100vw" viewBox="0 0 366 207" className="main">
       <rect x={0} y={0} width="365" height="206" className="backrect"></rect>
        <Liquid data={sensorData.weight}/>
        <Water data={{flow:sensorData.water, previous:0, fill:10}}/>
        <Technique data={{acceleration:sensorData.sponge.acceleration, pressure:sensorData.sponge.pressure}}/>
        <Noise data={sensorData.sponge.mic}/>
        <Time/>
        <Temperature data={sensorData.sponge.temperature}/>
        <g>
                <text x="186.584px" y="8.581px" className="sensortext">technique</text>
                <text x="242.905px" y="201.991px" className="sensortext">noise</text>
                <text x="310.329px" y="201.751px" className="sensortext">temperature</text>
                <text x="99.311px" y="8.498px" className="sensortext">washing liquid used</text>
                <text x="14.645px" y="8.07px" className="sensortext">water usage</text>
                <text x="117.449px" y="201.552px" className="sensortext">time</text>
        </g>
    </svg>
   
    );
}