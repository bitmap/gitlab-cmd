const req = require('../requests')

module.exports = function makeLabelChoices () {
  return req.project
    .get('labels')
    .then(labels => {
      const choices = []

      for (var label in labels) {
        const choice = labels[label].name
        choices.push(choice)
      }

      return choices
    })
    .then(choices => {
      return {
        type: 'checkbox',
        name: 'label',
        message: 'Add Label:',
        choices: choices,
        filter: function (value) {
          const labels = value.toString()
          return labels
        }
      }
    })
}
