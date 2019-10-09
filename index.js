let fs = require("fs")

function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

function fsExistsSync(path) {
  try{
    fs.accessSync(path,fs.F_OK);
  }catch(e){
    return false;
  }
  return true;
}

const SquirrelZooBuildPlugin = {
  apply:()=>{
    let json = fs.readFileSync('package.json','utf-8')
    const pj = JSON.parse(json)


    process.env.VUE_APP_BUILD_TIME = parseTime(new Date())
    process.env.VUE_APP_BUILD_VER = pj.version
    process.env.VUE_APP_BUILD_REPO_VER = ''
// 当前脚本的工作目录的路径
    let cwd = '"' + process.cwd() + '"'; // process-node全局模块用来与当前进程互动，可以通过全局变量process访问，不必使用require命令加载。它是一个EventEmitter对象的实例。process.cwd()表示返回运行当前脚本的工作目录的路径

// 获取git版本,这里还可以模式来区分
    const gitPath = '.git'
    let gitHEAD = fs.readFileSync(gitPath+'/HEAD', 'utf-8').trim() // ref: refs/heads/develop
    let ref = gitHEAD.split(': ')[1] // refs/heads/develop
    let gitVersion = ''
    let branch = gitHEAD.replace('ref: refs/heads/','') // 环境：develop
    if (fsExistsSync(gitPath+'/'+ref)) {
      gitVersion = fs.readFileSync(gitPath+'/' + ref, 'utf-8').trim() // git版本号，例如：6ceb0ab5059d01fd444cf4e78467cc2dd1184a66
      let gitCommitVersion = branch + ': ' + gitVersion  // 例如dev环境: "develop: 6ceb0ab5059d01fd444cf4e78467cc2dd1184a66"
      process.env.VUE_APP_BUILD_REPO_VER = gitCommitVersion
    }

    console.log('--------------------------------------------------------------')
    console.log('|                        BUILD INFO                          |')
    console.log('--------------------------------------------------------------')
    console.log('                       _                __')
    console.log('     _________ ___  __(_)____________  / /')
    console.log('    / ___/ __ `/ / / / / ___/ ___/ _ \\/ / ')
    console.log('   (__  ) /_/ / /_/ / / /  / /  /  __/ /  ')
    console.log('  /____/\\__, /\\__,_/_/_/  /_/   \\___/_/   ')
    console.log('    ____  _///  ____                       ')
    console.log('   /_  / / __ \\/ __ \\                      ')
    console.log('    / /_/ /_/ / /_/ /                      ')
    console.log('   /___/\\____/\\____/      ')
    console.log('')
    console.log('  official site : https://squirrelzoo.com')
    console.log('  docs address  : https://www.squirrelzoo.com/archives/1283')
    console.log('  version       : '+pj.devDependencies["vue-cli-plugin-pumelo-tea"])
    console.log('--------------------------------------------------------------')
    console.log('| project name     |', pj.name)
    console.log('| building branch  |', branch)
    console.log('| building time    |', process.env.VUE_APP_BUILD_TIME)
    console.log('| building version |', process.env.VUE_APP_BUILD_VER)
    console.log('| repo hash        |', gitVersion)
    console.log('| dependencies     |', Object.keys(pj.dependencies).length)
    console.log('--------------------------------------------------------------')

  }
}
module.exports = SquirrelZooBuildPlugin
