const req = require('../requests')

module.exports = function makeMilestoneChoices() {
  return req.project
    .get('/milestones')
    .then(milestones => {
      const choices = []

      // this is temporary, currently there's a bug in the api
      // where the milestone?state=active query returns an error
      const activeMilestones = milestones.filter(
        milestone => milestone.state === 'active'
      )

      choices.push({ name: 'No Milestone', value: 0 })

      for (const milestone in activeMilestones) {
        const choice = {
          name: activeMilestones[milestone].title,
          value: activeMilestones[milestone].id,
        }
        choices.push(choice)
      }

      return choices
    })
    .then(choices => ({
      type: 'list',
      name: 'milestone',
      message: 'Milestone:',
      choices,
    }))
}
