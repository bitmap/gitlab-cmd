const chalk = require('chalk')
const req = require('../requests')

const BaseOptions = require('./BaseOptions')

class MergeRequest extends BaseOptions {
  constructor(id) {
    super(id)

    this.config = {
      id,
      type: 'merge_requests',
      name: 'Merge Request',
    }
  }

  getStatus() {
    req[this.config.type]
      .get(this.config.id)
      .then(res => {
        if (res.merge_status === 'unchecked') {
          console.log(
            `\n !${chalk.yellow(res.iid)} merge status is ${chalk.cyan(
              res.merge_status
            )}.`
          )

          console.log(
            ` ${chalk.inverse(
              'Warning!'
            )} This is a bug in gitlab's API and can be resolved by visiting the URL: \n ${
              res.web_url
            }`
          )
        } else if (res.state !== 'merged') {
          console.log(
            `\n !${chalk.yellow(res.iid)} merge status is ${chalk.cyan(
              res.merge_status
            )}`
          )
          if (res.work_in_progress) {
            console.log(
              ` !${chalk.yellow(res.iid)} is a ${chalk.red(
                'Work in Progress!'
              )}`
            )
          }
        } else {
          console.log(
            `\n !${chalk.yellow(res.iid)} has been ${chalk.green(res.state)}.`
          )
        }
      })
      .catch(err => console.log(err.message))
  }

  merge() {
    req[this.config.type]
      .put(`${this.config.id}/merge`)
      .then(res => {
        console.log(`\n Merge Request ${res.iid} was merged.`)
      })
      .catch(err => {
        console.log(`\n ${chalk.red('Error!')} ${err.error.message}`)
        console.log(
          ' It might have unresolved coflicts. You can check status\n of this merge request with the command:'
        )
        console.log(
          `\n ${chalk.green('$')} gitlab merge ${this.config.id} --status`
        )
      })
  }

  toggleWIP() {
    req[this.config.type]
      .get(this.config.id)
      .then(res => res.title)
      .then(title => {
        let newTitle

        if (title.substring(0, 4) === 'WIP:') {
          newTitle = title.replace('WIP:', '')
        } else newTitle = `WIP: ${title}`

        return encodeURIComponent(newTitle.trim())
      })
      .then(title => req[this.config.type].put(this.config.id, `title=${title}`))
      .then(res => {
        if (res.work_in_progress) {
          console.log(
            `\n !${chalk.yellow(res.iid)} was ${chalk.green('marked')} as ${chalk.red(
              'Work In Progress'
            )}`
          )
        } else {
          console.log(
            `\n !${chalk.yellow(res.iid)} was ${chalk.red('unmarked')} as a ${chalk.green(
              'Work In Progress'
            )} and it's status is ${chalk.cyan(res.merge_status)}`
          )
        }
      })
      .catch(res => console.log(res.error.message))
  }
}

module.exports = MergeRequest
