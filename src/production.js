const OSS = require('ali-oss');
const fs = require('fs');

// 读取package.json文件
const params = require('./package.json');

// 本地目录和上传的目录
const localCatalog = './build';
const remoteCatalog = `p/test/pepsistate/${params.version}`;


// 阿里云鉴权
let client = new OSS({
  accessKeyId: '<Your accessKeyId>',
  accessKeySecret: '<Your accessKeySecret>',
  bucket: '<Your bucket>'
})

// 上传目录与文件
async function put (localSrc, remoteSrc) {
  try {
    console.log(`============================正在上传${localCatalog}${localSrc}============================`)
    let result = await client.put(remoteSrc, localSrc)
    // console.log(result)
    console.log(`============================上传完成${remoteCatalog}${remoteSrc}============================`)
  } catch (e) {
    console.error(`============================上传异常:start============================`)
    console.error(e)
    console.error(`============================上传异常:end============================`)
  }
}

// 读取本地目录, 并上传至阿里云
async function push (localSrc, remoteSrc) {
  var files = fs.readdirSync(localSrc)
  files.forEach(file => {
    let _localSrc = localSrc + '/' + file
    let _remoteSrc = remoteSrc + '/' + file
    let st = fs.statSync( _localSrc)
    // 判断是否为文件
    if(st.isFile() && file !== '.DS_Store') {
      if (!/\.map$/.test(_localSrc)) put(_localSrc, _remoteSrc)
    }
    // 如果是目录则递归调用自身
    else if (st.isDirectory()) {
      push(_localSrc, _remoteSrc)
    }
  })
}

// 判断是否存在此目录与文件, 存在的话就上传此目录与文件
const localFiles = fs.readdirSync(localCatalog);
if (localFiles.length === 0) {
  console.error(`未找到${localCatalog}编译打包后的css或js文件，请先在根目录运行 npm run build!`);
} else {
  console.log(`============================已在本地库中找到${localCatalog}============================`)
  push(localCatalog, remoteCatalog);
}
