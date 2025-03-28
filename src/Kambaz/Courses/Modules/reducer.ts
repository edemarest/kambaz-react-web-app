import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const modulesSlice = createSlice({
  name: "modules",
  initialState: {
    modules: [] as any[],
  },
  reducers: {
    setModules: (state, action: PayloadAction<any[]>) => {
      state.modules = action.payload;
    },
    addModule: (state, action: PayloadAction<any>) => {
      state.modules.push(action.payload);
    },
    updateModule: (state, action: PayloadAction<any>) => {
      const index = state.modules.findIndex((m) => m._id === action.payload._id);
      if (index !== -1) {
        state.modules[index] = action.payload;
      }
    },
    deleteModule: (state, action: PayloadAction<string>) => {
      state.modules = state.modules.filter((m) => m._id !== action.payload);
    },
  },
});

export const { setModules, addModule, updateModule, deleteModule } = modulesSlice.actions;
export default modulesSlice.reducer;
