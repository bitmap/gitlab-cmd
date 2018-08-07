const chalk = require('chalk')

module.exports = (args) => {
  if (!args._.length) {
    console.log('\n Must specify issues or merges')
    return
  }

  let type = args._[0]

  if (
    type === 'i' ||
    type === 'issue') type = 'issues'
  if (
    type === 'mr' ||
    type === 'merge' ||
    type === 'merges') type = 'merge_requests'

  if (type === 'issues' || type === 'merge_requests') {
    return type
  }

  console.log('\n Invalid argument: ' + chalk.red(type))
  process.exit(1)
}
