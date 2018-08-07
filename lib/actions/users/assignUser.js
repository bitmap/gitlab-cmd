const chalk = require('chalk')
const req = require('../../requests')
const users = require('./index')

const assignUser = (config, assignee) => {
  users.findUser(assignee)
    .then(user => {
      // for some reason issues require assignee to be an array
      let id
      if (config.type === 'issue') id = user ? [user[0].id] : 0
      else id = user ? user[0].id : 0
      return id
    })
    .then(userID => {
      return req[config.type].put(config.id, `assignee_id=${userID}`)
    })
    .then(res => {
      if (res.assignee === null) {
        console.log(`\n ${chalk.yellow(config.name, res.iid)} was unassigned.`)
      } else {
        console.log(
          `\n ${chalk.yellow(config.name, res.iid)} assigned to ${
            res.assignee.name
          } (@${res.assignee.username})`
        )
      }
    })
    .catch(err => console.log(err))
}

module.exports = assignUser
