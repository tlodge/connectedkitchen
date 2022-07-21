
   
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import sensorReducer from '../features/sensors/sensorSlice'
import liveReducer from '../features/live/liveSlice'
import replayReducer from '../features/replay/replaySlice'

export function makeStore() {
  return configureStore({
    reducer: { sensors: sensorReducer, live: liveReducer, replay: replayReducer },
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store