export function parseLyric(text) {
  let lines = text.split("\n");

  //匹配歌词前的时间
  const patternTime = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
  //返回一个数组
  const result = []

  //找到第一个符合的地方
  while (!patternTime.test(lines[0])) {
    lines = lines.slice(1)
  }
  for (const k of lines) {
    const time = k.match(patternTime)
    const lyr = k.replace(patternTime, "")
   
    if(!time)continue
    for (const t of time) {
      //去除[]
      // 格式为 ['01','13.12'] 分，秒+小数点
      const tm = t.slice(1, -1).split(":")

      //歌词不为空才添加
      if (lyr !== "") {
        result.push([parseInt(tm[0], 10) * 60 + parseFloat(tm[1]), lyr])
      }
    }
  }
  // 按时间排序
  result.sort((a, b) => a[0] - b[0])
  return result

}