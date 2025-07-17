import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../constants/api";
import { LoginCredentials, LoginResponse, User } from "./authTypes";



// const token = localStorage.getItem('tokenId');
const user = localStorage.getItem('userData');



interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!) : null,
    token: localStorage.getItem('accessToken') || null,
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("accessToken") && !!user
};


export const loginUser = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>('auth/loginUser', async (credentials, thunkAPI) => {
    try {
        const response = await axios.post(API.LOGIN, credentials)
        return response.data
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed')
    }
})



export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null,
                state.token = null,
                state.loading = false;
            state.error = null;
            state.isAuthenticated = false;

            localStorage.removeItem("accessToken")
            // localStorage.removeItem("refreshToken")
            localStorage.removeItem("userData")
            localStorage.removeItem("lastCheckInTime")
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.loading = false,
                state.user = action.payload.user
                state.token = action.payload.token;
                state.isAuthenticated = true;
                localStorage.setItem("accessToken", action.payload?.accessToken)
                // localStorage.setItem("refreshToken", action.payload?.refreshToken)
                localStorage.setItem("userData", JSON.stringify(action.payload.user))
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
                state.isAuthenticated = false
            })
    }
})



export const { logout } = authSlice.actions;
export default authSlice.reducer