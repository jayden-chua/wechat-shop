const appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    userAuthType: appInstance.globalData.userAuthType
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...', //提示的内容,
    });
    appInstance.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo: userInfo
        });
      },
      error: () => { },
      complete: function() {
        wx.hideLoading();
      }
    });
  },
  
  onTapLogin: function(){
    appInstance.login({
      success: ({userInfo}) => {
        this.setData({
          userInfo: userInfo,
          userAuthType: appInstance.globalData.userAuthType
        });
      }, 
      error: () => {
        this.setData({
          userAuthType: appInstance.globalData.userAuthType
        });
      }
    })
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
    this.setData({
      userAuthType: appInstance.globalData.userAuthType
    })
    appInstance.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        });
      }
    })
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