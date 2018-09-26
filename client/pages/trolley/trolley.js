const appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    userAuthType: appInstance.globalData.userAuthType,
    trolleyList: [{
      id: 1,
      name: '商品1',
      image: 'https://productlist-1257663775.cos.ap-shanghai.myqcloud.com/product1.jpg',
      price: 45,
      source: '海外·瑞典',
      count: 1,
    }, {
      id: 2,
      name: '商品2',
      image: 'https://productlist-1257663775.cos.ap-shanghai.myqcloud.com/product2.jpg',
      price: 158,
      source: '海外·新西兰',
      count: 3,
    }], // 购物车商品列表
    trolleyCheckMap: [undefined, true, true], // 购物车中选中的id哈希表
    trolleyAccount: 70, // 购物车结算总价
    isTrolleyEdit: false, // 购物车是否处于编辑状态
    isTrolleyTotalCheck: false, // 购物车中商品是否全选 
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
        })
      },
      complete: () => {
        wx.hideLoading();
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