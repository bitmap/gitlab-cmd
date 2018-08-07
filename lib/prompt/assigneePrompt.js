const req = require('../requests')

module.exports = function makeAssigneeChoices () {
  return req.project
    .get('/users?active=true')
    .then(users => {
      const choices = []

      choices.push({ name: 'Unassigned', value: 0 })

      for (var user in users) {
        const choice = {
          name: users[user].name,
          value: users[user].id
        }
        choices.push(choice)
      }

      return choices
    })
    .then(choices => {
      return {
        type: 'list',
        name: 'assignee',
        message: 'Assign Issue To:',
        pageSize: 10,
        choices: choices
      }
    })
}
