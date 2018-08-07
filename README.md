# gitlab-cmd

## Setup

Requires Node.js. Install the package globally:

```
npm install -g gitlab-cmd
```

This will add `gitlab` to the command-line.

In your `~/.gitconfig`, you'll need to setup the Gitlab url and a personal access token:

```
[gitlab]
  url = https://gitlab.com
  token = 1a2b3c4d5e6f7g8h9i0j
```

In the root of your project folder, create a file called `gitlab.config.json` and point it to your project's name:

```
{
  "repo": "cabe.io/gitlab-cmd",
  "defaultBranch": "master"
}
```

**Pro Tip:** You can also run `gitlab init` to quickly spin up a new repo.

To test if it works, run `gitlab --project` and you should see a JSON object that contains details about your project.

##### Other options

You can specify a `user` option in your gitconfig to omit namespacing `repo`. This is generally not recommended, but has some use cases. You can also specify a project's ID in `repo`.

```
{
  "repo": 12345
}
```

# Commands

* [gitlab](#gitlab)
* [gitlab issue](#gitlab-issue)
* [gitlab merge](#gitlab-merge)
* [gitlab list](#gitlab-list)
* [gitlab new](#gitlab-new)
* [gitlab branch](#gitlab-branch)
* [gitlab close](#gitlab-close)
* [gitlab query](#gitlab-query)

# `gitlab`

```
Usage: gitlab [options] [command]


Options:

  -V, --version     output the version number
  -P, --project     Display project details
  -L, --labels      Display a list of project labels
  -M, --milestones  Display a list of project milestones
  -B, --boards      Display a list of project issue boards
  -U, --users       Display a list of users
  -h, --help        output usage information


Commands:

  init                 Initialize repository
  issue|i <ids...>     Edit issues
  merge|mr <ids...>    Edit merge requests
  list|ls <type>       Display list of issues or merge requests
  new|n <type>         Create a new issues or merge requests
  query <queryString>  Query the Gitlab API
  branch               List or create branches
  help [cmd]           display help for [cmd]
```

# `gitlab issue`

```sh
$ gitlab issue <id> [options]
```

## Basic

Edit issue details. Provide an ID to edit a single issue. Provide multiple IDs to batch edit.

```sh
$ gitlab issue 138 --add-label "Bugfix" --remove-label "Feature"
$ gitlab issue 12 16 21 --close
```

#### Options

```
  -i, --info                  List out all data for this issue as a JSON object
  -c, --close                 Close issue
  -s, --state [close|reopen]  Set issue state
  -a, --assign <id|username>  Assign issue to user
  -b, --board                 Show which board issue belongs to
  -m, --move [board]          Move issue to board
  --ls-labels                 List issue labels
  --add-label <label>         Add label
  --remove-label <label>      Remove label
  --edit-title                Edit issue title
  --md-description            Translate description from markdown to HTML
```

# `gitlab merge`

```sh
$ gitlab merge <id>
$ gitlab merge ls
$ gitlab merge new
```

## Basic

Edit details or accept merge requests. Provide an ID to edit a single issue. Provide multiple IDs to batch edit.

```
$ gitlab merge 13 --merge
$ gitlab merge 5 9 10 --add-label "Staging"
```

#### Options

```
-i, --info                  List out all data for this merge as a JSON object
-c, --close                 Close merge request
-s, --state <close|reopen>  Set merge request state
-a. --assign <id|username>  Assign merge request to user
-m, --merge                 Accept merge request and merge into target branch
--ls-labels                 List merge request labels
--add-label <label>         Add label to merge request
--remove-label <label>      Remove Label from merge request
--edit-title                Edit merge request title
--status                    Check merge request status
--wip                       Toggle "Work in Progress" status
```

# `gitlab list`

Returns a list of all open issues or merges

```sh
$ gitlab list merges
$ gitlab list issues --filter labels "Bugfix"
```

#### Options

```sh
-f, --filter <type> <query>  Filter issues by parameter
```

# `gitlab new`

Creates a new issue or merge.

```sh
$ gitlab new merge
$ gitlab new issue --title "Really important bug" --labels "Bugfix"
```

#### Options

```
-t, --title <title>            Set title (required)
-d, --desc <description>       Set description
-m, --milestone <milestoneID>  Set milestone
-l, --label <label>            Set label
-u, --assignee <id|username>   Assign to user
--target <branch>              Target branch (required)
--source <branch>              Source branch (default: current branch)
--remove-branch <boolean>      Remove source branch? (default: true)
-P, --prompt                   Create via interactive prompt
```

# `gitlab branch`

Manage your project's branches

```sh
$ gitlab branch --list
$ gitlab branch --new issue/123-new-feature-branch
$ gitlab branch --delete bugfix/321-really-bad-idea
```

#### Options

```
--list                  List project branches
--new <branch_name>     Create a new branch from current
--delete <branch_name>  Delete a branch
```


# `gitlab close`

Close a batch of issues. Basically a shortcut for `gitlab issue [ids] --close`

```
$ gitlab close 12 13 14
```

# `gitlab query`

Allows you to query the GitLab API using a query string. It will return a JSON object with your results

```
$ gitlab query issues?state=closed
$ gitlab query merge_requests?labels=Staging,Feature
$ gitlab query "issues?search=Really obscure bug"
```
