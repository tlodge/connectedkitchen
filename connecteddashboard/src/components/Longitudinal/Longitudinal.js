import React, {memo} from "react";


function Longitudinal({data}){
    console.log("longitudinal with data", data);
    return  <h1>longitudinal data</h1>
}

function areEqual(prevProps, nextProps) {
    if (!prevProps || !nextProps)
        return false;
     const {data:d1} = prevProps || {};
     const {data:d2} = nextProps || {};

     if (!d1 || !d2){
         return false;
     }
     return true;
}

export default memo(Longitudinal, areEqual);