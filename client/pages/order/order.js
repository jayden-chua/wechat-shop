const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config');
const appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    userAuthType: appInstance.globalData.userAuthType,
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
  },

  onTapLogin: function () {
    appInstance.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          userAuthType: appInstance.globalData.userAuthType
        })
      },
      error: () => {
        this.setData({
          userAuthType: appInstance.globalData.userAuthType
        })
      }
    });
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
    wx.showLoading({
      title: '加载中...', //提示的内容,
    });
    this.setData({
      userAuthType: appInstance.globalData.userAuthType
    })
    appInstance.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        });
        this.getOrders();
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  getOrders: function() {
    qcloud.request({
      url: config.service.listOrders,
      login: true, 
      success: res => {
        this.setData({
          orderList: res.data.data
        });
      },
      fail: res => {
        console.log(res);
      }
    });
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