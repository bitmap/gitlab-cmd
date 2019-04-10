const config = require('config')
const branch = require('git-branch')

const defaultBranch = !config.defaultBranch ? 'master' : config.defaultBranch

module.exports = [
  {
    type: 'input',
    name: 'target',
    message: 'Target Branch:',
    validate(value) {
      if (value.length > 0) {
        return true
      }

      return 'Must specify a target branch'
    },
    default: defaultBranch,
  },
  {
    type: 'input',
    name: 'source',
    message: 'Source Branch:',
    default: branch.sync(),
  },
  {
    type: 'confirm',
    name: 'remove-branch',
    message: 'Remove source branch when issued?',
    default: true,
  },
]
