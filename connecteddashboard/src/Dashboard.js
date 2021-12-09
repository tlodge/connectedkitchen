import "./dashboard.css";
import { useD3 } from "./hooks/useD3";
import {useInterval} from './hooks/useInterval';

import {useEffect, useState, useRef} from 'react';
import * as d3 from 'd3';
import { transition } from "d3";

function Dashboard() {

    const renderLiquid = (root, data)=>{
 
        const g = root.select("g#washing-liquid");
        
        const bubbles = g.selectAll("g.bubblegroup").data(data, (_,i)=>i);
        
        const bubbleg = bubbles.enter().append("g").attr("class", "bubblegroup").attr("transform", d=>`translate(${d[0]},${d[1]})`).attr("opacity",0)
                        bubbleg.transition().duration(1000).attr("opacity", 1);
                        bubbleg.append("circle").attr("r", d=>4.5*d[2]).attr("cx",112).attr("cy",86).attr("class", (d,i)=>i%2==0? "bubble":"bubble2");
                        bubbleg.append("path").attr("d", d=>`M${111.42-d[2]},${83.659}C${109.216-d[2]},${85.178-d[2]} ${109.115-d[2]},${87.32} ${111.416-d[2]},${88.94}`).attr("class", "bubbleline");
                        
                 

        bubbles.transition().duration(1000).attr("transform", d=>`translate(${d[0]},${d[1]})`)
        bubbles.exit().transition().duration(1000).attr("opacity",0).remove();
    }

    const renderWater = (root, data)=>{

        const waterpos = d3.scaleLinear().domain([0, 500]).range([0,-100]);  
        const g = root.select("g#water-usage");
        const water = g.selectAll("g.watergroup").data(data, (d,i)=>i)
        const waterg = water.enter().append("g").attr("class", "watergroup");
        
        const rotationfor = (val)=>{
            return `rotate(${Math.min(val, 360)} 52.5 53)`
        }
        
        const w = waterg.append("g").attr("id","sink").attr("transform", d=>`translate(0,${waterpos(Math.min(482,d.fill))})`)
        
        w.append("path").attr("class","water").attr("id","water").attr("d", "M49.273,100.079C52.872,100.079 56.027,102.53 59.6,102.231C65.046,101.774 75.208,96.909 81.947,97.34C87.839,97.717 95.465,102.231 95.465,102.231L10.388,102.231C10.388,102.231 19.27,99.16 24.527,99.406C27.853,99.561 32.513,102.118 36.637,102.231C40.761,102.343 45.445,100.079 49.273,100.079Z")
        w.append("rect").attr("x",10).attr("y",100).attr("width",85.5).attr("height",100).attr("class", "water");

        water.select("g#sink").transition().duration(1000).attr("transform", d=>`translate(0,${waterpos(Math.min(482,d.fill))})`);

        waterg.append("circle").attr("id", "gauge-circle").attr("cx", 52).attr("cy", 53).attr("r", 35).attr("class", "gauge-circle");
        waterg.append("path").attr("class","arrow").attr("id","gauge-arrow").attr("d", "M49.138,46.414L49.165,37.721L40.093,39.939L52.678,23.099L65.16,40.015L56.102,37.742L56.075,46.394C58.51,47.633 60.178,50.145 60.178,53.038C60.178,55.948 58.492,58.471 56.034,59.703L55.963,82.978L49.026,82.956L49.098,59.641C46.706,58.387 45.075,55.9 45.075,53.038C45.075,50.16 46.724,47.661 49.138,46.414Z")
        waterg.append("circle").attr("id", "gauge-pivot").attr("cx", 52.5).attr("cy", 53).attr("r", 5).attr("class", "gauge-pivot");
    
        water.select("path.arrow").transition().duration(4000).attrTween("transform", (d)=>{
           
            const to =  rotationfor(d.flow);
            const from = rotationfor(d.previous);
            
            return d3.interpolate(from, to);
        })
        water.exit().remove();
    }

    const pathTween =(d1, precision)=>{
       
        return function() {
            var path0 = this;
          const  path1 = path0.cloneNode(), n0 = path0.getTotalLength(), n1 = (path1.setAttribute("d", d1), path1).getTotalLength();
      
          // Uniform sampling of distance based on specified precision.
          var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
          while ((i += dt) < 1) distances.push(i);
          distances.push(1);
      
          // Compute point-interpolators at each distance.
          var points = distances.map(function(t) {
            var p0 = path0.getPointAtLength(t * n0),
                p1 = path1.getPointAtLength(t * n1);
            return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
          });
      
          return function(t) {
            return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
          };
        };
      }

    const renderTime = (root, data=[])=>{
        const FLOWTIME = 60000;
        const FLIPTIME = 1000;

        const g = root.select("g#time");
        const timegroup = g.selectAll("g.timegroup").data(data);
        const timegroupg = timegroup.enter().append("g").attr("class", "timegroup");
        
        const sandtopbig = "M98.378,104.937c2.617,4.314 4.447,8.704 4.447,13.685c-0,15.661 -15.269,28.613 -31.727,28.613c-16.457,-0 -31.154,-12.679 -31.154,-28.341c-0,-4.981 0.997,-9.537 3.614,-13.851c16.459,4.001 36.847,3.895 54.82,-0.106Z";
        const sandtopsmall = "M83.079,142.594c1.143,0.584 1.64,-0.213 1.51,0.462c-0.355,1.837 -6.856,3.833 -13.847,3.878c-7.257,0.047 -10.709,-0.696 -10.451,-2.474c0.098,-0.674 -0.458,-0.679 0.685,-1.264c4.654,3.829 14.789,3.596 22.103,-0.602Z";
        const sandbottombig = "M99.341,204.579c0,0 3.812,-7.251 3.67,-13.616c-0.378,-16.933 -14.687,-28.542 -31.701,-28.542c-17.015,0 -31.591,13.222 -31.591,28.655c0,4.909 3.727,13.765 3.727,13.765l55.895,-0.262Z"
        const sandbottomsmall = "M95.542,204.597c0,0 4.18,0.447 4.18,-0.141c-0,-1.849 -12.955,-4.884 -28.373,-4.884c-15.419,0 -28.1,3.191 -28.1,5.04c0,0.588 3.906,-0.015 3.906,-0.015l48.387,0Z"
        
        
        const sandbottomtop = "M80.282,165.936c0,0 1.232,-0.54 1.186,-1.014c-0.122,-1.262 -4.745,-2.126 -10.241,-2.126c-5.497,-0 -10.205,0.985 -10.205,2.134c-0,0.366 1.203,1.026 1.203,1.026l18.057,-0.02Z"
        const sandtopbottom = "M95.587,104.885c2.373,0.483 4.031,0.974 4.031,1.531c0,1.752 -13.84,3.201 -28.759,3.201c-14.918,-0 -28.24,-1.419 -28.24,-3.171c-0,-0.557 0.904,-1.067 3.277,-1.549c14.919,0.447 33.399,0.436 49.691,-0.012Z";
      

        timegroupg.append("path").attr("id", "sandtop")
                    .attr("class","sandy")
                    .attr("d",sandtopbig)
                    .transition()
                    .on("start", function repeat(){
                        d3.active(this)
                        .transition().duration(FLOWTIME).attrTween("d", pathTween(sandtopsmall,4))
                        //.transition().duration(1).on("start",()=>d3.active(this).attr("d", sandtopbottom))
                        .transition().duration(FLIPTIME)

                        .transition().duration(FLOWTIME).attrTween("d", pathTween(sandtopbig,4))
                        .transition().duration(FLIPTIME)

                        .transition().duration(FLOWTIME).attrTween("d", pathTween(sandtopsmall,4))
                        //.transition().duration(1).on("start",()=>d3.active(this).attr("d", sandtopbottom))
                        .transition().duration(FLIPTIME)


                        .transition().duration(FLOWTIME).attrTween("d", pathTween(sandtopbig,4))
                         .transition().duration(FLIPTIME).on("end", repeat)
                    })
                    

        
        timegroupg.append("path").attr("id", "sandbottom")
                    .attr("class","sand")
                    .attr("d",sandbottomsmall)
                    .transition()
                    .on("start", function repeat(){
                      
                        d3.active(this)
                        .transition().duration(FLOWTIME).attrTween("d", pathTween(sandbottombig,4))
                       
                        .transition().duration(FLIPTIME).on("start", ()=>g.transition().attrTween("transform", (d)=>{
                            const to =  `rotate(180, 71.246, 155.031)`
                            const from = `rotate(0, 71.246, 155.031)`
                            return d3.interpolate(from, to);
                        }))
                        
                        .transition().duration(FLOWTIME).attrTween("d", pathTween(sandbottomtop,4))
                        
                        .transition().duration(FLIPTIME).on("start", ()=>g.transition().attrTween("transform", (d)=>{
                            const to =  `rotate(0, 71.246, 155.031)`
                            const from = `rotate(180, 71.246, 155.031)`
                            return d3.interpolate(from, to);
                        }))//.attr("d",sandbottomsmall)
                        
                        .transition().duration(FLOWTIME).attrTween("d", pathTween(sandbottombig,4))

                        .transition().duration(FLIPTIME).on("start", ()=>g.transition().attrTween("transform", (d)=>{
                            const to =  `rotate(180, 71.246, 155.031)`
                            const from = `rotate(0, 71.246, 155.031)`
                            return d3.interpolate(from, to);
                        }))
                        
                        .transition().duration(FLOWTIME).attrTween("d",   pathTween(sandbottomtop,4))

                        .transition().duration(FLIPTIME).on("start", ()=>g.transition().attrTween("transform", (d)=>{
                            const to =  `rotate(0, 71.246, 155.031)`
                            const from = `rotate(180, 71.246, 155.031)`
                            return d3.interpolate(from, to);
                        })).on("end", repeat)
                        //.attr("d",sandbottomsmall).on("end", repeat)
                      
                    });
        
        
        //timegroup.select("path.sandbottom")
          
        
    }

    const renderTechnique =(root, data)=>{

        const xacc = d3.scaleLinear().domain([-30, 30]).range([0,132]);  
        const yacc = d3.scaleLinear().domain([-30, 30]).range([0,-53]);  //reverse range as y is reversed axis
        const g = root.select("g#technique");
        const tech = g.selectAll("g.techgroup").data(data, (d,i)=>i)
        const techg = tech.enter().append("g").attr("class", "techgroup");

        techg.append("rect").attr("class","xback").attr("x",182.593).attr("y", 84.383).attr("width", 172.35).attr("height", 18.283)
        techg.append("rect").attr("class","yback").attr("x",331.822).attr("y", 0.965).attr("width", 23.274).attr("height", 83.496)
        techg.append("path").attr("d","M343.858,12.616C342.473,12.616 341.349,13.74 341.349,15.126L341.349,78.973C341.349,80.358 342.473,81.483 343.858,81.483C345.243,81.483 346.368,80.358 346.368,78.973L346.368,15.126C346.368,13.74 345.243,12.616 343.858,12.616Z").attr("class", "axisline")
        techg.append("path").attr("d","M341.631,94.067C341.631,92.682 340.507,91.557 339.122,91.557L189.459,91.557C188.074,91.557 186.949,92.682 186.949,94.067C186.949,95.452 188.074,96.577 189.459,96.577L339.122,96.577C340.507,96.577 341.631,95.452 341.631,94.067Z").attr("class", "axisline2")
        techg.append("path").attr("d","M189.98,93.946L338.045,93.946").attr("class", "axisline3")
        techg.append("path").attr("d","M344.151,78.896L344.151,14.608").attr("class", "axisline4")

        const dishmatic = techg.append("g").attr("id","dishmatic")
        dishmatic.append("path").attr("id","spongetop").attr("d","M302.811,79.838L230.854,79.838L230.854,66.77C230.854,64.365 232.806,62.414 235.21,62.414L299.339,62.414C301.256,62.414 302.811,63.969 302.811,65.886L302.811,79.838Z" ).attr("class", "spongetop")
        dishmatic.append("path").attr("id","spongebottom").attr("d","M230.854,79.838L302.811,79.838L302.811,80.886C302.811,83.519 300.674,85.656 298.041,85.656L235.615,85.656C232.987,85.656 230.854,83.523 230.854,80.896L230.854,79.838Z" ).attr("class", "spongebottom")
        dishmatic.append("path").attr("id","handlebottom").attr("d","M298.269,61.064C298.269,59.781 297.227,58.739 295.944,58.739L239.494,58.739C238.157,58.739 237.071,59.825 237.071,61.163L237.071,62.451L298.269,62.451L298.269,61.064Z" ).attr("class", "handlebottom")
        dishmatic.append("path").attr("id","handle").attr("d","M354.496,0.514L354.496,5.838C343.936,9.43 309.655,27.714 299.032,46.022C296.864,49.759 297.194,59.133 297.194,59.133L238.268,59.35C240.718,46.628 267.419,38.847 286.622,26.745C298.325,19.37 309.604,9.643 321.217,0.514L354.496,0.514Z").attr("class", "handle")


        const yaccsponge = techg.append("g").attr("id","yaccsponge").attr("transform", d=>`translate(${xacc(d.accx)},${0})`)
        yaccsponge.append("path").attr("id","yaccspongetop").attr("d","M205.654,96.097L190.028,96.097L190.028,91.303C190.028,90.421 190.744,89.705 191.626,89.705L204.38,89.705C205.083,89.705 205.654,90.275 205.654,90.978L205.654,96.097Z"  ).attr("class", "yaccspongetop")
        yaccsponge.append("path").attr("id","yaccspongebottom").attr("d","M190.028,96.097L205.654,96.097L205.654,96.505C205.654,97.531 204.822,98.363 203.796,98.363L191.883,98.363C190.859,98.363 190.028,97.532 190.028,96.509L190.028,96.097Z").attr("class", "yaccspongebottom")

        tech.select("g#yaccsponge").transition().duration(1000).attr("transform", d=>`translate(${xacc(d.accx)},${0})`)
    
        const xaccsponge = techg.append("g").attr("id","xaccsponge").attr("transform", d=>`translate(0, ${yacc(d.accy)})`);
        xaccsponge.append("path").attr("id","xaccspongebottom").attr("d","M339.872,67.884C337.857,67.884 336.222,69.52 336.222,71.535L336.222,75.588C336.222,77.603 337.857,79.239 339.872,79.239C339.872,79.239 348.391,79.239 348.391,79.239C350.406,79.239 352.042,77.603 352.042,75.588C352.042,75.588 352.042,71.535 352.042,71.535C352.042,69.52 350.406,67.884 348.391,67.884C348.391,67.884 339.872,67.884 339.872,67.884Z").attr("class", "xaccspongebottom")
        xaccsponge.append("path").attr("id","xaccspongetop").attr("d","M339.872,69.509C338.754,69.509 337.846,70.417 337.846,71.535L337.846,75.588C337.846,76.707 338.754,77.615 339.872,77.615L348.391,77.615C349.51,77.615 350.418,76.707 350.418,75.588L350.418,71.535C350.418,70.417 349.51,69.509 348.391,69.509L339.872,69.509Z").attr("class", "xaccspongetop")

        tech.select("g#xaccsponge").transition().duration(1000).attr("transform", d=>`translate(0, ${yacc(d.accy)})`)

        const pressurelines = techg.append("g").attr("id","pressurelines")
        pressurelines.append("path").attr("id","pressureline1").attr("d","M228.77,79.263L220.245,71.536L223.859,68.889L228.77,79.263Z").attr("class", "pressureline1")
        pressurelines.append("path").attr("id","pressureline2").attr("d","M228.319,72.356L224.335,64.108L227.769,63.224L228.319,72.356Z").attr("class", "pressureline2")
        pressurelines.append("path").attr("id","pressureline3").attr("d","M305.908,76.391L308.443,69.599L305.664,69.123L305.908,76.391Z").attr("class", "pressureline3")
        pressurelines.append("path").attr("id","pressureline4").attr("d","M307.209,79.335L315.734,71.608L312.12,68.96L307.209,79.335Z").attr("class", "pressureline4")
        pressurelines.append("path").attr("id","pressureline5").attr("d","M310.081,80.345L314.22,76.286L315.458,78.131L310.081,80.345Z").attr("class", "pressureline5")
       
    }

    const renderNoise = (root, data=[])=>{

        const tc = root.select("g#noise");
        const g = tc.select("g.noisecontainer");

        const noise = g.selectAll("g.noisegroup").data(data, (d,i)=>i)
        const noiseg = noise.enter().append("g").attr("class", "noisegroup").attr("opacity",0).attr("transform", d=>`translate(${d[0]},${d[1]})`)

        noiseg.transition().duration(1000).attr("opacity",1)
        noiseg.append("path").attr("id", "bullhorn").attr("d", "M195.156,133.437C192.065,134.672 188.222,136.437 186.878,137.057C186.728,137.126 186.955,137.504 186.906,137.617C186.856,137.729 186.647,137.844 186.58,137.731C186.436,137.487 186.135,136.905 185.823,136.275L185.823,136.276L185.798,136.224L185.799,136.223C185.513,135.58 185.259,134.975 185.162,134.707C185.117,134.583 185.334,134.484 185.45,134.513C185.566,134.542 185.712,134.96 185.858,134.881C187.734,133.854 194.627,130.066 196.705,128.355C197.7,127.535 197.95,125.278 198.325,124.612C198.443,124.403 198.833,124.129 198.959,124.356C199.348,125.06 200.197,126.802 201.048,128.609L201.047,128.61C201.884,130.401 202.67,132.142 202.961,132.887C203.055,133.13 202.607,133.278 202.375,133.245C201.637,133.14 199.77,131.949 198.533,132.253C198.072,132.366 197.467,132.563 196.771,132.816C197.27,133.276 197.696,133.849 198.011,134.52C199.202,137.059 198.346,140.038 196.101,141.168C193.857,142.298 191.067,141.155 189.876,138.616C189.51,137.835 189.424,137.307 189.426,136.51L190.736,135.843C190.631,136.545 190.727,137.299 191.057,138.002C191.875,139.745 193.818,140.516 195.394,139.722C196.971,138.928 197.586,136.869 196.769,135.126C196.408,134.356 195.827,133.776 195.156,133.437Z").attr("class", "bullhorn");

        noise.transition().duration(1000).attr("opacity",1).attr("transform", d=>`translate(${d[0]},${d[1]})`)
        noise.exit().transition().duration(1000).attr("opacity",0).remove();
    }
    
   

    const renderTemperature = (root, data)=>{   
        const pos = d3.scaleLinear().domain([10, 60]).range([186,115]);  //reverse range as y is reversed axis
        const temp = d3.scaleLinear().domain([10, 60]).range([0,71]);  
        const mercury = root.selectAll("rect.thermometerreading").data(data, (_,i)=>i);
        mercury.enter().append("rect").attr("x", 311.3).attr("y", d=>pos(d)).attr("width",5).attr("height",d=>temp(d)).attr("rx",2).attr("class", "thermometerreading");
        mercury.transition().duration(1000).attr("y", d=>pos(d)).attr("height",d=>temp(d));       
    }
  

    const [sensordata, setSensorData] = useState({
        liquiddata: Array.from({length: Math.floor(1+ Math.random()*100)}, () => ([-8 + Math.floor(Math.random() * 70),Math.floor(Math.random()*-64), Math.floor(1+Math.random()*2)])),
        waterdata:[{flow:0,fill:0, previous:0}],
        noisedata: Array.from({length: Math.floor(1+ Math.random()*100)}, () => ([-30 + Math.floor(Math.random() * 100), 70 - Math.floor(Math.random()*90)])),
        temperaturedata: [10],
        techniquedata:[{accx: -30 + Math.random()*60, accy: -30 + Math.random()*60, accz: -30 + Math.random()*60, pressure:Math.floor(Math.random()*1023)}],
    });
    
    useInterval(() => {

      setSensorData(
        {
            liquiddata: Array.from({length: Math.floor(1+ Math.random()*100)}, () => ([-8 + Math.floor(Math.random() * 70),Math.floor(Math.random()*-64), Math.floor(1+Math.random()*2)])),
            waterdata:[{flow:Math.floor(Math.random()*20),fill:sensordata.waterdata[0].fill+Math.floor(Math.random()*20), previous:sensordata.waterdata[0].flow}],
            noisedata: Array.from({length: Math.floor(1+ Math.random()*100)}, () => ([-30 + Math.floor(Math.random() * 100), 70 - Math.floor(Math.random()*90)])),
            temperaturedata: [10 + Math.floor(Math.random()*50)],
            techniquedata:[{accx: -30 + Math.random()*60, accy: -30 + Math.random()*60, accz: -30 + Math.random()*60, pressure:Math.floor(Math.random()*1023)}],
        }
      )
    
    }, 2000);

    const sensorref = useD3((root)=>{
        const {liquiddata=[],waterdata=[],noisedata=[], temperaturedata=[], techniquedata=[]} = sensordata;
        renderLiquid(root, liquiddata);
        renderWater(root, waterdata);
        renderTechnique(root, techniquedata);
        renderNoise(root,noisedata);
        renderTime(root, [1]);
        renderTemperature(root, temperaturedata);
       
    });

    return (
        <>
        <div className="fullwidth">
            <div className="line">
                    <div className="heading">Connected Kitchen <span className="subheading">dashboard</span></div>
                    <div className="menu">connect</div>
            </div>
        </div>
    <svg ref={sensorref} width="100vw" viewBox="0 0 366 207" className="main">
       <rect x={0} y={0} width="365" height="206" className="backrect"></rect>
       <g id="washing-liquid">
        <rect id="washingrect" x="95.467" y="0.392" width="87.06" height="102.757" className="washingrect"/>
       </g>
       <g id="water-usage">
        <rect id="waterrect" x="9.832" y="0.392" width="85.83" height="102.757" className="waterrect"/>
       </g>
       <g id="technique">
       <rect id="techrect" x="182.598" y="0.483" width="172.594" height="102.667" className="techrect"/>
       </g>
       <g id="noise">
            <rect id="noiserect" x="138.978" y="102.577" width="130.892" height="103.7" className="noiserect"/>
            <g class="noisecontainer"></g>
            <path id="bigbull" className="bigbull" d="M139.102,165.062C144.458,161.777 149,158.814 151.966,156.549C158.005,151.939 160.313,140.273 162.731,136.703C163.489,135.584 165.836,134.022 166.471,135.132C168.441,138.578 172.648,147.151 176.844,156.054L176.841,156.056C180.962,164.885 184.807,173.478 186.192,177.175C186.643,178.378 184.007,179.326 182.689,179.252C178.486,179.016 168.206,173.688 160.975,175.759C158.282,176.53 154.723,177.792 150.627,179.376C153.315,181.524 155.546,184.285 157.097,187.591C159.81,193.374 159.972,199.821 158.043,205.746L149.459,205.746C151.634,201.124 151.896,195.843 149.721,191.207C147.941,187.414 144.827,184.683 141.096,183.222C140.437,183.496 139.773,183.775 139.102,184.058L139.102,165.062Z"></path>
            <path id="bigbullinner" className="bigbullinner" d="M183.987,177C183.825,177.063 183.654,177.116 183.486,177.157C183.237,177.217 182.994,177.251 182.802,177.239C182.082,177.192 181.17,176.965 180.116,176.66C178.242,176.117 175.955,175.315 173.522,174.627C171.002,173.931 168.341,173.356 165.786,173.228C163.905,173.134 162.081,173.282 160.406,173.77C159.159,174.137 157.73,174.606 156.152,175.166C154.269,175.835 152.172,176.634 149.914,177.531C149.585,177.661 149.301,177.871 149.09,178.139C148.879,178.407 148.733,178.728 148.682,179.077C148.632,179.425 148.673,179.773 148.799,180.089C148.925,180.404 149.129,180.688 149.405,180.905C150.665,181.89 151.82,183.019 152.841,184.288C153.836,185.523 154.707,186.886 155.427,188.374C156.654,190.907 157.352,193.652 157.565,196.425C157.771,199.117 157.525,201.834 156.854,204.411L156.585,204.415C155.276,204.44 152.399,204.495 151.15,204.519C151.842,202.37 152.191,200.082 152.137,197.809C152.078,195.335 151.544,192.881 150.458,190.654C149.47,188.631 148.108,186.997 146.487,185.68C144.858,184.358 142.97,183.357 140.945,182.602C142.933,183.418 144.777,184.474 146.352,185.84C147.898,187.179 149.183,188.818 150.088,190.827C151.076,193.019 151.522,195.414 151.507,197.815C151.492,200.205 151.015,202.601 150.156,204.807C150.107,204.938 150.125,205.084 150.205,205.199C150.285,205.313 150.416,205.381 150.556,205.38C150.556,205.38 154.891,205.428 156.589,205.445C156.878,205.448 157.091,205.449 157.193,205.45C157.602,205.454 157.737,205.138 157.737,205.138C157.746,205.117 157.754,205.096 157.76,205.074C158.617,202.282 158.993,199.305 158.842,196.343C158.693,193.393 158.016,190.462 156.78,187.74C156.045,186.125 155.145,184.64 154.108,183.291C153.036,181.898 151.816,180.653 150.479,179.561C150.446,179.535 150.425,179.498 150.41,179.46C150.396,179.423 150.396,179.382 150.402,179.341C150.409,179.301 150.429,179.267 150.454,179.236C150.478,179.207 150.512,179.187 150.549,179.173C152.801,178.326 154.892,177.575 156.767,176.943C158.317,176.42 159.718,175.978 160.941,175.638C162.419,175.221 164.027,175.123 165.683,175.212C168.098,175.343 170.613,175.881 172.996,176.537C175.433,177.192 177.725,177.969 179.604,178.481C180.818,178.812 181.872,179.034 182.699,179.073C183.046,179.089 183.485,179.038 183.932,178.92C184.304,178.823 184.683,178.684 185.017,178.516L185.66,178.077C185.96,177.834 186.071,177.425 185.933,177.064C185.325,175.53 182.026,168.303 178.252,160.306C172.77,148.689 166.318,135.44 166.261,135.467C166.316,135.444 171.546,147.746 176.395,159.125C177.937,162.743 179.446,166.261 180.728,169.266C182.228,172.784 183.42,175.588 183.987,177Z"></path>
            
       </g>
       <g>
            <rect id="timerect" x="9.711" y="102.577" width="129.587" height="103.717" className="timerect"/>
            <path d="M112.434,103.177L30.213,103.177C28.05,108.24 26.932,113.665 26.935,119.16C26.942,134.008 34.993,147.152 47.277,154.711C46.379,155.223 45.694,155.637 45.433,155.828C45.304,155.922 45.179,156.017 45.057,156.112C34.019,163.846 26.942,176.265 26.935,190.204C26.932,195.748 28.204,200.743 30.405,205.844L112.507,205.368C114.703,200.279 115.708,195.776 115.71,190.247C115.717,176.106 108.445,163.52 97.135,155.802C96.894,155.627 96.64,155.456 96.372,155.288C96.187,155.172 95.836,154.968 95.371,154.707C107.663,147.141 115.718,133.977 115.71,119.116C115.708,113.636 114.591,108.226 112.434,103.177Z" className="timeback"/>
            <g id="time">
                
                <path id="timer" d="M59.727,148.238C47.305,143.875 38.457,132.704 38.451,119.622C38.448,114.252 40.234,108.639 43.117,103.987L98.886,104.154C101.774,108.803 104.192,114.22 104.195,119.59C104.201,132.93 95.012,144.292 82.207,148.478C80.587,150.197 79.645,152.252 79.645,154.459C79.645,157.075 80.968,159.477 83.174,161.359C85.61,162.237 90.4,164.913 90.311,164.932C98.715,170.48 104.2,179.607 104.195,189.915C104.192,195.285 102.671,200.559 99.783,205.208L42.847,205.181C39.964,200.529 38.448,195.252 38.451,189.882C38.456,179.63 43.891,170.552 52.221,165.005C52.008,164.964 56.615,162.463 58.591,161.689C61.037,159.761 62.522,157.23 62.522,154.459C62.522,152.148 61.489,150.004 59.727,148.238Z" className="timer"/>
                <path id="timerreflection" d="M42.335,204.165C41.237,202.05 40.504,199.843 40.061,197.572C39.619,195.312 39.468,192.992 39.529,190.641C39.641,185.871 40.979,181.409 43.237,177.5C45.509,173.569 48.72,170.21 52.582,167.692C52.582,167.692 52.784,167.536 52.784,167.536C53.22,167.297 54.724,166.481 56.159,165.757C57.025,165.32 57.864,164.918 58.412,164.709L59.074,164.346C61.039,163.272 62.412,161.825 63.374,160.149C64.336,158.474 64.872,156.558 65.157,154.539C65.383,152.869 64.874,150.744 63.804,148.888C62.786,147.124 61.272,145.623 59.542,144.924C56.814,143.853 54.263,142.447 51.947,140.78C49.57,139.068 47.443,137.079 45.655,134.838C42.063,130.336 39.817,124.858 39.647,118.736C39.571,116.392 39.752,114.047 40.217,111.758C40.685,109.455 41.434,107.215 42.51,105.093C41.276,107.153 40.359,109.355 39.732,111.642C39.1,113.95 38.77,116.336 38.694,118.737C38.521,125.185 40.559,131.093 44.115,136.008C45.911,138.49 48.098,140.712 50.581,142.618C53.003,144.476 55.717,146.015 58.611,147.223C59.862,147.731 60.909,148.864 61.651,150.136C62.437,151.484 62.896,153.007 62.744,154.225C62.54,155.943 62.136,157.581 61.355,159.02C60.618,160.375 59.552,161.555 58.006,162.452L57.61,162.709C57.023,162.955 56.122,163.418 55.197,163.923C53.718,164.729 52.169,165.637 51.786,165.863C51.722,165.899 51.663,165.942 51.609,165.992L51.491,166.091C47.523,168.916 44.26,172.591 42.043,176.844C39.878,180.998 38.701,185.691 38.812,190.641C38.872,193.03 39.146,195.378 39.711,197.65C40.274,199.911 41.122,202.094 42.335,204.165Z" className="timereflection"/>
                <path id="timerreflection1" d="M100.454,203.825C101.668,201.754 102.516,199.571 103.079,197.31C103.644,195.038 103.918,192.691 103.977,190.301C104.089,185.351 102.912,180.658 100.747,176.504C98.529,172.251 95.267,168.576 91.299,165.751C91.299,165.751 91.181,165.652 91.181,165.652C91.127,165.602 91.067,165.559 91.004,165.523C90.621,165.297 89.072,164.389 87.593,163.583C86.667,163.078 85.767,162.616 85.18,162.369L84.783,162.112C83.238,161.215 82.171,160.035 81.435,158.68C80.653,157.241 80.25,155.603 80.045,153.885C79.894,152.667 80.353,151.144 81.139,149.797C81.88,148.524 82.928,147.391 84.179,146.884C87.073,145.676 89.786,144.137 92.209,142.278C94.692,140.372 96.879,138.15 98.675,135.668C102.231,130.753 104.269,124.845 104.096,118.397C104.02,115.996 103.69,113.61 103.058,111.302C102.431,109.015 101.514,106.813 100.28,104.753C101.356,106.875 102.105,109.116 102.573,111.418C103.037,113.708 103.218,116.052 103.142,118.397C102.972,124.518 100.727,129.996 97.135,134.498C95.347,136.739 93.22,138.728 90.842,140.44C88.527,142.108 85.976,143.513 83.247,144.584C81.518,145.283 80.003,146.785 78.986,148.548C77.916,150.404 77.406,152.529 77.632,154.199C77.917,156.219 78.454,158.134 79.415,159.809C80.378,161.485 81.751,162.932 83.716,164.006L84.378,164.369C84.925,164.578 85.765,164.98 86.63,165.417C88.062,166.139 89.561,166.953 90.002,167.194C90.006,167.196 90.208,167.352 90.208,167.352C94.069,169.87 97.281,173.23 99.552,177.16C101.811,181.069 103.149,185.531 103.261,190.301C103.322,192.652 103.17,194.972 102.729,197.232C102.286,199.503 101.553,201.71 100.454,203.825Z" className="timereflection"/>
            </g>
           
        </g>
        <g id="temperature">
                <rect id="temprect" x="269.71" y="102.577" width="85.422" height="103.7" className="temprect"/>
                <path id="thermometerback" d="M325.38,118.478C325.38,112.103 320.204,106.926 313.828,106.926C307.452,106.926 302.276,112.103 302.276,118.478L302.276,182.13C302.276,188.505 307.452,193.682 313.828,193.682C320.204,193.682 325.38,188.505 325.38,182.13L325.38,118.478Z" className="thermometerback"/>
                <path d="M310.787,192.455C308.665,192.019 306.877,190.564 305.652,188.651C304.513,186.872 303.876,184.698 303.969,182.591C303.969,182.592 304.138,178.731 304.286,172.886C304.323,171.387 304.351,169.759 304.372,168.032C304.391,166.486 304.399,164.86 304.404,163.179C304.415,159.584 304.408,155.734 304.395,151.854C304.382,148.037 304.358,144.192 304.328,140.528C304.267,133.178 304.203,126.565 304.138,122.408C304.094,119.569 304.044,117.878 304.044,117.878C304.044,117.878 304.044,117.877 304.044,117.877C303.959,115.767 304.602,113.617 305.741,111.864C306.964,109.981 308.743,108.553 310.864,108.118C308.63,108.348 306.642,109.647 305.202,111.478C303.791,113.272 302.938,115.574 302.845,117.877C302.845,117.876 302.789,119.567 302.736,122.406C302.657,126.562 302.572,133.175 302.488,140.525C302.446,144.189 302.409,148.034 302.384,151.85C302.358,155.731 302.339,159.581 302.338,163.175C302.338,164.857 302.341,166.482 302.355,168.029C302.37,169.756 302.392,171.384 302.425,172.883C302.554,178.729 302.711,182.59 302.711,182.59C302.711,182.591 302.711,182.591 302.711,182.591C302.812,184.896 303.681,187.22 305.104,189.04C306.555,190.897 308.551,192.226 310.787,192.455Z" className="thermometerreflection"/>
                <path id="thermometerinner" d="M317.83,116.285L317.83,183.334C317.83,185.321 316.037,186.935 313.828,186.935C311.619,186.935 309.826,185.321 309.826,183.334C309.826,183.334 309.826,116.285 309.826,116.285C309.826,114.298 311.619,112.684 313.828,112.684C316.037,112.684 317.83,114.298 317.83,116.285Z" className="thermometerinner"/>
                
        </g>
        <g>
                <text x="186.584px" y="8.581px" className="sensortext">technique</text>
                <text x="242.905px" y="201.991px" className="sensortext">noise</text>
                <text x="310.329px" y="201.751px" className="sensortext">temperature</text>
                <text x="99.311px" y="8.498px" className="sensortext">washing liquid used</text>
                <text x="14.645px" y="8.07px" className="sensortext">water usage</text>
                <text x="117.449px" y="201.552px" className="sensortext">time</text>
        </g>
    </svg>
    <div className="fullwidth">
            <div style={{display:"flex", alignItems:"center", justifyContent:"center", width: "100vw", height:"80px", textAlign:"center"}}>
                    <div className="message">A message goes here!</div>
            </div>
        </div>
    </>);
}

export default Dashboard;