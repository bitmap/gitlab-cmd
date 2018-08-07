#!/usr/bin/env node

const request = require('request-promise-native')
const parse = require('parse-git-config')
const config = require('config')

const homeDir = process.env['HOME']

const gitconfig_home = parse.sync({ path: `${homeDir}/.gitconfig` })

let gitconfig

if (gitconfig_home.gitlab) {
  gitconfig = gitconfig_home
} else {
  if (gitconfig_home.include.gitlab) {
    gitconfig = parse.sync({ path: `${homeDir}/${gitconfig_home.include.gitlab}` })
  } else {
    console.log('Error: Can\'t locate [gitlab] settings in .gitconfig')
    process.exit(1)
  }
}

const repo = encodeURIComponent(config.repo)
let projectPath

gitconfig.gitlab.user
  ? projectPath = `projects/${gitconfig.gitlab.user}%2F${repo}`
  : projectPath = `projects/${repo}`

function gitlabRequest (url, endpoint, { headers, body, queryString }) {
  const params = {
    url: `${url}${endpoint}`,
    headers,
    json: true
  }

  body
    ? (params.body = body)
    : (params.queryString = queryString)

  return params
}

class Gitlab {
  constructor () {
    this.url = `${gitconfig.gitlab.url}/api/v4/`
    this.headers = {}

    if (gitconfig.gitlab.token) {
      this.headers['private-token'] = gitconfig.gitlab.token
    } else {
      console.log('A private access token is required')
      process.exit(1)
    }
  }

  get (endpoint, options) {
    return request.get(
      gitlabRequest(this.url, endpoint, {
        headers: this.headers,
        queryString: options
      })
    )
  }

  post (endpoint, options) {
    return request.post(
      gitlabRequest(this.url, endpoint, {
        headers: this.headers,
        body: options
      })
    )
  }

  put (endpoint, options) {
    return request.put(
      gitlabRequest(this.url, endpoint, {
        headers: this.headers,
        body: options
      })
    )
  }

  delete (endpoint, options) {
    return request.delete(
      gitlabRequest(this.url, endpoint, {
        headers: this.headers,
        body: options
      })
    )
  }
}

const gitlab = new Gitlab()

const API = {
  get: url => gitlab.get(url),
  put: (url, data) => gitlab.put(url, data),
  post: (url, data) => gitlab.post(url, data),
  delete: (url, data) => gitlab.delete(url, data),
  url: gitlab.url,
  token: gitlab.headers['private-token'],
  project: projectPath
}

module.exports = API
