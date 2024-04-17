import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import auth from '../auth'

export type RequestConfig = AxiosRequestConfig

export const cancelToken = () => axios.CancelToken.source()

const reqErrorInterceptor = (error: any) => {
  axios.get('')
  return Promise.reject(error)
}

const resInterceptor = (response: any) => response

const resErrorInterceptor = (error: { response: { status: number } }) => {
  // whatever you want to do with the error
  if (error?.response?.status === 401) {
    auth.clearToken()
    window.location.href = '/auth/login'
  }

  throw error
}

const addInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use((v) => {
    v.headers.setAuthorization(`Bearer ${auth.getToken()}`)
    return v
  }, reqErrorInterceptor)

  instance.interceptors.response.use(resInterceptor, resErrorInterceptor)
}

export const fetchClient = () => {
  const instance = axios.create({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  addInterceptors(instance)

  return instance
}

export default fetchClient()
