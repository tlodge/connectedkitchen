import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { AppState, AppThunk } from '../../app/store'


import participant10 from '../../data/participant10.json';

const {sponge, water, weight} = participant10;

const minspongets = sponge.reduce((acc,item)=>{
    return item.ts < acc ? item.ts : acc;
}, Number.MAX_SAFE_INTEGER);


const minwaterts = water.reduce((acc,item)=>{
    return item.ts < acc ? item.ts : acc;
}, Number.MAX_SAFE_INTEGER);


const minweightts = weight.reduce((acc,item)=>{
    return item.ts < acc ? item.ts : acc;
}, Number.MAX_SAFE_INTEGER);

const MINTS = [minwaterts,minweightts].reduce((acc, item)=>{
    return item < acc ? item : acc;
},minspongets);


const MINPRESSURE = sponge.reduce((acc,item)=>{
    return item.pressure < acc ? item.pressure : acc;
}, Number.MAX_SAFE_INTEGER);

const MAXPRESSURE = sponge.reduce((acc,item)=>{
    console.log(item.pressure);
    return item.pressure > acc ? item.pressure : acc;
}, Number.MIN_SAFE_INTEGER);

console.log("MIN PRESSURE", MINPRESSURE, "max", MAXPRESSURE);


let BASELINE = 700;

export interface SensorState {
  experiment:string,
  data: any,
  activity: string,
}

const initialState: SensorState = {
  experiment:undefined, //name of this experiment (whether recording or not!)

  data: {   //live data (not necessarily being recorded!)
      "water": [],
      "sponge": [],
      "weight": [],
      "time" : {from:0, to:0},
      "activities":{
        "drying": [],
        "surfaces":[],
        "items":[],
      } 
  },

  activity: undefined,
}

export const replaySlice = createSlice({
  name: 'replay',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {    

    setData: (state, action:PayloadAction<any>)=>{
        //append the latest data item to its type
        
        state.data = {...state.data, [action.payload.type] : [...state.data[action.payload.type],action.payload.data]}
    },

    setActivity: (state, action:PayloadAction<any>)=>{
        const activity = action.payload;
        //set last activity end time if last activity still exists
        if (state.activity){
            state.data.activities[state.activity] = (state.data.activities[state.activity] || []).map((item,index)=>{
                if (index == state.data.activities[state.activity].length -1){
                    return {...item, to: Date.now()}
                }
                return item;
            })
        }
        state.activity = activity;

        //if this is a new activity, record it!
        if (activity){
            state.data.activities = {
                ...state.data.activities,
                [activity]: [...(state.data.activities[activity]||[]), {from:Date.now()}]
            }
        }
    },
  }
})

export const { setData,  setActivity }  = replaySlice.actions;

export const handleFlow = (): AppThunk => (dispatch, getState) => {
    let index = 0;
    const playdata = ()=>{
        const item = water[index];
        dispatch(setData({
          
            type:"water",
            data:{
                ts: item.ts,
                flow: item.flow,
                fill: item.fill,
                previous: item.previous
            }
          }
        ));
        
        index+=1;

        if (index < water.length){
            const duration = (water[index].ts - item.ts);
            setTimeout(playdata, duration);
        }
    }
    setTimeout(playdata, (minwaterts-MINTS));
}


export const handleWeight = (): AppThunk => (dispatch, getState) => {
    
    let index = 0;
    const playdata = ()=>{
        const item = weight[index];
        dispatch(setData({
            type:"weight",
            data:{
                ts:item.ts,
                squirted:item.squirted
            }
          }
        ));
        index+=1;
        if (index < weight.length){
            const duration = (weight[index].ts - item.ts);
            setTimeout(playdata, duration);
        }
    }
    setTimeout(playdata, (minweightts-MINTS));
}

export const handleSponge = (): AppThunk => (dispatch, getState) => {
  

    let index = 0;
    const playdata = ()=>{
        const item = sponge[index];
        dispatch(setData({
            type:"sponge",
            data:{
              ts: item.ts, 
              baseline: BASELINE,
              pressure:item.pressure, 
              temperature:item.temperature, 
              acceleration:item.acceleration, 
              gyro:item.gyro, 
              mic: item.mic,
            }
          }
        ));
        index+=1;
        if (index < sponge.length){
            const duration = (sponge[index].ts - item.ts);
            setTimeout(playdata, duration);
        }
    }
    setTimeout(playdata, (minspongets-MINTS));
  }

export const selectData = (state: AppState) => state.replay.data;

export const selectSpongeData = (state: AppState)   => {
   const {data:{sponge}} = state.replay;
   return sponge.length > 0 ? sponge[sponge.length -1] : {};
}

export const selectWaterData = (state: AppState)    => {
    const {data:{water}} = state.replay;
    return water.length > 0 ? water[water.length -1] : {};
}

export const selectWeightData = (state: AppState)   => {
    const {data:{weight}} = state.replay;
    return weight.length > 0 ? weight[weight.length -1] : {};
}

export default replaySlice.reducer