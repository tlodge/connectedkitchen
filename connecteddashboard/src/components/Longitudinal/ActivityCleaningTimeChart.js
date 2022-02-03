import React, {memo} from "react";
import './style.css'
import * as d3 from 'd3'

function ActivityCleaningTimeChart({value, max, average, labelfn}){
 
    
    const scale = d3.scaleLinear().domain([0,max]).range([0,350]);

    const resultfn = ()=>{
        if (average < value){
            return `${labelfn(value-average)} more`;
        }else{
            return `${labelfn(average-value)} less`
        }
    }

    return (<g id="activity-cleaning-chart">
                <g id="cleaning-chart">
                    <rect id="cleaning-big-rect"  x="474.877" y="70.881" width="356.883" height="35.117" className="cleaning-big-rect"/>
                    <rect id="cleaning-inner-rect" x="478" y="74.256" width={scale(value)} height="27.734" className="cleaning-inner-rect"/>
                    <path id="water-average-line"  d={`M${478 + scale(average)},106.165l0.104,-40.375`} className="averageline"/>
                    <ellipse id="water-average-circle" cx={478 + scale(average)} cy="64.61" rx="2.557" ry="2.55" className="average-circle"/>
                    <text x={478 + scale(average)} y="58.827px" className="averagetext">average</text>
                    <text x="489.908px" y="92.122px" className="value-label">{labelfn(value)}</text>
                </g>
                <text x="476.165px" y="120.91px" className="title" >cleaning items</text>
                <g transform="matrix(1,0,0,1,-306.005,-1170.36)">
                        <text x="784.076px" y="1316.58px" className="textinfo">The time you spent cleaning was {resultfn()} than others</text>
                </g>
            </g>)
}

export default ActivityCleaningTimeChart;