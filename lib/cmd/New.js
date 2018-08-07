const querystring = require('querystring')
const branch = require('git-branch')
const req = require('../requests')
const chalk = require('chalk')
const inquirer = require('inquirer')

const users = require('../actions/users')

const labelQuestion = require('../prompt/labelPrompt')
const assigneeQuestion = require('../prompt/assigneePrompt')
const milestoneQuestion = require('../prompt/milestonePrompt')
const branchQuestion = require('../prompt/branchPrompt')

const prompt = inquirer.createPromptModule()

class Create {
  constructor (type, args) {
    this.type = type
    this.args = args
  }

  prompt () {
    let questions = [
      {
        type: 'input',
        name: 'title',
        message: 'Title:',
        validate: function (value) {
          if (value.length > 0) {
            return true
          }

          return 'A title is required'
        }
      },
      {
        type: 'input',
        name: 'desc',
        message: 'Description:'
      }
    ]

    if (this.type === 'merge_requests') {
      questions.push(...branchQuestion)
    }

    labelQuestion()
      .then(question => {
        questions.push(question)
        return assigneeQuestion()
      })
      .then(question => {
        questions.push(question)
        return milestoneQuestion()
      })
      .then(question => {
        questions.push(question)
        return questions
      })
      .then(quest => {
        return prompt(quest)
      })
      .then(answers => {
        return this.makeQueryString(answers, answers.assignee)
      })
      .then(query => {
        this.post(query)
      })
  }

  parseArgs () {
    if (this.args['assignee']) {
      users.findUser(this.args['assignee'])
        .then(user => {
          return user[0].id
        })
        .then(assignee => {
          this.post(this.makeQueryString(this.args, assignee))
        })
    } else {
      this.post(this.makeQueryString(this.args))
    }
  }

  makeQueryString (_obj, assignee) {
    let qs = {}

    if (!_obj['title']) {
      console.log('Title is required')
      process.exit(1)
    } else {
      qs.title = _obj['title']
    }

    if (_obj['desc']) qs.description = _obj['desc']
    if (_obj['label']) qs.labels = _obj['label']
    if (_obj['milestone']) qs.milestone_id = _obj['milestone']
    if (assignee) qs.assignee_id = assignee

    if (this.type === 'merge_requests') {
      if (!_obj['target']) {
        console.log('\n No target branch specified')
        process.exit(1)
      } else {
        qs.target_branch = _obj['target']
      }

      if (!_obj['source']) {
        qs.source_branch = branch.sync()
      } else {
        qs.source_branch = _obj['source']
      }

      if (_obj['target'] === _obj['source']) {
        console.log('\n Can\'t merge source branch into itself!')
        process.exit(1)
      }

      if (_obj['remove-branch']) {
        qs.remove_source_branch = _obj['remove-branch']
      }
    }

    return querystring.stringify(qs)
  }

  template (issue) {
    let assignee = 'None'
    let milestone = 'None'
    let branchStatus = ''

    if (issue.assignee) {
      assignee = `${issue.assignee.name} (@${issue.assignee.username})`
    }

    if (issue.milestone) {
      milestone = `${issue.milestone.title}`
    }

    if (this.type === 'merge_requests') {
      branchStatus = `
  Source: ${chalk.blue(issue.source_branch)}
  Target: ${chalk.yellow(issue.target_branch)}
  Status: ${chalk.magenta(issue.merge_status)}`
    }

    return `
  !${chalk.yellow(issue.iid)}: ${issue.title}
  URL: ${issue.web_url}
  Author: ${issue.author.name} (@${issue.author.username})
  Assignee: ${assignee}
  Milestone: ${milestone} ${branchStatus}
`
  }

  post (queryString) {
    return req[this.type]
      .post(queryString)
      .then(res => {
        if (this.type === 'issues') console.log('\n New Issue created:')
        if (this.type === 'merge_requests') console.log('\n New Merge Request created:')
        console.log(this.template(res))
      })
      .catch(err => console.log(err.message))
  }
}

module.exports = Create
