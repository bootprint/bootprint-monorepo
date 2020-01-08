# Contributing Guide

## Monorepo setup

A relevant packages of `customize` and `bootprint` have been moved to this
mono-repo, because it seems easier to maintain that way.

The repo is now using `yarn` instead of `npm` and uses "yarn workspaces" and [lerna](https://npmjs.com/package/lerna)
to manage dependencies between packages in the mono-repo.

`devDependencies` should generally be added to the root package.

## Commit Style / Changelogs

We now use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to automatically
generate changelogs. The following is an adapted excerpt of the [Angular Commit Style](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines)
that we use in this project as well.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer than 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples: (even more [samples](https://github.com/angular/angular/commits/master))

```
docs(changelog): update changelog to beta.5
```
```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type
Must be one of the following:

* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* **ci**: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests

### Scope

The scope should be the name of the npm package affected (as perceived by the person reading the changelog generated from commit messages).

The following is the list of supported scopes. Use the bold-part as scope for the corresponding package.

* **customize**
* customize-engine-**handlebars**
* customize-engine-**less**
* customize-**write-files**
* **bootprint**
* bootprint-**unit-testing**
* **bootprint-base**
* bootprint-**json-schema**
* bootprint-**openapi**
* **thought-plugin**-bootprint


There are currently a few exceptions to the "use package name" rule:

* **packaging**: used for changes that change the npm package layout in all of our packages, e.g.
  public path changes, package.json changes done to all packages, d.ts file/format changes, changes
  to bundles, etc.
* **changelog**: used for updating the release notes in CHANGELOG.md
* none/empty string: useful for `style`, `test` and `refactor` changes that are done across all
  packages (e.g. `style: add missing semicolons`) and for docs changes that are not related to a
  specific package (e.g. `docs: fix typo in tutorial`).

### Subject
The subject contains a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

A detailed explanation can be found in this [document][commit-message-format].

## Code-Style / Linting

The [StandardJS](https://standardjs.com/) code-style is enforced through [eslint](https://npmjs.com/package/eslint) and [prettier](https://npmjs.com/package/prettier).
If you are interested in the exact packages to achieve this, have a look at the `package.json` of the root-project.

Files are formatted and lint-fixed on pre-commit using [lint-stages](https://npmjs.com/package/lint-stages), so you usually do not have to
worry about code-style very much. If a commit fails, please consult the git-output for details.


