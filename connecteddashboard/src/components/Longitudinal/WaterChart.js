import React, {memo} from "react";
import './style.css'
import * as d3 from 'd3'

function WaterChart({value, max, average, labelfn}){
  
    const scale = d3.scaleLinear().domain([0,max]).range([0,350]);

    const resultfn = ()=>{
        if (average < value){
            return `${labelfn(value-average)} more than average`;
        }else{
            return `${labelfn(average-value)} less than average`
        }
    }
            
    return (<g id="water-chart" >
                <rect id="big-rect"  x="40.994" y="71.435" width="356.883" height="35.117" className="water-big-rect"/>
                <rect id="inner-rect" x="44.174" y="74.81" width={scale(value)} height="27.734" className="water-inner-rect"/>
                <path id="water-average-line4"  d={`M${44+scale(average)},106.588l0.103,-40.375`} className="averageline"/>
                <ellipse id="water-average-circle4"  cx={44+scale(average)} cy="64.288" rx="2.557" ry="2.55" className="average-circle"/>
                <text x={44+scale(average)} y="58.506px" className="averagetext">average</text>
                <text x="60.303px" y="92.677px" className="value-label">{labelfn(value)}</text>
                <g transform="matrix(1,0,0,1,-727.826,-1176.14)">
                <text x="770.463px" y="1316.58px" className="textinfo">{`You used ${labelfn(value)} of water, which is ${resultfn()}`}</text>
            </g>
   
        </g>)
}

export default WaterChart;