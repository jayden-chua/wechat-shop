const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config');
const _ = require('../../utils/util');

Page({

  data: {
    commentList: [], 
  },

  onLoad: function (options) {
    let product = {
      id: options.id,
      name: options.name, 
      price: options.price, 
      image: options.image
    };
    this.setData({
      product: product
    });
    this.getCommentList(product.id);
  },

  previewImg: function (event) {
    let dataset = event.currentTarget.dataset;
    let src = dataset.src;
    let urls = dataset.urls;

    wx.previewImage({
      current: src,
      urls: urls
    });
  },

  getCommentList: function (id) {
    qcloud.request({
      url: config.service.listComment,
      data: {
        productId: id
      },
      success: (res) => {
        let data = res.data;
        if (!data.code) {
          this.setData({
            commentList: data.data.map((item) => {
              let itemDate = new Date(item.create_time);
              item.createTime = _.formatTime(itemDate);
              item.images = item.images ? item.images.split(';;') : [];
              return item;
            })
          });
        }
      } 
    });
  },

  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})