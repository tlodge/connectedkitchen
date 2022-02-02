import React, {memo} from "react";
import './style.css'
import * as d3 from 'd3'

function ActivitySurfacesChart({value, max, average, labelfn}){

    const scale = d3.scaleLinear().domain([0,max]).range([0,350]);

    const resultfn = ()=>{
        if (average < value){
            return `${labelfn(value-average)} more`;
        }else{
            return `${labelfn(average-value)} less`
        }
    }


    return (<g id="activity-cleaning-chart1">
    <g id="cleaning-chart1">
        <rect id="surfaces-bigrect"  x="474.877" y="211.748" width="356.883" height="35.117" className="surfaces-big-rect"/>
        <rect id="surfaces-inner-rect"  x="478.057" y="215.123" width={scale(value)} height="27.734" className="surfaces-inner-rect"/>
        <path id="water-average-line1"  d={`M${478 + scale(average)},247.032l0.104,-40.375`} className="averageline"/>
        <ellipse id="water-average-circle1" cx={478 + scale(average)} cy="205.477" rx="2.557" ry="2.55" className="average-circle"/>
        <text x={478 + scale(average)} y="199.694px" className="averagetext">average</text>
        <text x="489.908px" y="232.989px" className="value-label">{labelfn(value)}</text>
    </g>
    <text x="477.15px" y="261.777px" className="title">cleaning surfaces / sinks</text>
    <g transform="matrix(1,0,0,1,-304.613,-1026.25)">
    <text x="784.076px" y="1316.58px" className="textinfo">You spent {resultfn()} time cleaning surfaces/sinks than others</text>
</g>
</g>)
}

export default ActivitySurfacesChart;


