const chalk = require('chalk')
const inquirer = require('inquirer')
const req = require('../../requests')
const prompt = inquirer.createPromptModule()

const editTitle = (config) => {
  req[config.type]
    .get(config.id)
    .then(res => {
      return prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter new title:',
          default: res.title
        }
      ])
    })
    .then(answer => {
      const newTitle = encodeURIComponent(answer.title)
      return req[config.type].put(config.id, `title=${newTitle}`)
    })
    .then(res => {
      console.log(
        `\n ${chalk.yellow(
          config.name,
          res.iid
        )} title updated to ${chalk.green(res.title)}.`
      )
    })

    .catch(err => console.log(err))
}

module.exports = editTitle
