const COS = require("cos-js-sdk-v5");
var cos = new COS({
  // 必选参数
  SecretId: process.env.VUE_APP_SECRETID,
  SecretKey: process.env.VUE_APP_SECRETKEY,
  // 可选参数
  FileParallelLimit: 3, // 控制文件上传并发数
  ChunkParallelLimit: 8, // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
  ChunkSize: 1024 * 1024 * 8, // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
  Proxy: '',
  Protocol: 'http:',
  FollowRedirect: false,
});
const allowImg = ['png', 'jpg', 'gif', 'jpeg']
export async function putFile(files, prefix: string) {
  //单文件
  const { name, orgfile, type, size } = files
  const key = allowImg.includes(type) ? `${prefix}/${new Date().getTime()}-${name}` : `${prefix}/${name}`
  return new Promise((resolve, reject) => {
    cos.putObject({
      Bucket: process.env.VUE_APP_BUCKET,
      Region: process.env.VUE_APP_REGION,
      Key: key,
      Body: orgfile, // 上传文件对象
      Sign: true,
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          data: data,
          errorCode: data.statusCode,
          url: 'http://' + data.Location,
        })
      }
    })
  })
}

export async function getFile(name, prefix) {
  return new Promise((resolve, reject) => {
    cos.getObjectUrl({
      Bucket: process.env.VUE_APP_BUCKET,
      Region: process.env.VUE_APP_REGION,
      Key: `${prefix}/${name}`,
    }, function (err, data) {
      if (err) { reject(err); }
      else {
        const downloadUrl = data.Url + (data.Url.indexOf('?') > -1 ? '&' : '?') + 'response-content-disposition=attachment'; // 补充强制下载的参数
        // （推荐使用window.open()方式）这里是新窗口打开 url，如果需要在当前窗口打开，可以使用隐藏的 iframe 下载，或使用 a 标签 download 属性协助下载
        resolve(downloadUrl)
      }
    });
  })
}