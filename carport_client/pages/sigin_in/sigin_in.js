// pages/sigin_in/sigin_in.js
const app = getApp()

Page({
  data: {
    username: '',
    phone: '',
    passwd: '',
    passwdagin: '',
    email: '',
    name: '',
    result: ''
  },

  inputSiginUsername: function(e){
    this.setData({
      username: e.detail.value
    })
  },

  inputSiginPhone: function(e){  //获取注册用户名
    this.setData({
      phone: e.detail.value
    })
  },

  inputSiginEmail: function(e){
    this.setData({
      email: e.detail.value
    })
  },

  inputSiginName: function(e){
    this.setData({
      name: e.detail.value
    })
  },

  inputPwd: function(e){
    this.setData({
      passwd: e.detail.value
    })
  },

  inputPwdAgin: function(e){
    this.setData({
      passwdagin: e.detail.value
    })
  },

  log: function(e){
    wx.request({
      url: 'http://192.168.124.7:8000/login',	//获取服务器地址，此处为本地地址
      // url: 'http://192.168.20.145:8000/sigin',
      header:{
        "content-type": "application/x-www-form-urlencoded"		//使用POST方法要带上这个header
      },
      method: "POST",
      data: {		//向服务器发送的信息
        username: this.data.username,
        passwd: this.data.passwd,
        phone: this.data.phone,
        name: this.data.name,
        email: this.data.email
      },

      success: res => {
        if (res.statusCode == 200) {
          var sigin_msg;
          if (res.data == '0') {
            sigin_msg = "用户名存在"
          } else if (res.data == '1') {
            sigin_msg = "手机号存在"
          } else if (res.data == '2') {
            sigin_msg = "邮箱存在"
          } else if (res.data == '3'){
            sigin_msg = "昵称存在"
          } else if (res.data == '4'){
            sigin_msg = "注册成功"
          } else {
            sigin_msg = "请求错误"
          }
          console.log(sigin_msg)
          this.setData({
            result: sigin_msg,	//服务器返回的结果
            // login_code = res.data,
          })
        }
      }

    })
  }
})