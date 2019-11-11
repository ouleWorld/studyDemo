// components/table.js
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
    fixedColsNum: { //开始滚动的列
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
    fixedColsNum: 1, //开始滚动的列，可外部传入

    colWidths: [], //所有单元格的宽度
    scrollTop: 0, //记录滚动位置
    totalWidth: 0, //根据colWidths获取的总长度
    fixedCols: [], //横竖方向都要固定的左上角单元格
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
    scrollVertical: function(event) {
      this.setData({
        scrollTop: event.detail.scrollTop,
      });
    },

    /**
     * 组件的初始化
     */
    ready: function() {
      console.log('this.data: ', this.data)
      
      const colWidths = this.getColWidths();
      const totalWidth = this.getTotalWidth(colWidths);
      const fixedCols = this.getFixedCols();
      const firstColsOther = this.getFirstColsOther(fixedCols);
      const thead = this.getThead();
      const tbody = this.getTbody();

      this.setData({
        colWidths: colWidths,
        totalWidth: totalWidth,
        fixedCols: fixedCols,
        firstColsOther: firstColsOther,
        thead: thead,
        tbody: tbody,
      });

      console.log(this.data)

      // console.log('colWidths', this.data.colWidths);
      // console.log('totalWidth', this.data.totalWidth);
      // console.log('fixedCols', this.data.fixedCols);
      // console.log('firstColsOther', this.data.firstColsOther);
      // console.log('thead', this.data.thead);
      // console.log('tbody', this.data.tbody);

    },

    /**
     * 获取固定表头（完整）
     */
    getThead: function () {
      return this.data.table.length > 0 ? this.data.table[0] : [];
    },

    /**
     * 获取固定表体（完整）
     */
    getTbody: function () {
      return this.data.table.length > 1 ? this.data.table.slice(1) : [];
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
      console.log('result', result)
      return result;
    },

    /**
     * 获取固定列（除表头）
     */
    getFirstColsOther: function (fixedCols) {
      return fixedCols.length > 1 ? fixedCols.slice(1) : [];
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
      console.log(result)
      return result;
    },

    /**
     * 获取总长度
     */
    getTotalWidth: function (colWidths) {
      return colWidths.length > 0 ? colWidths.reduce((acc, cur) => {
        return acc + cur
      }): 0;
    },

    /**
     * 根据字符串长度和字体大小计算文本长度，中文为 fontSize，其余为 fontSize / 2
     * https://segmentfault.com/a/1190000016405843
     * @param {String} text - 文本
     * @param {Number} fontSize - 字体大小
     * @returns {Number} 长度
    */
    getTextWidth: function(text, fontSize) {
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
