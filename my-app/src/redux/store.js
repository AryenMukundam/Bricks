import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import studentSlicereducer from "./studentSlice.js";
import instructorSlicereducer from "./instructorSlice.js";
import classSlicereducer from "./classSlice.js"
import assignmentSlicereducer from "./assignmentSlice.js";
const rootReducer = combineReducers({
    student: studentSlicereducer,
    instructor: instructorSlicereducer,
    class: classSlicereducer,
    assignment: assignmentSlicereducer
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['student', 'instructor' , 'class' , 'assignment']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);
export default store;