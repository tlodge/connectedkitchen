import "../Dashboard/dashboard.css";
import { useD3 } from "../../hooks/useD3";
import * as d3 from 'd3';
import {memo} from 'react';

const MAXFLOW = 200;//176;

function Water(props) {

    const  arrowcolour = d3.scaleSequential(d3.interpolateRdYlBu).domain([MAXFLOW,0]);
    const renderWater = (root, data)=>{

        const waterpos = d3.scaleLinear().domain([0, 6000]).range([0,-100]);  
        const water = root.selectAll("g.watergroup").data(data, (d,i)=>i)
        const waterg = water.enter().append("g").attr("class", "watergroup");
        
        const rotationfor = (val)=>{
            const angle = (val / MAXFLOW) * 360
            return `rotate(${Math.min(angle, 360)} 52.5 53)`
        }
        
        const w = waterg.append("g").attr("id","sink").attr("transform", d=>`translate(0,${waterpos(d.fill)})`)
        
        w.append("path").attr("class","water").attr("id","water").attr("d", "M49.273,100.079C52.872,100.079 56.027,102.53 59.6,102.231C65.046,101.774 75.208,96.909 81.947,97.34C87.839,97.717 95.465,102.231 95.465,102.231L10.388,102.231C10.388,102.231 19.27,99.16 24.527,99.406C27.853,99.561 32.513,102.118 36.637,102.231C40.761,102.343 45.445,100.079 49.273,100.079Z")
        w.append("rect").attr("x",10).attr("y",100).attr("width",85.5).attr("height",100).attr("class", "water");

        water.select("g#sink").transition().duration(500).attr("transform", d=>`translate(0,${waterpos(d.fill)})`);

        waterg.append("circle").attr("id", "gauge-circle").attr("cx", 52).attr("cy", 53).attr("r", 35).attr("class", "gauge-circle");
        waterg.append("path").attr("class","arrow").attr("id","gauge-arrow").attr("d", "M49.138,46.414L49.165,37.721L40.093,39.939L52.678,23.099L65.16,40.015L56.102,37.742L56.075,46.394C58.51,47.633 60.178,50.145 60.178,53.038C60.178,55.948 58.492,58.471 56.034,59.703L55.963,82.978L49.026,82.956L49.098,59.641C46.706,58.387 45.075,55.9 45.075,53.038C45.075,50.16 46.724,47.661 49.138,46.414Z")
        waterg.append("circle").attr("id", "gauge-pivot").attr("cx", 52.5).attr("cy", 53).attr("r", 5).attr("class", "gauge-pivot");
    
        water.select("path.arrow").style("fill", d=>arrowcolour(d.flow)).transition().duration(500).attrTween("transform", (d)=>{
           
            const to =  rotationfor(d.flow);
            const from = rotationfor(d.previous);
            
            return d3.interpolate(from, to);
        })
        water.exit().remove();
    }

    const waterref = useD3((root)=>{
        const {flow, previous, fill} = props.data;
        console.log("rendeing flow, previous, fill", flow, previous, fill)
        renderWater(root, [{flow,previous,fill}]);
    });

    return (<g ref={waterref} id="water-usage">
        <rect id="waterrect" x="9.832" y="0.392" width="85.83" height="102.757" className="waterrect"/>
       </g> 
    );
}

function areEqual(prevProps, nextProps) {
    return prevProps.data.flow == nextProps.data.flow && prevProps.data.previous == nextProps.data.previous && prevProps.data.fill == nextProps.data.fill;
  }

export default memo(Water, areEqual);