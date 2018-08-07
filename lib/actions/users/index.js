const req = require('../../requests')

exports.getUsers = () => {
  return req.project.get('users?active=true').then(users => users)
}

exports.findUser = (userQuery) => {
  return this.getUsers().then(users => {
    let assignee

    if (userQuery === 0) {
      // Removes assignees
      assignee = 0
    } else if (typeof userQuery === 'number') {
      assignee = users.filter(assignee => assignee.id === userQuery)
    } else if (typeof userQuery === 'string') {
      assignee = users.filter(
        assignee => assignee.username === userQuery.toLowerCase()
      )
    } else {
      assignee = users.map(
        assignee => `${assignee.id}: ${assignee.name} (${assignee.username})`
      )
    }

    if (!assignee.length && userQuery !== 0) {
      console.log(' No user found.')
      process.exit(1)
    }

    return assignee
  })
}
