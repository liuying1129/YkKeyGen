angular.module('starter.controllers', [])
.controller('DashCtrl', function($scope,$ionicLoading,$ionicPopup,$timeout,$state) {

  var getSmsList2 = function() {

    yklis.commfuction.getSmsList(
      function(success) {        
        $scope.$apply(function(){
            //$scope.$apply更新该$scope.enCryptSmsBody到view
            $scope.smsList = success;
            vSmsList = success;
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
  };

  $ionicLoading.show({
      template: '<ion-spinner icon="ios-small"></ion-spinner>Loading...'
  });

  //Cordova提供的通过HTML5调用Native功能并不是立即就能使用的，Cordova框架在读入HTML5代码之后，
  //要进行HTML5和Native建立桥接，在未能完成这个桥接的初始的情况下，是不能调用Native功能的。
  //在Cordova框架中，当这个桥接的初始化完成后，会调用他自身特有的事件，即deviceready事件。 
  document.addEventListener("deviceready", onDeviceReady, false);//注册监听器
  function onDeviceReady() {

    getSmsList2();

    $ionicLoading.hide();

  }

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
    params = {
        methodNum:"login",
        userId:$scope.login.userId,
        passWord:requestPwd
    };

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

.controller('AccountCtrl', function($scope,$http,$ionicLoading,$ionicPopup,$timeout, $q,AppConstant,$ionicHistory,Chats,$state,CommonService) {

  $scope.datetimeValue = new Date();
  
  var getVersionNumber = function() {

    cordova.getAppVersion.getVersionNumber().then(function (version) {
      $scope.VersionNumber = version;
    });
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
              ionic.Platform.exitApp();
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

});
