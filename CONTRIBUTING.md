# Just some reminders

## 1. Contributor setup

Install requirements for contributing:
1. Please install python3 on your system. (It is needed for scripts to format your commit messages and handle [CHANGELOG.rst](/CHANGELOG.rst) file)
2. Install venv module for python (linux users only):
   - `sudo apt-get install python3-venv`
   - If using python3.10: `sudo apt-get install python3.10-venv`
3. Run `install.py` script:
   - `python3 .githooks/install.py`

### Issues

#### Create a new issue

1. **Bug**: If you found a bug, simply create a bug issue and say exactly what is going on.
2. **Feature**: If you want to add new feature, simply create a new feature issue and start working on it or assign it to someone else to do it.

**Note**: If you assign a feature to someone and that someone does not know about it, there is a huge chance that your issue will get rejected.

### Make changes

**Note**: This workflow is designed based on **gitflow**.
1. [Pick or create a **feature** or **bug** issue](#issues).
2. Fork the repository.
3. Then you should create a branch:
   - If you found a bug on a **release** branch, create a new branch based on that **release** branch with a name like:
     - `bugfix/<issue number>`
   - If you found a bug on **main** branch, create a new branch based on **main** branch with a name like:
     - `hotfix/<issue number>`
   - If you want to contribute a new feature into the project, create a new branch based on **develop** branch with a name like:
     - `feature/<issue number>`
4. Make your changes locally.
5. Test and debug your changes.
6. Add documentations every where needed.
7. Commit and push your changes. (Please read [Commit message guidelines](#commit-message-guidelines) section)
8. Create a pull request and **mention** your issue number inside the pull request.
9. Wait for the review and thanks for your contribution.

### Changelog

Most of the times, **do not** touch or change the `CHANGELOG.rst` file and let the script handle it.

### Commit message guidelines

There is a template for how to commit (based on **conventional** commit):

- **\<type>(\<scope>): \<subject>**

Samples:

```
docs(changelog): update changelog to beta.5
```

#### Type (Essential)

* docs: Documentation only changes
* feat: A new feature
* fix: A bug fix
* perf: A code change that improves performance
* refactor: A code change that neither fixes a bug nor adds a feature
* style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* test: Adding missing tests or correcting existing tests

#### Scope (Optional)

This section can be written in two formats:
1. (\<package>-\<function>)
2. (\<file,description...>)

**Note**: If you don't specify this part, remove parenthesis too.

#### Subject (Essential)

A brief description about what just happened.

## Versioning (Extra Section)

This is just a reminder for us to know what versioning system we are using.

Versioning in this project is based on **semantic** versioning:

v**Major**.**Minor**.**Patch**-**PreReleaseIdentifier**

Example:
- v1.4.0-beta.1

### Major Version

Signals backward-incompatible changes in a module’s public API. This release carries no guarantee that it will be backward compatible with preceding major versions.

### Minor Version

Signals backward-compatible changes to the module’s public API. This release guarantees backward compatibility and stability.

### Patch Version

Signals changes that don’t affect the module’s public API or its dependencies. This release guarantees backward compatibility and stability.

### Pre-release Version

Signals that this is a pre-release milestone, such as an alpha or beta. This release carries no stability guarantees.

### More information

For more information about versioning, read [this](https://go.dev/doc/modules/version-numbers).
