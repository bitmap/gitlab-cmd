const req = require('../../requests')

const getInfo = config => {
  return req[config.type]
    .get(config.id)
    .then(res => res)
    .catch(err => console.log(err))
}

module.exports = getInfo
