import "./dashboard.css";
import { useD3 } from "./hooks/useD3";
import * as d3 from 'd3';
import {memo} from 'react';

function Technique(props) {
    
    const  colour = d3.scaleSequential(d3.interpolateRdYlBu).domain([500,0]);
    const  pressurescale = d3.scaleLinear().domain([0, 500]).range([0,1.0]);  

    const renderTechnique =(root, data)=>{

        const _xacc = d3.scaleLinear().domain([-15, 15]).range([0,132]);  
        const _yacc = d3.scaleLinear().domain([-15, 15]).range([-53,0]);  //reverse range as y is reversed axis
        
        //create ceiling as only interested in smaller acc values!
        const xacc = (x)=> _xacc(Math.max(-15,Math.min(15, x)));
        const yacc = (y)=> _yacc(Math.max(-15,Math.min(15, y)));

        
        const tech = root.selectAll("g.techgroup").data(data, (d,i)=>i)
        const techg = tech.enter().append("g").attr("class", "techgroup");

        techg.append("rect").attr("class","xback").attr("x",182.593).attr("y", 84.383).attr("width", 172.35).attr("height", 18.283)
        techg.append("rect").attr("class","yback").attr("x",331.822).attr("y", 0.965).attr("width", 23.274).attr("height", 83.496)
        techg.append("path").attr("d","M343.858,12.616C342.473,12.616 341.349,13.74 341.349,15.126L341.349,78.973C341.349,80.358 342.473,81.483 343.858,81.483C345.243,81.483 346.368,80.358 346.368,78.973L346.368,15.126C346.368,13.74 345.243,12.616 343.858,12.616Z").attr("class", "axisline")
        techg.append("path").attr("d","M341.631,94.067C341.631,92.682 340.507,91.557 339.122,91.557L189.459,91.557C188.074,91.557 186.949,92.682 186.949,94.067C186.949,95.452 188.074,96.577 189.459,96.577L339.122,96.577C340.507,96.577 341.631,95.452 341.631,94.067Z").attr("class", "axisline2")
        techg.append("path").attr("d","M189.98,93.946L338.045,93.946").attr("class", "axisline3")
        techg.append("path").attr("d","M344.151,78.896L344.151,14.608").attr("class", "axisline4")

        const dishmatic = techg.append("g").attr("id","dishmatic")
        dishmatic.append("path").attr("id","spongetop").attr("d","M302.811,79.838L230.854,79.838L230.854,66.77C230.854,64.365 232.806,62.414 235.21,62.414L299.339,62.414C301.256,62.414 302.811,63.969 302.811,65.886L302.811,79.838Z" ).attr("class", "spongetop")
        dishmatic.append("path").attr("id","spongebottom").attr("d","M230.854,79.838L302.811,79.838L302.811,80.886C302.811,83.519 300.674,85.656 298.041,85.656L235.615,85.656C232.987,85.656 230.854,83.523 230.854,80.896L230.854,79.838Z" ).attr("class", "spongebottom").style("fill", d=>{
            console.log("have d", d);
            return  colour(Math.max(0,d.pressure))
        })
        dishmatic.append("path").attr("id","handlebottom").attr("d","M298.269,61.064C298.269,59.781 297.227,58.739 295.944,58.739L239.494,58.739C238.157,58.739 237.071,59.825 237.071,61.163L237.071,62.451L298.269,62.451L298.269,61.064Z" ).attr("class", "handlebottom")
        dishmatic.append("path").attr("id","handle").attr("d","M354.496,0.514L354.496,5.838C343.936,9.43 309.655,27.714 299.032,46.022C296.864,49.759 297.194,59.133 297.194,59.133L238.268,59.35C240.718,46.628 267.419,38.847 286.622,26.745C298.325,19.37 309.604,9.643 321.217,0.514L354.496,0.514Z").attr("class", "handle")
        tech.select("path#spongebottom").style("fill", d=>colour(Math.max(0,d.pressure)))

        const yaccsponge = techg.append("g").attr("id","yaccsponge").attr("transform", d=>`translate(${xacc(d.accx)},${0})`)
        yaccsponge.append("path").attr("id","yaccspongetop").attr("d","M205.654,96.097L190.028,96.097L190.028,91.303C190.028,90.421 190.744,89.705 191.626,89.705L204.38,89.705C205.083,89.705 205.654,90.275 205.654,90.978L205.654,96.097Z"  ).attr("class", "yaccspongetop")
        yaccsponge.append("path").attr("id","yaccspongebottom").attr("d","M190.028,96.097L205.654,96.097L205.654,96.505C205.654,97.531 204.822,98.363 203.796,98.363L191.883,98.363C190.859,98.363 190.028,97.532 190.028,96.509L190.028,96.097Z").attr("class", "yaccspongebottom")

        tech.select("g#yaccsponge").transition().duration(1000).attr("transform", d=>`translate(${xacc(d.accx)},${0})`)
    
        const xaccsponge = techg.append("g").attr("id","xaccsponge").attr("transform", d=>`translate(0, ${yacc(d.accy)})`);
        xaccsponge.append("path").attr("id","xaccspongebottom").attr("d","M339.872,67.884C337.857,67.884 336.222,69.52 336.222,71.535L336.222,75.588C336.222,77.603 337.857,79.239 339.872,79.239C339.872,79.239 348.391,79.239 348.391,79.239C350.406,79.239 352.042,77.603 352.042,75.588C352.042,75.588 352.042,71.535 352.042,71.535C352.042,69.52 350.406,67.884 348.391,67.884C348.391,67.884 339.872,67.884 339.872,67.884Z").attr("class", "xaccspongebottom")
        xaccsponge.append("path").attr("id","xaccspongetop").attr("d","M339.872,69.509C338.754,69.509 337.846,70.417 337.846,71.535L337.846,75.588C337.846,76.707 338.754,77.615 339.872,77.615L348.391,77.615C349.51,77.615 350.418,76.707 350.418,75.588L350.418,71.535C350.418,70.417 349.51,69.509 348.391,69.509L339.872,69.509Z").attr("class", "xaccspongetop")

        tech.select("g#xaccsponge").transition().duration(1000).attr("transform", d=>`translate(0, ${yacc(d.accy)})`)

        const pressurelines = techg.append("g").attr("id","pressurelines").attr("opacity", d=>pressurescale(d.pressure));

        pressurelines.append("path").attr("id","pressureline1").attr("d","M228.77,79.263L220.245,71.536L223.859,68.889L228.77,79.263Z").attr("class", "pressureline1")
        pressurelines.append("path").attr("id","pressureline2").attr("d","M228.319,72.356L224.335,64.108L227.769,63.224L228.319,72.356Z").attr("class", "pressureline2")
        pressurelines.append("path").attr("id","pressureline3").attr("d","M305.908,76.391L308.443,69.599L305.664,69.123L305.908,76.391Z").attr("class", "pressureline3")
        pressurelines.append("path").attr("id","pressureline4").attr("d","M307.209,79.335L315.734,71.608L312.12,68.96L307.209,79.335Z").attr("class", "pressureline4")
        pressurelines.append("path").attr("id","pressureline5").attr("d","M310.081,80.345L314.22,76.286L315.458,78.131L310.081,80.345Z").attr("class", "pressureline5")

        tech.select("g#pressurelines").transition().duration(500).attr("opacity",  d=>pressurescale(d.pressure));  
    }

    const techref = useD3((root)=>{
        const {acceleration=[0,0,0],pressure=0} = props.data;
        renderTechnique(root, [{accx:acceleration[0],accy:acceleration[1], accz:acceleration[2], pressure}]);
    });

    return (<g ref={techref} id="technique">
                <rect id="techrect" x="182.598" y="0.483" width="172.594" height="102.667" className="techrect"/>
            </g>
    );
}

export default memo(Technique);