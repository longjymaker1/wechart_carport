// pages/login/login.js
const app = getApp()

Page({
  data:{		//此处定义本页面中的全局变量
    result: '',		
    username: '',
    passwd: ''
  },
  inputName: function(e){	// 用于获取输入的账号
    this.setData({
      username: e.detail.value	//将获取到的账号赋值给username变量
    })
  },
  inputPwd: function (e) {		// 用于获取输入的密码
    this.setData({
      passwd: e.detail.value	//将获取到的账号赋值给passwd变量
    })
  },
  

  log: function(e){		//与服务器进行交互
    wx.request({
      url: 'http://192.168.124.7:8000/login',	//获取服务器地址，此处为本地地址
      // url: "http://192.168.20.145:8000/login",
      header:{
        "content-type": "application/x-www-form-urlencoded"		//使用POST方法要带上这个header
      },
      method: "POST",
      data: {		//向服务器发送的信息
        username: this.data.username,
        passwd: this.data.passwd
      },
      success: res => {
        if (res.statusCode == 200) {
          var login_msg;
          if (res.data == '1') {
            login_msg = "登录成功"
          } else if (res.data == '0') {
            login_msg = "密码错误"
          } else if (res.data == '2') {
            login_msg = "用户不存在"
          } else {
            login_msg = "请求错误"
          }
          console.log(login_msg)
          this.setData({
            result: login_msg,	//服务器返回的结果
            // login_code = res.data,
          })
        }
      }
    })
  }
})