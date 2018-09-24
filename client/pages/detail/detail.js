// client/pages/detail/detail.js.js
const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config');

Page({

  /**
   * Page initial data
   */
  data: {
    product: {}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.getProduct(options.id);
  },

  getProduct: function (id) {
    wx.showLoading({
      title: '商品数据加载中...'
    });

    qcloud.request({
      url: config.service.productDetail + id,
      success: (res) => {
        wx.hideLoading();
        let data = res.data;
        if (!data.code) {
          this.setData({
            product: data.data
          })
        } else {
          setTimeout(() => {
            wx.navigateBack();
          }, 2000)
        }

      },
      fail: (res) => {
        wx.hideLoading();

        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      }
    })
  },

  buy: function() {
    let product = Object.assign({
      count: 1
    }, this.data.product)
    console.log(product);
    
    qcloud.request({
      url: config.service.addOrder,
      login: true,
      method: 'POST',
      data: {
        list: [product]
      },
      success: (res) => {
        console.log(res);
        wx.showToast({
          title: 'buy success', //提示的内容,
        });
      },
      fail: (res) => {
        console.log(res);
      }
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})