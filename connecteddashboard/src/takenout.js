/*
const WIDTH = 1000;
const PRESSUREHEIGHT = 400;
const ACCHEIGHT = 200;
const MICHEIGHT = 200;*/

/*<svg ref={pressureref} width={`${WIDTH}px`} height={`${PRESSUREHEIGHT}px}`}/>
<svg ref={accelerometerref} width={`${WIDTH}px`} height={`${ACCHEIGHT}px}`}/>
<svg ref={micref} width={`${WIDTH}px`} height={`${MICHEIGHT}px}`}/>}
</div>*/}

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
    );*/

/*
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
  */