// 定义log函数
const log = console.log.bind(console)

const TYPE = {
    "[object Number]": 1,
    "[object String]": 2,
    "[object Null]": 3,
    "[object Boolean]": 4,
    "character": 5,
    "escapeCharater": 6
}

const includeEscapeCharacter = function(str) {
    let asciiEscape = [0, 39, 34, 92, 10, 13, 11, 9, 8, 12]
    for (let i = 0, len = str.length; i < len; i++) {
        let temp = str[i].charCodeAt(0)
        if (asciiEscape.indexOf(temp) !== -1) {
            return true
        }
    }
    return false
}

const getType = function (value) {
    if (value === ':' || value === '{' || value === '}' || value === '[' || value === ']') {
        return 5
    }
    if (includeEscapeCharacter(value)) {
        return 6
    }
    let type = Object.prototype.toString.apply(value)
    return TYPE[type]
}

class JsonValue {
    constructor(value) {
        this.value = String(value)
        this.type = getType(value)
    }

    toString() {
        if (this.type === 1) {
            return Number(this.value)
        } else if (this.type === 2) {
            return String(this.value)
        } else if (this.type === 3) {
            return null
        } else if (this.type === 4) {
            return this.value === 'true'
        } else if (this.type === 5) {
            return String(this.value)
        } else if (this.type === 6) {
            return dealEscape(this.value)
        }
    }
}

// 判断两个对象是否相等的函数
const objectEquals = (a, b) => {
    // 如果 a, b相等，则返回 true，否则返回 false

    // Object.getOwnPropertyNames()方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组
    // 换句话来说 Object.getOwnPropertyNames()方法返回的是对象所有 key 组成的数组 list
    var aProps = Object.getOwnPropertyNames(a)
    var bProps = Object.getOwnPropertyNames(b)
    if (aProps.length != bProps.length) {
        return false
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i]
        if (typeof a[propName] === 'object') {
            let judge = objectEquals(a[propName], b[propName])
            if (!judge) {
                return false
            }
        } else if (a[propName] !== b[propName]) {
            return false
        }
    }
    return true
}

// 判断 str字符是否是数组，如果是则返回true，否则返回false
const isNumber = (str) => {
    let string = String(str)
    let judge = string.charCodeAt(0)
    return (judge > 47 && judge < 58)
}

// 判断 str字符是否是字符串，如果是则返回true，否则返回false
const isString = (str) => {
    let string = String(str)
    let judge = string.charCodeAt(0)
    return (judge > 64 && judge < 91) || (judge > 96 && judge < 123)
}

// 判断一个对象是否是数组的函数
const isArray = s => Object.prototype.toString.call(s) === '[object Array]'

const isBoolean = s => Object.prototype.toString.call(s) === '[object Boolean]'

// 返回对象 '{' 对应的 '}'，返回数组 '[' 对应的 ']'
const getAimIndex = (string, index) => {
    let str = string
    // breakStr是结束判断字符
    let startStr = str[index].value
    let breakStr = startStr === '{' ? '}' : ']'
    let judgeNum = 0
    /*
    判断逻辑：
        1. 遍历从 i = 1 开始
        2. if temp = '{' || '[', judgeNum++
        3. if temp = '}' || ']', judgeNum--
        4. if temp = '}' || ']' && judgeNum === 1, return i
     */
    for (let i = index, len = str.length; i < len; i++) {
        let temp = str[i].value
        if (temp === startStr) {
            judgeNum++
        } else if (temp === breakStr && judgeNum !== 1) {
            judgeNum--
        } else if (temp === breakStr && judgeNum === 1) {
            return i
        }
    }
    // log('judgeNum: ', judgeNum)
}

// 将一个数组tokens解析成为一个数组对象
const conversionObj = (array) => {
    let result = []
    let list = array
    for (let i = 0, len = list.length; i < len;) {
        let temp = list[i].value
        if (temp === '[') {
            let nextIndex = getAimIndex(list, i)
            let sliceList = array.slice(i + 1, nextIndex)
            result.push(conversionObj(sliceList))
            i = nextIndex + 1
        } else if (temp === '{') {
            let nextIndex = getAimIndex(list, i)
            let sliceList = array.slice(i + 1, nextIndex)
            result.push(parsedDict(sliceList))
            i = nextIndex + 1
        } else {
            result.push(list[i].toString())
            i++
        }
    }
    // log(result)
    return result
}

// 获取key-value对的value值
const getTokensValue = (index, array) => {
    let judge = array[index].value
    if (judge === '{') {
        let nextIndex = getAimIndex(array, index)
        let sliceList = array.slice(index + 1, nextIndex)
        return parsedDict(sliceList)
    } else if (judge === '[') {
        let nextIndex = getAimIndex(array, index)
        let sliceList = array.slice(index + 1, nextIndex)
        return conversionObj(sliceList)
    } else {
        return array[index].toString()
    }
}

// 返回一个数/字符串的最末尾index
const findEndIndex = (start, string) => {
    for (let i = start, len = string.length; i < len; i++) {
        let temp = string[i]
        let judge1 = (temp === ':' || temp === ',' || temp === '\n' || temp === ']' || temp === '"')
        // let judge1 = temp === '"'
        let judge2 = (string[i - 1] !== '\\')
        if (judge1 && judge2) {
            return i
        }
    }
}

