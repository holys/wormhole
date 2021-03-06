/*
 * <<
 * wormhole
 * ==
 * Copyright (C) 2016 - 2017 EDP
 * ==
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * >>
 */

import notification from 'antd/lib/notification'

/**
 * 美化 camelcase 字符串，例如 "showMeTheMoney" 会被转换为 "Show Me The Money"
 * @param text
 * @returns {string}
 */
export function prettyShownText (text) {
  let textArr = text.split('')
  let textBlocks = []

  cutBlocks(textArr, textBlocks)

  textBlocks = textBlocks.map(t => {
    const content = t.join('')
    return `${content.substring(0, 1).toUpperCase()}${content.substring(1)}`
  })

  return textBlocks.join(' ')

  function cutBlocks (arr, blocks) {
    let sign = 0
    for (let i = 1, al = arr.length; i < al; i += 1) {
      if (arr[i].charCodeAt(0) > 64 && arr[i].charCodeAt(0) < 91) {
        sign++
        blocks.push(arr.splice(0, i))
        cutBlocks(arr, blocks)
        break
      }
    }
    if (!sign) {
      blocks.push(arr)
    }
  }
}

/**
 * UUID生成器
 * @param len 长度 number
 * @param radix 随机数基数 number
 * @returns {string}
 */
export const uuid = (len, radix) => {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = []
  var i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    var r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

/**
 * 异常通知弹窗
 * @param err 异常内容: Error
 * @param title 弹窗标题: string
 */
export function notifyError (err, title) {
  notification.error({
    message: title,
    description: err.toString(),
    duration: null
  })
}

/**
 * sagas 异常通知
 * @param err 异常内容: Error
 * @param prefix sagas名称: string
 */
export function notifySagasError (err, prefix) {
  notifyError(err, `${prefix} sagas or reducer 异常`)
}

/**
 *  JSON 格式校验
 *  如果JSON.parse能转换成功；并且字符串中包含 { 时，那么该字符串就是JSON格式的字符串。
   *  另：str 可为空
   */
export function isJSON (str) {
  if (typeof str === 'string') {
    if (str === '') {
      return true
    } else {
      try {
        JSON.parse(str)
        if (str.indexOf('{') > -1) {
          return true
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    }
  }
  return false
}

export function isJSONNotEmpty (str) {
  if (typeof str === 'string') {
    try {
      JSON.parse(str)
      if (str.indexOf('{') > -1) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
  return false
}

/**
 * flow transformation: sql语句可能出现双引号，从而影响Json对象解析，将双引号转义
 * @param sql
 */
export function preProcessSql (sql) {
  const doubleQuotationRegex = new RegExp('\\"{1}', 'g')
  let result
  if (sql.indexOf('\\') > -1) {
    result = sql
  } else {
    result = sql.replace(doubleQuotationRegex, '\\"')
  }
  return result
}

/**
 * 判断两个对象的值是否相等
 */
export function isEquivalent (a, b) {
  // 获取对象属性的所有的键
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)

  // 如果键的数量不同，那么两个对象内容也不同
  if (aProps.length !== bProps.length) {
    return false
  }

  for (let i = 0, len = aProps.length; i < len; i++) {
    var propName = aProps[i]

    // 如果对应的值不同，那么对象内容也不同
    if (a[propName] !== b[propName]) {
      return false
    }
  }
  return true
}

/**
 * 时间格式 YYYYMMDDHHmmss 转换成 YYYY-MM-DD HH:mm:ss, 再转成 YYYY/MM/DD HH:mm:ss
 */
export function formatString (dateString) {
  let dateTemp = ''

  dateTemp += `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)} ${dateString.slice(8, 10)}:${dateString.slice(10, 12)}:${dateString.slice(12)}`

  dateTemp = dateTemp.replace(new RegExp('-', 'gm'), '/')
  const dateTempHaoMiao = (new Date(dateTemp)).getTime()
  return dateTempHaoMiao
}

