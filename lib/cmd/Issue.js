const inquirer = require('inquirer')
const chalk = require('chalk')
const markdown = require('markdown').markdown
const req = require('../requests')
const boards = require('../actions/boards')
const labels = require('../actions/labels')

const prompt = inquirer.createPromptModule()

const BaseOptions = require('./BaseOptions')

class Issue extends BaseOptions {
  constructor (id) {
    super(id)

    this.config = {
      id,
      type: 'issues',
      name: 'Issue'
    }
  }

  moveToBoard (_board) {
    function moveBoard (config, newBoard, oldBoard, projectBoards) {
      if (newBoard === oldBoard) {
        console.log(`\n ${chalk.red('Error!')} Issue is already in board ${chalk.magenta(newBoard)}`)
        process.exit(1)
      }

      if (!projectBoards.includes(newBoard)) {
        console.log('\n', chalk.magenta(newBoard), 'is not a valid board name.')
        process.exit(1)
      }

      labels('move',
        config,
        newBoard,
        oldBoard
      )
    }

    boards.compareBoards(this.config)
      .then(boards => {
        const projectBoards = boards.project
        const oldBoard = boards.current

        if (typeof _board !== 'string') {
          const choices = projectBoards.filter(board => board !== oldBoard)
          prompt([
            {
              type: 'list',
              name: 'board',
              message: `\n Current board is ${chalk.cyan(oldBoard)}.\n Move ${chalk.yellow(this.config.name + ' ' + this.config.id)} to board:`,
              choices
            }
          ]).then(answer => {
            const newBoard = answer.board
            moveBoard(this.config, newBoard, oldBoard, projectBoards)
          })
        } else {
          moveBoard(this.config, _board, oldBoard, projectBoards)
        }
      })
      .catch(err => console.log(err))
  }

  getBoard () {
    boards.compareBoards(this.config).then(boards => {
      const currentBoard = boards.current
      if (currentBoard) console.log('\n Current board:', chalk.green(currentBoard))
      else console.log(' No board found.')
    })
  }

  descriptionToMarkdown () {
    req[this.config.type]
      .get(this.config.id)
      .then(res => console.log(markdown.toHTML(res.description)))
      .catch(err => console.log(err))
  }
}

module.exports = Issue
