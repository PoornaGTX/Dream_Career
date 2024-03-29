import { initialState } from "./appContext";

const reducer = (state, action) => {
  if (action.type === "DISPLAY_ALERT") {
    return {
      ...state,
      showAlert: true,
      alertType: "danger",
      alertText: "Please provide all values",
    };
  }

  if (action.type === "CLEAR_ALERT") {
    return {
      ...state,
      showAlert: false,
      alertType: "",
      alertText: "",
    };
  }

  if (action.type === "REGISTER_USER_BEGIN") {
    return { ...state, isLoading: true };
  }

  if (action.type === "REGISTER_USER_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      showAlert: true,
      alertType: "success",
      alertText: "User Created! Redirecting",
    };
  }

  if (action.type === "REGISTER_USER_ERROR") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  if (action.type === "LOGIN_USER_BEGIN") {
    return { ...state, isLoading: true };
  }

  if (action.type === "LOGIN_USER_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      showAlert: true,
      alertType: "success",
      alertText: "Login Successful! Redirecting",
    };
  }

  if (action.type === "LOGIN_USER_ERROR") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  if (action.type === "TOGGLE_SIDEBAR") {
    return {
      ...state,
      showSidebar: !state.showSidebar,
    };
  }

  //logout user

  if (action.type === "LOGOUT_USER") {
    return {
      ...initialState,
      PasswordRestStatus: true,
      user: null,
      jobLocation: "",
      userLocation: "",
    };
  }

  //update user

  if (action.type === "UPDATE_USER_BEGIN") {
    return { ...state, isLoading: true };
  }

  if (action.type === "UPDATE_USER_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      showAlert: true,
      alertType: "success",
      alertText: "User Profile Updated",
    };
  }

  if (action.type === "UPDATE_USER_ERROR") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  if (action.type === "HANDLE_CHANGE") {
    return {
      ...state,
      pageAdmin: 1,
      [action.payload.name]: action.payload.value,
    };
  }

  //clear values admin

  if (action.type === "CLEAR_VALUES_ADMIN") {
    return {
      ...state,
      sortAdmin: "latest",
      searchAdmin: "",
      searchTypeAdmin: "all",
    };
  }

  if (action.type === "CLEAR_VALUES") {
    const initialState = {
      isEditing: false,
      editJobId: "",
      position: "",
      company: "",
      jobLocation: state.userLocation,
      jobType: "full-time",
      status: "pending",
    };

    return {
      ...state,
      ...initialState,
    };
  }

  if (action.type === "CREATE_JOB_BEGIN") {
    return { ...state, isLoading: true };
  }

  if (action.type === "CREATE_JOB_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "New Job Created",
    };
  }

  if (action.type === "CREATE_JOB_ERROR") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  if (action.type === "GET_JOBS_BEGIN") {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }

  if (action.type === "GET_JOBS_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      jobs: action.payload.jobs,
      totalJobs: action.payload.totalJobs,
      numOfPages: action.payload.numOfPages,
    };
  }

  if (action.type === "SET_EDIT_JOB") {
    const job = state.jobs.find((job) => job._id === action.payload.id);
    const { _id, position, company, jobLocation, jobType, status, createdBy } =
      job;
    return {
      ...state,
      isEditing: true,
      editJobId: _id,
      editJobCreateID: createdBy,
      position,
      company,
      jobLocation,
      jobType,
      status,
    };
  }

  if (action.type === "DELETE_JOB_BEGIN") {
    return { ...state, isLoading: true };
  }

  if (action.type === "REJECT_JOB_REQ_BEGIN") {
    return { ...state, isLoading: true };
  }

  if (action.type === "EDIT_JOB_BEGIN") {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === "EDIT_JOB_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Job Updated",
    };
  }

  if (action.type === "EDIT_JOB_ERROR") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  if (action.type === "APPLY_JOB_BEGIN") {
    return { ...state, isLoading: true };
  }

  if (action.type === "APPLY_JOB_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Submit the Application.",
    };
  }

  if (action.type === "APPLY_JOB_ERROR") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  //login password reset

  if (action.type === "LOGIN_PASSWORDREST") {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === "LOGIN_PASSWORDREST_COMPLETE") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Link",
    };
  }

  if (action.type === "LOGIN_PASSWORDREST_ERROR") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: "Error",
    };
  }

  if (action.type === "GET_APPLIED_JOBS_BEGIN") {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }

  if (action.type === "GET_APPLIED_JOBS_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      AppliedJobs: action.payload.AppliedJobs,
      AppliedTotalJobs: action.payload.AppliedTotalJobs,
      AppliedJobsNumOfPages: action.payload.AppliedJobsNumOfPages,
    };
  }

  if (action.type === "CLEAR_FILTERS_APPLIED_JOBS") {
    return {
      ...state,
      appliedJobsSearch: "",
      appliedJobsSearchType: "all",
      appliedJobsSort: "latest",
    };
  }

  if (action.type === "GET_JOBREQUESTS_BEGIN") {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }

  if (action.type === "GET_JOBREQUESTS_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      jobRequests: action.payload.JobRequests,
      jobRequestsCount: action.payload.JobRequestsCount,
      jobRequestsPages: action.payload.JobRequestsNumOfPages,
    };
  }

  if (action.type === "GET_JOBREQUESTS_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      jobRequests: action.payload.JobRequests,
      jobRequestsCount: action.payload.JobRequestsCount,
      jobRequestsPages: action.payload.JobRequestsNumOfPages,
    };
  }

  if (action.type === "CLEAR_REC_FILTERS") {
    return {
      ...state,
      recSearch: "",
      recSearchType: "all",
      recSort: "latest",
    };
  }

  if (action.type === "SHOW_JOB_APP_STATS_BEGIN") {
    return { ...state, isLoading: true, showAlert: false };
  }

  if (action.type === "SHOW_JOB_APP_STATS_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      jobAppStats: action.payload.jobAppStats,
      monthlyJobAppApplications: action.payload.monthlyJobAppApplications,
    };
  }
  if (action.type === "DELETE_JOB_APP_BEGIN") {
    return { ...state, isLoading: true };
  }
  if (action.type === "SET_EDIT_APP_JOB") {
    const appJob = state.AppliedJobs.find(
      (job) => job._id === action.payload.id
    );
    const { _id, position, company, jobType, education, location } = appJob;
    return {
      ...state,
      isEditing: true,
      editJobId: _id,
      jobAppType: jobType,
      jobAppLocation: location,
      jobAppCompany: company,
      jobAppPosition: position,
      jobAppEducation: education,
    };
  }

  if (action.type === "EDIT_JOB_APP_BEGIN") {
    return { ...state, isLoading: true };
  }
  if (action.type === "EDIT_JOB_APP_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Job Updated!",
    };
  }

  //admin get all users
  if (action.type === "GET_ALL_USERS_BEGIN") {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }
  if (action.type === "SHOW_REC_STATS_BEGIN") {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }
  if (action.type === "SHOW_REC_STATS_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      recStats: action.payload.stats,
      recMonthlyApplications: action.payload.monthlyApplications,
    };
  }

  if (action.type === "SET_EDIT_JOB") {
    const job = state.jobs.find((job) => job._id === action.payload.id);
    const { _id, position, company, jobLocation, jobType, status } = job;
    return {
      ...state,
      isEditing: true,
      editJobId: _id,
      position,
      company,
      jobLocation,
      jobType,
    };
  }
  if (action.type === "DELETE_JOB_BEGIN") {
    return { ...state, isLoading: true };
  }
  if (action.type === "EDIT_JOB_BEGIN") {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === "GET_ALL_USERS_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      users: action.payload.users,
      totalUsers: action.payload.totalUsers,
      numOfPagesAdmin: action.payload.numOfPagesAdmin,
    };
  }

  //admin get all users for stats
  if (action.type === "GET_ALL_USERS_BEGIN_PDF") {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }
  if (action.type === "GET_ALL_USERS_SUCCESS_PDF") {
    return {
      ...state,
      isLoading: false,
      allusersAdmin: action.payload.allusers,
    };
  }

  // admin set update user
  if (action.type === "SET_UPDATE_USER") {
    const user = state.users.find((user) => user._id === action.payload.id);
    const { _id, firstName, email, lastName, type, location } = user;
    return {
      ...state,
      isUpdate: true,
      isDelete: false,
      updateUserId: _id,
      firstName,
      lastName,
      location,
      type,
      email,
    };
  }
  if (action.type === "UPDATE_USER_ADMIN_BEGIN") {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === "UPDATE_USER_ADMIN_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "User Updated",
    };
  }
  if (action.type === "EDIT_JOB_APP_ERROR") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Job Updated!",
    };
  }
  if (action.type === "EDIT_JOB_ERROR") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  if (action.type === "UPDATE_USER_ADMIN_ERROR") {
    return {
      ...state,
      isLoading: false,
      alertType: "danger",
      showAlert: true,
      alertText: action.payload.msg,
    };
  }

  // admin set delete user
  if (action.type === "SET_DELETE_USER") {
    const user = state.users.find((user) => user._id === action.payload.id);
    const { _id, firstName, email, lastName, type, location } = user;
    return {
      ...state,
      isDelete: true,
      isUpdate: false,
      deleteUserId: _id,
      firstName,
      lastName,
      location,
      type,
      email,
    };
  }

  // admin delete user
  if (action.type === "DELETE_USER") {
    return {
      ...state,
      isLoading: true,
      showAlert: true,
      alertType: "success",
      alertText: "User delete success",
    };
  }

  // admin stats
  if (action.type === "SHOW_STATS_BEGIN") {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }

  // admin stats
  if (action.type === "SHOW_STATS_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      adminStats: action.payload.adStats,
      monthelUserCreations: action.payload.admonthelUserCreations,
    };
  }

  // admin pagination
  if (action.type === "CHANGE_VLAUES") {
    return {
      ...state,
      pageAdmin: action.payload.page,
    };
  }

  if (action.type === "ACCEPT_JOB_REQ_BEGIN") {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === "ACCEPT_JOB_REQ_SUCCESS") {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Job Updated",
    };
  }

  throw new Error(`no such action : ${action.type}`);
};

export default reducer;
