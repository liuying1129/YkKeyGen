;(function() {
    //设立"严格模式"的目的
    //1、消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
    //2、消除代码运行的一些不安全之处，保证代码运行的安全；
　　//3、提高编译器效率，增加运行速度；
　　//4、为未来新版本的Javascript做好铺垫
    "use strict";

angular.module('starter.controllers', [])
.controller('DashCtrl', function($scope,$ionicLoading,$ionicPopup,$timeout,$state,$ionicPlatform) {

  var getSmsList2 = function() {

      if (window.yklis && window.yklis.commfuction) {
          yklis.commfuction.getSmsList(
              function(success) {
                  $scope.$apply(function(){
                      //$scope.$apply更新该$scope.enCryptSmsBody到view
                      $scope.smsList = success;
                  });
              },
              function(errorStr) {
                  var alertPopup = $ionicPopup.alert({
                      template: '读取短信失败:'+ errorStr
                  });
                  alertPopup.then(function(res) {
                      //console.log('Thank you for not eating my delicious ice cream cone');
                  });
                  $timeout(function() {
                      alertPopup.close(); //由于某种原因3秒后关闭弹出
                  }, 2000);
              }
          );
      }
  };

  $ionicLoading.show({
      template: '<ion-spinner icon="ios-small"></ion-spinner>Loading...'
  });

  //Cordova提供的通过HTML5调用Native功能并不是立即就能使用的，Cordova框架在读入HTML5代码之后，
  //要进行HTML5和Native建立桥接，在未能完成这个桥接的初始的情况下，是不能调用Native功能的。
  //在Cordova框架中，当这个桥接的初始化完成后，会调用他自身特有的事件，即deviceready事件。
    $ionicPlatform.ready(function() {

        //$ionicPlatform.ready后window.device才能取到值
        if (window.device) {
            //设备使用
            document.addEventListener("deviceready", onDeviceReady, false);//注册监听器
        } else {
            //浏览器调试使用
            $(document).ready(onDeviceReady);
        }

    });

    function onDeviceReady() {
            getSmsList2();
    }

    $ionicLoading.hide();

    $scope.goSmsDetail = function(address,body){
      $state.go("tab.chat-detail", {smsAddress:address,smsBody:body}, {});
  };

})

.controller('ChatsCtrl', function($scope, Chats,$cordovaSQLite,$ionicPopup) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  //浏览器则返回
  if(!window.cordova) return;

  var db = $cordovaSQLite.openDB("userdb.db"); 
  $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS RegInfo (id integer primary key autoincrement, TelNo varchar(50),OrgRegNo varchar(50),RegNo varchar(200),Create_Date_Time TimeStamp DEFAULT (datetime('now','localtime')))");

  var getSendList = function() {

    var query = "SELECT * FROM RegInfo";
    $cordovaSQLite.execute(db, query, []).then(function(res) {
        //if(res.rows.length > 0) {
          var sendList = [];
          for (var i=0;i<res.rows.length;i++){
            
            sendList.push(res.rows.item(i));

          }
          $scope.sendList = sendList;

        //} else {
        //    alert("No results found");
        //}
    }, function (err) {
        alert("查询发送列表失败:"+err);
    });

  }

  getSendList();  

  $scope.deleteSendItem = function(AAA){

    var confirmPopup = $ionicPopup.confirm({
      title: '提示',
      template: '确定删除该记录?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        var query = "delete FROM RegInfo where id = ?";
        $cordovaSQLite.execute(db, query, [AAA.id]).then(function(res) {

          //从界面删除这条item
          var idx = $scope.sendList.indexOf(AAA);
          $scope.sendList.splice(idx,1);
          //==================

          //alert("删除记录成功");
        }, function (err) {
          alert("删除记录失败:"+err);
        });
      } else {
        //console.log('You are not sure');
      }
    });
  };

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats,$cordovaSQLite) {

  var db = $cordovaSQLite.openDB("userdb.db"); 
  $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS RegInfo (id integer primary key autoincrement, TelNo varchar(50),OrgRegNo varchar(50),RegNo varchar(200),Create_Date_Time TimeStamp DEFAULT (datetime('now','localtime')))");

  var insertRegInfo = function(AAA,BBB,CCC) {

    var query = "INSERT INTO RegInfo (TelNo, OrgRegNo, RegNo) VALUES (?,?,?)";
    $cordovaSQLite.execute(db, query, [AAA, BBB,CCC]).then(function(res) {
      //alert("insertId: " + res.insertId);
      //alert("插入数据库成功");
    }, function (err) {
      alert("插入数据库失败:"+err);
    });
  };

  //$scope的变量名称必须全部小写
  $scope.sms = {
    Address  : $stateParams.smsAddress,
    Body : $stateParams.smsBody
  };

  $scope.getEnCrypt = function(){
    yklis.commfuction.getEnCrypt($scope.sms.Body,
      function(successStr) {
        $scope.$apply(function(){
            //$scope.$apply更新该$scope.enCryptSmsBody到view
            $scope.enCryptSmsBody = successStr;
        });        
    },
    function(errorStr) {
        alert('加密字符串失败:'+ errorStr );
    });
  };

  $scope.doSendSms = function(AAA,BBB){

    if (!$scope.enCryptSmsBody || "" == $scope.enCryptSmsBody) {
        alert("请先加密");
        return;
    }

    yklis.commfuction.doSendSms(
      AAA,BBB,
      function(successStr) {
        insertRegInfo(AAA,$scope.sms.Body,BBB);
        alert('发送短信成功:'+ successStr );
    },
    function(errorStr) {
        alert('发送短信失败:'+ errorStr );
    });  
  };

  $scope.insertRegInfo = insertRegInfo;

  $scope.sendTypes=["授权","注册","接口"];
  $scope.SendType = {choice:"授权"};  
})

