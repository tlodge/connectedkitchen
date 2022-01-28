import { compose, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { AppState, AppThunk } from '../../app/store'
import {loadState,saveState} from '../../utils/localStorage'

const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
let rxCharacteristic;
const BASELINE = 260;
const BASEREADING = 17032;
const MILLILITRESPERSECOND = 10.8;
let recordTimer;


type Status = Partial<Record<'weight'|'sponge'|'water', boolean>>

export interface BluetoothStatus {
  weight: boolean,
  sponge: boolean,
  water: boolean
}

export interface SensorState {
  recording: boolean,
  archive: String,
  experiment:String,
  bluetoothstatus: BluetoothStatus, 
  data: any,
  recordeddata: any
}

const initialState: SensorState = {
  recording: undefined,  //name of the recording
  archive: undefined, // name of the archive selected to view
  experiment:undefined, //name of this experiment (whether recording or not!)
  bluetoothstatus: {"weight":false, "sponge":false, "water": false},

  recordeddata: {  //currently selecetd longitudinal (recorded) data
    "water": [],
    "sponge": [],
    "weight": [],
    "time" : {from:0, to:0},
  },

  data: {   //live data (not necessarily being recorded!)
      "water": [],
      "sponge": [],
      "weight": [],
      "time" : {from:0, to:0},
  },
}

export const sensorSlice = createSlice({
  name: 'sensor',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {    
    setData: (state, action:PayloadAction<any>)=>{
        //append the latest data item to its type
        
        state.data = {...state.data, [action.payload.type] : [...state.data[action.payload.type],action.payload.data]}
        saveState(action.payload.type, action.payload.data);
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
    setArchive: (state, action:PayloadAction<any>)=>{
    
        state.archive = action.payload;
        state.recordeddata = loadState(action.payload);
    },
    setExperimentName: (state, action:PayloadAction<any>)=>{
    
        state.experiment = action.payload;
    },
    setBluetoothStatus: (state, action:PayloadAction<Status>)=>{
     
        state.bluetoothstatus = {
          ...state.bluetoothstatus,
          ...action.payload,
        }
    }
  }
})
export const { setData, setRecording, stopRecording, setArchive, setBluetoothStatus, setExperimentName } = sensorSlice.actions;

export const handleFlow = (device,service): AppThunk => (dispatch, getState) => {

    let fill = 0;
    let previous = 0;

    device.addEventListener('gattserverdisconnected', ()=>{
      dispatch(setBluetoothStatus({'water':false}));
    });

    try{
      rxCharacteristic =  service.getCharacteristic(
        UART_RX_CHARACTERISTIC_UUID
      ).then((characteristic)=>{
        dispatch(setBluetoothStatus({'water':true}));
        return characteristic.startNotifications().then(char => {
          characteristic.addEventListener('characteristicvaluechanged',
            (event)=>{
                const data = event.target.value;
                const arr = new Uint8Array(data.buffer);
                var string = new TextDecoder().decode(arr);

                const ML = Number(string);
                  

                if (ML > 0 || previous != 0){
                    const flow = ML * MILLILITRESPERSECOND;
                    fill += (flow / 2); // divide by two as two readings per second/
                

                    dispatch(setData({
                        type:"water",
                        data:{
                            ts: Date.now(), 
                            flow,
                            fill,
                            previous
                        }
                    }));     
                    previous = flow;
                }else{
                    previous = 0;
                }
               
                //saveState()
            })
        })
      });
    }catch(err){
      dispatch(setBluetoothStatus({'water':false}));
    }
  }

export const handleWeight = (device, service): AppThunk => (dispatch, getState) => {
    
    const THRESHOLD = 5;
    const lasttwo = [0,0];
    let index = 0;
    let lastreading = 0;
    let lastthresholdreading = 0;
    let totalsquirted = 0;

    device.addEventListener('gattserverdisconnected', ()=>{
      dispatch(setBluetoothStatus({'weight':false}));
    });

    try{
      rxCharacteristic =  service.getCharacteristic(
        UART_RX_CHARACTERISTIC_UUID
      ).then((characteristic)=>{

       

        return characteristic.startNotifications().then(char => {
          dispatch(setBluetoothStatus({'weight':true}));
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
                      const weight = rawweight-BASEREADING;
                      lasttwo[++index%2]= weight;
                      
                      //omly update weight if last two readings tally
                      if (lasttwo[0]==lasttwo[1] && lastreading != weight){
                        lastreading = weight;
                        
                        if (weight > THRESHOLD){
                          if (lastthresholdreading > 0){
                            totalsquirted += Math.max(0, lastthresholdreading-weight);
                            console.log(totalsquirted);

                            dispatch(setData({
                                type:"weight",
                                data:{
                                    ts:Date.now(), 
                                    squirted:totalsquirted
                                }
                            }));
                          }
                          lastthresholdreading = weight;
                        }
                        
                      }
                    }
                  }
                 
                })
        })
      });
    }catch(err){
      dispatch(setBluetoothStatus({'weight':false}));
    }
  }

