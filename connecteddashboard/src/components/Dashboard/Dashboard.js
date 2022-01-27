import React from "react";
import "./dashboard.css";
import {Liquid} from "../Liquid";
import {Water} from "../Water";
import {Technique} from "../Technique";
import {Noise} from "../Noise";
import {Time} from "../Time";
import {Temperature} from "../Temperature";

import {
    selectSpongeData,
    selectWaterData,
    selectWeightData,
  } from '../../features/sensors/sensorSlice'
  import { useAppSelector } from '../../hooks/useRedux'

export function Dashboard(props) {

    const weightData = useAppSelector(selectWeightData);
    const waterData = useAppSelector(selectWaterData);
    const spongeData = useAppSelector(selectSpongeData);
    
    console.log("water data is", waterData);

    return (<svg width="100vw" viewBox="0 0 366 207" className="main">
       <rect x={0} y={0} width="365" height="206" className="backrect"></rect>
        <Liquid data={weightData.squirted}/>
        <Water data={{flow:waterData.flow, previous:waterData.previous, fill:waterData.fill}}/>
        <Technique data={{acceleration:spongeData.acceleration, pressure:spongeData.pressure}}/>
        <Noise data={spongeData.mic}/>
        <Time/>
        <Temperature data={spongeData.temperature}/>
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