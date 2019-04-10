const chalk = require('chalk')
const jsome = require('jsome')
const req = require('../requests')
const labels = require('../actions/labels/')
const assignUser = require('../actions/users/assignUser')
const setState = require('../actions/setState/')
const getInfo = require('../actions/getInfo/')
const getLabels = require('../actions/labels/helpers/getLabels')
const editTitle = require('../actions/editTitle/')

// Shared commands
class BaseOptions {
  constructor(id, type) {
    this.config = {
      id,
      type,
      name: '',
    }

    this.getInfo = () => getInfo(this.config).then(info => jsome(info))
    this.setState = state => setState(this.config, state)
    this.addLabel = label => labels('add', this.config, label)
    this.removeLabel = label => labels('remove', this.config, label)
    this.assignUser = assignee => assignUser(this.config, assignee)
    this.editTitle = newTitle => editTitle(this.config, newTitle)
    this.getLabels = () => getLabels(this.config).then(labels => {
      console.log(`\n ${chalk.yellow(this.config.name, this.config.id)} Labels:`)
      labels.map(label => console.log(` \u2022 ${label}`))
    })
    this.delete = () => req[this.config.type].delete(this.config.id)
  }
}

module.exports = BaseOptions
