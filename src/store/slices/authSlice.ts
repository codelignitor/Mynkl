import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isUserLoggedIn: boolean;
  open_to_talk_status:boolean,
  user_id:string | null,
  username:string | null
}

const initialState: AuthState = {
  token: null,
  isUserLoggedIn: false,
  open_to_talk_status:false,
  user_id:null,
  username:null


};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload.access_token;
      state.isUserLoggedIn = true;
      state.open_to_talk_status = action.payload.open_to_talk_status;
      state.user_id = action.payload.user_id;
      state.username = action.payload.username;
    },
    isUserLoggedIn: (state) => {
      
      state.isUserLoggedIn = true;
    },
     setTokenOnly: (state, action: PayloadAction<string>) => {
        state.token = action.payload.access_token;
      state.open_to_talk_status = action.payload.open_to_talk_status;
      state.user_id = action.payload.user_id;
      state.username = action.payload.username;
      
      
    },
    logout: (state) => {
      state.token = null;
      state.isUserLoggedIn = false;
      state.open_to_talk_status = false;
      state.user_id = null;
      state.username = null;
    },

  },
});

export const { setToken, logout , isUserLoggedIn , setTokenOnly } = authSlice.actions;
export default authSlice.reducer;
