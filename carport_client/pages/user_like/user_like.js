// pages/user_like/user_like.js
const app = getApp()
const db = wx.cloud.database({});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageItems: [],
    openid: '',
    carporList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openID = ''
    wx.cloud.callFunction({
      name:'getOpenid',
      complete:res=>{
        that.setData({
          openid:res.result.openId
        })
        openID = res.result.openId
        db.collection('User_Carport_Like').field({
          carportID: true
        }).where({
          openID: openID
        }).get({
          success: res => {
            if (res.data.length > 0) {
              var carporLst = []
              for (const key in res.data) {
                carporLst.push(res.data[key].carportID)
              }
            }
            db.collection('Carport').where({
              _id: db.command.in(carporLst),
              status: 0
            }).get({
              success: res => {
                this.setData({
                  messageItems: res.data
                })
              }
            })
          }
        })
      },
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

  },

  _toCarportMsg: function(evt){
    wx.navigateTo({
      url: '../carport_detail/carport_detail?_id='+evt.currentTarget.id+'&openid='+this.data.openid,
    })
  },
})