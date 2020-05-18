const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo

    //获取openid
    wx.login({
      success: function (res) {
        console.log(res.code)
        //发送请求获取openid
        wx.request({
          url: '你的域名/openid.php?code=code', //接口地址
          data: { code: res.code },
          header: {
            'content-type': 'application/json' //默认值
          },
          success: function (res) {
            //返回openid
            console.log(res.data.openid)
            //向数据库注册用户，验证用户
            var that = this;
            wx.request({
              url: '你的域名/server.php?nickname=' + e.detail.userInfo.nickName + '&avatarUrl=' + e.detail.userInfo.avatarUrl + '&openid=' + res.data.openid,
              data: {

              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                //打印用户信息
                console.log(res.data)
              }
            })
          }
        })
      }
    })

    
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
  }
})