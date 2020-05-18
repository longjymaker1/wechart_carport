// pages/carport_detail/carport_detail.js
const app = getApp()
const db = wx.cloud.database({});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",  // 标题
    updateTime: "",  // 更新时间
    price: "",  // 价格
    priceUnit: "",  // 价格单位
    messageType: "",  // 信息类型 -- 车位出租or车位出售
    area: "",  // 面积
    payType: "",  // 付款类型
    termLease: "",  // 租期
    address: "",  // 地址
    describe: "",  // 描述
    landlordName: "",  // 联系人
    phone: "",  // 电话
    isLike: false,  // 用户是否收藏
    openid: "",  // 用户openid
    carportId: ""  // 车位信息id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var msg_id = options._id;
    var openid = options.openid
    this.setData({
      openid: openid,
      carportId: msg_id
    })
    db.collection('Carport').where({
      _id: msg_id
    }).get({
      success: res => {
        var messageType0 = ''
        if (res.data[0].type==0) {
          messageType0 = '车位出租'
        }else{
          messageType0 = '车位出售'
        }
        this.setData({
          title: res.data[0].title,  // 标题
          updateTime: res.data[0].edit_time,  // 更新时间
          price: res.data[0].rant_price,  // 价格
          priceUnit: res.data[0].rant_unit,  // 价格单位
          messageType: messageType0,  // 信息类型 -- 0车位出租or1车位出售
          area: res.data[0].area,  // 面积
          payType: res.data[0].pay_type,  // 付款类型
          termLease: res.data[0].lease,  // 租期
          address: res.data[0].address,  // 地址
          describe: res.data[0].describe,  // 描述
        })
      }
    })

    db.collection('Carport_User').where({
      carport_id: msg_id
    }).where({
      type: 0
    }).get({
      success: res => {
        db.collection('User').where({
          _id: res.data[0].user_id
        }).get({
          success: res2 => {
            this.setData({
              landlordName: res2.data[0].nikeName,  // 联系人
              phone: res2.data[0].phone  // 电话
            })
          }
        })
      }
    })

    db.collection('User_Carport_Like').where({
      openID: openid
    }).where({
      carportID: msg_id
    }).count().then(res=>{
      var likeNum = res.total
      if (likeNum == 1) {
        this.setData({
          isLike: true
        })
      }
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
  _userLike: function(){
    if (!this.data.isLike == true) {
      // let jobData = this.data.jobStorage;
      // jobData.push({
      //   jobid: jobData.length,
      //   id: this.data.job.id
      // })
      // wx.setStorageSync('jobData', jobData);//设置缓存
      var time0 = this._getDatetime()
      db.collection("User_Carport_Like").add({
        data:{
          createTime: time0,
          editTime: time0,
          openID: this.data.openid,
          carportID: this.data.carportId
        },
        success(res){
          console.log(res)
        }
      })
      wx.showToast({
        title: '已收藏',
      });
    } else {
      db.collection('User_Carport_Like').where({
        openID: this.data.openid
      }).where({
        carportID:  this.data.carportId
      }).remove({
        success: function(res) {
          console.log(res.data)
        }
      })
      wx.showToast({
        title: '已取消收藏',
      });
    }
    this.setData({
      isLike: !this.data.isLike
    })
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