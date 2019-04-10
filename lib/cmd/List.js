const req = require('../requests')
const filter = require('../actions/filter')
const list = require('../actions/list')

class List {
  constructor(type, item) {
    this.type = type
    this.item = item
  }

  filter(option) {
    filter(this.type, option)
  }

  display() {
    req.project
      .get(this.type)
      .then(res => {
        list(this.type, res)
      })
      .catch(err => console.log(err))
  }
}

module.exports = List
