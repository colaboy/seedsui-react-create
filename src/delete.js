const OSS = require('ali-oss');

// 读取package.json文件
const params = require('./package.json');

// 需要删除的远程目录, process.argv[2]为输入的参数
const remoteCatalog = `p/test/pepsistate/${process.argv[2] || params.version}`;

// 阿里云鉴权
let client = new OSS({
  accessKeyId: '<Your accessKeyId>',
  accessKeySecret: '<Your accessKeySecret>',
  bucket: '<Your bucket>'
})

// 删除文件
async function deleteFile (file) {
  try {
    console.log(`============================正在删除${file}============================`)
    let result = await client.delete(`${file}`);
    // console.log(result)
    console.log(`============================删除完成${file}============================`)
  } catch (e) {
    console.error(`============================删除异常:start============================`)
    console.error(e)
    console.error(`============================删除异常:end============================`)
  }
}

// 删除所有文件
async function push(dir) {
  let result = await client.list({
    prefix: dir,
    delimiter: '/'
  });
  if (result.objects) {
    result.objects.forEach((obj) => {
      deleteFile(obj.name);
      return obj.name
    });
  }
  if (result.prefixes) {
    result.prefixes.forEach((prefixe) => {
      push(prefixe);
    });
  }
}
push(remoteCatalog + '/')
