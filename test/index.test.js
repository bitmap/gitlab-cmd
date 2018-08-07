/* globals describe, beforeEach, it */
const expect = require('chai').expect
const nock = require('nock')
const gitlab = require('../lib/config')

const getInfo = require('../lib/actions/getInfo')
const users = require('../lib/actions/users')
const getLabels = require('../lib/actions/labels/helpers/getLabels')
const boards = require('../lib/actions/boards')

const API = `${gitlab.url}`

const issueConfig = {
  id: 1,
  type: 'issues',
  name: 'Issue'
}

const mergeConfig = {
  id: 1,
  type: 'merge_requests',
  name: 'Merge Request'
}

const project = `/${gitlab.project}`
const issue = `${project}/issues/${issueConfig.id}`
const merge = `${project}/merge_requests/${mergeConfig.id}`

const path = {
  boards: `${project}/boards`
}

const data = require('./data')

describe('User / Assignee', () => {
  beforeEach(() => {
    nock(API)
      .get(`${project}/users`)
      .query({
        active: true
      })
      .reply(200, data.users)
  })

  it('Get Users', () => {
    return users.getUsers()
      .then(response => {
        expect(typeof response).to.equal('object')
        expect(response[0].id).to.equal(1)
      })
  })

  it('Find User', () => {
    return users.findUser('cabe')
      .then(response => {
        expect(typeof response).to.equal('object')
        expect(response[0].id).to.equal(138)
        expect(response[0].name).to.equal('Cabe Branson')
        expect(response[0].username).to.equal('cabe')
      })
  })
})

describe('Project', () => {
  beforeEach(() => {
    nock(API)
      .get(path.boards)
      .reply(200, data.boards)
  })

  it('Gets project boards', () => {
    return boards.getBoardsList()
      .then(response => {
        expect(typeof response).to.equal('object')
        expect(response[0].id).to.equal(100)
        expect(response[0].label.name).to.equal('Development')
      })
  })
})

describe('Get Issue', () => {
  beforeEach(() => {
    nock(API)
      .get(issue)
      .reply(200, data.issue)
  })

  it('Get issue info', () => {
    return getInfo(issueConfig)
      .then(response => {
        expect(typeof response).to.equal('object')
        expect(response.iid).to.equal(1)
      })
  })
  it('Get issue labels', () => {
    return getLabels(issueConfig)
      .then(response => {
        expect(typeof response).to.equal('object')
        expect(response[0]).to.equal('Feature')
        expect(response[1]).to.equal('Bugfix')
      })
  })
})

describe('Get Merge Request', () => {
  beforeEach(() => {
    nock(API)
      .get(merge)
      .reply(200, data.mergeRequest)
  })

  it('Get merge request info', () => {
    return getInfo(mergeConfig)
      .then(response => {
        expect(typeof response).to.equal('object')
        expect(response.iid).to.equal(1)
        expect(response.target_branch).to.equal('master')
      })
  })
  it('Get merge request labels', () => {
    return getLabels(mergeConfig)
      .then(response => {
        expect(typeof response).to.equal('object')
        expect(response[0]).to.equal('Bugfix')
      })
  })
})
