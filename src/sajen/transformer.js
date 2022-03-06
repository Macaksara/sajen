const { js_beautify } = require('js-beautify')
const { constant } = require('./types')

const {
    info,
    logExec,
    chalk: { gray }
} = require('./utils')

exports.parse = (tokens, callback) => {
    logExec('transformer.parse')

    const token_handler = {
        BALENI: ulangi_handler,
        SABEN: setiap_handler,
        NGIMPOR: impor_handler,
        [constant.INPUT]: masukan_handler,
        [constant.INGPO]: ingpo_handler,
        [constant.SUCCESS]: success_handler,
        [constant.WARN]: warn_handler,
        [constant.ERROR]: error_handler,
        [constant.GET]: get_handler,
        [constant.POST]: post_handler,
        [constant.WARNA]: warna_handler,
    }

    let transformed = ''
    let transformTrace = []

    for (let token of tokens) {
        transformTrace.push(`${token.type}:${token.line}`)

        if (token.type.toString() in token_handler) {
            transformed += token_handler[token.type](token)
        } else {
            // if(tokens.some(item => item.type === 58)) {
            //     transformed += token.value.split('(')
            // } else if(tokens.some(item => item.type === 59)) {
            //     transformed += token.value.split('(')
            // } else if(tokens.some(item => item.type === 60)) {
            //     transformed += token.value.split('(')
            // } else {
            //     transformed += token.value + ' '
            // }

            // console.log(token.type.toString())
            // tokens[1]["type"]
            transformed += token.value + ' '
            //transformed += `${token.value.split('(')}`
        }
    }

    info('parse', 'transforming:', gray(transformTrace.join(',')))

    if (Object.keys(additions).length <= 0) return callback(transformed)

    let additionsString = ''

    for (let key in additions) additionsString += additions[key] + '\n'

    info('parse', 'remove all additions')
    additions = {}

    callback(`${additionsString}\n${transformed}`)
}

let additions = {}

const INPUT = `const readlineSync = require("${require.resolve(
    'readline-sync'
).replace(/\\/g, "\\\\")}");`

const INGPO = `const werna = require("${require.resolve(
    '@macaksara/wernai'
).replace(/\\/g, "\\\\")}").auto.id;`

const SUCCESS = `const { success } = require("${require.resolve(
    '@macaksara/wernai'
).replace(/\\/g, "\\\\")}").auto.id;`

const WARN = `const { warn } = require("${require.resolve(
    '@macaksara/wernai'
).replace(/\\/g, "\\\\")}").auto.id;`

const ERROR = `const { error } = require("${require.resolve(
    '@macaksara/wernai'
).replace(/\\/g, "\\\\")}").auto.id;`

const GET = `const { get } = require("${require.resolve(
    'axios'
).replace(/\\/g, "\\\\")}");`

const POST = `const { post } = require("${require.resolve(
    'axios'
).replace(/\\/g, "\\\\")}");`

const WARNA = `const werna = require('../src/sajen/werna.js');`

function ulangi_handler(token) {
    logExec('transformer.ulangi_handler', gray(token.line))

    let valArr = js_beautify(token.value).split(' ')

    info('ulangi_handler', 'array value:', valArr)
    info('ulangi_handler', 'array length:', valArr.length)

    if (valArr.length < 5) {
        triggerError("Syntax 'ulangi' error", token.line)
        process.exit()
    }

    const intvar = valArr[1]

    info('ulangi_handler', 'variable interation:', intvar)

    var parsedJS = `for(var ${intvar} = 0; ${intvar} < ${
        valArr[3]
    }; ${intvar}++)`

    return parsedJS
}

function setiap_handler(token) {
    logExec('transformer.setiap_handler', gray(token.line))

    const parsed = js_beautify(token.value, {
        indent_level: 4
    }).trim().split(' ')

    info('setiap_handler', 'diuraikan:', parsed)

    return `for(var ${parsed[2].slice(0, -1)} of ${parsed[0].split('(')[1]})`
}

function masukan_handler(token) {
    logExec('transformer.masukan_handler', gray(token.line))

    additions.input = INPUT

    return token.value
}

function ingpo_handler(token) {
  logExec('transformer.ingpo_handler', gray(token.line))

  additions.ingpo = INGPO

  return token.value
}

function success_handler(token) {
    logExec('transformer.success_handler', gray(token.line))

    additions.success = SUCCESS

    return token.value
  }

  function warn_handler(token) {
    logExec('transformer.warn_handler', gray(token.line))

    additions.WARN = WARN

    return token.value
  }

  function error_handler(token) {
    logExec('transformer.error_handler', gray(token.line))

    additions.ERROR = ERROR

    return token.value
  }

  function get_handler(token) {
    logExec('transformer.get_handler', gray(token.line))

    additions.GET = GET

    return token.value
  }

  function post_handler(token) {
    logExec('transformer.post_handler', gray(token.line))

    additions.POST = POST

    return token.value
  }

  function warna_handler(token) {
    logExec('transformer.warna_handler', gray(token.line))

    additions.WARNA = WARNA

    return token.value
  }

function impor_handler(token) {
    logExec('transformer.impor_handler', gray(token.line))

    const parsed = token.value
        .replace('ngimpor', 'const')
        .replaceLast('saking', '=')
    let packageName = parsed.match(/['`"]([^'`"]+)['`"]/)[0]

    info('ngimpor_handler', 'diuraikan:', parsed.trim())
    info('ngimpor_handler', 'package:', packageName)

    return parsed.replaceLast(packageName, `require(${packageName})`)
}

function triggerError(mess, line) {
    logExec('transformer.triggerError', gray(line))
    throw `Kesalahan ing baris ${line}: "${mess}"`
}

String.prototype.reverse = function() {
    return this.split('')
        .reverse()
        .join('')
}

String.prototype.replaceLast = function(what, replacement) {
    return this.reverse()
        .replace(new RegExp(what.reverse()), replacement.reverse())
        .reverse()
}
