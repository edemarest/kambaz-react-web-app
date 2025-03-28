import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as client from "./client";

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableFrom?: string;
  availableUntil?: string;
  course: string;
}

interface AssignmentsState {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
}

const initialState: AssignmentsState = {
  assignments: [],
  loading: false,
  error: null,
};

// 🔄 Thunks
export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAssignments",
  async (courseId: string) => {
    return await client.fetchAssignmentsForCourse(courseId);
  }
);

export const addAssignment = createAsyncThunk(
  "assignments/addAssignment",
  async ({ courseId, assignment }: { courseId: string; assignment: Assignment }) => {
    return await client.createAssignment(courseId, assignment);
  }
);

export const editAssignment = createAsyncThunk(
  "assignments/editAssignment",
  async ({ assignmentId, updates }: { assignmentId: string; updates: Assignment }) => {
    return await client.updateAssignment(assignmentId, updates);
  }
);

export const removeAssignment = createAsyncThunk(
  "assignments/removeAssignment",
  async (assignmentId: string) => {
    await client.deleteAssignment(assignmentId);
    return assignmentId;
  }
);

// 🧠 Slice
const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.assignments = action.payload;
        state.loading = false;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch assignments.";
      })

      .addCase(addAssignment.fulfilled, (state, action) => {
        state.assignments.unshift(action.payload);
      })

      .addCase(editAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(a => a._id === action.payload._id);
        if (index !== -1) state.assignments[index] = action.payload;
      })

      .addCase(removeAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(a => a._id !== action.payload);
      });
  },
});

export default assignmentsSlice.reducer;
