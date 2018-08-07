const req = require('../../../requests')

const getLabels = config => {
  return req[config.type].get(config.id).then(res => res.labels)
}

module.exports = getLabels
