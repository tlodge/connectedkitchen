import { compose, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { AppState, AppThunk } from '../../app/store'
import {loadState,saveState} from '../../utils/localStorage'

const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
let rxCharacteristic;
let BASELINE = 700;
let BASEREADING = 17053;
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
  archive: string,
  experiment:string,
  bluetoothstatus: BluetoothStatus, 
  data: any,
  recordeddata: any
  activity: string,
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
      "activities":{
        "drying": [],
        "surfaces":[],
        "items":[],
      } 
  },

  activity: undefined,
}

export const sensorSlice = createSlice({
  name: 'sensor',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {    

    fixWeight : (state, action:PayloadAction<any>)=>{
      const data = loadState("connected one");
      const _data = {...data, weight: [{ts:1644248531409, squirted:2}]}
      saveState("connected one", _data);

      const d2 = loadState("connected two");
      const _d2 = {...d2, weight: [{ts: 1644249172545, squirted:3}]}
      saveState("connected two", _d2);
    },
    setData: (state, action:PayloadAction<any>)=>{
        //append the latest data item to its type
        
        state.data = {...state.data, [action.payload.type] : [...state.data[action.payload.type],action.payload.data]}
        saveState(action.payload.type, action.payload.data);
    },
    setRecording: (state, action:PayloadAction<any>)=>{
        //append the latest data item to its type
        //reset data
        state.data = {
            ...initialState.data,
            time : {
                ...initialState.data.time,
                from: Date.now(),
            }
        } 
        state.recording = action.payload;
    },
    stopRecording: (state)=>{
      
        state.recording = undefined;
        state.data.time.to = Date.now();
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
    },
    deleteArchive:  (state, action:PayloadAction<Status>)=>{
        console.log("in del archive");
        const recordings = loadState("recordings");
        console.log("recordings", recordings);
        const deleted = loadState("deleted") || [];

        const filtered = recordings.reduce((acc, item)=>{
            if (item.name != action.payload){
                return [...acc, item]
            }
            return acc;
        }, []);

        saveState("recordings", filtered);
        saveState("deleted", [...deleted, action.payload])
       

    }
  }
})
export const { fixWeight,setData, setRecording, stopRecording, setArchive, setBluetoothStatus, setExperimentName, setActivity, deleteArchive } = sensorSlice.actions;

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

const calculatebasereading = (calibrations)=>{
    
   

    const frequencies = calibrations.reduce((acc,item)=>{
        acc[item] = (acc[item]|| 0)+1;
        return acc;
    },{});

   
    const maxkey = Object.keys(frequencies).reduce((acc,key)=>{
       return acc < frequencies[key] ? key : acc;
    },0);

   
    return Number(maxkey)
}

export const handleWeight = (device, service): AppThunk => (dispatch, getState) => {
    
    const THRESHOLD = 1;
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

        let calibrationcount = 0;
        let calibrationreadings = [];

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
                      if (calibrationcount < 5){
                        calibrationreadings[calibrationcount++] = rawweight;
                      }
                      if (calibrationcount == 5){
                        BASEREADING = calculatebasereading(calibrationreadings);
                        calibrationcount+=1;
                      }
                      const weight = rawweight-BASEREADING;
                     
                      lasttwo[++index%2]= weight;
                      
                      //omly update weight if last two readings tally
                      if (lasttwo[0]==lasttwo[1] && lastreading != weight){
                        lastreading = weight;
                       
                        if (weight > THRESHOLD){
                         
                          if (lastthresholdreading > 0 && lastthresholdreading-weight >= THRESHOLD){
                            totalsquirted += Math.max(0, lastthresholdreading-weight);
                            
                           
                            console.log("set squirted to", totalsquirted);
                            dispatch(setData({
                                type:"weight",
                                data:{
                                    ts:Date.now(), 
                                    squirted:totalsquirted
                                }
                            }));
                          }
                          lastthresholdreading = weight;
                        }else{
                            console.log("not recording, less than threshold");
                        }
                        
                      }
                      
                      //else{
                      //  lastreading = weight;
                        
                     // }
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
    let calibrationcount = 0;
    let calibrationreadings = [];
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
                      
                      if (calibrationcount < 5){
                        calibrationreadings[calibrationcount++] = pressure;
                      }
                      if (calibrationcount == 5){
                        BASELINE = calculatebasereading(calibrationreadings);
                        calibrationcount+=1;
                      }
                      
                      dispatch(setData({
                          type:"sponge",
                          data:{
                            ts, 
                            baseline: BASELINE,
                            pressure: BASELINE-Number(pressure), 
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

export const selectOtherData = (state:AppState)=>{
    const recordings = loadState("recordings");
    const {archive} = state.sensors;
    if (!archive)
        return {}
    
    const names = recordings.map(r=>r.name).filter(r=>r!=archive);
    const other = names.reduce((acc, key)=>{
        return {
            ...acc,
            [key] : loadState(key)
        }
    },{})
    return other;
}

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

export const selectActivities = (state:AppState)=>{
    return state.sensors.data.activities;
}

export const selectActivity = (state:AppState)=>{
  return state.sensors.activity;
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