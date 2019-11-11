const fs = require('fs')
const log = console.log.bind(console)

// 深拷贝函数，这种方法是存在局限的：只能拷贝对象中的数组和常规变量；
const deepClone = (obj) => {
    // 最常用的拷贝函数
    // 嵌套结构最多为3层，如果层数超过3层，则不能使用该深拷贝函数
    let x = JSON.stringify(obj)
    return JSON.parse(x)
}

/* ------------------------------------------------------------------------------------------------------------------------ */
// 数组处理函数

// 对数组list进行去重操作
const listDeduplication = (list) => {
    let result = new Set(list)
    return Array.from(result)
}

// 获取数组list中的最小值
const listMinValue = (list) => {
    let min = list[0]
    for(let i = 1, len = list.length; i < len; i++) {
        if(min < list[i]) {
            min = list[i]
        }
    }
    return min
}

// 获取数组list中的最大值
const listMaxValue = (list) => {
    let max = list[0]
    for(let i = 1, len = list.length; i < len; i++) {
        if(max > list[i]) {
            max = list[i]
        }
    }
    return max
}

// 返回数组list 排序过后的数组，judge=1表示排序顺序为升序，judge=-1时，表示排序为降序
const listSort = (list, judge=1) => {
    let result = list
    let length = result.length
    for (let i = 0; i < length; i++) {
        for (let k = i; k < length; k++) {
            if (result[i] > result[k]) {
                let temp = result[i]
                result[i] = result[k]
                result[k] = temp
            }
        }
    }
    if(judge === 1) {
        return result
    } else {
        return result.reverse()
    }
}

/* ------------------------------------------------------------------------------------------------------------------------ */

// 产生一个范围在 [min，max) 内的随机数，结果保留n位小数
const productRandomNumber = (min, max, n) => {
    return Number((Math.random() * (max - min) + min).toFixed(n))
}

// 判断对象a, b两个对象在数值上是否相等
const isObjectValueEqual = (a, b) => {
    // 如果 a, b相等，则返回 true，否则返回 false

    // Object.getOwnPropertyNames()方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组
    // 换句话来说 Object.getOwnPropertyNames()方法返回的是对象所有 key 组成的数组 list
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}

// 判断obj 对象是否存在于list数组中
const isObjectListValueEqual = (list, obj) => {
    // 判断一个对象是否存在于数组（该数组由对象所组成）中的函数
    // 如果 obj 对象存在于 list 数组中，则返回 true，否则返回 false
    for (let i = 0, len = list.length; i < len; i++) {
        if (isObjectValueEqual(list[i], obj)) {
            return true
        }
    }
    return false
}

// 判断list 数组中的对象是否重复（list中必须全为对象）
const isJudgeObjectListValueSingle = (list) => {
    // 判断一个数组（该数组由对象所组成）中每个对象是否是不重复的（值）
    // 如果 list 数组中没有重复的对象，则返回 true，否则返回 false
    let receive = list
    for (let i = 0, len = receive.length; i < len; i++) {
        let temp = receive[i]
        let aim = receive.slice(i + 1, len)
        if (isObjectListValueEqual(aim, temp)) {
            return false
        }
    }
    return true
}

// 文件写入函数，path表示写入的路径，info表示需要写入的信息
const oulaeWriteFile = (path, info) => {
    let temp = JSON.stringify(info)
    fs.writeFileSync(path, temp)
}

// 文件读取函数，path表示需要读取路径
const oulaeReadFile = (path) => {
    let options = {
        encoding: 'utf-8',
    }
    let result = fs.readFileSync(path, options)
    result = JSON.parse(result)
    return result
}

// 时延函数，该函数表示等待delayTime 秒之后，再执行下一个语句，可用于测试
const timeDelay = (delayTime) =>{
    // delayTime表示等待的时间
    let time = new Date()
    // console.log(time.getTime())
    while(true) {
        var t1 = new Date()
        if ((t1.getTime() - time.getTime()) >= Number(delayTime)) {
            // console.log(t1.getTime())
            break
        }
    }
}

