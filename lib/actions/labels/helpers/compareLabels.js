// Compare the issue or merge request's labels to the project's labels
// Returns a new array of labels if the label exists in the project
const chalk = require('chalk')
const req = require('../../../requests')
const getLabels = require('./getLabels')

const compareLabels = (config, LABEL) => {
  let itemLabels = []
  return getLabels(config)
    .then(labels => {
      itemLabels = labels
      return itemLabels
    }).then(() => {
      return req.project.get('labels')
    }).then(labels => {
      const projectLabels = labels.map(label => label.name)

      if (!projectLabels.includes(LABEL)) {
        console.log(`\n "${LABEL}" is not a label in this Project. This input is case-sensitive.`)
        console.log(' Available Labels:')
        labels.map(label => console.log(`   ${chalk.bgHex(label.color)(label.name)}`))
        process.exit(1)
      }

      return itemLabels
    })
}

module.exports = compareLabels
