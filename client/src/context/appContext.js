import React, {useContext, createContext, useReducer, useEffect} from "react";
import reducer from "./reducer";
import axios from 'axios'
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

export const initialState = {
    isLoading: false,
    showAlert: false,
    showSidebar: false,
    alertText: '',
    alertType: '',
    user: null,
    userLocation: '',
    jobLocation: '',
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['interview', 'declined', 'pending'],
    status: 'pending',
    stats: {},
    monthlyApplications: [],
    search: '',
    searchStatus: 'all',
    searchType: 'all',
    sort: 'latest',
    sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
    userLoading: true
}

const AppContext = createContext()

const AppProvider = ({children}) => {

    const [state, dispatch] = useReducer(reducer, initialState)

    // axios interceptors
    const authFetch = axios.create({
        baseURL: '/api/v1',

    })

    // axios response interceptors
    authFetch.interceptors.response.use((response) => {
        return response
    }, (error) => {
        if (error.response.status === 401) {
            return 'Error'
        }
        return Promise.reject(error)
    })

    const displayAlert = () => {
        dispatch({type: DISPLAY_ALERT})
    }

    const toggleSidebar = () => {
        dispatch({type: TOGGLE_SIDEBAR})
    }

    const clearAlert = () => {
        setTimeout(() => {
            dispatch({type: CLEAR_ALERT})
        }, 3000)
    }

    const handleChange = ({name, value}) => {
        dispatch({type: HANDLE_CHANGE, payload: {name, value}})
    }

    const clearValues = () => {
        dispatch({type: CLEAR_VALUES})
    }

    const clearFilters = () => {
        dispatch({type: CLEAR_FILTERS})
    }

    const changePage = (page) => {
        dispatch({type: CHANGE_PAGE, payload: {page}})
    }

    // CRUD FUNCITONS
    const setupUser = async({currentUser, endPoint, alertText}) => {
        dispatch({type: SETUP_USER_BEGIN})
        try {
            const {data} = await axios.post(`/api/v1/auth/${endPoint}`, currentUser)
        
            const {user, location} = data
            dispatch({type: SETUP_USER_SUCCESS, payload: {user, location, alertText}})
        } catch (error) {
            dispatch({type: SETUP_USER_ERROR, payload: {msg: error.response.data.msg}})
        }
        clearAlert()
    }
    
    const updateUser = async(currentUser) => {
        dispatch({type: UPDATE_USER_BEGIN})
        try {
            const {data} = await authFetch.patch('/auth/updateUser', currentUser)

            const {user, location} = data

            dispatch({type: UPDATE_USER_SUCCESS, payload: {user, location}})
        } catch (error) {
            dispatch({type: UPDATE_USER_ERROR, payload: {msg: error.response.data.msg}})
        }
        clearAlert()
    }

    const getCurrentUser = async() => {
        dispatch({type: GET_CURRENT_USER_BEGIN})
        try {
            const { data } = await authFetch('/auth/getCurrentUser')
            const { user,location } = data

            dispatch({
                type: GET_CURRENT_USER_SUCCESS,
                payload: { user, location }
            })
        } catch (error) {
            logoutUser()
        }
    }

    const logoutUser = async() => {
        await authFetch.get('/auth/logout')
        dispatch({type: LOGOUT_USER})
    }

    const getJobs = async() => {
        const { page, search, searchStatus, searchType, sort } = state

        let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
        
        if (search) {
            url = url + `&search=${search}`
        }

        dispatch({type: GET_JOBS_BEGIN})
        try {
            const {data} = await authFetch.get(url)
            const { jobs, totalJobs, numOfPages } = data

            dispatch({type: GET_JOBS_SUCCESS, payload: {jobs, totalJobs, numOfPages}})
        } catch (error) {
            logoutUser()
        }
        clearAlert()
    }

    const createJob = async() => {
        dispatch({type: CREATE_JOB_BEGIN})
        try {
            const { position, company, jobLocation, jobType, status } = state

            await authFetch.post('/jobs', {
                company,
                position,
                jobLocation,
                jobType,
                status
            })
            dispatch({type: CREATE_JOB_SUCCESS})
            dispatch({type: CLEAR_VALUES})
        } catch (error) {
            if (error.response.status === 401) return;
            dispatch({
                type: CREATE_JOB_ERROR,
                payload: {msg: error.response.data.msg}
            })
        }
        clearAlert()
    }

    const setEditJob = (id) => {
        dispatch({type: SET_EDIT_JOB, payload: {id}})
    }

    const editJob = async() => {
        dispatch({type: EDIT_JOB_BEGIN})
        try {
            const { position, company, jobLocation, jobType, status } = state

            await authFetch.patch(`/jobs/${state.editJobId}`, {
                company,
                position,
                jobLocation,
                jobType,
                status
            })

            dispatch({type: EDIT_JOB_SUCCESS})
            dispatch({type: CLEAR_VALUES})
        } catch (error) {
            if (error.response.status === 401) return 
            dispatch({
                type: EDIT_JOB_ERROR,
                payload: {msg: error.response.data.msg}
            })
        }
        clearAlert()
    } 

    const deleteJob = async(id) => {
        dispatch({type: DELETE_JOB_BEGIN})
        try {
            await authFetch.delete(`/jobs/${id}`)
            getJobs()
        } catch (error) {
            dispatch({type: DELETE_JOB_ERROR, payload: {msg: error.response.data.msg}})
        }
        clearAlert()
    }

    const showStats = async() => {
        dispatch({type: SHOW_STATS_BEGIN})
        try {
            const { data } = await authFetch('/jobs/stats')
            dispatch({
                type: SHOW_STATS_SUCCESS,
                payload: {
                    stats: data.defaultStats,
                    monthlyApplications: data.monthlyApplications
                }
            })
        } catch (error) {
            logoutUser()
        }
        clearAlert()
    }

    useEffect(() => {
        getCurrentUser()
        // getJobs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AppContext.Provider value={{
            ...state,
            displayAlert,
            toggleSidebar,
            clearAlert,
            handleChange,
            clearValues,
            clearFilters,
            changePage,
            setupUser,
            updateUser,
            logoutUser,
            getJobs,
            createJob,
            setEditJob,
            deleteJob,
            editJob,
            showStats
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider }