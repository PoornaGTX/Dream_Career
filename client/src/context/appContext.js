import React, { useReducer, useContext } from "react";
import reducer from "./reducer";
import axios from "axios";

const user = localStorage.getItem("user");
const userlocation = localStorage.getItem("location");

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  userLocation: userlocation || "",
  showSidebar: false,
  isEditing: false,
  editJobId: "",
  editJobCreateID: "",
  position: "",
  company: "",
  jobLocation: userlocation || "",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["Accepted", "Pending", "Rejected"],
  status: "pending",
  jobs: [],
  jobRequests: [],
  jobRequestsCount: 0,
  jobRequestsPages: 1,
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  recSearch: "",
  recSearchType: "all",
  recSort: "latest",
  recSortOptions: ["latest", "oldest", "a-z", "z-a"],
  AppliedJobs: [],
  AppliedTotalJobs: 0,
  AppliedJobsNumOfPages: 1,
  AppliedJobsPage: 1,
  appliedJobsSearch: "",
  appliedJobsSearchType: "all",
  appliedJobsSearchTypePotions: ["Remote", "On-location", "Hybrid"],
  appliedJobsSort: "latest",
  appliedJobsSortOptions: ["latest", "oldest", "a-z", "z-a"],
  PasswordRestStatus: false,
  recStats: {},
  recMonthlyApplications: [],
  jobAppStats: {},
  jobAppType: "",
  jobAppLocation: "",
  jobAppCompany: "",
  jobAppPosition: "",
  jobAppEducation: "",
  monthlyJobAppApplications: [],
  users: [],
  totalUsers: 0,
  numOfPagesAdmin: 1,
  pageAdmin: 1,

  //admin
  searchAdmin: "",
  searchTypeAdmin: "all",
  searchTypeOptionsAdmin: ["Admin", "Applicant", "Recruiter"],
  sortAdmin: "latest",
  sortOptionsAdmin: ["latest", "oldest", "a-z", "z-a"],
  updateUserId: "",
  deleteUserId: "",
  isUpdate: false,
  isDelete: false,
  adminStats: {},
  monthelUserCreations: [],
  allusersAdmin: [],
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const displayAlert = () => {
    dispatch({ type: "DISPLAY_ALERT" });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: "CLEAR_ALERT" });
    }, 3000);
  };

  //store user details in local storage

  const addUserToLocalStorage = ({ user, location }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("location", location);
  };

  //remove user details in local storage when logout

  const removeFromTheLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("location");
  };

  //register user

  const registerUser = async (currentUser) => {
    dispatch({ type: "REGISTER_USER_BEGIN" });
    try {
      const response = await axios.post("/api/v1/auth/register", currentUser);
      const { user, location } = response.data;
      dispatch({
        type: "REGISTER_USER_SUCCESS",
        payload: { user, location },
      });

      addUserToLocalStorage({ user, location });
    } catch (error) {
      dispatch({
        type: "REGISTER_USER_ERROR",
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  //login

  const loginUser = async (currentUser) => {
    dispatch({ type: "LOGIN_USER_BEGIN" });
    try {
      const response = await axios.post("/api/v1/auth/login", currentUser);

      const { user, location } = response.data;
      dispatch({
        type: "LOGIN_USER_SUCCESS",
        payload: { user, location },
      });

      addUserToLocalStorage({ user, location });
    } catch (error) {
      dispatch({
        type: "LOGIN_USER_ERROR",
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: "SETUP_USER_BEGIN" });
    try {
      const response = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );

      const { user, location } = response.data;
      dispatch({
        type: "SETUP_USER_SUCCESS",
        payload: { user, location, alertText },
      });

      addUserToLocalStorage({ user, location });
    } catch (error) {
      dispatch({
        type: "SETUP_USER_ERROR",
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  //logOut

  const logoutUser = () => {
    dispatch({ type: "LOGOUT_USER" });
    removeFromTheLocalStorage();
  };

  //update user
  const updateUser = async (currentUser) => {
    dispatch({ type: "UPDATE_USER_BEGIN" });
    try {
      const { data } = await axios.patch(
        "/api/v1/auth/updateUser",
        currentUser
      );

      const { user, location } = data;

      dispatch({
        type: "UPDATE_USER_SUCCESS",
        payload: { user, location },
      });
      addUserToLocalStorage({ user, location });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: "UPDATE_USER_ERROR",
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: "HANDLE_CHANGE", payload: { name, value } });
  };

  const clearValuesAdmin = () => {
    dispatch({ type: "CLEAR_VALUES_ADMIN" });
  };

  const clearValues = () => {
    dispatch({ type: "CLEAR_VALUES" });
  };

  const createJob = async () => {
    dispatch({ type: "CREATE_JOB_BEGIN" });

    try {
      const { position, company, jobLocation, jobType, status } = state;
      await axios.post("/api/v1/jobs", {
        position,
        company,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: "CREATE_JOB_SUCCESS" });
      dispatch({ type: "CLEAR_VALUES" });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: "CREATE_JOB_ERROR",
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  //get all users
  const getUsers = async () => {
    const { pageAdmin, sortAdmin, searchAdmin, searchTypeAdmin } = state;
    let url = `/api/v1/users?page=${pageAdmin}&sort=${sortAdmin}&type=${searchTypeAdmin}`;

    if (searchAdmin) {
      url = url + `&search=${searchAdmin}`;
    }

    dispatch({ type: "GET_ALL_USERS_BEGIN" });
    try {
      const { data } = await axios.get(url);
      const { users, totalUsers, numOfPagesAdmin } = data;
      dispatch({
        type: "GET_ALL_USERS_SUCCESS",
        payload: { users, totalUsers, numOfPagesAdmin },
      });
    } catch (error) {
      console.log(error);
      logoutUser();
    }
    clearAlert();
  };

  //set update user
  const setUpdateUser = (id) => {
    dispatch({ type: "SET_UPDATE_USER", payload: { id } });
  };

  //delete user
  const setDeleteUser = (id) => {
    dispatch({ type: "SET_DELETE_USER", payload: { id } });
  };

  const updateUserAdmin = async ({
    UPname,
    UPlname,
    UPtype,
    UPemail,
    UPlocation,
  }) => {
    dispatch({ type: "UPDATE_USER_ADMIN_BEGIN" });
    try {
      await axios.patch(`/api/v1/users/${state.updateUserId}`, {
        email: UPemail,
        firstName: UPname,
        type: UPtype,
        location: UPlocation,
        lastName: UPlname,
      });
      dispatch({ type: "UPDATE_USER_ADMIN_SUCCESS" });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "UPDATE_USER_ADMIN_ERROR",
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  //delete user
  const deleteUser = async () => {
    const id = state.deleteUserId;
    dispatch({ type: "DELETE_USER" });
    try {
      await axios.delete(`/api/v1/users/${id}`);
      getUsers();
    } catch (error) {
      logoutUser();
    }
  };

  const getUsersPDF = async () => {
    dispatch({ type: "GET_ALL_USERS_BEGIN_PDF" });
    try {
      const { data } = await axios.get("/api/v1/users/allusers");
      const { allusers } = data;
      dispatch({
        type: "GET_ALL_USERS_SUCCESS_PDF",
        payload: { allusers },
      });
    } catch (error) {
      console.log(error);
      logoutUser();
    }
    clearAlert();
  };

  const changePage = (page) => {
    dispatch({ type: "CHANGE_VLAUES", payload: { page } });
  };

  const getJobs = async () => {
    const { page, recSearch, recSearchType, recSort } = state;

    let url = `/api/v1/jobs?page=${page}&jobType=${recSearchType}&sort=${recSort}`;
    if (recSearch) {
      url = url + `&search=${recSearch}`;
    }
    dispatch({ type: "GET_JOBS_BEGIN" });
    try {
      const { data } = await axios(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: "GET_JOBS_SUCCESS",
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const setEditJob = (id) => {
    dispatch({ type: "SET_EDIT_JOB", payload: { id } });
  };
  const editJob = async () => {
    dispatch({ type: "EDIT_JOB_BEGIN" });

    try {
      const { position, company, jobLocation, jobType, status } = state;
      await axios.patch(`/api/v1/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: "EDIT_JOB_SUCCESS" });
      dispatch({ type: "CLEAR_VALUES" });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: "EDIT_JOB_ERROR",
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
  const deleteJob = async (jobId) => {
    dispatch({ type: "DELETE_JOB_BEGIN" });
    try {
      await axios.delete(`/api/v1/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      logoutUser();
    }
  };

  const getJobRequets = async () => {
    dispatch({ type: "GET_JOBREQUESTS_BEGIN" });
    const { page, recSearch, recSort, status } = state;
    let url = `/api/v1/jobs/job-requests?page=${page}&Status=${status}&$sort=${recSort}`;
    if (recSearch) {
      url = url + `&search=${recSearch}`;
    }
    try {
      const { data } = await axios.get(url);
      const { JobRequests, JobRequestsCount, JobRequestsNumOfPages } = data;
      dispatch({
        type: "GET_JOBREQUESTS_SUCCESS",
        payload: {
          JobRequests,
          JobRequestsCount,
          JobRequestsNumOfPages,
        },
      });
    } catch (error) {
      console.log(error.response);
    }
    clearAlert();
  };

  const acceptJobRequest = async (jobId) => {
    dispatch({ type: "ACCEPT_JOB_REQ_BEGIN" });
    try {
      await axios.patch(`/api/v1/jobs/job-requests/${jobId}`, {
        Status: "Accepted",
      });
      dispatch({ type: "ACCEPT_JOB_REQ_SUCCESS" });
      getJobRequets();
    } catch (error) {
      logoutUser();
    }
  };

  const rejectJobRequest = async (jobId) => {
    dispatch({ type: "REJECT_JOB_REQ_BEGIN" });
    try {
      await axios.patch(`/api/v1/jobs/job-requests/${jobId}`, {
        Status: "Rejected",
      });
      getJobRequets();
    } catch (error) {
      logoutUser();
    }
  };

  const applyJob = async (applyJobQ) => {
    dispatch({ type: "APPLY_JOB_BEGIN" });
    const { name, email } = state.user;
    try {
      await axios.post("/api/v1/jobApps", {
        ...applyJobQ,
        name,
        email,
      });
      dispatch({ type: "APPLY_JOB_SUCCESS" });
      dispatch({ type: "CLEAR_VALUES" });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: "APPLY_JOB_ERROR",
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const getAppliedJobs = async () => {
    dispatch({ type: "GET_APPLIED_JOBS_BEGIN" });
    const { appliedJobsSearch, appliedJobsSearchType, appliedJobsSort } = state;
    let url = `/api/v1/jobApps?jobType=${appliedJobsSearchType}&$sort=${appliedJobsSort}`;
    if (appliedJobsSearch) {
      url = url + `&search=${appliedJobsSearch}`;
    }
    try {
      const { data } = await axios.get(url);
      const { AppliedJobs, AppliedTotalJobs, AppliedJobsNumOfPages } = data;

      dispatch({
        type: "GET_APPLIED_JOBS_SUCCESS",
        payload: {
          AppliedJobs,
          AppliedTotalJobs,
          AppliedJobsNumOfPages,
        },
      });
    } catch (error) {
      console.log(error.response);
    }
    clearAlert();
  };
  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS_APPLIED_JOBS" });
  };
  const setEdit = (id) => {
    dispatch({ type: "SET_EDIT_JOB", payload: { id } });
  };

  const showJobAppStats = async () => {
    dispatch({ type: "SHOW_JOB_APP_STATS_BEGIN" });
    try {
      const { data } = await axios("/api/v1/jobApps/job-App-stats");
      dispatch({
        type: "SHOW_JOB_APP_STATS_SUCCESS",
        payload: {
          jobAppStats: data.stats,
          monthlyJobAppApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      console.log(error.response);
    }

    clearAlert();
  };

  const deleteJobApp = async (jobId) => {
    dispatch({ type: "DELETE_JOB_APP_BEGIN" });
    try {
      await axios.delete(`/api/v1/jobApps/${jobId}`);
      getAppliedJobs();
    } catch (error) {
      logoutUser();
    }
  };

  const setEditJobApp = (id) => {
    dispatch({ type: "SET_EDIT_APP_JOB", payload: { id } });
  };

  const editJobAPP = async () => {
    dispatch({ type: "EDIT_JOB_APP_BEGIN" });
    try {
      const { jobAppEducation } = state;

      await axios.patch(`/api/v1/jobApps/${state.editJobId}`, {
        education: jobAppEducation,
      });
      dispatch({
        type: "EDIT_JOB_APP_SUCCESS",
      });
      dispatch({ type: "CLEAR_VALUES" });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: "EDIT_JOB_APP_ERROR",
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const clearRecFilters = () => {
    dispatch({ type: "CLEAR_REC_FILTERS" });
  };

  const showRecStats = async () => {
    dispatch({ type: "SHOW_REC_STATS_BEGIN" });
    try {
      const { data } = await axios("/api/v1/jobs/stats");
      dispatch({
        type: "SHOW_REC_STATS_SUCCESS",
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        getJobRequets,
        applyJob,
        getAppliedJobs,
        clearFilters,
        clearRecFilters,
        showRecStats,
        setEditJob,
        deleteJob,
        editJob,
        acceptJobRequest,
        rejectJobRequest,
        setEdit,
        showJobAppStats,
        deleteJobApp,
        editJobAPP,
        setEditJobApp,
        getUsers,
        setUpdateUser,
        setDeleteUser,
        updateUserAdmin,
        deleteUser,
        clearValuesAdmin,
        changePage,
        getUsersPDF,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