.controller('LoginController', function($scope,$ionicLoading,$ionicPopup,$timeout,$state,$http,AppConstant,CommonService) {

  $scope.login = {
    userId  : "",
    passWord : ""
  };

  var rsaPubKey;

  var params2 = {
    methodNum:"rsa"
  };

  var promise2 = CommonService.asynchHttpMethod(AppConstant.BASE_URL,'POST',params2);

  promise2.then(function(data) {

    //post成功才会执行

    //if((typeof data.exponent!='undefined')&&(typeof data.exponent.valueOf()=='string')&&(data.exponent.length>0)){
    if(!data.success)return;//{    
      //处理正常业务数据
      setMaxDigits(131);
      rsaPubKey = new RSAKeyPair(data.response.exponent, "", data.response.modulus);
    //}       
  });    

  $scope.doLogin = function () {

    //$scope的变量名称如果超过1层，则第1层必须全部小写
    if (!$scope.login.userId || "" == $scope.login.userId) {
        $ionicPopup.alert({
            title: '提示',
            template: "账号不能为空。",
            okText: '确定'
        });
        return;
    }

    var passWord = $scope.login.passWord;
    if(!passWord || passWord == '') passWord = '';
        
    var requestPwd = encryptedString(rsaPubKey,passWord);
    var params = {
        methodNum:"login",
        userId:$scope.login.userId,
        passWord:requestPwd//,
        //aa:"中国"
    };
    
    params.sign = make_sign(params,null);
    //alert(params.sign);

    var promise = CommonService.asynchHttpMethod(AppConstant.BASE_URL,'POST',params);

    promise.then(function(data) {

      //post成功才会执行

            //判断变量为有效的字符串
            //先要确定该变量存在，否则后面的判断会发生错误，还要确定该变量是string数据类型的，
            //然而，如果该变量是一个String对象，而不是一个直接量，typeof将返回一个'object'数据类型而不是'string'，
            //这就是为什么要使用valueOf方法，它对所有的javascript对象都可用，不管对象是什么，
            //都返回其基本值：对于Number，String和布尔类型，返回其原始值；对于函数，是函数文本，
            //因此，如果该变量是一个String对象，valueOf返回一个字符串直接量，如果该变量已经是一个字符串直接量，
            //对其应用valueOf方法会临时性地将它封装成一个String对象，这意味着，valueOf仍然将返回一个字符串直接量，
            //最终，只用测量该字符串长度是否大于0了
      //if((typeof data.msg!='undefined')&&(typeof data.msg.valueOf()=='string')&&(data.msg.length>0))return;
      if(!data.success)return;  
      //处理正常业务数据
            
            window.localStorage.setItem('token', data.response.token);
            window.localStorage.setItem('userId', $scope.login.userId);

            $state.go("tab.dash");
                
    });

  };

})

