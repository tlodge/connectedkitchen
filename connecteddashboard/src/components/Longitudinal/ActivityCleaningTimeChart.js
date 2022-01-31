import React, {memo} from "react";
import './style.css'

function ActivityCleaningTimeChart({data}){
    return (<g id="activity-cleaning-chart">
                <g id="cleaning-chart">
                    <rect id="cleaning-big-rect"  x="474.877" y="70.881" width="356.883" height="35.117" className="cleaning-big-rect"/>
                    <rect id="cleaning-inner-rect" x="478.057" y="74.256" width="92.258" height="27.734" className="cleaning-inner-rect"/>
                    <path id="water-average-line"  d="M550.237,106.165l0.104,-40.375" className="averageline"/>
                    <ellipse id="water-average-circle" cx="550.291" cy="64.61" rx="2.557" ry="2.55" className="average-circle"/>
                    <text x="539.159px" y="58.827px" className="averagetext">average</text>
                    <text x="489.908px" y="92.122px" className="value-label">4 min 12 s</text>
                </g>
                <text x="476.165px" y="120.91px" className="title" >cleaning items</text>
                <g transform="matrix(1,0,0,1,-306.005,-1170.36)">
                        <text x="784.076px" y="1316.58px" className="textinfo">The time you spent cleaning was</text>
                        <text x="932.49px" y="1316.58px" className="textinfobold">24 seconds shorter</text>
                        <text x="1026.97px" y="1316.58px" className="textinfo">than other participants</text>
                </g>
            </g>)
}

export default ActivityCleaningTimeChart;