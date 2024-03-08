import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore,persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "../Slice/authSlice";
import profileSlice from "../Slice/profileSlice";
import postSlice from "../Slice/postSlice";


const persistConfig = {
    key: "root",
    storage,
   };

const rootReducer = combineReducers({
        auth: authSlice,
        profile: profileSlice,
        post:postSlice,
        
})
const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
    reducer: persistedReducer,
   });

const persistor = persistStore(store);

export {store,persistor}