import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.ts";
import settingReducer from "./settingsSlice.ts";
import storage from "redux-persist/lib/storage"; // Make sure to import this
import { persistReducer, persistStore } from "redux-persist";


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], 
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,        
  settings: settingReducer, 
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
