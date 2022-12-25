import axios from 'axios'
import { API } from './urlConfig'
import store from '../store'
import {
  authConstants,
  getCategoryConstants,
  userSignUpConstants
} from '../actions/constants/constants'

const token = localStorage.getItem('token')
const axioInstance = axios.create({
  baseURL: API,
  headers: { Authorization: token ? `Bearer ${token}` : '' }
})

axioInstance.interceptors.request.use(req => {
  const { auth } = store.getState()
  if (auth.token) {
    req.headers.Authorization = `Bearer ${auth.token}`
  }
  return req
})
axioInstance.interceptors.response.use(
  res => {
    return res
  },
  error => {
    switch (
      error.response.data.message ||
      error.response.data.error ||
      error.response.data.error.message
    ) {
      case 'Wrong username or password':
        store.dispatch({
          type: authConstants.LOGIN_FAILURE,
          payload: {
            error: error.response.data.message
          }
        })
        alert('Wrong username or password')
        break
      case 'Category already exists':
        store.dispatch({
          type: getCategoryConstants.ADD_CATEGORY_FAILURE,
          payload: {
            error: error.response.data.message
          }
        })
        alert('Category already exists')
        break
      case "Couldn't find user":
        store.dispatch({
          type: authConstants.LOGIN_FAILURE,
          payload: {
            error: error.response.data.message
          }
        })
        alert("Couldn't find user")
        break
      case 'Email or username already exists':
        console.log({ error, message: 'shit' })
        store.dispatch({
          type: userSignUpConstants.USER_SIGNUP_FAILURE,
          payload: { error: error.response.data.message }
        })
        alert('Email or username already exists')
        break
      
      case 'password is should be more than 6 characters':
        console.log({ error })
        store.dispatch({
          type: userSignUpConstants.USER_SIGNUP_FAILURE,
          payload: { error: error.response.data.error }
        })
        alert('Password is should be more than 6 characters')
        break

      case 'jwt expired':
        store.dispatch({ type: authConstants.LOGOUT_SUCCESS })
        alert('Session expired, please login again to renew session')
        localStorage.clear()
        break
    }

    return Promise.reject(error)
  }
)

export default axioInstance
