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
    trolleyList: [], // 购物车商品列表
    trolleyCheckMap: [], // 购物车中选中的id哈希表
    trolleyAccount: 0, // 购物车结算总价
    isTrolleyEdit: false, // 购物车是否处于编辑状态
    isTrolleyTotalCheck: false, // 购物车中商品是否全选 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  getTrolleyList: function () {
    qcloud.request({
      url: config.service.listTrolley,
      method: 'GET',
      login: true,
      success: (res) => {
        let trolleyList = res.data.data;
        if (trolleyList.length > 0) {
          this.setData({
            trolleyList: trolleyList
          });
        }
      },
      fail: () => {
        console.log('failed');
      }
    });
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

  onTapEdit: function() {
    let isTrolleyEdit = this.data.isTrolleyEdit;
    
    if (isTrolleyEdit) {
      this.updateTrolley();
    } else {
      this.setData({
        isTrolleyEdit: !isTrolleyEdit
      });
    }
  },

  adjustTrolleyProductCount: function(event) {
    let trolleyList = this.data.trolleyList;
    let trolleyCheckMap = this.data.trolleyCheckMap;
    let dataset = event.currentTarget.dataset;
    let adjustType = dataset.type;
    let productId = dataset.id;
    let product;
    let index;

    trolleyList.forEach((item, key) => {
      if (item.id === productId) {
        index = key;
        product = item;
      }
    });

    if (product) {
      if (adjustType === 'add') {
        product.count++;
      } else {
        if (product.count <= 1) {
          delete trolleyCheckMap[productId];
          trolleyList.splice(index, 1);
        } else {
          product.count--;
        }
      }
    }

    let trolleyAccount = this.calculateTotalPrice(trolleyCheckMap, trolleyList);
    if (!trolleyList.length) {
      // 当购物车为空，自动同步至服务器
      this.updateTrolley()
    }

    this.setData({
      trolleyList: trolleyList,
      trolleyCheckMap: trolleyCheckMap,
      trolleyAccount: trolleyAccount
    });
  },

  onCheckSingleItem: function(event) {
    let currentId = event.currentTarget.dataset.id;
    let trolleyList = this.data.trolleyList;
    let trolleyCheckMap = this.data.trolleyCheckMap;
    let totalProductsInTrolley = trolleyList.length;
    let totalCheckedProducts = 0;
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck;
    
    trolleyCheckMap[currentId] = !trolleyCheckMap[currentId];
    trolleyCheckMap.forEach((item) => {
      totalCheckedProducts = (item === true) ? totalCheckedProducts + 1 : totalCheckedProducts;
    });

    isTrolleyTotalCheck = (totalCheckedProducts === totalProductsInTrolley) ? true : false;

    this.setData({
      trolleyCheckMap: trolleyCheckMap,
      isTrolleyTotalCheck: isTrolleyTotalCheck,
      trolleyAccount: this.calculateTotalPrice(trolleyCheckMap, trolleyList)
    });
  },

  onCheckAllItems: function (event) {
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck;
    let trolleyCheckMap = this.data.trolleyCheckMap;
    let trolleyList = this.data.trolleyList;

    isTrolleyTotalCheck = !isTrolleyTotalCheck;

    trolleyList.forEach((product) => {
      trolleyCheckMap[product.id] = isTrolleyTotalCheck;
    });

    this.setData({
      isTrolleyTotalCheck: isTrolleyTotalCheck,
      trolleyCheckMap: trolleyCheckMap,
      trolleyAccount: this.calculateTotalPrice(trolleyCheckMap, trolleyList)
    });
  },

  calculateTotalPrice: function (trolleyCheckMap, trolleyList) {
    let trolleyAccount = 0;
    trolleyList.forEach((product) => {
      if (trolleyCheckMap[product.id] == true) {
        trolleyAccount = trolleyAccount + (product.count * product.price);
      }
    });

    return trolleyAccount;    
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
        this.getTrolleyList();
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },

  updateTrolley: function () {
    wx.showLoading({
      title: '更新购物车数据...'
    });

    let trolleyList = this.data.trolleyList;

    qcloud.request({
      url: config.service.updateTrolley,
      method: 'POST',
      login: true,
      data: {
        list: trolleyList
      },
      success: (res) => {
        wx.hideLoading();
        let data = res.data;

        if (!data.code) {
          this.setData({
            isTrolleyEdit: false
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: '更新购物车失败1'
          });
        }
      },
      fail: (res) => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '更新购物车失败2'
        });
        console.log(res);
      }
    })
  },

  checkout: function () {
    if (!this.data.trolleyAccount) return;

    wx.showLoading({
      title: '结算中...',
    })

    let trolleyList = this.data.trolleyList;
    let trolleyCheckMap = this.data.trolleyCheckMap;

    let checkoutList = trolleyList.filter((product) => {
      return !!trolleyCheckMap[product.id];
    })
    
    qcloud.request({
      url: config.service.addOrder,
      login: true,
      method: 'POST',
      data: {
        list: checkoutList
      },
      success: (res) => {
        wx.hideLoading();
        let data = res.data;
        if (!data.code) {
          wx.showToast({
            title: '结算成功',
          });
          this.getTrolleyList();
          wx.navigateTo({ url: '../order/order' });
        } else {
          wx.showToas({
            icon: 'none',
            title: '结算失败'
          });
        }
      },
      fail: (res) => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '结算失败'
        });
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