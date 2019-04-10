const req = require('../requests')

module.exports = function makeLabelChoices() {
  return req.project
    .get('labels')
    .then(labels => {
      const choices = []

      for (const label in labels) {
        const choice = labels[label].name
        choices.push(choice)
      }

      return choices
    })
    .then(choices => ({
      type: 'checkbox',
      name: 'label',
      message: 'Add Label:',
      choices,
      filter(value) {
        const labels = value.toString()
        return labels
      },
    }))
}
