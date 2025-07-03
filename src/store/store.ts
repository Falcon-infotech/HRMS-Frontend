import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice.ts"
import settingReducer from "./settingsSlice.ts"
export const store=configureStore({
    reducer:{
        auth:authReducer,
        settings:settingReducer,
    }
})


export type RootState=ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
