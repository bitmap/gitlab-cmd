const gitlab = require('./config')

const issuesPath = `${gitlab.project}/issues`
const mergeRequestsPath = `${gitlab.project}/merge_requests`

const req = {
  issues: {
    get: id => gitlab.get(`${issuesPath}/${id}`),
    put: (id, data) => {
      data = `?${data}` || ''
      return gitlab.put(`${issuesPath}/${id}${data}`)
    },
    post: data => gitlab.post(`${issuesPath}?${data}`),
    delete: id => gitlab.delete(`${issuesPath}/${id}`)
  },

  merge_requests: {
    get: id => gitlab.get(`${mergeRequestsPath}/${id}`),
    put: (id, data) => {
      data = `?${data}` || ''
      return gitlab.put(`${mergeRequestsPath}/${id}${data}`)
    },
    post: data => gitlab.post(`${mergeRequestsPath}?${data}`),
    delete: id => gitlab.delete(`${mergeRequestsPath}/${id}`)

  },

  project: {
    get: (type) => {
      return gitlab.get(`${gitlab.project}/${type}`)
    },
    post: (type, query) => {
      type = type || ''
      query = `?${query}` || ''
      return gitlab.post(`${gitlab.project}/${type + query}`)
    },
    delete: query => {
      return gitlab.delete(`${gitlab.project}/${query}`)
    }
  },

  get: query => {
    return gitlab.get(query)
  },

  put: query => {
    return gitlab.put(query)
  },

  post: query => {
    return gitlab.post(query)
  },

  delete: query => {
    return gitlab.delete(query)
  }
}

module.exports = req
