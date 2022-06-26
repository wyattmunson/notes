# Git

## Git Commands

```bash
# see current branch and file status
git status

# add commits to staging
git add .

# add commit message
git commit -m "fix: update date selector"

# push
git push
git push -u REMOTE_NAME BRANCH_NAME
git push -u origin main
```

### Git command reference

```bash
# see current branches
git branch
# See what braches are tracking upstream branches
git branch -vv

```

### Addiing initial repository

```bash
git init
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:USERNAME/REPO_NAME.git
git push -u origin main
```

### Git Config

Git Config stores metadata - globally and per repository.

```bash
git config --list

git config --global user.email "your_email@example.com"

# add git config
git config --add core.sshcommand "ssh -i ~/.ssh/github"

# remove git config
git config --unset remote.github.url
```

### Remotes

Remotes refer to the location of a repository stored on an online tool like GitHub or GitLab, versus the local copy stored on each users machine. When pushing and pulling, the command is targeting a remote.

Most repos push and pull from a single remote called `origin`. In more advanced use cases, multiple remotes are used for repos stored in multiple locations.

```bash
# see remote origin
git remote show origin

# add another remote
git remote add REMOTE_NAME REMOTE_URL
git remote add origin git@github.com:USERNAME/REPO_NAME.git
git remote add second-remote git@github.com:USERNAME/REPO_NAME.git
```

### Tag Commit

```bash
# create a tag
git tag -a v0.1.0 -m "Version 0.1.0 - do a thing"

# push tags to remote
git push --tags
```

### Pulling without pull strategy set

```
warning: Pulling without specifying how to reconcile divergent branches is
discouraged. You can squelch this message by running one of the following
commands sometime before your next pull:

  git config pull.rebase false  # merge (the default strategy)
  git config pull.rebase true   # rebase
  git config pull.ff only       # fast-forward only

You can replace "git config" with "git config --global" to set a default
preference for all repositories. You can also pass --rebase, --no-rebase,
or --ff-only on the command line to override the configured default per
invocation.
```
