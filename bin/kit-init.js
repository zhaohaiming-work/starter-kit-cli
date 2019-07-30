#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const ora = require('ora')
const download = require('download-git-repo')
const tplObj = require(`${__dirname}/../template`)
// console.log(tplObj.templateName)
program
  .usage('<project-name> [project type]')
program.parse(process.argv)
// 当没有输入参数的时候给个提示
if (program.args.length < 1) return program.help()
// 获取第一个参数
let projectName = program.args[0]
let type = program.args[1]
// console.log(program.args)
// 小小校验一下参数
if (!projectName) {
  console.log(chalk.red('\n Project should not be empty! \n '))
  return
}
if (type !== 'pc' && type !== 'mobile') {
  console.log(chalk.red('\n Project should named types  ( pc or mobile )! \n '))
  return
}
console.log(chalk.white('\n Start generating... \n'))
const url = type === 'pc' ? tplObj.tmplPcUrl : tplObj.tmplMobileUrl
// 出现加载图标
const spinner = ora('Downloading...');
spinner.start();
// 执行下载方法并传入参数
const downloadTmpl = new Promise((res, rej) => {
  download(
    `direct:${url}`,
    projectName,
    { clone: true },
    err => err ? rej(err) : res()
  )
})
downloadTmpl.then(() => {
  // 结束加载图标
  spinner.succeed();
  console.log(chalk.green('\n Generation completed!'))
  console.log('\n To get started')
  console.log(`\n    cd ${projectName} \n`)
  console.log(`\n    yarn/npm install \n`)
  console.log(`\n    yarn/npm start \n`)
})
  .catch(err => {
    spinner.fail();
    console.log(chalk.red(`Generation failed. ${err}`))
  })