import {
    CHANGE_PAGE,
    CLEAR_ALERT,
    CLEAR_FILTERS,
    CLEAR_VALUES,
    CREATE_JOB_BEGIN,
    CREATE_JOB_ERROR,
    CREATE_JOB_SUCCESS,
    DELETE_JOB_BEGIN,
    DELETE_JOB_ERROR,
    DISPLAY_ALERT,
    EDIT_JOB_BEGIN,
    EDIT_JOB_ERROR,
    EDIT_JOB_SUCCESS,
    GET_CURRENT_USER_BEGIN,
    GET_CURRENT_USER_SUCCESS,
    GET_JOBS_BEGIN,
    GET_JOBS_SUCCESS,
    HANDLE_CHANGE,
    LOGOUT_USER,
    SETUP_USER_BEGIN,
    SETUP_USER_ERROR,
    SETUP_USER_SUCCESS,
    SET_EDIT_JOB,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    TOGGLE_SIDEBAR,
    UPDATE_USER_BEGIN,
    UPDATE_USER_ERROR,
    UPDATE_USER_SUCCESS
} from './action'

import { initialState } from './appContext'

const reducer = (state, action) => {
    if (action.type === DISPLAY_ALERT) {
        return {
            ...state,
            showAlert: true,
            alertType: 'danger',
            alertText: 'Please Provide all values'
        }
    } if (action.type === CLEAR_ALERT) {
        return {
            ...state,
            showAlert: false,
            alertText: '',
            alertType: ''
        }
    } if (action.type === HANDLE_CHANGE) {
        return {
            ...state,
            page: 1,
            [action.payload.name]: action.payload.value
        }
    } if (action.type === CLEAR_VALUES) {
        const initialState = {
            isEditing: false,
            editJobId: '',
            position: '',
            company: '',
            jobLocation: state.userLocation,
            jobType: 'full-time',
            status: 'pending',
        }
        return {
            ...state,
            ...initialState

        }
    } if (action.type === SETUP_USER_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    } if (action.type === SETUP_USER_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: action.payload.alertText,
            user: action.payload.user,
            userLocation: action.payload.location,
            jobLocation: action.payload.location 
        }
    } if (action.type === SETUP_USER_ERROR) {
        return {
            ...state,
            isLoading: false,
            alertText: action.payload.msg,
            alertType: 'danger',
            showAlert: true
        }
    } if (action.type === TOGGLE_SIDEBAR) {
        return {
            ...state,
            showSidebar: !state.showSidebar
        }
    } if (action.type === LOGOUT_USER) {
        return {
            ...initialState,
            userLoading: false,
            user: null,
            userLocation: '',
            jobLocation: ''
        }
    } if (action.type === GET_JOBS_BEGIN) {
        return {
            ...state,
            isLoading: true,
        }
    } if (action.type === GET_JOBS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            numOfPages: action.payload.numOfPages,
            jobs: action.payload.jobs,
            totalJobs: action.payload.totalJobs
        }
    } if (action.type === SET_EDIT_JOB) {
        const job = state.jobs.find((job) => job._id === action.payload.id)
        const {_id, position, company, jobLocation, jobType, status} = job
        return {
            ...state,
            isEditing: true,
            editJobId: _id,
            position,
            company,
            jobLocation,
            jobType,
            status
        }
    } if (action.type === EDIT_JOB_BEGIN) {
        return {
            ...state,
            isLoading: false
        }
    } if (action.type === EDIT_JOB_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: 'Job Updated!'
        }
    } if (action.type === EDIT_JOB_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertText: action.payload.msg,
            alertType: 'danger'
        }
    } if (action.type === DELETE_JOB_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    } if (action.type === DELETE_JOB_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertText: action.payload.msg,
            alertType: 'danger'
        }
    } if (action.type === UPDATE_USER_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    } if (action.type === UPDATE_USER_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            alertText: 'User Profile Updated',
            alertType: 'success',
            showAlert: true,
            user: action.payload.user,
            userLocation: action.payload.location,
            jobLocation: action.payload.location
        }
    } if (action.type === UPDATE_USER_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertText: action.payload.msg,
            alertType: 'danger',
        }
    } if (action.type === CREATE_JOB_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    } if (action.type === CREATE_JOB_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertText: 'New Job Created',
            alertType: 'success'
        }
    } if (action.type === CREATE_JOB_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        }
    } if (action.type === SHOW_STATS_BEGIN) {
        return {
            ...state,
            isLoading: true,
            showAlert: false
        }
    } if (action.type === SHOW_STATS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            stats: action.payload.stats,
            monthlyApplications: action.payload.monthlyApplications
        }
    } if (action.type === CLEAR_FILTERS) {
        return {
            ...state,
            search: '',
            searchStatus: 'all',
            searchType: 'all',
            sort: 'latest'
        }
    } if (action.type === CHANGE_PAGE) {
        return {
            ...state,
            page: action.payload.page
        }
    } if (action.type === GET_CURRENT_USER_BEGIN) {
        return {
            ...state,
            userLoading: true,
            showAlert: false
        }
    } if (action.type === GET_CURRENT_USER_SUCCESS) {
        return {
            ...state,
            userLoading: false,
            user: action.payload.user,
            userLocation: action.payload.location,
            jobLocation: action.payload.location
        }
    } 

    throw new Error(`no such action : ${action.type}`)
}

export default reducer