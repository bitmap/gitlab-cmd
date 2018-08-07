//  Special function to remove issue from any boards
const chalk = require('chalk')
const req = require('../../requests')
const labels = require('../labels')
const boards = require('../boards')

const closeIssue = (config) => {
  return boards.compareBoards(config)
    .then(boards => {
      const currentBoard = boards.current
      if (currentBoard) {
        labels('remove', config, boards.current)
      }
      return currentBoard
    })
    .then(() => {
      return req[config.type].put(config.id, 'state_event=close')
    })
    .then(res => {
      console.log(
        `\n ${chalk.yellow('Issue', res.iid)}: ${chalk.green(
          res.title
        )} was ${chalk.cyan(res.state)}.`
      )
    })
    .catch(err => console.log(err))
}

module.exports = closeIssue
