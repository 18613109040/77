
import { host } from '../config'

export const photoUpload = (src,callback=()=>{})=>{
	let token = wx.getStorageSync('token');
  let uid = wx.getStorageSync('uid')
  wx.uploadFile({
    url: host + "/api/upload/photoUpload",
    filePath: src,
    name: 'file',
    header: {
      "content-type": "multipart/form-data",
      "Shop-Token": token,
      "Shop-UID": uid
    },
    formData: {
      'file': src
    },
    success: (res) => {
    	// 回调图片的具体路径
    	let {errorMsg,errorCode,result} = JSON.parse(res.data)
    	if(errorCode==0){
    		callback(result)
    	}else{
    		wx.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        })
    	}
    }, 
    fail: (red) => {
      console.dir(res)
    }
  })
}
export const chooseImage = (type,callback=()=>{})=>{
	
  let uploadTask = wx.chooseImage({
    count: 1, // 默认9
    sourceType: type == "相机拍摄" ? ['camera'] : ['album'], // 可以指定来源是相册还是相机，默认二者都有
    success: (res) => {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      let tempFilePaths = res.tempFilePaths;
      photoUpload(tempFilePaths[0],callback)
    }
  })
}