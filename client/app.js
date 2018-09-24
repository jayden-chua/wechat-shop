//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

let userInfo;

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl);
    },

    globalData: {
        userAuthType: UNPROMPTED
    },

    login: function({ success, error }) {
        wx.getSetting({ 
          success: res => {
            if (res.authSetting['scope.userInfo'] === false) {
              this.globalData.userAuthType = UNAUTHORIZED;
              wx.showModal({
                title: '提示',
                content: '请授权我们获取您的用户信息',
                showCancel: false
              });
              error && error();
            } else {
              this.globalData.userAuthType = AUTHORIZED;
              this.doQcloudLogin({ success, error })
            }
          }
        });
      },

      doQcloudLogin: function({ success, error }) {
        qcloud.login({
          success: (res) => {
            if (res) {
              let userInfo = res;
              success && success({
                userInfo
              });
            } else {
              this.getUserInfo({ success, error });
            }
          },
          fail: (res) => {
            error && error();
          }
        })
      },

      getUserInfo: function({ success, error}) {
        qcloud.request({
          url: config.service.requestUrl,
          login: true,
          success: (res) => {
            let data = res.data;
            
            if (!data.code) {
              let userInfo = data.data;
    
              success && success({
                userInfo
              });
            } else {
              error && error()
            }
          },
          fail: (res) => {
            error && error();
          }
        })
      },

      checkSession: function ({ success, error, complete }) {
        wx.checkSession({
          success: (res) => {
            this.getUserInfo({ success, error });
          },
          fail: () => {
            error && error();
          },
          complete: () => {
            complete && complete();
          }
        });
      }
})