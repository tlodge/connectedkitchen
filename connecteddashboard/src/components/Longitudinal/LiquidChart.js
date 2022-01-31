import React, {memo} from "react";
import './style.css'
import * as d3 from 'd3'

function LiquidChart({weight, used}){

    const {value:wvalue, average:waverage, max:wmax, labelfn:wlabelfn} = weight;
    const {value:uvalue, average:uaverage, max:umax, labelfn:ulabelfn} = used;
    console.log(wvalue, waverage, wmax);

    const wscale = d3.scaleLinear().domain([0,wmax]).range([0,350]);
    const uscale = d3.scaleLinear().domain([0,umax]).range([0,350]);


    const wresultfn = ()=>{
        if (waverage < wvalue){
            return `${wlabelfn(wvalue-waverage)} grams less`;
        }else{
            return `${wlabelfn(waverage-wvalue)} grams more`
        }
    }

    const uresultfn = ()=>{
        if (uaverage < uvalue){
            return `${ulabelfn(uvalue-uaverage)} times less`;
        }else{
            return `${wlabelfn(uaverage-uvalue)} times more`
        }
    }

    return  <g id="washing-up-chart" >
                <text x="45.852px" y="194.987px" className="title">washing up liquid</text>
                <text x="43.237px" y="279.574px" className="title">amount used</text>
                <text x="42.297px" y="369.356px" className="title">number of times used</text>
           
                
                <rect id="amount-used-rect"  x="40.994" y="226.095" width="356.883" height="35.117" className="liquid-big-rect"/>
                <rect id="inner-amount-used-rect"  x="44.174" y="229.47" width={wscale(wvalue)} height="27.734" className="liquid-inner-rect"/>
                <path id="water-average-line6"  d={`M${44+wscale(waverage)},261.735l0.103,-40.375`} className="averageline"/>
                <ellipse id="water-average-circle6"  cx={44+wscale(waverage)} cy="220.18" rx="2.557" ry="2.55" className="average-circle"/>
                <text x={44+wscale(waverage)} y="214.397px" className="averagetext">average</text>
                <text x="57.418px" y="247.54px" className="value-label">{wlabelfn(wvalue)}</text>
                
                <rect id="big-rect2"  x="41.428" y="317.924" width="356.883" height="35.117" className="liquid-big-rect"/>
                <rect id="inner-rect2"  x="44.608" y="321.299" width={uscale(uvalue)} height="27.734" className="liquid-inner-rect"/>
                <path id="water-average-line7"  d={`M${44+uscale(uaverage)},353.564l0.104,-40.376`} className="averageline"/>
                <ellipse id="water-average-circle7"  cx={44+uscale(uaverage)} cy="312.008" rx="2.557" ry="2.55" className="average-circle"/>
                <text x={44+uscale(uaverage)} y="306.226px" className="averagetext">average</text>
                <text x="57.852px" y="339.368px" className="value-label">{ulabelfn(uvalue)}</text>

                <g transform="matrix(1,0,0,1,-691.667,-907.283)">
                    <text x="731.532px" y="1316.58px" className="textinfo">{`You used ${wresultfn()} liquid and used it ${uresultfn()} than average`}</text>
                </g>
            </g>
}

export default LiquidChart;