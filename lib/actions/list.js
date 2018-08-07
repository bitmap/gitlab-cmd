const chalk = require('chalk')

const list = (type, res) => {
  const openItems = res.filter(item => item.state === 'opened')

  if (openItems.length === 0) {
    console.log(chalk.red('\n No results found.'))
    process.exit(0)
  }

  openItems.forEach(item => {
    const labels = item.labels.join(', ')

    const assignees = function () {
      const assignees = []
      if (item.assignees !== undefined) {
        item.assignees.map(user => assignees.push(user.username))
        if (assignees.length === 0) return ''
        return `: ${chalk.magenta(assignees)}`
      }

      if (item.assignee) return `| Assignee: ${chalk.magenta(item.assignee.username)}`
      return ''
    }

    const listItem = {
      item, labels, assignees
    }

    if (type === 'issues') issuesMessage(listItem)
    if (type === 'merge_requests') mergesMessage(listItem)
  })
}

const issuesMessage = (ls) => {
  const { item, labels, assignees } = ls
  console.log(` \u2022 ${chalk.yellow(`#${item.iid}`)}: ${chalk.cyan(item.title)} (${labels}) ${assignees()}`)
}

const mergesMessage = (ls) => {
  const { item, labels, assignees } = ls
  console.log(` \u2022 ${chalk.yellow(`!${item.iid}`)}: ${chalk.cyan(item.title)} (${labels}) by ${item.author.username}\n${chalk.gray(' |---')} ${chalk.blue(item.source_branch)} \u2192 ${chalk.yellow(item.target_branch)} ${assignees()}`)
}

module.exports = list
