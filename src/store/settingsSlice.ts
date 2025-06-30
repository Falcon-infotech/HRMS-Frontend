import { createAsyncThunk, createSlice, isRejectedWithValue, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface SettingsState {
    darkMode: boolean;
    location: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
    desktop: boolean;
}


interface State {
    data: SettingsState;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    saveStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    saveError: string | null;
}


const initialState: State = {
    data: {
        darkMode: false,
        location: false,
        email: false,
        push: false,
        sms: false,
        desktop: false
    },
    status: 'idle',
    error: null,
    saveStatus: 'idle',
    saveError: null
}


export const fetchSettings = createAsyncThunk<SettingsState, { rejectValue: string }>('settings/fetchSettings', async (_, thunkApi) => {
    try {
        const response = await axios.get('/api/settings');
        return response.data;
    } catch (error: string | any) {
        if (isRejectedWithValue(error)) {
            return thunkApi.rejectWithValue(error.message);
        }
        return thunkApi.rejectWithValue('Failed to fetch settings');

    }
})


export const saveSettings = createAsyncThunk<SettingsState, Partial<SettingsState>>('setting/saveSettings', async (Settings, thunkAi) => {
    try {
        const response = await axios.put('/api/settings', Settings);
        return response.data;

    } catch (error: string | any) {
        if (isRejectedWithValue(error)) {
            return thunkAi.rejectWithValue(error.message);
        }
        return thunkAi.rejectWithValue('Failed to save settings');

    }
})




const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchSettings.fulfilled, (state, action: PayloadAction<SettingsState>) => {
                state.status = "succeeded";
                state.data = action.payload;
            }
            )
            .addCase(fetchSettings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(saveSettings.pending, (state) => {
                state.saveStatus = 'loading';
                state.saveError = null;
            })
            .addCase(saveSettings.fulfilled, (state, action: PayloadAction<SettingsState>) => {
                state.saveStatus = 'succeeded';
                state.data = action.payload;
            })
            .addCase(saveSettings.rejected, (state, action) => {
                state.saveStatus = 'failed';
                state.saveError = action.payload as string;
            });
    }
})

export default settingsSlice.reducer;