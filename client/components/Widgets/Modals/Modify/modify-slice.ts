import { createSlice } from '@reduxjs/toolkit';

const visible = false;

const modifyModalSlice = createSlice({
  initialState: visible,
  name: 'modify-modal',
  reducers: {
    open() {
      return true;
    },
    close() {
      return false;
    },
  },
});

export const { open, close } = modifyModalSlice.actions;
export default modifyModalSlice.reducer;
