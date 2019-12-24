const Handlebars = require('handlebars')
const _ = require('./utils')

/**
 * This module exports helper functions to compute details of Handlebars configurations.
 * At the moment, this is
 *
 * * Compute callees and callers for each partial and template registered with
 *   `customize-engine-handlebars`
 * * Extract comments from partials
 * * Create a call-hierarchy (templates -> partials -> partials)
 *   the can be rendered using for example `thought`
 * @type {{augmentSingleFile: function, augment: function, hierarchy: function}}
 */
module.exports = { augmentSingleFile, augment, hierarchy }

/**
 * Compute a hierarchy tree of templates and partials calling other partials.
 * The return value can be used as input for the 'renderTree'-helper and
 * has the form
 *
 * ```
 * [{
 *   "name": "template1",
 *   "type": "template",
 *   "path": "src/tmpl/template1.hbs
 *   "comments": ["a comment for template1"],
 *   "children": [
 *     "name": "partial1",
 *     "path": "src/prt/partial1.hbs
 *     "type": "partial",
 *     "comments": ["a comment for partial 1"],
 *     "children": []
 *   ]
 * }]
 * ```
 *
 * @param {{templates: object, partials: object}} config
 * @return {object}
 */
function hierarchy(config) {
  const templates = _.mapValues(config.templates, augmentSingleFile)
  const partials = _.mapValues(config.partials, augmentSingleFile)
  return {
    children: Object.keys(templates).map(name => {
      const template = templates[name]
      return {
        name: name,
        type: 'template',
        path: template.path,
        comments: template.comments,
        children: template.callsPartial
          .map(callee => callee.name)
          // Remove redundant names (only take the first one)
          .filter((name, index, array) => array.indexOf(name) === index)
          .map(name => partialForCallTree(name, partials, {}))
      }
    })
  }
}

/**
 * Inner function that returns a partial and its callees as tree
 * @param {string} name the name of the partial
 * @param {object} partials an object of all partials (by name). This is assumed to be an augmentedPartial with comment
 * and  callee
 * @param {object<boolean>=} visitedNodes names of the visited nodes for breaking cycles (values are alwasy "true")
 * @returns {{name: *, type: string, comment}}
 */
function partialForCallTree(name, partials, visitedNodes) {
  const cycleFound = visitedNodes[name]
  try {
    visitedNodes[name] = true
    const partial = partials[name]
    if (!partial) {
      throw new Error(`Missing partial "${name}"`)
    }
    let children
    if (!cycleFound) {
      children = partial.callsPartial
        .map(callee => callee.name)
        // Remove redundant names (only take the first one)
        .filter((name, index, array) => array.indexOf(name) === index)
        .map(name => partialForCallTree(name, partials, visitedNodes))
    }
    return {
      name,
      type: 'partial',
      comments: partial.comments,
      path: partial.path,
      children,
      cycleFound
    }
  } finally {
    if (!cycleFound) {
      delete visitedNodes[name]
    }
  }
}

/**
 * Augment a whole customize-engine-handlebars configuration (templates and partials)
 * by adding comment, callers and callees
 * @param {{templates: object, partials: object}} config
 */
function augment(config) {
  const augmentedTemplates = _.mapValues(config.templates, augmentSingleFile)
  const augmentedPartials = _.mapValues(config.partials, augmentSingleFile)
  // Prepare caller array in each partial
  _.forEachValue(augmentedPartials, file => {
    file.calledBy = []
  })
  ;[augmentedTemplates, augmentedPartials].forEach(obj => {
    _.forEachValue(obj, (file, name) => {
      file.callsPartial.forEach(callee => {
        // @partial-block calls need to be ignored, because when building the call-hierarchy,
        // the partial-blocks are "unknown" partials. Partial-blocks actually are part of the
        // parent partial, so they should not be shown in the hierarchy
        if (callee.name === '@partial-block') {
          return
        }
        const partial = augmentedPartials[callee.name]
        if (!partial) {
          throw new Error(`Missing partial "${callee.name}"`)
        }
        partial.calledBy.push({
          name: name,
          path: file.path,
          type: augmentedPartials === obj ? 'partial' : 'template',
          line: callee.line
        })
      })
    })
  })
  return {
    templates: augmentedTemplates,
    partials: augmentedPartials
  }
}

/**
 * Augments the 'fileWithContents' with several properties derived from the files contents:
 *
 * * **calls**: A list of one object `{name: 'abc'}` for each partial that is called from within the current
 *  template or partials.
 * * **apidocComment**: The contents of first comment that contains the string `@apidoc`.
 *
 *
 * @param {{path:string, contents: string}} fileWithContents an object containing the path to
 * a file and its contents.
 * @return {{path: string, contents: string, calls: string[], comment?:string}} the input object
 * augmented by the partialnames called from this template or partial
 */
function augmentSingleFile(fileWithContents) {
  const result = Object.assign(
    {
      callsPartial: [],
      comments: []
    },
    fileWithContents
  )
  const ast = Handlebars.parse(fileWithContents.contents)
  new PartialVisitor(partialCall => result.callsPartial.push(partialCall)).accept(ast)
  new ApiDocCommentVisitor(comment => result.comments.push(comment)).accept(ast)
  return result
}

/**
 * Visitory to collect partial-calls from the ast
 * @see https://github.com/wycats/handlebars.js/blob/master/docs/compiler-api.md#ast-visitor
 */
class PartialVisitor extends Handlebars.Visitor {
  /**
   *
   * @param {function({name:string, line:number})} fn function that is called for each partial-call in the template
   */
  constructor(fn) {
    super()
    this.fn = fn
  }

  PartialStatement(partialCall) {
    super.PartialStatement(partialCall)
    this.fn({
      name: partialCall.name.original,
      line: partialCall.loc.start.line
    })
  }
}

class ApiDocCommentVisitor extends Handlebars.Visitor {
  constructor(fn) {
    super()
    this.fn = fn
  }

  /**
   * Visit a comment statement
   * @param {string} comment
   */
  CommentStatement(comment) {
    super.CommentStatement(comment)
    this.fn(comment.value.trim())
  }
}
