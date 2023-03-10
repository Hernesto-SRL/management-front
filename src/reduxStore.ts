import {AnyAction, configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";

interface ControlState {
    barcode: string;
}

const controlInitialState: ControlState = {
    barcode: ""
};

interface ControlActions {
    setBarcode: (barcode: string) => AnyAction;
}

const controlSlice = createSlice({
   name: "control",
   initialState: controlInitialState,
   reducers: {
       setBarcode: (state: ControlState, action: PayloadAction<string>) => {
           state.barcode = action.payload;
       }
   }
});

export const controlActions = controlSlice.actions as ControlActions;

export interface AppState {
    control: ControlState;
}

export const appReduxStore = configureStore({
    reducer: {
        control: controlSlice.reducer
    }
});