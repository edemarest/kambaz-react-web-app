import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Enrollment {
  user: string;
  course: string;
}

interface EnrollmentsState {
  enrollments: Enrollment[];
}

const initialState: EnrollmentsState = {
  enrollments: [],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enrollInCourse: (state, action: PayloadAction<Enrollment>) => {
      const { user, course } = action.payload;
      if (!state.enrollments.some((en) => en.user === user && en.course === course)) {
        state.enrollments.push({ user, course });
      }
    },
    unenrollFromCourse: (state, action: PayloadAction<Enrollment>) => {
      const { user, course } = action.payload;
      state.enrollments = state.enrollments.filter((en) => !(en.user === user && en.course === course));
    },
  },
});

export const { enrollInCourse, unenrollFromCourse } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
