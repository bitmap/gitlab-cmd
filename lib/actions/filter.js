const chalk = require('chalk')

const req = require('../requests')
const args = require('../args')(process)

const list = require('./list')

const filter = (type, filterOption) => {
  filterOption.toLowerCase()

  if (typeof filterOption !== 'string') {
    console.log('\n No query specified! Try \'labels\', \'assignee\', or \'milestone')
    process.exit(1)
  }

  let filter

  // Do some corrections
  if (filterOption === 'label') filter = 'labels'
  else if (filterOption === 'assignee') filter = 'assignee_id'
  else filter = filterOption.toLowerCase()

  var query = encodeURI(`${filter}=${args._[1]}`)

  console.log(`\n Filtering ${type} by ${chalk.blue(filter)}: ${chalk.keyword('orange')(args._[1])}`)

  req.project.get(`${type}?${query}`).then(res => {
    list(type, res)
  })
}

module.exports = filter
