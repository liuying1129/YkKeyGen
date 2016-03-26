;(function() {
    //设立"严格模式"的目的
    //1、消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
    //2、消除代码运行的一些不安全之处，保证代码运行的安全；
    //3、提高编译器效率，增加运行速度；
    //4、为未来新版本的Javascript做好铺垫
    "use strict";

    angular.module('starter.services', [])

.factory('Chats', function($ionicLoading,$q,AppConstant,$window,$http,$ionicPopup) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  var smsLists = [{"body":"你好","address":"12345678901"},{"body":"第二条短信","address":"10987654321"},{"body":"第三条短信","address":"5677444545"}];

  return {
    getSmsList: function() {
      /*yklis.commfuction.getSmsList(
        function(success) {
          //alert('读取短信成功:'+ JSON.stringify(success).substring(0,200) );
          //return success;
          var aaa = "";
      },
      function(errorStr) {
          //alert('读取短信失败:'+ errorStr );
          //return null;
          var bbb = "";
      });*/
      return smsLists;
      
    }, 
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    },
    getNormal:function() {

            $ionicLoading.show({
                template: '<ion-spinner icon="ios-small"></ion-spinner>Loading...'
            });

            var deferred = $q.defer();//声明延后执行，表示要去监控后面的执行

            $http({
              url:'http://211.97.0.5:8080/YkAPI/service/normal',
              method:'POST',
              params: {
                token:$window.localStorage['token']
              }
            })            
            .success(function(data, status, headers, config){
              
                    //data:这个数据代表转换过后的响应体（如果定义了转换的话）
                    //status:响应的HTTP状态码
                    //headers:这个函数是头信息的getter函数，可以接受一个参数，用来获取对应名字值
                    //config:这个对象是用来生成原始请求的完整设置对象        

                    $ionicLoading.hide();
                    deferred.resolve(data);//声明执行成功，即http请求数据成功，可以返回数据了
                }
            )
            .error(function(data, status, headers, config){
                $ionicLoading.hide();
                
                var alertPopup = $ionicPopup.alert({
                  template: '请求失败,状态码:'+status
                });
                alertPopup.then(function(res) {
                    //console.log('Thank you for not eating my delicious ice cream cone');
                });
                $timeout(function() {
                    alertPopup.close(); //由于某种原因3秒后关闭弹出
                }, 2000);
                deferred.reject(error);//$defer, promise must be rejected on error
            });

            return deferred.promise;//返回承诺，这里并不是最终数据，而是访问最终数据的API                 
    },
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }    

  };
});

})();
