import React, {memo} from "react";
import './style.css'

function ActivitySurfacesChart({data}){
    return (<g id="activity-cleaning-chart1">
    <g id="cleaning-chart1">
        <rect id="surfaces-bigrect"  x="474.877" y="211.748" width="356.883" height="35.117" className="surfaces-big-rect"/>
        <rect id="surfaces-inner-rect"  x="478.057" y="215.123" width="157.06" height="27.734" className="surfaces-inner-rect"/>
        <path id="water-average-line1"  d="M550.237,247.032l0.104,-40.375" className="averageline"/>
        <ellipse id="water-average-circle1" cx="550.291" cy="205.477" rx="2.557" ry="2.55" className="average-circle"/>
        <text x="539.159px" y="199.694px" className="averagetext">average</text>
        <text x="489.908px" y="232.989px" className="value-label">5 min 11 s</text>
    </g>
    <text x="477.15px" y="261.777px" className="title">cleaning surfaces / sinks</text>
    <g transform="matrix(1,0,0,1,-304.613,-1026.25)">
    <text x="784.076px" y="1316.58px" className="textinfo">You spent</text>
    <text x="831.889px" y="1316.58px" className="textinfobold">1 minute less</text>
    <text x="898.027px" y="1316.58px" className="textinfo">cleaning surfaces/sinks than other participants</text>
</g>
</g>)
}

export default ActivitySurfacesChart;


