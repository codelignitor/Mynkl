import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MapState {
  shouldRefresh: boolean;
  lastCheckInTime: number | null;
}

const initialState: MapState = {
  shouldRefresh: true,
  lastCheckInTime: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    triggerMapRefresh: (state) => {
      state.shouldRefresh = true;
      state.lastCheckInTime = Date.now();
    },
    resetMapRefresh: (state) => {
      state.shouldRefresh = false;
    },
  },
});

export const { triggerMapRefresh, resetMapRefresh } = mapSlice.actions;
export default mapSlice.reducer;