.controller('AccountCtrl', function($scope,$http,$ionicLoading,$ionicPopup,$timeout, $q,AppConstant,$ionicHistory,Chats,$state,CommonService,CommonValue,$ionicActionSheet) {

    $scope.currentUserId = window.localStorage.getItem("userId");

    CommonValue.globalVar2 = "abc";
    $scope.g1 = CommonValue.globalVar1;
    $scope.g2 = CommonValue.globalVar2;

    //echarts应用start
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    // 使用指定的配置项和数据显示图表。
    myChart.setOption(option);
    //echarts应用stop

  $scope.datetimeValue = new Date();
  
  var getVersionNumber = function() {

      if (window.cordova && window.cordova.getAppVersion){
          cordova.getAppVersion.getVersionNumber().then(function (version) {
              $scope.VersionNumber = version;
          });
      }
  };

  getVersionNumber();

  //生成二维码start
  $scope.qrText = {srcQrText : ""};
  //进入页面时生成默认的二维码//
  //$('#code').qrcode($scope.qrText.srcQrText);//canvas方式,默认方式，效率最高，需要浏览器支持html5

  $scope.MakeQrCode = function(){
    $("#code").empty();
    var str = toUtf8($scope.qrText.srcQrText);
    
    //table方式
    $("#code").qrcode({
      render: "table",
      width: 200,
      height:200,
      text: str
    });

    generateBarcode();
  };

  function toUtf8(str) {   
      var out, i, len, c;   
      out = "";   
      len = str.length;   
      for(i = 0; i < len; i++) {   
        c = str.charCodeAt(i);   
        if ((c >= 0x0001) && (c <= 0x007F)) {   
            out += str.charAt(i);   
        } else if (c > 0x07FF) {   
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));   
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));   
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));   
        } else {   
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));   
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));   
        }   
      }   
      return out;   
  }
  //生成二维码stop

  //生成条码start
  function generateBarcode(){
    var value = $scope.qrText.srcQrText;
        
    var settings = {
      output: "css",
      bgColor: "#FFFFFF",
      color: "#000000",
      barWidth: "2",
      barHeight: "50"
    };

    $("#barcodeTarget").html("").show().barcode(value, "code128", settings);
  }
  //生成条码stop

  //手势密码start
  $("#gesturepwd").GesturePasswd({
    backgroundColor:"#252736",  //背景色
    color:"#FFFFFF",   //主要的控件颜色
    roundRadii:25,    //大圆点的半径
    pointRadii:6, //大圆点被选中时显示的圆心的半径
    space:30,  //大圆点之间的间隙
    width:240,   //整个组件的宽度
    height:240,  //整个组件的高度
    lineColor:"#00aec7",   //用户划出线条的颜色
    zindex :100  //整个组件的css z-index属性
    });
  
  $("#gesturepwd").on("hasPasswd",function(e,passwd){
    var result;

    if(passwd == "1235789"){

      result=true;
    }
    else {
       result=false;
    }

    if(result == true){
      $("#gesturepwd").trigger("passwdRight");
      setTimeout(function(){

        //密码验证正确后的其他操作，打开新的页面等。。。
        alert("密码正确！")
      },500);  //延迟半秒以照顾视觉效果
    }
    else{
      $("#gesturepwd").trigger("passwdWrong");

      //密码验证错误后的其他操作。。。

    }
  });
  //手势密码stop

  $scope.logout = function () {
      $ionicPopup.confirm({
          title: '<strong>安全退出?</strong>',
          template: '确定要安全退出吗?',
          okText: '退出',
          cancelText: '取消'
      }).then(function (res) {
        if (res) {
          window.localStorage.removeItem('userId');
          $ionicHistory.clearHistory();
          $ionicHistory.clearCache();
          if (ionic.Platform.isIOS()) {
              $state.go('login');
          } else {
              //延时后再退出，等待window.localStorage.removeItem完成
              //否则window.localStorage.removeItem可能不成功
              setTimeout(function(){
                  ionic.Platform.exitApp();
              },700);
          }
        } else {
          // Don't close
        }
      });
  };  

  $scope.rqtNormal = function(){

    var params = {
      methodNum:'AIF014',
      sql:"SELECT * FROM ApiToken"
    };
    
    params.sign = make_sign(params,window.localStorage.getItem('token'));

    var promise = CommonService.asynchHttpMethod(AppConstant.BASE_URL,'POST',params);

    promise.then(function(data) {

      //post成功才会执行

      //if((typeof data.response.result!='undefined')&&(typeof data.response.result.valueOf()=='string')&&(data.response.result.length>0)){
      //  alert(data.response.result);
      if(!data.success)return;

        //处理正常业务数据
      alert(JSON.stringify(data.response));
      //}

    });
  };

  $scope.showPicture = function(){
      $scope.$broadcast('imgBoxModalShow');
  };

  $scope.getPhoto = function() {

      var options = {
          //quality: 50,
          //sourceType: Camera.PictureSourceType.CAMERA,//Camera.PictureSourceType.PHOTOLIBRARY
          destinationType: Camera.DestinationType.FILE_URI//Camera.DestinationType.DATA_URL
      };

      //promise是一个带有then()方法的对象
      //then有3个可选参数(successFunc, errorFunc, notifyFunc)
      //resolve时调用successFunc，reject时调用errorFunc，notify时调用notifyFunc
      //.then(successFunc, errorFunc, notifyFunc)
      //    .then(successFunc, errorFunc, notifyFunc)
      //    .then(successFunc, errorFunc, notifyFunc)
      //    .catch()
      //    .finally();
      var promise = CommonService.getPicture(options);

      promise
      .then(function(imageUri) {

          $scope.lastPhoto = imageUri;

      },function(err) {
          $scope.errInfo = "err:"+ err;
      })
      .catch(function(e) {

              $scope.errInfo = "catch:" + e;

      });

  };

    //判断是否安装了微信start
    var weIsInstalled = true;
    if(window.Wechat){
        Wechat.isInstalled(function (installed) {
            if(!installed){
                //alert("未安装微信，无法分享!");
                weIsInstalled = false;
            }
        }, function (reason) {
            alert("Wechat.isInstalled Failed: " + reason);
            weIsInstalled = false;
        });
    }
    //判断是否安装了微信stop

    $scope.weShareScenes=["会话","朋友圈","收藏"];
    $scope.weShareScene = {choice:"会话"};

    $scope.share = function(title, desc, url, thumb) {

        if (typeof window.Wechat === "undefined") {
            alert("Wechat plugin is not installed.");
            return;
        }

        if(!weIsInstalled){
            alert("未安装微信，无法分享!");
            return;
        }

        $ionicActionSheet.show({
                buttons: [
                    { text: '发送Text消息给微信' },//<b>分享至微信朋友圈</b>
                    { text: '发送Photo消息给微信(本地图片)' },
                    { text: '发送Photo消息给微信(远程图片)' },
                    { text: '发送Link消息给微信(本地缩略图)' },
                    { text: '发送Link消息给微信(远程缩略图)' },
                    { text: '发送Music消息给微信' },
                    { text: '发送Video消息给微信' },
                    { text: '发送App消息给微信' },
                    { text: '发送非gif消息给微信' },
                    { text: '发送gif消息给微信' },
                    { text: '发送文件消息给微信' }//,
                    //{ text: '微信授权登录' },
                    //{ text: '测试URL长度' },
                    //{ text: '打开Profile' },
                    //{ text: '打开mp网页' },
                    //{ text: '添加单张卡券至卡包' },
                    //{ text: '添加多张卡券至卡包' }
                ],
                titleText: '分享功能列表',
                cancelText: '取消',
                cancel: function() {
                    // 取消时执行
                },
                buttonClicked: function(index) {
                    var scene;
                    if(typeof $scope.weShareScene.choice === "undefined"){
                        alert("无效的场景选择");
                        return;
                    }
                    if($scope.weShareScene.choice === "会话") {scene=0;}
                        else if($scope.weShareScene.choice === "朋友圈"){scene=1;}
                            else if($scope.weShareScene.choice === "收藏"){scene=2;}
                                else {scene=2;}

                    var params = {
                        scene: scene
                    };
                    if(index == 0){
                        params.text = "人文的东西并不是体现在你看得到的方面，它更多的体现在你看不到的那些方面，它会影响每一个功能，这才是最本质的。但是，对这点可能很多人没有思考过，以为人文的东西就是我们搞一个很小清新的图片什么的。”综合来看，人文的东西其实是贯穿整个产品的脉络，或者说是它的灵魂所在。";
                    }else{

                        params.message = {
                            title: "[TEST]" + index,
                            description: "[TEST]Sending from test application",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {}
                        };

                        switch (index){
                            case 1://发送Photo消息给微信(本地图片)
                                params.message.media.type = Wechat.Type.IMAGE;
                                params.message.media.image = "www/img/icon.png";
                                break;

                            case 2://发送Photo消息给微信(远程图片)
                                params.message.media.type = Wechat.Type.IMAGE;
                                params.message.media.image = "https://cordova.apache.org/images/cordova_256.png";
                                break;

                            case 3://发送Link消息给微信(本地缩略图)
                                params.message.title = "发送Link消息给微信(本地缩略图)";
                                params.message.description = "微信的平台化发展方向是否真的会让这个原本简洁的产品变得臃肿？在国际化发展方向上，微信面临的问题真的是文化差异壁垒吗？腾讯高级副总裁、微信产品负责人张小龙给出了自己的回复。";
                                params.message.thumb = "www/img/icon.png";
                                params.message.media.type = Wechat.Type.WEBPAGE;
                                params.message.media.webpageUrl = "http://tech.qq.com/";
                                break;

                            case 4://发送Link消息给微信(远程缩略图)
                                params.message.title = "发送Link消息给微信(远程缩略图)";
                                params.message.description = "微信的平台化发展方向是否真的会让这个原本简洁的产品变得臃肿？在国际化发展方向上，微信面临的问题真的是文化差异壁垒吗？腾讯高级副总裁、微信产品负责人张小龙给出了自己的回复。";
                                params.message.thumb = "https://cordova.apache.org/images/cordova_256.png";
                                params.message.media.type = Wechat.Type.WEBPAGE;
                                params.message.media.webpageUrl = "http://tech.qq.com/";
                                break;

                            case 5://发送Music消息给微信
                                params.message.title = "发送Music消息给微信";
                                params.message.description = "崔健";
                                params.message.thumb = "www/img/icon.png";
                                params.message.media.type = Wechat.Type.MUSIC;
                                params.message.media.musicUrl = "http://y.qq.com/i/song.html#p=7B22736F6E675F4E616D65223A22E4B880E697A0E68980E69C89222C22736F6E675F5761704C69766555524C223A22687474703A2F2F74736D7573696334382E74632E71712E636F6D2F586B30305156342F4141414130414141414E5430577532394D7A59344D7A63774D4C6735586A4C517747335A50676F47443864704151526643473444442F4E653765776B617A733D2F31303130333334372E6D34613F7569643D3233343734363930373526616D703B63743D3026616D703B636869643D30222C22736F6E675F5769666955524C223A22687474703A2F2F73747265616D31342E71716D757369632E71712E636F6D2F33303130333334372E6D7033222C226E657454797065223A2277696669222C22736F6E675F416C62756D223A22E4B880E697A0E68980E69C89222C22736F6E675F4944223A3130333334372C22736F6E675F54797065223A312C22736F6E675F53696E676572223A22E5B494E581A5222C22736F6E675F576170446F776E4C6F616455524C223A22687474703A2F2F74736D757369633132382E74632E71712E636F6D2F586C464E4D313574414141416A41414141477A4C36445039536A457A525467304E7A38774E446E752B6473483833344843756B5041576B6D48316C4A434E626F4D34394E4E7A754450444A647A7A45304F513D3D2F33303130333334372E6D70333F7569643D3233343734363930373526616D703B63743D3026616D703B636869643D3026616D703B73747265616D5F706F733D35227D";
                                params.message.media.musicDataUrl = "http://stream20.qqmusic.qq.com/32464723.mp3";
                                break;

                            case 6://发送Video消息给微信
                                params.message.title = "发送Video消息给微信";
                                params.message.description = "饿着肚皮，傻逼着。";
                                params.message.thumb = "www/img/icon.png";
                                params.message.media.type = Wechat.Type.VIDEO;
                                params.message.media.videoUrl = "http://v.youku.com/v_show/id_XNTUxNDY1NDY4.html";
                                break;

                            case 7://发送App消息给微信
                                params.message.title = "App消息";
                                params.message.description = "这种消息只有App自己才能理解，由App指定打开方式！";
                                params.message.thumb = "www/img/icon.png";
                                params.message.media.type = Wechat.Type.APP;
                                params.message.media.extInfo = "<xml>extend info</xml>";
                                params.message.media.url = "http://weixin.qq.com";
                                break;

                            case 8://发送非gif消息给微信
                                params.message.thumb = "www/img/icon.png";
                                params.message.media.type = Wechat.Type.EMOTION;
                                params.message.media.emotion = "www/img/icon.png";
                                break;

                            case 9://发送gif消息给微信
                                params.message.thumb = "www/img/icon.png";
                                params.message.media.type = Wechat.Type.EMOTION;
                                params.message.media.emotion = "www/img/res6.gif";
                                break;

                            case 10://发送文件消息给微信
                                params.message.title = "发送文件消息给微信";
                                params.message.description = "Pro CoreData";
                                params.message.thumb = "www/img/icon.png";
                                params.message.media.type = Wechat.Type.FILE;
                                params.message.media.file = "www/img/jiagou.pdf";
                                break;

                            default:
                                alert(index + " can not be recognized!");
                        }

                    }

                    //微信插件地址：https://github.com/xu-li/cordova-plugin-wechat
                    //安装该插件需要参数：ionic plugin add cordova-plugin-wechat --variable wechatappid=微信AppID
                    //apk包一定是经过签名文件签名的。默认签名(ionic build android)的apk包是不行的
                    //微信平台生成AppID，与应用签名没有必然联系的。即应用签名可以在微信开放平台修改，与apk的签名一致即可
                    Wechat.share(params, function() {
                        alert("分享成功");
                    }, function(reason) {
                        alert("分享失败,错误原因: " + reason);
                    });
                }
        });
    };

});

})();