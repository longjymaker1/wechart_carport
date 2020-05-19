// pages/index_page/index_page.js
const app = getApp()
const db = wx.cloud.database({});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageItems: [],
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    db.collection('Carport').where({
      status: 0
    }).get({
      success: res => {
        that.setData({
          messageItems: res.data
        })
      }
    }),
    this.getOpenid()
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
  /**
   * 跳转车位信息上传页面
   */
  _toMsgUupload: function(){
    wx.navigateTo({
      url: '../message_upload/message_upload',
    })
  },
  
  _toCarportMsg: function(evt){
    wx.navigateTo({
      url: '../carport_detail/carport_detail?_id='+evt.currentTarget.id+'&openid='+this.data.openid,
    })
  },
  getOpenid(){
    var that = this;
    var openid = '';
    wx.cloud.callFunction({
      name:'getOpenid',
      complete:res=>{
        that.setData({
          openid:res.result.openId
        })
        openid = res.result.openId
        var time0 = this._getDatetime()
        db.collection("User").where({
          openID: res.result.openId
        }).count().then(res => {
          var userNum = res.total
          if (userNum == 0) {
            db.collection('User').add({
              data: {
                createTime: time0,
                editTime: time0,
                openID: openid,
                nikeName: '',
                phone: 0
              },
              success(res){
                console.log(res)
              }
            })
          }
        })
      },
    })
  },
  _dataSelectDay: function(evt){
    console.log("筛选日租数据")
  },
  _dataSelectMonth: function(evt){
    console.log("筛选月租数据")
  },
  _dataSelectYear: function(evt){
    console.log("筛选年租数据")
  },


  _msgTmp: function(){
  },

  _getDatetime: function() {
    var d = new Date();
    var year = d.getFullYear();
    var month = change(d.getMonth() + 1);
    var day = change(d.getDate());
    var hour = change(d.getHours());
    var minute = change(d.getMinutes());
    var second = change(d.getSeconds());
    
    function change(t) {
        if (t < 10) {
            return "0" + t;
        } else {
            return t;
        }
    }

    var time = year + '-' + month + '-' + day + ' ' 
            + hour + ':' + minute + ':' + second;

    return time;
  }
})