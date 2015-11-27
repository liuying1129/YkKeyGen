var exec = require('cordova/exec');

module.exports = {

     /**  
     * exec共5个参数  
       第一个 :成功回调  
       第二个 :失败回调  
       第三个 :将要调用的类的配置名字(在config.xml中配置)  
       第四个 :调用的方法名(一个类里可能有多个方法,靠这个参数区分.JAVA类->execute方法->action参数)  
       第五个 :传入参数(以json数组的格式)  
     */

    //getSmsList:module.exports对象(json)的键。调用插件功能时就是用这个名称
    //getSmsList的值是一个自定义函数
    getSmsList: function(callbackSucc,callbackErr) {
        //callback:JAVA后台执行execute方法后传来的回调函数
        exec(callbackSucc, callbackErr, 'YkLisSms', 'readSms', []);
    },

    doSendSms: function(address,body,callbackSucc,callbackErr) {
        //callback:JAVA后台执行execute方法后传来的回调函数
        exec(callbackSucc, callbackErr, 'YkLisSms', 'sendSms', [address,body]);
    }    

};