export const handleSponge = (device,service): AppThunk => (dispatch, getState) => {
    device.addEventListener('gattserverdisconnected', ()=>{
      dispatch(setBluetoothStatus({'sponge':false}));
    });

    try{
        rxCharacteristic =  service.getCharacteristic(
          UART_RX_CHARACTERISTIC_UUID
        ).then((characteristic)=>{
          return characteristic.startNotifications().then(char => {
            dispatch(setBluetoothStatus({'sponge':true}));
            characteristic.addEventListener('characteristicvaluechanged',
                  (event)=>{
                      
                      const ts = Date.now();
                      const dv = event.target.value;
                      const arr = new Uint8Array(dv.buffer)
                      var string = new TextDecoder().decode(arr);
                     
                      const toks = string.split(" ");
                      const [xa, ya, za, xg, yg, zg, pressure, temperature, mic] = toks;
                      
                      dispatch(setData({
                          type:"sponge",
                          data:{
                            ts, 
                            pressure: Number(pressure)-BASELINE, 
                            temperature:Number(temperature), 
                            acceleration:[Number(xa),Number(ya),Number(za)], 
                            gyro:[Number(xg), Number(yg), Number(zg)], 
                            mic
                          }
                        }
                      ));
                     
                  });
              });
          });
        }catch(err){
          dispatch(setBluetoothStatus({'sponge':false}));
        }
  }


export const stoprecording = (): AppThunk => (dispatch, getState)=>{
    try{
        clearInterval(recordTimer);
        dispatch(stopRecording());
        const {sensors:{data, experiment}} = getState();
        saveState(experiment, {...data, time : {...data.time, to:Date.now()}});
    }catch(err){
        console.error(err);
    }   
}

export const record = (): AppThunk => (dispatch, getState)=>{
    try {
        const {sensors:{experiment:name}} = getState();
        if (!name){
          console.log("no name to record under");
          return;
        }
        
        console.log("recording experiment with name", name);

        const recordings = loadState("recordings");
        let _name = name;

        if (!recordings){
            saveState("recordings", [{ts:Date.now(), name}])
        }else{
            const recordings = loadState("recordings");
            //prevent name clash!
            const names = recordings.map(r=>r.name);
            let suffix = "", index=0;
            while (names.indexOf(`${name}${suffix}`) != -1){
                suffix = `${++index}`;
            }
            _name = `${name}${suffix}`;
            dispatch(setExperimentName(_name));
            saveState("recordings", [...recordings, {ts:Date.now(), name:_name}])
        }
        dispatch(setRecording(_name));
      
        recordTimer = setInterval(()=>{
            const {sensors:{data}} = getState();
            saveState(_name, data);
        }, 5000);
    }catch(err){
        console.log(err);
    }
}

export const selectData = (state: AppState) => state.sensors.data;

export const selectRecording= (state: AppState)=> state.sensors.recordeddata;

export const selectBluetoothState = (state: AppState)=>{
  const {bluetoothstatus} = state.sensors;
  return bluetoothstatus;
}

export const selectExperimentName = (state: AppState)=>{
  const {experiment} = state.sensors;
  return experiment;
}

export const selectExperiments = (state: AppState)=>{
  return loadState("recordings");
}

export const selectSpongeData = (state: AppState)   => {
   const {data:{sponge}} = state.sensors;
   return sponge.length > 0 ? sponge[sponge.length -1] : {};
}

export const selectWaterData = (state: AppState)    => {
    const {data:{water}} = state.sensors;
    return water.length > 0 ? water[water.length -1] : {};
}

export const selectWeightData = (state: AppState)   => {
    const {data:{weight}} = state.sensors;
    return weight.length > 0 ? weight[weight.length -1] : {};
}

export default sensorSlice.reducer