const chalk = require('chalk')
const req = require('../../requests')
const closeIssue = require('../closeIssue')

function getState (config) {
  req[config.type].get(config.id).then(res => {
    console.log(
      `\n ${chalk.yellow(config.name, res.iid)}: ${chalk.green(
        res.title
      )} state: ${chalk.cyan(res.state)}`
    )
    process.exit(1)
  })
}

function setState (config, state) {
  if (state === 'open' || state === 'opened') state = 'reopen'
  if (state === 'closed') state = 'close'
  if (config.type === 'issue' && state === 'close') {
    return closeIssue(config)
  }

  req[config.type]
    .put(config.id, `state_event=${state}`)
    .then(res => {
      if (res.state === 'merged') {
        console.log(
          `\n ${chalk.yellow(config.name, res.iid)}: ${chalk.green(
            res.title
          )} has already been ${chalk.cyan(res.state)}`
        )
      } else {
        console.log(
          `\n ${chalk.yellow(config.name, res.iid)}: ${chalk.green(
            res.title
          )} was ${chalk.cyan(res.state)}`
        )
      }
    })
    .catch(err => console.log(err.message))
}

const state = (config, state) => {
  if (typeof state !== 'string') {
    getState(config)
  } else {
    setState(config, state)
  }
}

module.exports = state
