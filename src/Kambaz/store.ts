import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Courses/Assignments/assignmentsReducer"
import enrollmentsReducer from "./Enrollments/reducer"
const store = configureStore({
  reducer: {
    modules: modulesReducer,
    accountReducer,
    assignments: assignmentsReducer,
    enrollmentsReducer,
  },
});
export default store;