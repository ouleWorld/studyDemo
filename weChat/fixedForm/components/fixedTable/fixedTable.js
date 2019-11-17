// components/table.js
const getSumForList = (list) => {
  let array = list
  let result = 0
  for(let i = 0, arrayLen = array.length; i < arrayLen; i++) {
    // console.log(array[i])
    result += Number(array[i])
  }
  return result
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    table: { //传入数据源
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        //属性被设置的时候触发
        this.setData({
          table: newVal ? newVal : [],
        })
        //console.log('table', this.data.table);
      }
    },
    fixedColsNum: { //固定的列数（竖方向）
      type: [Number, String], //可传入数字和数字字符
      value: 1,
      observer: function (newVal, oldVal) {
        //属性被设置的时候触发
        this.setData({
          fixedColsNum: newVal ? newVal : 1,
        })
        //console.log('fixedColsNum', this.data.fixedColsNum);
      }
    },
    fixedRowsNum: { //固定的行数（横方向上）
      type: [Number, String], //可传入数字和数字字符
      value: 1,
      observer: function (newVal, oldVal) {
        //属性被设置的时候触发
        this.setData({
          fixedRowsNum: newVal ? newVal : 1,
        })
        //console.log('fixedColsNum', this.data.fixedColsNum);
      }
    },
    showColsNumber: {
      type: [Number, String], //可传入数字和数字字符
      value: 5,
      observer: function (newVal, oldVal) {
        //属性被设置的时候触发
        this.setData({
          showColsNumber: newVal ? newVal : 5,
        })
        //console.log('fixedColsNum', this.data.fixedColsNum);
      }
    },
    tbodyHeight: { //表体高度（内部没有使用，所以不用定义到私有）
      type: [Number, String],
      value: 504,
    }
  },

  /**
   * 组件的私有数据，可用于模板渲染
   */
  data: {
    table: [], //数据源，外部传入
    fixedColsNum: 1, //固定的列（数目），可外部传入
    fixedRowsNum: 1, //固定的行（数目），可外部传入

    colWidths: [], //所有单元格的宽度
    scrollTop: 0, //记录滚动位置
    totalWidth: 0, //根据colWidths获取的总长度
    fixedCols: [], //竖方向都要固定的左上角单元格
    fiedRows: [], //横竖方向上都要固定在左上角的单元格
    firstColsOther: [], //固定列（除表头）
    thead: [], //固定表头（完整）
    tbody: [], //固定表体（完整）
  },

  /**
   * 在组件在视图层布局完成后执行
   */
  ready: function (e) {
    this.ready();
    console.log('table_components ready');
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 滚动时触发，event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}
     */
    scrollVertical: function (event) {
      this.setData({
        scrollTop: event.detail.scrollTop,
      });
    },

    /**
     * 组件的初始化
     */
    ready: function () {

      // const colWidths = this.getColWidths();
      const colWidths = this.getColWidthsForNumber()
      const totalWidth = this.getTotalWidth(colWidths);
      const fixedCols = this.getFixedCols();
      const firstColsOther = this.getFirstColsOther(fixedCols);
      const fiedRows = this.getFiedRows(fixedCols, this.data.fixedRowsNum)
      const thead = this.getThead();
      const tbody = this.getTbody();

      this.setData({
        colWidths: colWidths,
        totalWidth: totalWidth,
        fixedCols: fixedCols,
        fiedRows: fiedRows,
        firstColsOther: firstColsOther,
        thead: thead,
        tbody: tbody,
      });
      console.log(this.data)
    },

    /**
    * 获取固定表头（完整）
    */
    getThead: function () {
      // 前三列是固定的
      return this.data.table.length > 0 ? this.data.table.slice(0, this.data.fixedRowsNum) : [];
    },

    /**
     * 获取固定表体（完整）
     */
    getTbody: function () {
      return this.data.table.length > 1 ? this.data.table.slice(this.data.fixedRowsNum) : [];
    },

    /**
     * 横竖方向都要固定的左上角单元格
     */
    getFixedCols: function () {
      const result = [];
      this.data.table.forEach(row => {
        result.push(row
          .slice(0, this.data.fixedColsNum)
          .map(col => col))
      });
      console.log(result)
      return result;
    },
    getFiedRows: function (list, number) {
      console.log(list)
      let result = []
      for (let i = 0, listLen = number; i < listLen; i++) {
        result.push(list[i])
      }
      console.log(result)
      return result
    },

    /**
     * 获取固定列（除表头）
     */
    getFirstColsOther: function (fixedCols) {
      return fixedCols.length > 1 ? fixedCols.slice(this.data.fixedRowsNum) : [];
    },

    /**
     * 计算每列的宽度，依据单元格的字符串像素宽度
     */
    getColWidths: function () {
      const table = this.data.table;
      if (table.length == 0) return [];
      const result = [];
      const TH_FONT_SIZE = 24;
      const TD_FONT_SIZE = 28;
      const SCALE_RATIO = 1.5;
      for (let colIndex = 0, colLen = table[0].length; colIndex < colLen; colIndex++) {
        let maxWidth = this.getTextWidth(table[0][colIndex], TH_FONT_SIZE);
        for (let rowIndex = 1, rowLen = table.length; rowIndex < rowLen; rowIndex++) {
          const cell = table[rowIndex][colIndex];
          const cellWidth = this.getTextWidth(cell, TD_FONT_SIZE);
          if (cellWidth > maxWidth) {
            maxWidth = cellWidth;
          }
        }
        result.push(Math.ceil(maxWidth * SCALE_RATIO));
      }
      return result;
    },

    getColWidthsForNumber: function () {
      const table = this.data.table;
      // console.log(table)
      let number = this.data.showColsNumber - this.data.fixedRowsNum
      let result = []

      const TH_FONT_SIZE = 24;
      const TD_FONT_SIZE = 28;
      const SCALE_RATIO = 1.5;
      for (let colIndex = 0; colIndex < this.data.fixedRowsNum; colIndex++) {
        let maxWidth = this.getTextWidth(table[0][colIndex], TH_FONT_SIZE);
        for (let rowIndex = 1, rowLen = table.length; rowIndex < rowLen; rowIndex++) {
          const cell = table[rowIndex][colIndex];
          const cellWidth = this.getTextWidth(cell, TD_FONT_SIZE);
          if (cellWidth > maxWidth) {
            maxWidth = cellWidth;
          }
        }
        result.push(Math.ceil(maxWidth * SCALE_RATIO));
      }
      // console.log('fixedColsNum: ', this.data.fixedColsNum)
      // console.log('result: ', result)

      let widthIndex = 750 * 95 / 100 - getSumForList(result)
      console.log(widthIndex)
      for (let i = this.data.fixedRowsNum, len = table[0].length; i < len; i++) {
        result.push(widthIndex / number)
      }
      return result
    },

    /**
     * 获取总长度
     */
    getTotalWidth: function (colWidths) {
      return colWidths.length > 0 ? colWidths.reduce((acc, cur) => {
        return acc + cur
      }) : 0;
    },

    /**
     * 根据字符串长度和字体大小计算文本长度，中文为 fontSize，其余为 fontSize / 2
     * https://segmentfault.com/a/1190000016405843
     * @param {String} text - 文本
     * @param {Number} fontSize - 字体大小
     * @returns {Number} 长度
    */
    getTextWidth: function (text, fontSize) {
      text = String(text)
      text = text.split('')
      let width = 0
      text.forEach(function (item) {
        if (/[a-zA-Z]/.test(item)) {
          width += 7
        } else if (/[0-9]/.test(item)) {
          width += 5.5
        } else if (/\./.test(item)) {
          width += 2.7
        } else if (/-/.test(item)) {
          width += 3.25
        } else if (/[\u4e00-\u9fa5]/.test(item)) {  // 中文匹配
          width += 10
        } else if (/\(|\)/.test(item)) {
          width += 3.73
        } else if (/\s/.test(item)) {
          width += 2.5
        } else if (/%/.test(item)) {
          width += 8
        } else {
          width += 10
        }
      })
      return width * fontSize / 10
    }


  }
})
