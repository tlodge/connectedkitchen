import React, {memo} from "react";
import './style.css'
import * as d3 from 'd3'

function ActivityDryingChart({value, max, average, labelfn}){
    const scale = d3.scaleLinear().domain([0,max]).range([0,350]);

    const resultfn = ()=>{
        if (average < value){
            return `${labelfn(value-average)} more`;
        }else{
            return `${labelfn(average-value)} less`
        }
    }

    return (<g id="drying-chart" >
                    <text x="45.852px" y="34.358px" className="title">water usage</text>
                    <g id="cleaning-chart3" >
                        <rect id="drying-big-rect"  x="474.877" y="499.125" width="356.883" height="35.117" className="drying-big-rect"/>
                        <rect id="drying-inner-rect"  x="478.057" y="502.5" width={scale(value)} height="27.734" className="drying-inner-rect"/>
                        <path id="water-average-line3"  d={`M${478 + scale(average)},534.409l0.104,-40.375`} className="averageline"/>
                        <ellipse id="water-average-circle3"  cx={478 + scale(average)} cy="492.854" rx="2.557" ry="2.55" className="average-circle"/>
                        <text x={478 + scale(average)} y="487.071px" className="averagetext">average</text>
                        <text x="489.908px" y="520.366px" className="value-label">{labelfn(value)}</text>
                    </g>
                    <text x="477.742px" y="549.149px" className="title">drying</text>
                    <g transform="matrix(1,0,0,1,-309.695,-741.501)">
                    <text x="786.574px" y="1316.58px" className="textinfo">{`The time you spent drying was ${resultfn()} than others`}</text>
                </g>
            </g>)
}

export default ActivityDryingChart;
