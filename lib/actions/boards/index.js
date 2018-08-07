const req = require('../../requests')
const getLabels = require('../../actions/labels/helpers/getLabels')

const compareBoards = (config) => {
  let _labels = []
  let _boards = {
    project: [],
    current: ''
  }

  return getLabels(config).then(labels => {
    _labels = labels
    return _labels
  }).then(() => {
    return getBoardsList()
  }).then(boards => {
    _boards.project = mapProjectBoards(boards)
    _boards.current = getCurrentBoard(_boards.project, _labels)

    return _boards
  }).catch(res => console.log(res.error))
}

function getBoardsList () {
  return req.project.get('boards').then(boards => boards[0].lists)
}

function mapProjectBoards (boards) {
  let projectBoards = []
  boards.map(board => {
    projectBoards.push(board.label.name)
  })
  return projectBoards
}

function getCurrentBoard (boards, labels) {
  const currentBoards = boards.filter(boardLabel => labels.includes(boardLabel))

  if (currentBoards.length > 1) {
    console.log('\n Error: Issue belongs to multiple boards!')
    console.log('\n Use the --remove-label option to manually edit boards and try again.')
    process.exit(1)
  }

  if (!currentBoards.length) currentBoards[0] = ''

  return currentBoards[0]
}

module.exports = {
  getBoardsList,
  compareBoards
}
