import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js';
import imagesReducer from './imageUploadSlice/index'
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { persistStore } from 'redux-persist';

const rootreducer=combineReducers({
    user:userReducer,
    images:imagesReducer
});

const persistConfig={
    key:'root',
    storage,
    version:1,
}


const persistedReducer=persistReducer(persistConfig,rootreducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
    serializableCheck:false,
  }),
})

export const persistor=persistStore(store)