import instance, { RequestConfig } from './fetchClient'

const addPrependingSlash = (url: string) => (typeof url === 'string' && url.charAt(0) !== '/' ? `/${url}` : url)

//This regular expression matches a string that starts with either "http://" or "https://" or any other protocol name in lower case letters, followed by "://" and ends with anything else
const hasProtocol = (url: string) => new RegExp('^(?:[a-z+]+:)?//', 'i').test(url)

// check if the url has a prepending slash, if not it adds the slash
const normalizeUrl = (url: string) => (hasProtocol(url) ? url : addPrependingSlash(url))

const getFetchClient = (defaultOptions = {}) => {
  instance.defaults.baseURL = 'https://be.sellfastusdt.com/cms'
  return {
    get: (url: string, config?: RequestConfig) => instance.get(normalizeUrl(url), { ...defaultOptions, ...config }),
    put: (url: string, data?: unknown, config?: RequestConfig) =>
      instance.put(normalizeUrl(url), data, { ...defaultOptions, ...config }),
    patch: (url: string, data?: unknown, config?: RequestConfig) =>
      instance.patch(normalizeUrl(url), data, { ...defaultOptions, ...config }),
    post: (url: string, data?: unknown, config?: RequestConfig) =>
      instance.post(normalizeUrl(url), data, { ...defaultOptions, ...config }),
    del: (url: string, config?: RequestConfig) => instance.delete(normalizeUrl(url), { ...defaultOptions, ...config }),
    export: (url: string, config?: RequestConfig) =>
      instance.get(normalizeUrl(url), { ...defaultOptions, ...config, responseType: 'blob' })
  }
}

export default getFetchClient
