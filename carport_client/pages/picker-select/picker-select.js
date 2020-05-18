// carport_client/pages/picker-select/picker-select.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList1: ['吉林省', '黑龙江', '辽宁省', '浙江省', '北京市', '上海市'],   //当前一级类目的列表
    cateList2: [],   //当前二级类目的列表,
    cateList3: [],   //当前三级类目的列表,
    multiArray: [],  //当前列表
    multiIndex: [0, 0, 0],  //联动选择框初始选择
  },
  getCate: function(parentId, depth) {
    const that = this
    const params = {
        parentId: parentId,
        depth: depth
    }
    const onSuccess = res => {
        let list = res.data
        // 获取的是第一级类目，则还需获取第2、3级，（其实只在页面onload时会获取一级）
        if (depth == 1) {
            that.setData({
                cateList1: list,
                multiIndex: [0, 0, 0]
            })
            that.getCate(list[0].id, 2)
        } else if (depth == 2) { //获取的是二级类目，则还需要重新获取第三级
            that.setData({
                cateList2: list,
                ['multiIndex[1]']: 0,
                ['multiIndex[2]']: 0,
            })
            that.getCate(list[0].id, 3)
        } else {
            that.setData({
                cateList3: list,
                ['multiIndex[3]']: 0,
            })
        }
        this.setData({
            multiArray: [that.data.cateList1, that.data.cateList2, that.data.cateList3]
        })
    }
    const onFail = res => {}
    request(apis.getCate, params, onSuccess, onFail)
  },
  bindMultiPickerColumnChange: function (e) {
    const that = this
    const { multiArray, multiIndex } = this.data
    let parentId = multiArray[e.detail.column][e.detail.value].id
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value, parentId); //0,3
    if (e.detail.column == 0) {
        //改变第一列，获取第二列
        that.getCate(parentId, 2)
        that.setData({
            ['multiIndex[0]']: e.detail.value
        })
    } else if (e.detail.column == 1) {
        //改变第二列，获取第三列
        that.getCate(parentId, 3)
        that.setData({
            ['multiIndex[1]']: e.detail.value
        })
    } else {
        //改变第三列，无需再获取cate
        that.setData({
            ['multiIndex[2]']: e.detail.value
        })
    }
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)  //3,0
    this.setData({
        multiIndex: e.detail.value
    })
  },
})