// 将JSON字符串解析成为数组的形式
const jsonTokens = (s) => {
    // 把 json 字符串解析成 tokens 数组的形式
    // 思路：
    // 1. 遍历字符串, 根据不同情况 push 不同元素到数组中
    // 2. 如果遇到的是 ", 按照字符串来处理
    // 3. 如果遇到的是数字, 按照数值来处理
    // 4. 如果遇到 '{', '}', '[', ']', ':', ',' 这几个字符, 直接 push 到数组中
    // 5. 如果遇到空白字符, 如换行, 空格, 缩进等, 直接跳过
    let string = s
    let result = []
    let i = 0
    let len = string.length
    while (i < len) {
        let temp = string[i]
        if (temp === '{' || temp === '}' || temp === '[' || temp === ']' || temp === ':') {
            // result.push(temp)
            result.push(new JsonValue(temp))
            i++
        } else if (isString(temp) || temp === '-') {
            let start = i
            let end = findEndIndex(start, string, isString)
            let tempStr = string.slice(start, end)
            if (tempStr !== 'true' && string[i - 1] !== '"') {
                tempStr = Number(tempStr)
            } else if (tempStr === 'true' && string[i - 1] !== '"') {
                tempStr = true
            } else if (tempStr === 'false' && string[i - 1] !== '"') {
                tempStr = false
            }
            log('tempStr: ', String(tempStr))
            result.push(new JsonValue(tempStr))
            i = end
        } else if (isNumber(temp)) {
            let start = i
            let end = findEndIndex(start, string, isNumber)
            let tempStr = string.slice(start, end)
            // result.push(tempStr)
            tempStr = string[i - 1] === '"' ? tempStr : Number(tempStr)
            result.push(new JsonValue(tempStr))
            i = end
        } else {
            i++
        }
    }
    return result
}

// 处理存在转义字符时的字符串
// 特别注意，转义字符必须使用这种方式添加才有效
const dealEscape = (str) => {
    let escape = {
        b: `\b`,
        f: '\f',
        n: '\n',
        r: '\r',
        t: '\t',
        '\\': '\\',
        '\/': '\/',
        '\"': '\"',
        "\'": "\'"
    }
    let result = ''
    let string = str
    let i = 0
    let len = string.length
    // log(str)
    while (i < len) {
        let temp = string[i]
        if (temp === '\\') {
            let endIndex = i + 1
            result += escape[string[endIndex]]
            i = endIndex + 1
        } else {
            result += temp
            i++
        }
    }
    return result
}

// tokens 是一个包含部分 JSON object tokens 的数组
// 解析 tokens, 返回解析后的 object
const parsedDict = (tokens) => {

    /*
    解题思路：
        1.先找出所有'：'符号的下标
        2.'：'左边是key，右边是value,
            key的算法：list[i - 1] 因为key只能是字符串或者数字，所以只会出现在数组的前一项
            value的算法：因为一个object的值可能有许多种情况(这里其实还要考虑嵌套的问题)
                if (list[i + 1] !== '[' || list[i + 1] !== '{') { value = list[i + 1] }
                if (list[i + 1] === '[') 找到下一个']'的坐标，并将其中的值添加到数组Array，则value = Array
                if (list[i + 1] === '{') 找到下一个'}'的坐标，并将其中的值添加到对象Object,则value = Object
     */
    let list = tokens
    let result = {}
    let i = 0
    let len = list.length
    while (i < len) {
        let temp = list[i].value
        if (temp === ':') {
            let key = list[i - 1]
            let value = getTokensValue(i + 1, list)
            // log('200value: ', value)
            result[key.toString()] = value
            // log('add after result: ', result)
            // 在这里要计算i变化过后的值
            if (list[i + 1].value === '{' || list[i + 1].value === '[') {
                let endIndex = getAimIndex(list, i + 1)
                i = endIndex
                continue
            }
        }
        i++
    }
    // log('result: ', result)
    return result
}

const parse = (s) => {
    // s 是一个 JSON 格式的字符串
    // 解析 s, 返回相应的 JSON 对象格式
    // 1. 数字需要考虑负数和小数
    // 2. 字符串需要考虑转义字符
    // 3. 考虑嵌套数组和对象
    // 4. 需要加上布尔值和 null

    // 解析的具体思路：
    /*
       1.将JSON 格式的字符串转换成为token数组
       2.将token数组转换成为obj对象（此时obj对象所有值均为String类型）
       3.将obj对象的值作处理，得到最终的结果
     */

    let list = jsonTokens(s)
    log(list)
    let obj = parsedDict(list)
    // log(obj)
    return obj
    // return recursiveParse(obj)
}

const __main = () => {
    let s3 = String.raw `{
    "arr1": [1, 2, 3],
    "obj": {
        "arr2": [4, 5, 6],
        "obj2": {
            "key1": [7, 10.3]
        }
    },
    "obj2": [
        {
            "a": 1
        },
        {
            "a": 2
        }
    ],
    "boolean": true,
    "null": "null",
    "s1": "gua",
    "s2": "a\bb\fc\nd\re\tf\\g\/h\"i",
    "s3": -1
}`
    let test = String.raw `{
    "s2": "a\bb\fc\nd\re\tf\\g\/g\"i"
    }`
    // let a = JSON.parse(s3)
    // log('a: ', JSON.stringify(a))
    let b = parse(test)
    // log(b)
    // log('b: ', JSON.stringify(b))
    // log('a对象和b对象是否相等：', objectEquals(a, b))

}

__main()