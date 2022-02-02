import { compose, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { AppState, AppThunk } from '../../app/store'
import {loadState, saveState} from '../../utils/localStorage'
let captureTimer, screenTimer;

type Status = Partial<Record<'weight'|'sponge'|'water', boolean>>

export interface BluetoothStatus {
  weight: boolean,
  sponge: boolean,
  water: boolean
}

export interface SensorState {
  recording: boolean,
  experiment: String,
  bluetoothstatus: BluetoothStatus, 
  data: any
}

const initialState: SensorState = {
  recording: undefined,
  experiment: undefined,
  bluetoothstatus: {"weight":false, "sponge":false, "water": false},

  data: {
      "water": {},
      "sponge": {},
      "weight": {},
      "time" : {from:0, to:0},
  },
}

export const sensorSlice = createSlice({
  name: 'live',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {    
    setData: (state, action:PayloadAction<any>)=>{
      
        state.data = action.payload;
    },
    setRecording: (state, action:PayloadAction<any>)=>{
    
        //append the latest data item to its type
        state.recording = action.payload;
        state.data.time.from = Date.now();
    },
    stopRecording: (state)=>{
   
        state.recording = undefined;
        state.data.time.to = Date.now();
    },
    setExperiment: (state, action:PayloadAction<any>)=>{
    
        state.experiment = action.payload;
        state.data = loadState(action.payload);
    },
    setBluetoothStatus: (state, action:PayloadAction<Status>)=>{
   
        state.bluetoothstatus = {
          ...state.bluetoothstatus,
          ...action.payload,
        }
    }
  }
})
export const { setData, setRecording, stopRecording, setExperiment, setBluetoothStatus } = sensorSlice.actions;

export const init = (): AppThunk => (dispatch, getState) => {
   

      saveState("water", {});
      saveState("sponge",{});
      saveState("weight",{});
      captureTimer = setInterval(()=>{
        const water = loadState("water")    || {};
        const sponge = loadState("sponge")  || {};
        const weight = loadState("weight")  || {};
        dispatch(setData({water,sponge,weight}));
      },500)
}

export const selectData = (state: AppState) => state.live.data;

export const selectBluetoothState = (state: AppState)=>{
  const {bluetoothstatus} = state.live;
  return bluetoothstatus;
}

export const selectSpongeData = (state: AppState)   => {
  const {data} = state.live;
  if (data){
    return data.sponge;
  }
  return {}
}

export const selectWaterData = (state: AppState)    => {
  const {data} = state.live;
  if (data){
    return data.water;
  }
  return {}
}

export const selectWeightData = (state: AppState)   => {
    const {data} = state.live;
    if (data){
      return data.weight;
    }
    return {}
}

export default sensorSlice.reducer