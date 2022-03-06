#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const app = require('commander')
const chalk = require('chalk')
const recReadSync = require('recursive-readdir-sync')
const mkdirp = require('mkdirp')
const ON_DEATH = require('death')

const program = require('../src/sajen/program')

const { version, description } = require('../package.json')

if (
    process.argv[2] &&
    fs.existsSync(path.resolve(process.cwd(), process.argv[2]))
) {
    program.runFile(process.argv[2])
}

function checkOption() {
    if (app.verbose) global.verbose = true
}

app.version(version).description(description)

/* eslint-disable no-console */
app.option('--verbose', 'debug logging')

app.command('bantuan')
    .alias('help')
    .description('Nuduhake bantuan')
    .action(() => app.help())

app.command('r <file>')
    .alias('run')
    .description("Nindakaken file sajen")
    .action(filepath => {
        checkOption()
        program.runFile(filepath)
    })

app.command('c <file>')
    .alias('compile')
    .description('Compile file lan cetak menyang konsol')
    .action(filepath => {
        checkOption()
        program.compile(program.getRealPath(filepath), result => {
            console.log(result)
        })
    })

app.command('o <file> <output>')
    .alias('output')
    .description('Compile lan simpen menyang file javascript')
    .action((filepath, output) => {
        checkOption()
        program.compile(program.getRealPath(filepath), result => {
            fs.writeFileSync(path.join(process.cwd(), output), result)
        })
    })

app.command('d <input> <output>')
    .alias('directory')
    .description('Compile direktori')
    .action((input, output) => {
        checkOption()
        const cwd = process.cwd()

        const inputDir = path.resolve(cwd, input)
        const outputDir = path.resolve(cwd, output)

        const isDir = fs.statSync(inputDir).isDirectory()

        if (!isDir) {
            return console.log(
                `input kudu ${chalk.bold.red('direktori')}`
            )
        }

        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

        for (let fileDir of recReadSync(inputDir)) {
            const fileDirJs = program.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '').replace(input, output))
                .slice(1)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            program.compile(fileDir, result => {
                console.log(
                    `${chalk.bold(
                        fileDir.replace(cwd, '').slice(1)
                    )} ${chalk.blue('➜')} ${chalk.bold.gray(jsOutputBase)}`
                )

                mkdirp.sync(path.dirname(jsOutput))

                fs.writeFileSync(jsOutput, result)
            })
        }
    })

app.command('contoh <output>')
    .description('Nggawe folder contoh menyang direktori output')
    .action(dirpath => {
        checkOption()
        program.copyExample(path.resolve(process.cwd(), dirpath), () => {
            console.log(chalk.bold.green('Rampung mass!'))
        })
    })

app.command('t <file>')
    .alias('token')
    .description('Menghasilkan token / lex (debug)')
    .action(filepath => {
        checkOption()
        program.token(program.getRealPath(filepath), token => {
            console.log(token)
        })
    })

app.command('clean')
    .description('resiki file sawentawis.')
    .action(() => {
        checkOption()
        program.clean(message => {
            console.log(message)
        })
    })

app.command('v')
    .description('cek versi')
    .alias('versi')
        .action(() => {
          console.log(
              `Versi Sajen: ${chalk.bold.gray(app.version())}, ${chalk.bold.green(
                  'sajen -h'
              )} kanggo menu bantuan.`
          )
        })

app.parse(process.argv)

if (app.args.length < 1) {
    //console.log(`versi sajen: ${chalk.bold.gray(version)}, ${chalk.bold.green('sajen -h')} kanggo menu bantuan.`)
    console.log(
        `Versi Sajen: ${chalk.bold.gray(app.version())}, ${chalk.bold.green(
            'sajen -h'
        )} kanggo menu bantuan.`
    )
}

ON_DEATH(() => {
    console.info('\n\nProses dipunkendelaken, memulihkan...')
    program.recover(
        program.getCompiledPath(),
        fs.readFileSync(global.userFilePath)
    )
})
