import React, {memo} from "react";
import './style.css'
import * as d3 from 'd3'

function ActivityTapChart({value, max, average, labelfn}){

    console.log("timedata is", value, max, average);

    const scale = d3.scaleLinear().domain([0,max]).range([0,350]);

    const resultfn = ()=>{
        if (average < value){
            return `${labelfn(value-average)} more time`;
        }else{
            return `${labelfn(average-value)} less time`
        }
    }

    return  <g id="running-tap-chart" >
                <g id="cleaning-chart2">
                    <rect id="running-tap-big-rect"  x="474.877" y="357.873" width="356.883" height="35.117" className="tap-big-rect"/>
                    <rect id="runing-tap-inner-rect"  x="478.057" y="361.248" width={scale(value)} height="27.734" className="tap-inner-rect"/>
                    <path id="water-average-line2"  d={`M${478+scale(average)},393.157l0.104,-40.375`} className="averageline"/>
                    <ellipse id="water-average-circle2"  cx={478+scale(average)} cy="351.602" rx="2.557" ry="2.55" className="average-circle"/>
                    <text x={478+ scale(average)} y="345.819px" className="averagetext">average</text>
                    <text x="489.908px" y="379.114px" className="value-label">{labelfn(value)}</text>
                </g>
                <text x="476.979px" y="407.902px" className="title">running tap</text>
                <g transform="matrix(1,0,0,1,-308.181,-884.229)">
                    <text x="784.076px" y="1316.58px" className="textinfo">{`You spent ${resultfn()} running the tap than average`}</text>
                </g>
            </g>
}

export default ActivityTapChart;