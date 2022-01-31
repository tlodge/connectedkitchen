import React, {memo} from "react";
import './style.css'
import * as d3 from 'd3'

function OverallTimeChart({value, max, average, labelfn}){
    console.log("timedata is", value, max, average);

    const scale = d3.scaleLinear().domain([0,max]).range([0,350]);

    const resultfn = ()=>{
        if (average < value){
            return `you spent ${labelfn(value-average)} more time`;
        }else{
            return `you spent ${labelfn(average-value)} less time`
        }
    }

    return  <g id="timechart">
                <text x="45.811px" y="468.745px"className="title">overall time taken</text>
                <rect id="big-rect1"  x="40.994" y="494.826" width="356.883" height="35.117" className="time-big-rect"/>
                <rect id="inner-rect1"  x="44" y="498.201" width={scale(value)} height="27.734" className="time-inner-rect"/>
                <path id="water-average-line5"  d={`M${44+scale(average)},530.11l0.103,-40.375`} className="averageline"/>
                <text x={44+scale(average)} y="482.772px" className="averagetext">average</text>
                <text x="54.244px" y="516.067px" className="value-label">{labelfn(value)}</text>
                <ellipse id="water-average-circle5"  cx={44+scale(average)} cy="488.555" rx="2.557" ry="2.55" className="average-circle"/>
                <text x="44.24px" y="550.358px" className="title">time</text>
                <g transform="matrix(1,0,0,1,-757.78,-743.623)">
                    <text x="799.719px" y="1316.58px" className="textinfo">{`You spent ${resultfn()} cleaning than average`}</text>
                </g>
            </g>
}

export default OverallTimeChart;