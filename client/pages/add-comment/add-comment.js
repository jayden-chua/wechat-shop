const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config');

Page({
  data: {
    product: {},
    commentValue: '',
    commentImages: []
  },

  onInput: function (event) {
    console.log(event);
    this.setData({
      commentValue: event.detail.value.trim()
    })
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
  },

  addComment: function (event) {
    let content = this.data.commentValue;
    if (!content) return;

    wx.showLoading({
      title: '正在发表评论',
    });

    this.uploadImages((images) => {
      qcloud.request({
        url: config.service.addComment,
        login: true, 
        method: 'PUT',
        data: {
          images,
          content,
          productId: this.data.product.id
        },
        success: (result) => {
          wx.hideLoading();
          
          let data = result.data;

          if (!data.code) {
            wx.showToast({
              title: '发表评论成功'
            })
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          } else {
            wx.showToast({
              icon: 'none',
              title: '发表评论失败'
            });
          }
        },
        fail: (res) => {
          wx.hideLoading();

          wx.showToast({
            icon: 'none',
            title: '发表评论失败'
          });
        }
      });
    });
  },

  uploadImages: function (callback) {
    let commentImages = this.data.commentImages;
    let images = [];

    if (commentImages.length) {
      let length = commentImages.length;
      for (let i = 0; i < length; i++) {
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: commentImages[i],
          name: 'file',
          success: (res) => {
            let data = JSON.parse(res.data);
            length--;

            if (!data.code) {
              images.push(data.data.imgUrl);
            }

            if (length <= 0) {
              callback && callback(images)
            }
          },
          fail: () => {
            length--;
          }
        })
      }
    } else {
      callback && callback(images);
    }
  },

  chooseImage: function () {
    let currentImages = this.data.commentImages;

    wx.chooseImage({
      count: 3, 
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        commentImages = currentImages.concat(res.tempFilePaths);

        let end = currentImages.length;
        let begin = Math.max(end = 3, 0);
        currentImages = currentImages.slice(begin, end);
        
        this.setData({
          commentImages
        });
      },
    })
  },

  previewImages: function (event) {
    let target = event.currentTarget;
    let src = target.dataset.src;

    wx.previewImage({
      current: src,
      urls: this.data.commentImages
    })
  },

  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})