import "./dashboard.css";
import { useD3 } from "./hooks/useD3";
import {useEffect, memo} from 'react';

const Liquid= memo(function Liquid(props) {

    useEffect(()=>{
        console.log("liquid chanegd!!!")
    }, [props.data])

    const renderLiquid = (root, data)=>{  
        const bubbles = root.selectAll("g.bubblegroup").data(data, (_,i)=>i);
        
        const bubbleg = bubbles.enter().append("g").attr("class", "bubblegroup").attr("transform", d=>`translate(${d[0]},${d[1]})`);//.attr("opacity",0)
                        //bubbleg.transition().duration(1000).attr("opacity", 1);
                        bubbleg.append("circle").attr("r", d=>4.5*d[2]).attr("cx",112).attr("cy",86).attr("class", (d,i)=>i%2==0? "bubble":"bubble2");
                        bubbleg.append("path").attr("d", d=>`M${111.42-d[2]},${83.659}C${109.216-d[2]},${85.178-d[2]} ${109.115-d[2]},${87.32} ${111.416-d[2]},${88.94}`).attr("class", "bubbleline");

        bubbles.transition().duration(1000).attr("transform", d=>`translate(${d[0]},${d[1]})`)
        bubbles.exit().remove();//transition().duration(1000).attr("opacity",0).remove();
    }

    const liquidref = useD3((root)=>{
        const squirted = props.data;
        renderLiquid(root, Array.from({length: squirted*5}, () => ([-8 + Math.floor(Math.random() * 70),Math.floor(Math.random()*-64), Math.floor(1+Math.random()*2)])));      
    });

    return ( <g ref={liquidref} id="washing-liquid">
        <rect id="washingrect" x="95.467" y="0.392" width="87.06" height="102.757" className="washingrect"/>
       </g>
    );
});

export default Liquid;