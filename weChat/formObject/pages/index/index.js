//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    formData: {
      firstLow: ["省份/直辖市", "GDP", "增长率"],
      listLow: [
        { x: '广东', y: '72812456', z: '8.0%' },
        { x: '河南', y: '37010', z: '8.35' },
        { x: '江苏', y: '70116', z: '8.5%' }
      ]
    }
  },
  onLoad: function() {
    
  }
})
