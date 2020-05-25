// pages/index_page/index_page.js
const app = getApp()
const db = wx.cloud.database({});
var QQMapWX = require('../../assets/js/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageItems: [],
    provincesArray: [],
    cityArray: [],
    districtArray: [],
    openid: '',
    location: '',
    useraddr: '',
    city: '',
    city_id: '',
    city_index: 0,
    province: '',
    province_id: '',
    province_index: 0,
    district: '',
    district_id: '',
    district_index: 0
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
    this.getOpenid(),
    wx.getSetting({
      success: (res)=>{
        // console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] !=true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res){
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.showToast({
                  title: '授权成功',
                  icon: 'success',
                  duration: 1000
                })
              } else{
                wx.showToast({
                  title: '授权成功',
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          this._getUserLocation()
        } else {
          this._getUserLocation()
        }
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
    console.log("province = ", this.data.province)
    console.log("province_id = ", this.data.province_id)
    console.log('province_index = ', this.data.province_index)
    console.log('provincesArray = ', this.data.provincesArray)
    console.log("--------------")
    console.log("city = ", this.data.city)
    console.log("city_id = ", this.data.city_id)
    console.log("city_index = ", this.data.city_index)
    console.log("cityArray = ", this.data.cityArray)
    console.log("--------------")
    console.log("district = ", this.data.district)
    console.log("district_id = ", this.data.district_id)
    console.log("district_index = ", this.data.district_index)
    console.log("districtArray = ", this.data.districtArray)
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
  },

  _getUserLocation: function(){
    qqmapsdk = new QQMapWX({
      key: 'WEJBZ-4RPCR-POEWD-WR5OX-LKS52-AGFBY' // 必填
    });
    var that = this;
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy:true,
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          sig: "cPgBA3tUnTCj2bU51Q16JZoz63O4GJ33",
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(ress){
            that.setData({
              city: ress.result.address_component.city,
              province: ress.result.address_component.province,
              district: ress.result.address_component.district,
              useraddr: ress.result.address
            })
            
            db.collection("Provinces").get({
              success: res=> {
                var provincesArrayTmp = [];
                var provinceIdTmp;
                var cityArrayTmp = [];
                var cityIdTmp;
                var districtArrayTmp = [];
                for (let pid = 0; pid < res.data.length; pid++) {
                  provincesArrayTmp.push({id: pid, _id: res.data[pid]._id, name: res.data[pid].name})
                  if (res.data[pid].name === ress.result.address_component.province) {
                    provinceIdTmp = res.data[pid]._id;
                    that.setData({
                      province_id: res.data[pid]._id,
                      province_index: pid
                    })
                  }
                }
                that.setData({
                  provincesArray: provincesArrayTmp
                })
                db.collection("City").where({
                  province_id: provinceIdTmp
                }).get({
                  success: cres => {
                    for (let cid = 0; cid < cres.data.length; cid++) {
                      cityArrayTmp.push({id: cid, _id: cres.data[cid]._id, name: cres.data[cid].name})
                      if (cres.data[cid].name === ress.result.address_component.city) {
                        cityIdTmp = cres.data[cid]._id
                        that.setData({
                          city_id: cres.data[cid]._id,
                          city_index: cid
                        })
                      }
                    }
                    that.setData({
                      cityArray: cityArrayTmp
                    })
                    db.collection("City_District").where({
                      city_id: cityIdTmp
                    }).get({
                      success: dres => {
                        for (let did = 0; did < dres.data.length; did++) {
                          districtArrayTmp.push({id:did, _id: dres.data[did]._id, name: dres.data[did].name})
                          if (dres.data[did].name === ress.result.address_component.district) {
                            that.setData({
                              district_id: dres.data[did]._id,
                              district_index: did
                            })
                          }
                        }
                        that.setData({
                          districtArray: districtArrayTmp
                        })
                      }
                    })
                  }
                })
              }
            })
          },
          faild: function(res){
            wx.showToast({
              title: '定位失败',
              icon: 'none',
              duration: 2000
            })
          },

        })
      },
      faild: function(){
        wx.hideLoading();
        wx.getSetting({
          success:function(res){
            if(!res.authSetting['scope.userLocation']){
              wx.showModal({
                title: '',
                content: '请允许获取您的定位',
                confirmText: '授权',
                success: function(res){
                  if (res.confirm) {
                    wx.openSetting()
                  } else {
                    console.log('get location fail');
                  }
                }
              })
            } else {
              wx.showModal({
                title: '',
                content: '请在系统设置中打开定位服务',
                confirmText: '确定',
                success: function(res){}
              })
            }
          }
        })
      }
    })
  }
})