// pages/home/home.js
const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [] // 商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '商品数据加载中',
    });
    wx.openSetting({ success: res => {
      console.log(res);
    } });
    qcloud.request({
      url: 'https://rohfuev9.qcloud.la/weapp/product',
      success: (result) => {
        this.setData({
          productList: result.data.data
        })
      },
      fail: (result) => {
        console.log('failed');
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  addToTrolley: function(event) {
    let productId = event.currentTarget.dataset.id;
    if (productId) {
      qcloud.request({
        url: config.service.addTrolley,
        login: true, 
        method: 'PUT',
        data: {
          id: productId
        },
        success: (res) => {
          console.log(res);
        }, 
        fail: (res) => {
          console.log(res);
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})