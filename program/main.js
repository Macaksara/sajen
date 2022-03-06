const beautify = require('js-beautify').js_beautify

const tokenizer = require('../src/sajen/tokenizer')
const transformer = require('../src/sajen/transformer')
const program = require('../src/sajen/program')

async function compile(_code) {
    return new Promise((resolve, reject) => {
        tokenizer.lexString(_code, (token, error) => {
            if (error) return reject(error)

            transformer.parse(token, compiled => {
                resolve(beautify(compiled))
            })
        })
    })
}

async function run(_code) {
    return new Promise((resolve, reject) => {
        tokenizer.lexString(_code, (token, error) => {
            if (error) return reject(error)
            transformer.parse(token, compiled => {
                program.run(compiled, resolve)
            })
        })
    })
}

async function clean() {
    return program.clean();
}

module.exports = { compile, run, clean }
