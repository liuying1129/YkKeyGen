;(function() {
    //设立"严格模式"的目的
    //1、消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
    //2、消除代码运行的一些不安全之处，保证代码运行的安全；
    //3、提高编译器效率，增加运行速度；
    //4、为未来新版本的Javascript做好铺垫
    "use strict";

    angular.module('starter.commonService', [])

.factory('CommonService', function($ionicLoading,$q,$http,$ionicPopup,$timeout,$state) {

  return {

  	  asynchHttpMethod: function(url,method,params) {

		  var ifRest = arguments[3] ? arguments[3] : false;//第4个参数的默认值
		  
  		  var urlTmp;
		  if(ifRest){
		  	urlTmp = url + '/' + params.methodNum;
		  }else{
		  	urlTmp = url + '/service';
		  }

          //method:GET、POST...

          $ionicLoading.show({
              template: '<ion-spinner icon="ios-small"></ion-spinner>Loading...'
          });
          
          //所有请求统一增加token参数，后台决定是否需要使用
          //用拦截器中实现了该功能
          //params.token = window.localStorage.getItem('token');

          var deferred = $q.defer();//声明延后执行，表示要去监控后面的执行

          $http({
            url : urlTmp,
            method : method,
            //用拦截器中实现了该功能
            //headers: {
			//	'X-Access-Token': window.localStorage.getItem('token')
  			//},
            params : params,
            timeout : 20000 //毫秒,默认60s,超时则返回到error
          })
          .success(function(data, status, headers, config){

                  //data:这个数据代表转换过后的响应体（如果定义了转换的话）
                  //status:响应的HTTP状态码
                  //headers:这个函数是头信息的getter函数，可以接受一个参数，用来获取对应名字值
                  //config:这个对象是用来生成原始请求的完整设置对象

                  $ionicLoading.hide();
                  deferred.resolve(data);//声明执行成功，即http请求数据成功，可以返回数据了

                  //每个应用这里的处理方式可能不同start
                  //判断变量为有效的字符串
                  //先要确定该变量存在，否则后面的判断会发生错误，还要确定该变量是string数据类型的，
                  //然而，如果该变量是一个String对象，而不是一个直接量，typeof将返回一个'object'数据类型而不是'string'，
                  //这就是为什么要使用valueOf方法，它对所有的javascript对象都可用，不管对象是什么，
                  //都返回其基本值：对于Number，String和布尔类型，返回其原始值；对于函数，是函数文本，
                  //因此，如果该变量是一个String对象，valueOf返回一个字符串直接量，如果该变量已经是一个字符串直接量，
                  //对其应用valueOf方法会临时性地将它封装成一个String对象，这意味着，valueOf仍然将返回一个字符串直接量，
                  //最终，只用测量该字符串长度是否大于0了
                  //if((typeof data.msg!='undefined')&&(typeof data.msg.valueOf()=='string')&&(data.msg.length>0)) alert(data.msg);
                  if (!data.success) alert(data.response.errorCode +":"+ data.response.errorMsg);

                  //if ($state.current.name !== 'login'&&data.invalidToken) $state.go('login');
                  //每个应用这里的处理方式可能不同stop

              }
          )
          .error(function(data, status, headers, config){
              $ionicLoading.hide();

              var alertPopup = $ionicPopup.alert({
                template: '请求'+config.params.methodNum+'失败,状态码:'+status
              });
              alertPopup.then(function(res) {
                  //console.log('Thank you for not eating my delicious ice cream cone');
              });
              $timeout(function() {
                  alertPopup.close(); //由于某种原因3秒后关闭弹出
              }, 2000);

              if ($state.current.name !== 'login'&&status == 403) $state.go('login');

              deferred.reject(error);//$defer, promise must be rejected on error
          });

          return deferred.promise;//返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getPicture:function(options){

          var deferred = $q.defer();//声明延后执行，表示要去监控后面的执行

          navigator.camera.getPicture(function (imageUri) {
              deferred.resolve(imageUri);
          }, function (err) {
              deferred.reject(err);//$defer, promise must be rejected on error
          }, options);

          return deferred.promise;//返回承诺，这里并不是最终数据，而是访问最终数据的API
      }

  };

});

})();