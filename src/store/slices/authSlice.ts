import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isUserLoggedIn: boolean;
  open_to_talk_status: boolean;
  user_id: string | null;
  username: string | null;
  profileImage?: string | null; // ✅ Added this
  mode: string | null;
  stream_token?: string | null;
}

const initialState: AuthState = {
  token: null,
  isUserLoggedIn: false,
  open_to_talk_status: false,
  user_id: null,
  username: null,
  profileImage: null, // ✅ Initialized here too
  mode: null,
  stream_token: null,
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
      state.stream_token = action.payload.stream_token || null;
    },
    isUserLoggedIn: (state) => {
      state.isUserLoggedIn = true;
    },
    setTokenOnly: (state, action: PayloadAction<string>) => {
      state.token = action.payload.access_token;
      state.open_to_talk_status = action.payload.open_to_talk_status;
      state.user_id = action.payload.user_id;
      state.username = action.payload.username;
      state.stream_token = action.payload.stream_token || null;
    },
    logout: (state) => {
      state.token = null;
      state.isUserLoggedIn = false;
      state.open_to_talk_status = false;
      state.user_id = null;
      state.username = null;
      state.profileImage = null; // ✅ Clear profileImage on logout
      state.stream_token = null;
    },
    getHomeDetail: (state, action: PayloadAction<{ open_to_talk_status: boolean, user_id: string, username: string, mode: string }>) => {
      state.open_to_talk_status = action.payload.open_to_talk_status;
      state.user_id = action.payload.user_id;
      state.username = action.payload.username;
      state.mode = action.payload.mode;
    },
    setProfile: (state, action: PayloadAction<{ username: string; profileImage: string }>) => {
      state.username = action.payload.username;
      state.profileImage = action.payload.profileImage;
    },
  },
});

export const { setToken, logout, isUserLoggedIn, setTokenOnly, getHomeDetail, setProfile } = authSlice.actions;
export default authSlice.reducer;
