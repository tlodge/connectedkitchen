import logo from './logo.svg';
import './App.css';
import * as THREE from 'three';
import { useLoader, useThree} from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useRef, useState, useMemo, useEffect } from "react";
import * as d3 from 'd3';
import { useD3 } from './hooks/useD3'
import './ColorMaterial'
import Dashboard from './Dashboard'

const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

let uBitDevice;
let rxCharacteristic;
const BASEREADING = 17029;

const WIDTH = 1000;
const PRESSUREHEIGHT = 400;
const ACCHEIGHT = 200;
const MICHEIGHT = 200;
const MAXVALUES = 40;
const BASELINE = 460;
const MAXPRESSURE = 1023;
const delta = 60; //samples per second


const handleFlow = (service)=>{
  try{
    rxCharacteristic =  service.getCharacteristic(
      UART_RX_CHARACTERISTIC_UUID
    ).then((characteristic)=>{
      return characteristic.startNotifications().then(char => {
        characteristic.addEventListener('characteristicvaluechanged',
              (event)=>{
                const data = event.target.value;
                const arr = new Uint8Array(data.buffer);
                var string = new TextDecoder().decode(arr);
                //console.log(string);
        })
      })
    });
  }catch(err){

  }
}

const handleWeight = (service)=>{
  try{
    rxCharacteristic =  service.getCharacteristic(
      UART_RX_CHARACTERISTIC_UUID
    ).then((characteristic)=>{
      return characteristic.startNotifications().then(char => {
        characteristic.addEventListener('characteristicvaluechanged',
              (event)=>{
                const data = event.target.value;
                const arr = new Uint8Array(data.buffer);
                var string = new TextDecoder().decode(arr);
               
                if (string.startsWith("-")){
                  const toks = string.split(",");
                 
                  const [sign, ...number] = toks[0];
                  
                  //get rid of truncated values!
                  if (number.length >= 5){
                    const rawweight = Number(number.join(""))
                    console.log(rawweight-BASEREADING);
                    
                  }
                }
               
              })
      })
    });
  }catch(err){

  }
}

