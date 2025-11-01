import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";// it is authSlice.reducer from authSlice.js
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import companySlice from "./companySlice";
import jobSlice from "./jobSlice";
import applicationSlice from "./applicationSlice";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}
const rootReducer = combineReducers({
    auth: authSlice,
    company:companySlice,
    job:jobSlice,
    application:applicationSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export default store;

//https://www.npmjs.com/package/redux-persist
//see how to impleent redux persist in documentation

//Redux Persist is a library that saves the state of a Redux store between sessions, even after the app is restarted or the page is refreshed. 
//This is useful for applications that require users to log in or want to save user preferences and session data

//react persist uses local storage to store the state of the application so that data is not lost when the page is refreshed or the app is restarted
//so we dont have to use local storage or cookies to store the state of the application

//redux-persist code is availabe in documentation (same as above)