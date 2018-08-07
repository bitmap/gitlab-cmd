const chalk = require('chalk')

const compareLabels = require('./helpers/compareLabels')
const putLabels = require('./helpers/putLabels')

function addLabel (label, labels) {
  if (labels.includes(label)) {
    console.log(`\n Issue already has label "${label}"`)
    process.exit(1)
  }

  labels.push(label)
  return labels
}

function removeLabel (label, labels) {
  if (!labels.includes(label)) {
    console.log(`\n Issue doesn't have label "${label}"`)
    process.exit(1)
  }

  return labels.filter(l => l !== label)
}

const labels = (action, config, _label, _board) => {
  compareLabels(config, _label)
    .then(labels => {
      if (action === 'add') {
        labels = addLabel(_label, labels)
      } else if (action === 'remove') {
        labels = removeLabel(_label, labels)
      } else if (action === 'move') {
        labels = addLabel(_label, labels)
        if (_board) labels = removeLabel(_board, labels)
      } else {
        console.log('Invalid action:', action)
        process.exit(1)
      }

      return putLabels(config, labels)
    }).then(res => {
      if (action !== 'move') {
        // Add
        action === 'add' ? action = 'added to' : action = 'removed from'
        console.log(`\n Label ${chalk.green(_label)} ${action} ${chalk.yellow(config.name, res.iid)}`)
      } else {
        // Remove
        console.log(`\n ${chalk.yellow(config.name, res.iid)} moved to board ${chalk.green(_label)}`)
      }
    })
    .catch(err => console.log(err))
}

module.exports = labels
