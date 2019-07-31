#!/usr/bin/env node
const program = require('commander')
const inquirer = require('inquirer')
const fs = require('fs') // 引入fs模块
const path = require('path')
const chalk = require('chalk')
const ora = require('ora')

program
  .usage('<project-name> [project type]')
program.parse(process.argv)

const question = [
  {
    name: 'name',
    message: '请输入要删除的文件目录名称',
    validate(val) {
      if (val === '') {
        return 'Name is required!'
      } else {
        return true
      }
    }
  }, {
    name: 'del',
    message: '确定要删除吗？(y/n)',
    validate(val) {
      if (val === 'y' || val === '') {
        return true
      }
      process.exit()
    }
  }
]
const spinner = ora('正在删除...')
const deleteall = url => {
  let files = []
  if (fs.existsSync(url)) {
    files = fs.readdirSync(url)
    files.forEach((file, index) => {
      const curPath = path.resolve(url, file)
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteall(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(url)
    console.log(chalk.green(`删除${url}目录成功`))
  } else {
    spinner.fail()
    console.log(chalk.red('文件夹不存在!'))
  }
}

inquirer
  .prompt(question)
  .then(answers => {
    const { name, del } = answers
    const url = path.resolve(process.cwd(), name);
    // console.log(url);
    (del === 'y' || del === '') && deleteall(url)
  })