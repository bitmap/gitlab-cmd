const req = require('../../../requests')

const putLabels = (config, labels) => {
  const labelString = labels.join(',')
  return req[config.type].put(config.id, `labels=${labelString}`)
}

module.exports = putLabels
