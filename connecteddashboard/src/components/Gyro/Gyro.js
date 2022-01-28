import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef, useState, memo, useEffect } from "react";

import './ColorMaterial'

const Gyro = (props)=>{

  const mesh = useRef();

  const [rotation, _setRotation] = useState(props.rotation);
  const rotationRef = React.useRef(rotation);

  const setRotation = (rotation)=>{
    rotationRef.current = rotation;
    _setRotation(rotation);
  } 

  useEffect(()=>{
    setRotation(props.rotation);
  },[props.rotation])

  const [position, setPosition] = useState([0,0,0]);

  const Box = (props) => {
   
    
    useFrame(() => {
        
        if ((rotation || []).length > 0){
            const [gx,gy,gz] = rotation; 
            const y =  mesh.current.rotation.y  + (gx-0.07)/60;
            const x =  mesh.current.rotation.x  + (gy+0.12)/60;
            const z =  mesh.current.rotation.z +  (gz+0.05)/60;
            setPosition([x,y,z])
        }
    });

    return (
        <mesh
        {...props}
        ref={mesh}
        scale={[1.5, 1.5, 1.5]}>
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


  return (<Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Box  rotation={position}/>
    </Canvas>    
  );
}

function areEqual(prevProps, nextProps) {
    const r1 = prevProps.rotation || [0,0,0];
    const r2 = nextProps.rotation || [0,0,0];

    return r1[0] == r2[0] && r1[1]== r2[1] && r1[2]==r2[2];
  }


export default memo(Gyro, areEqual);