const minimist = require('minimist')

module.exports = function argParse (proc) {
  return minimist(proc.argv.slice(2))
}
