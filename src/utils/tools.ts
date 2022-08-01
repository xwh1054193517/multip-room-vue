//解析歌词
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

    if (!time) continue
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


// 格式化时间
export const formatTime = date => {
  date = new Date(date).getTime();
  const autoZero = n => (String(n).length === 1 ? '0' : '') + n;
  const oriSecond = date / 1000;
  const curSecond = parseInt((new Date().getTime() / 1000).toString());
  const diffSecond = curSecond - oriSecond;
  const curDate = new Date(curSecond * 1000);
  const oriDate = new Date(oriSecond * 1000);
  const Y = oriDate.getFullYear();
  const m = oriDate.getMonth() + 1;
  const d = oriDate.getDate();
  const H = oriDate.getHours();
  const i = oriDate.getMinutes();
  // just
  if (diffSecond < 60) {
    // within a minute
    return '刚刚';
  }
  if (diffSecond < 3600) {
    // within an hour
    return `${Math.floor(diffSecond / 60)}分钟前`;
  }
  if (curDate.getFullYear() === Y && curDate.getMonth() + 1 === m && curDate.getDate() === d) {
    return `今天${autoZero(H)}:${autoZero(i)}`;
  }
  // yesterday
  const mewDate = new Date((curSecond - 86400) * 1000);
  if (mewDate.getFullYear() === Y && mewDate.getMonth() + 1 === m && mewDate.getDate() === d) {
    return `昨天${autoZero(H)}:${autoZero(i)}`;
  }
  if (curDate.getFullYear() === Y) {
    return `${autoZero(m)}月${autoZero(d)}日`;
  }
  return `${Y}年${autoZero(m)}月${autoZero(d)}日`;
};


