import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { AppState, AppThunk } from '../../app/store'


const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
let rxCharacteristic;
const BASELINE = 260;
const BASEREADING = 17032;
const MILLILITRESPERSECOND = 10.8;

export interface SensorState {
  value: number
  status: 'idle' | 'loading' | 'failed'
  data: any
}

const initialState: SensorState = {
  value: 0,
  status: 'idle',
  data: {
      "water": {},
      "sponge": {},
      "weight": {},
  },
}

export const sensorSlice = createSlice({
  name: 'sensor',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {    
    setData: (state, action:PayloadAction<any>)=>{
        state.data = {...state.data, [action.payload.type] : action.payload.data}
    }
  }
})

export const { setData } = sensorSlice.actions
export const selectData = (state: AppState) => state.data


export const handleFlow = (service): AppThunk => (dispatch, getState) => {

    let fill = 0;
    let previous = 0;

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
          })
        })
      });
    }catch(err){
  
    }
  }

export const handleWeight = (service): AppThunk => (dispatch, getState) => {
    
    const THRESHOLD = 15;
    const lasttwo = [0,0];
    let index = 0;
    let lastreading = 0;
    let lastthresholdreading = 0;
    let totalsquirted = 0;

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
                      const weight = rawweight-BASEREADING;
                      lasttwo[++index%2]= weight;
                      
                      //omly update weight if last two readings tally
                      if (lasttwo[0]==lasttwo[1] && lastreading != weight){
                        lastreading = weight;
                        console.log("seen new weight", weight);
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
  
    }
  }

export const handleSponge = (service): AppThunk => (dispatch, getState) => {
    console.log("HANDLING SPONGE!!");
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
  
        }
  }

export default sensorSlice.reducer