/* ------------------------------------------------------------------------------------------------------------------------ */
// 时间处理的相关函数

// 时间格式转换：YY-MM-DD  转换为 时间戳
const timeChangeYYMMDDToTimestamp = (timeYYMMDD) => {
    let list = timeYYMMDD.split('-')
    // 注意这里只有月份减去1才表示的是真实的时间
    let result = {
        'year': list[0],
        'month': list[1] - 1,
        'day': (list[2] !== undefined) ? list[2] : 1,
    }
    return (new Date(result.year, result.month, result.day)).valueOf()
}

// 时间格式转换：YY-MM-DD  转换为 时间对象
const timeChangeYYMMDDToTimeobject = (timeYYMMDD) => {
    // { year: '2019', month: '03', day: '28' } 这是一个返回的例子，由于有些场合需要需要 '2019-03-28' 这种表现形式，所以直接显示这样的结果
    // 由于返回的时对象，显示界面可以根据该数据格式进行相应的调整
    let list = timeYYMMDD.split('-')
    // 注意这里只有月份减去1才表示的是真实的时间
    let result = {
        'year': list[0],
        'month': list[1],
        'day': list[2],
    }
    return result
}

// 时间格式转换：时间对象 转换为 YYMMDD
const timeChangeTimeobjectToYYMMDD = (timeObject) => {
    // 返回例子：2019-03-22
    // 这里没有设置分支选项了，因为如果仅仅只想要显示：2019-3-22的话，那么可以使用模板字符串操作
    let obj = timeObject
    let year = obj.year
    let month = obj.month < 10 ? `0${obj.month}` : `${obj.month}`
    let day = obj.day < 10 ? `0${obj.day}` : `${obj.day}`
    return `${year}-${month}-${day}`
}

// 时间格式转换：时间对象 转换为 时间戳
const timeChangeTimeobjectToTimestamp = (timeObject) => {
    let obj = timeObject
    // 特别注意：这里月份需要 - 1 才能得到正确的时间戳值
    let result = (new Date(obj.year, obj.month - 1, obj.day)).valueOf()
    return result
}

// 时间格式转换：时间戳 转换为 时间对象
const timeChangeTimestampToTimeobject = (timestamp) => {
    let obj = new Date(timestamp)
    let result = {
        year: obj.getFullYear(),
        month: obj.getMonth() + 1,
        day: obj.getDate()
    }
    return result
}

// 时间格式转换：时间戳 转换为 YYMMDD
const timeChangeTimestampToYYMMDD = (timestamp) => {
    let obj = new Date(timestamp)
    let timeObject = {
        year: obj.getFullYear(),
        month: obj.getMonth() + 1,
        day: obj.getDate()
    }
    let result = timeChangeTimeobjectToYYMMDD(timeObject)
    return result
}

// 获取当前的时间对象，返回一个object值
const timeObjectOfNow = () => {
    let t = new Date()
    let result = {
        'year': t.getFullYear(),
        'month': t.getMonth() + 1,
        'day': t.getDate(),
        'hours': t.getHours(),
        'minute': t.getMinutes(),
        'second': t.getSeconds()
    }
    return result
}

// 获取某一年月份的天数
    const monthNumberOfDays = (time) => {
        // 平年月份天数
        let averageYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        // 闰年月份天数
        let leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

        let objYear = Number(time.year)
        let objMonth = Number(time.month) - 1
        if(objYear % 100 !== 0 && objYear % 4 === 0) {
            return leapYear[objMonth]
        } else {
            return averageYear[objMonth]
        }
    }


/* ------------------------------------------------------------------------------------------------------------------------ */



const __main = () => {
    console.log(timeChangeTimestampToYYMMDD(153313920000))
}

__main()

