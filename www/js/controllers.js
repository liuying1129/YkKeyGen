angular.module('starter.controllers', ['ngCordova'])

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

  $scope.goSmsDetail = function(){
    $state.go("tab.chat-detail", {smsAddress:"13763435454",smsBody:"http://www.baidu.com"}, {});
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

.controller('AccountCtrl', function($scope) {

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

});