function App() {
  
  const [spongeData, _setSpongeData] = useState([]);
  const spongeRef = React.useRef(spongeData);

  const setSpongeData = (data)=>{
    spongeRef.current = data;
    _setSpongeData(data);
  }


  /*const Model = () => {
    const gltf = useLoader(GLTFLoader, "./testmodel.glb");
    
    useThree(({camera}) => {
      camera.position.set(0, 0, 1);
    });

    useEffect(()=>{
  
      if (spongeData.length > 0){
            const {gyro = [0,0,0]} = spongeData[spongeData.length-1] || {};

        
            //const xr = spongeData.;
            //const yr = spongeData[4];
            //const zr = spongeData[5];
            console.log(Number(gyro[0]));
            gltf.scene.rotation.x = gltf.scene.rotation.x + (gyro[0]-0.06);
            //gltf.scene.rotation.y = gltf.scene.rotation.y  + gyro[1];
            //gltf.scene.rotation.z = gltf.scene.rotation.z  + gyro[2];
            //gltf.scene.rotation.y = yr;
            //gltf.scene.rotation.z = zr;
      }  
    },[spongeData]);
  
    useFrame(() => {
      
    });
  
    return (
      <>
        <primitive object={gltf.scene} scale={0.5} />
      </>
    );
  }*/


  const handleSponge = (service)=>{
   
    try{
      rxCharacteristic =  service.getCharacteristic(
        UART_RX_CHARACTERISTIC_UUID
      ).then((characteristic)=>{
        return characteristic.startNotifications().then(char => {
          
          characteristic.addEventListener('characteristicvaluechanged',
                (event)=>{
                    
                    const ts = Date.now();
                    const dv = event.target.value;
                    const arr = new Uint8Array(dv.buffer)
                    var string = new TextDecoder().decode(arr);
                   
                    const toks = string.split(" ");
                    const [xa, ya, za, xg, yg, zg, pressure, proximity, mic] = toks;
                    const item  = {ts, pressure: Number(pressure)-BASELINE, proximity:Number(proximity), acceleration:[Number(xa),Number(ya),Number(za)], gyro:[Number(xg), Number(yg), Number(zg)], mic};
                  
                    
                    if (spongeRef.current.length > MAXVALUES){
                      const [first, ...rest] = spongeRef.current;
                      setSpongeData([...rest, item]);
                    }else{
                      setSpongeData([...spongeRef.current,item]);
                    }
                    
                });
                    
            });
        });
      }catch(err){

      }
  }


  const selectDevice = async()=> {
    try {
   
      uBitDevice = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "Connected Sponge"},{ namePrefix: "Connected Tap"},{ namePrefix: "Adafruit Bluefruit LE"}],
        optionalServices: [UART_SERVICE_UUID]
      });
  
      if (uBitDevice.name==="Connected Sponge"){
        const server = await uBitDevice.gatt.connect();
        const service = await server.getPrimaryService(UART_SERVICE_UUID);
        handleSponge(service);
      }
  
      if (uBitDevice.name==="Adafruit Bluefruit LE"){
        const server = await uBitDevice.gatt.connect();
        const service = await server.getPrimaryService(UART_SERVICE_UUID);
        handleWeight(service);
      }
  
      if (uBitDevice.name==="Connected Tap"){
        const server = await uBitDevice.gatt.connect();
        const service = await server.getPrimaryService(UART_SERVICE_UUID);
        handleFlow(service);
      }
  
    }catch(err){
      console.log(err);
    }
  }


  const accelerometerref = useD3((root)=>{
    
    const acc   = d3.scaleLinear().domain([-30, 30]).range([ 0,ACCHEIGHT]);  //reverse range as y is reversed axis
    const tsx  = d3.scaleTime().domain(d3.extent(spongeData, d=>d.ts)).range([ 0, WIDTH ]);            

    const renderAccelerometer = ()=>{
    
      const linefn =  d3.line().curve(d3.curveBasis).x(d=>tsx(d.ts)).y(d=>acc(d.value));
      const xdata = [spongeData.map(d=>({value:d.acceleration[0], ts:d.ts}))];
      const ydata = [spongeData.map(d=>({value:d.acceleration[1], ts:d.ts}))];
      const zdata = [spongeData.map(d=>({value:d.acceleration[2], ts:d.ts}))];
      
      const accelXchart = root.selectAll("path#x").data(xdata)
    
      accelXchart.enter().append("path")
        .attr("d", d=>linefn(d))
        .attr("id", "x")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5);
      
      accelXchart.attr("d",d=>linefn(d))
      
      const accelYchart = root.selectAll("path#y").data(ydata)
    
      accelYchart.enter().append("path")
        .attr("d", d=>linefn(d))
        .attr("id", "y")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5);
      
      accelYchart.attr("d",d=>linefn(d))

      const accelZchart = root.selectAll("path#z").data(zdata)
    
      accelZchart.enter().append("path")
        .attr("d", d=>linefn(d))
        .attr("id", "z")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5);
      
      accelZchart.attr("d",d=>linefn(d))
    }
    renderAccelerometer();
  });


  const micref = useD3((root)=>{
    
    const tsx  = d3.scaleTime().domain(d3.extent(spongeData, d=>d.ts)).range([ 0, WIDTH ]);            
    const micy  = d3.scaleLinear().domain([0, 1000]).range([MICHEIGHT,0]);//reverse range as y is reversed axis

    const renderMic = ()=>{
      const linefn =  d3.line().curve(d3.curveBasis).x(d=>tsx(d.ts)).y(d=>micy(d.value));
      const micdata = [spongeData.map(d=>({value:d.mic, ts:d.ts}))];
      const micChart = root.selectAll("path#x").data(micdata);
      micChart.enter().append("path")
      .attr("d", d=>linefn(d))
      .attr("id", "x")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5);
    
      micChart.attr("d",d=>linefn(d))
    }
    renderMic();
  });
  
  const mesh = useRef();

  const pressureref = useD3((root) => {
    
      //const pressuresvg = root.attr("id", "pressure").attr('width',1000).attr("height", PRESSUREHEIGHT);
      //const accelerometersvg = root.select("#charts").append("svg").attr("id", "accelerometer").attr('width',1000).attr("height", ACCHEIGHT);
      //const micsvg =  root.select("#charts").append("svg").attr("id", "mic").attr('width',1000).attr("height", MICHEIGHT);

      var colour = d3.scaleSequential(d3.interpolateRdYlBu).domain([MAXPRESSURE-BASELINE,0]);
      const tsx  = d3.scaleTime().domain(d3.extent(spongeData, d=>d.ts)).range([ 0, WIDTH ]);            
      
      const px    = d3.scaleLinear().domain([0, MAXPRESSURE-BASELINE]).range([0, PRESSUREHEIGHT]);
   
                        
      const pressurec = root.selectAll("rect").data(spongeData, d=>d.ts)  
      
      const BARWIDTH = (WIDTH/MAXVALUES) - 1;

      const renderPressure = ()=>{
        pressurec.enter()  // Returns placeholders for our missing elements
        .append("rect")  // Creates the new rectangles
        .attr("x", (d, i)=> tsx(d.ts))
        .attr("y", (d, i)=> d.pressure > 0 ?  PRESSUREHEIGHT-px(d.pressure) : px(MAXPRESSURE))//d.pressure <= 0 ? PRESSUREHEIGHT - 1023 : PRESSUREHEIGHT - (d.pressure))
        .attr("rx",4)
        .attr("ry",4)
        .attr("width", BARWIDTH)
        .attr("height", (d)=> d.pressure > 0 ? px(d.pressure) : MAXPRESSURE)
        .style("fill", d=> colour(d.pressure))//d.pressure > (MAXPRESSURE-BASELINE-200) ? d.pressure > (MAXPRESSURE-BASELINE-100) ? "red"  : "orange": "steelblue")
        .style("opacity", d=> d.pressure <= 0 ? 0.1 : 1)

        pressurec.attr("x", (d, i)=> tsx(d.ts))
        pressurec.exit().remove()
      }
      renderPressure();
  });
  
  const [rotation, setRotation] = useState([0,0,0]);

  const Box = (props) => {
   
    const [active, setActive] = useState(false);
    useFrame(() => {
      if ((spongeData || []).length > 0){
        const {gyro = [0,0,0]} = spongeData[spongeData.length-1] || {}; 
        const y =  mesh.current.rotation.y  + (gyro[0]-0.07)/60;
        const x =  mesh.current.rotation.x  + (gyro[1]+0.12)/60;
        const z =  mesh.current.rotation.z +  (gyro[2]+0.05)/60;
        setRotation([x,y,z])
      }
  });
  

    
 
    return (
      <mesh
      {...props}
      ref={mesh}
      scale={active ? [2, 2, 2] : [1.5, 1.5, 1.5]}
      onClick={(e) => setActive(!active)}
        >
        <boxBufferGeometry args={[1, 1, 1]} />
        <colorMaterial attachArray="material" color="#A2CCB6" />
      <colorMaterial attachArray="material" color="#FCEEB5" />
      <colorMaterial attachArray="material" color="#EE786E" />
      <colorMaterial attachArray="material" color="#E0FEFF" />
      <colorMaterial attachArray="material" color="lightpink" />
      <colorMaterial attachArray="material" color="lightblue" />
           {/*<primitive attach="map" object={texture} />*/}
      </mesh>
    );
  }
  return (
    <div className="App"><Dashboard/></div>
  );
}

export default App;
/*
<div className="App">
      <button onClick={selectDevice}>connect</button>

      <Canvas>
        {<Suspense fallback={null}>
          <Model />
  </Suspense>}
      
  <ambientLight intensity={0.5} />
  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
  <pointLight position={[-10, -10, -10]} />
  <Box  rotation={rotation} />

</Canvas>
<Dashboard/>
{<svg ref={pressureref} width={`${WIDTH}px`} height={`${PRESSUREHEIGHT}px}`}/>
<svg ref={accelerometerref} width={`${WIDTH}px`} height={`${ACCHEIGHT}px}`}/>
<svg ref={micref} width={`${WIDTH}px`} height={`${MICHEIGHT}px}`}/>}
</div>*/