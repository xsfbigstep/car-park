/**
 * 处理从 Excel 单元格中读取到的日期格式的字段并转换为指定格式的日期字符串
 *
 * @param {string|number} date 从 Excel 单元格中读取到的日期格式
 * @param {string} fmt 要转换为的格式，默认 yyy-MM-dd HH:mm:ss
 */
import moment from 'moment'
export function handleDate(date, fmt) {
  if (!date) {
    return date
  }
  date = date.trim ? date.trim() : date
  if (/^[\d.]+$/.test(date)) {
    const dateNum = parseFloat(date)
    // 大于 1000 万说明是一个毫秒数，直接解析并转换为指定格式即可
    if (dateNum > 10000000) {
      return formatDate(dateNum, fmt)
    }
    // 否则认为这个是一个 Excel 格式的日期
    date = formatExcelDate(dateNum, fmt)
    console.log(date, typeof (date), dateNum)
  } else {
    // 处理中文冒号，和 yyyy/MM/dd 格式的问题
    date = date.replace(/：/g, ':').replace(/\//g, '-')
  }
  // 将不规则的格式，例如 "2020-1-1     1:3:3" 转换成 yyyy-MM-dd HH:mm:ss
  // 再转为 Date 对象进行指定的格式化
  console.log(date)
  const dtPars = date.split(/\s+/g)
  const dPars = dtPars[0].split('-')
  dPars[1] = padding2(dPars[1])
  dPars[2] = padding2(dPars[2])
  dtPars[0] = dPars.join('-')
  if (!dtPars[1]) {
    dtPars[1] = '00:00:00'
  } else {
    const tPars = dtPars[1].split(':')
    tPars[0] = padding2(tPars[0])
    // 支持分缺失
    tPars[1] = padding2(tPars[1] || '00')
    // 支持秒缺失
    tPars[2] = padding2(tPars[2] || '00')
    dtPars[1] = tPars.join(':')
  }
  return formatDate(new Date(dtPars.join(' ')), fmt)
}

/**
 * 缺位补0
 */
function padding2(part) {
  if (part.length === 1) {
    return '0' + part
  } else {
    return part
  }
}

/**
 * 解析xlsl日期
 */
export function getFormatDate_XLSX(serial, fmt) {
  var utc_days = Math.floor(serial - 25569)
  var utc_value = utc_days * 86400
  var date_info = new Date(utc_value * 1000)
  var fractional_day = serial - Math.floor(serial) + 0.0000001
  var total_seconds = Math.floor(86400 * fractional_day)
  var seconds = total_seconds % 60
  total_seconds -= seconds
  var hours = Math.floor(total_seconds / (60 * 60))
  var minutes = Math.floor(total_seconds / 60) % 60
  var d = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds)
  /* //得到Date()对象后，便可进行日期格式化了！
  var add0 = (m) => m < 10 ? '0' + m : m;
  var d = getFormatDate_XLSX(44358.9999884259);
  var YYYY = d.getFullYear();
  var MM = add0(d.getMonth() + 1);
  var DD = add0(d.getDate());
  var hh = add0(d.getHours());
  var mm = add0(d.getMinutes());
  var ss = add0(d.getSeconds());
  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
  */
  console.log(11, d)
  return moment(d).format(fmt)
}

/**
 * 解析Excel表达的日期数字，并转换为指定格式的日期字符串
 *
 * @param {number} numb Excel解析出的数字形式的日期
 * @param {string} format 要转换为的格式，默认 yyy-MM-dd HH:mm:ss
 */
function formatExcelDate(numb, format) {
  const time = new Date((numb - 2) * 24 * 3600000 + 1)
  time.setYear(time.getFullYear() - 70)
  time.setHours(time.getHours() - 8)
  return formatDate(time, format)
}

/**
 * 日期格式转换
 *
 * @param {date|number} date 日期
 * @param {string} fmt 要转换为的格式，默认 yyy-MM-dd HH:mm:ss
 */
function formatDate(date, fmt) {
  date = date === undefined ? new Date() : date
  date = typeof date === 'number' ? new Date(date) : date
  fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
  const obj =
  {
    'y': date.getFullYear(), // 年份，注意必须用getFullYear
    'M': date.getMonth() + 1, // 月份，注意是从0-11
    'd': date.getDate(), // 日期
    'q': Math.floor((date.getMonth() + 3) / 3), // 季度
    'w': date.getDay(), // 星期，注意是0-6
    'H': date.getHours(), // 24小时制
    'h': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
    'm': date.getMinutes(), // 分钟
    's': date.getSeconds(), // 秒
    'S': date.getMilliseconds() // 毫秒
  }
  const week = ['天', '一', '二', '三', '四', '五', '六']
  for (const i in obj) {
    fmt = fmt.replace(new RegExp(i + '+', 'g'), function(m) {
      let val = obj[i] + ''
      if (i === 'w') return (m.length > 2 ? '星期' : '周') + week[val]
      for (let j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
      return m.length === 1 ? val : val.substring(val.length - m.length)
    })
  }
  return fmt
}
