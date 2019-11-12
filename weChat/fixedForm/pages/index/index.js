const app = getApp()

Page({
  data: {
    tableData: [
      ['Full Name', 'Age', 'Column 1', 'Column 2', 'Column 3', 'Column 4']
    ],
    fixedColsNum: 2,
    tbodyHeight: 504, //wx.getSystemInfoSync().windowHeight
  },
  onLoad: function () {
    // var that = this;
    // wx.getSystemInfo({
    //   success: function (res) {
    //     // 获取可使用窗口高度
    //     console.log('windowHeight px', res.windowHeight)
    //     // 将高度乘以换算后的该设备的rpx与px的比例
    //     let windowHeight = (res.windowHeight * (750 / res.windowWidth)); 
    //     console.log('windowHeight rpx', windowHeight);
    //     that.setData({
    //       tbodyHeight: windowHeight,
    //     });
    //   }
    // })
    
    var tableData = this.data.tableData;

    var count = 100;
    var age = 30;

    for (var i = 0; i < count; i++) {
      tableData.push([
        i,
        age + i,
        400,
        5,
        6666,
        70
      ])
    }

    let list = [
      ['参数类型'],
      ['血压'],
      ['血糖'],
      ['心率'],
      ['身高'],
      ['体重'],
      ['饮水量'],
      ['运动步数']
    ]
    for (let i = 0; i < 31; i++) {
      list[0].push('2019-1-' + i)
      list[1].push(i)
      list[2].push(i)
      list[3].push(i)
      list[4].push(i)
      list[5].push(i)
      list[6].push(i)
      list[7].push(i)
    }

    this.setData({
      tableData: tableData,
    });
  },
})
