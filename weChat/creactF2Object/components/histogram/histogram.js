import F2 from '@antv/wx-f2';

// components/histogram/histogram.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    chartId: {
      type: String,
      value: "charts-line"
    },
    chartData: {
      type: Object,
      value: null,
      // 微信自带的函数，如果参数发生改变，那么就执行函数
      // 该内容叫数据监听器，属于自定义组件中的一个特性
      // observer 函数有三个参数：第一个参数表示的是新的value值，第二参数表示旧的value值，第三个参数表示名字值，例如在这里表示的是 chartData
      observer: function (newVal, oldVal) {
        if (oldVal !== newVal) {
          this.initChart();
        }
      }
      // observer: function (...x) {
      //   console.log("x: ", x)
      // }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 该属性是f2-canvas组件特殊要求的，具体作用暂时未知
    opts: {
      lazyLoad: true // 延迟加载组件
    }
  },

  ready: function () {
    this.initChart();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initChart: function () {
      console.log('绘图开始')
      if (this.properties.chartData === null || this.properties.chartData === undefined) {
        return
      }
      let properties = this.properties;
      console.log(properties)
      let id = "#" + properties.chartId;
      let colors = properties.colors;
      let data = this.properties.chartData
      if (!data || !id) {
        console.error("绘制折线图参数不足！");
        return;
      }

      let _this = this
      _this.chartComponent = _this.selectComponent(id);
      _this.chartComponent && _this.chartComponent.init((canvas, width, height) => {
        const chart = new F2.Chart({
          el: canvas,
          width,
          height
        });

        chart.source(data, {
          sales: {
            tickCount: 5
          }
        });
        chart.tooltip({
          showItemMarker: false,
          onShow(ev) {
            const { items } = ev;
            items[0].name = null;
            items[0].name = items[0].title;
            items[0].value = '¥ ' + items[0].value;
          }
        });
        chart.interval().position('year*sales');
        chart.render();
        return chart;
        
      })
    }
  }
})
