import XLSX from 'xlsx'

/**
 *
 * https://github.com/SheetJS/sheetjs
 * cols=[
 *      {
 *          title:'标题',
 *          field:'name',
 *          width:4,
 *          comment:'列注释',
 *          validate:{
 *              required:true,//必填
 *              len:10,//长度为10
 *              max:20,//长度不超20
 *              regexp:/\d+/,//正则表达式
 *              regexpMsg:'必须是数字'//正则表达式提示
 *          },
 *          style:{
     *          font: {
                      name: '宋体',
                      sz: 24,
                      bold: true,
                      color: { rgb: "FFFFAA00" }
                    },
                alignment: { horizontal: "center", vertical: "center", wrap_text: true },
                border: {
                    right: { style: 'thick', color: { auto: 1 } },
                    top: { style: 'thick', color: { auto: 1 } },
                    bottom: { style: 'thick', color: { auto: 1 } }
                },
                fill: { fgColor: { rgb: "ff6600" } }
            }
 *      }
 * ]
 * @type {{import(*=, *=): Promise<unknown>, regexpRules: {chinese: RegExp, phone: RegExp, idCard: RegExp, int: RegExp, email: RegExp}, export(*, *=, *=): void}}
 */
const excel = {
  export(cols, data = [], config) {
    const p = {
      bookName: new Date().getTime() + '.xlsx',
      sheetName: 'sheet1',
      author: 'SheetJs',
      dateNF: 'yyyy/m/d h:m:s',
      cellDates: false,
      skipHeader: false,
      origin: undefined
    }
    Object.assign(p, config)
    const wb = XLSX.utils.book_new()
    const widthArr = []
    const tableHead = {}
    const header = cols.map((c, index) => {
      widthArr.push({ wch: c.width ? c.width : c.width || (c.title ? Math.max(c.title.length, 4) * 2 : 8) })
      const pha = excel.util.colAlpha(index)
      tableHead[pha + '1'] = {
        t: 's',
        v: c.title,
        c: c.comment ? [{ a: p.author, t: c.comment }] : undefined
      }// 改表头
      tableHead[pha + '1'].c && (tableHead[pha + '1'].c.hidden = true)
      return c.field
    })
    p.header = header
    const newData = filterFields(cols, data)
    const sheet = XLSX.utils.json_to_sheet(newData, p)
    sheet['!cols'] = widthArr
    Object.assign(sheet, tableHead)
    XLSX.utils.book_append_sheet(wb, sheet, p.sheetName)
    XLSX.writeFile(wb, p.bookName)
  },
  import(cols, config) {
    return new Promise((resolve, reject) => {
      const p = {
        bookSize: 10,
        validate: true,
        raw: true,
        range: undefined,
        header: undefined,
        dateNF: 'yyyy/m/d h:m:s', // Use specified date format in string output
        defval: undefined, // Use specified value in place of null or undefined
        blankrows: undefined // Include blank lines in the output **

      }
      Object.assign(p, config)
      // 打开文件选择框
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.style.display = 'none'
      fileInput.name = 'file'
      document.body.append(fileInput)
      fileInput.onchange = (e) => {
        const file = fileInput.files[0]
        const ext = file.name.substring(file.name.lastIndexOf('.'), file.name.length).toLowerCase()
        if (ext === '.xls' || ext === '.xlsx') {
          if (file.size > p.bookSize * 1024 * 1024) {
            alert('文档大小请控制在10MB以内')
            return
          }
        } else {
          alert('请选择excel文档')
          return
        }
        const reader = new FileReader()
        reader.onload = e => {
          const d = new Uint8Array(e.target.result)
          const workbook = XLSX.read(d, { type: 'array', cellDates: false })
          const sheet = workbook.Sheets[workbook.SheetNames[0]]
          const tableHead = {}
          cols.forEach((c, index) => {
            tableHead[excel.util.colAlpha(index) + '1'] = { t: 's', v: c.field, h: c.field, w: c.field }// 改表头为英文
          })
          Object.assign(sheet, tableHead)
          const data = XLSX.utils.sheet_to_json(sheet, p)
          // const data2 = []
          // data.forEach(r => {
          //   const cn = r.carNo.split('/')
          //   if (cn.length > 1) {
          //     cn.forEach(c => {
          //       const a = Object.assign({}, r)
          //       a.carNo = c
          //       data2.push(a)
          //     })
          //   } else {
          //     data2.push(r)
          //   }
          // })
          // console.log(data2, 'data2=')
          let newData = filterFields(cols, data)
          console.log(newData, data, 'newData')
          if (p.rowStart) {
            newData = newData.slice(p.rowStart)
          }
          if (p.validate) {
            const codes = validate(newData, cols)
            if (codes.length === 0) {
              resolve({ newData, fileName: file.name })
            } else {
              reject({ codes, newData })
            }
          } else {
            resolve({ newData, fileName: file.name })
          }
        }
        reader.readAsArrayBuffer(file)
        fileInput.value = ''
      }
      fileInput.click()
      fileInput.parentNode.removeChild(fileInput)
    })
  },
  util: {
    colAlpha(n) {
      const ordA = 'A'.charCodeAt(0)
      const ordZ = 'Z'.charCodeAt(0)
      const len = ordZ - ordA + 1
      let s = ''
      while (n >= 0) {
        s = String.fromCharCode(n % len + ordA) + s
        n = Math.floor(n / len) - 1
      }
      return s
    }
  },
  regexpRules: {
    int: /^[0-9]*$/,
    chinese: /^[\u4e00-\u9fa5]{0,}$/,
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    phone: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
    idCard: /^\d{15}|\d{18}$/

  }
}
/*
过滤掉不在cols里的字段
 */
function filterFields(cols, data) {
  const arr = []
  if (!cols || cols.length === 0) {
    return arr
  }
  data.forEach(d => {
    const obj = {}
    cols.forEach(col => {
      obj[col.field] = d[col.field]
    })
    arr.push(obj)
  })
  return arr
}
/**
 *  验证表格数据
 * @param data 表格数据
 * @param cols 列数组
 * @returns [{msg:'',position:'A1'}]
 */
function validate(data, cols) {
  const codes = []
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    for (let j = 0; j < cols.length; j++) {
      const col = cols[j]
      if (col.validate) {
        const r = validateField(i, j, row[col.field], col.validate, col.title)
        if (r !== true) {
          codes.push(r)
        }
      }
    }
  }
  return codes
}

/**
 *  单元格验证
 *  @param r 行号
 *  @param c 列号
 * @param value 单元格数值
 * @param rule 验证规则对象{required:true,max:10,regexp://}
 * @param title 头中文字段
 */
function validateField(r, c, value, rule, title) {
  const colAl = excel.util.colAlpha(c)
  const rowNum = r + 2
  if (rule.required) {
    if (value === undefined) {
      return { msg: `${title}不能为空`, position: colAl + (rowNum) }
    }
    if (!value.toString().trim()) {
      return { msg: `${title}不能为空`, position: colAl + (rowNum) }
    }
  }
  if (rule.max && value.toString().length > rule.max) {
    return { msg: `${title}长度超过了${rule.max}`, position: colAl + (rowNum) }
  }
  if (rule.len && value.toString().length !== rule.len) {
    return { msg: `${title}长度必须是${rule.len}`, position: colAl + (rowNum) }
  }
  if (rule.regexp && !rule.regexp.test(value.toString())) {
    return { msg: `${title},` + rule.regexpMsg, position: colAl + (rowNum) }
  }
  return true
}

export default excel
