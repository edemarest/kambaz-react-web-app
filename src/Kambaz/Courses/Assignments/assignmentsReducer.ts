import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.assignments = action.payload;
    },
    addAssignment: (state, action: PayloadAction<Assignment>) => {
      state.assignments.unshift(action.payload);
    },
    updateAssignment: (state, action: PayloadAction<Assignment>) => {
      const index = state.assignments.findIndex(
        (a) => a._id === action.payload._id,
      );
      if (index !== -1) {
        state.assignments[index] = action.payload;
      }
    },
    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.assignments = state.assignments.filter(
        (a) => a._id !== action.payload,
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setAssignments,
  addAssignment,
  updateAssignment,
  deleteAssignment,
  setLoading,
  setError,
} = assignmentsSlice.actions;

export const fetchAssignments = (courseId: string) => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const assignments = await client.fetchAssignmentsForCourse(courseId);
    dispatch(setAssignments(assignments));
  } catch (error: any) {
    dispatch(setError(error.message ?? "Failed to fetch assignments."));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createAssignment =
  (courseId: string, assignment: Assignment) => async (dispatch: any) => {
    try {
      const newAssignment = await client.createAssignment(courseId, assignment);
      dispatch(addAssignment(newAssignment));
    } catch (error: any) {
      dispatch(setError(error.message ?? "Failed to create assignment."));
    }
  };

export const editAssignment =
  (assignmentId: string, updates: Assignment) => async (dispatch: any) => {
    try {
      const updatedAssignment = await client.updateAssignment(
        assignmentId,
        updates,
      );
      dispatch(updateAssignment(updatedAssignment));
    } catch (error: any) {
      dispatch(setError(error.message ?? "Failed to update assignment."));
    }
  };

export const removeAssignment =
  (assignmentId: string) => async (dispatch: any) => {
    try {
      await client.deleteAssignment(assignmentId);
      dispatch(deleteAssignment(assignmentId));
    } catch (error: any) {
      dispatch(setError(error.message ?? "Failed to delete assignment."));
    }
  };

export default assignmentsSlice.reducer;
