;(function() {
  //设立"严格模式"的目的
  //1、消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
  //2、消除代码运行的一些不安全之处，保证代码运行的安全；
  //3、提高编译器效率，增加运行速度；
  //4、为未来新版本的Javascript做好铺垫
  "use strict";

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic'
  , 'ngCordova'
  , 'starter.controllers'
  , 'starter.services'
  , 'common.directive'
  , 'common.constants'
  , 'starter.commonValue'
  , 'starter.commonService'
  , 'hideTabs.directive'
  , 'ion-datetime-picker'
  , 'starter.interceptor'
  , 'live.directive.imgBoxScroll'
  ])
//引用的第三方插件进行了ngCordova封装，如$cordovaSQLite，故需引用ngCordova模块

/*
angular.module为我们公开的API有：
invokeQueue:按名约定的私有属性，请不要随意使用
runBlocks:按名约定的私有属性，请不要随意使用
requires
name
provider
factory:服务
service:服务
value:变量,在不同的组件之间共享一个变量
constant:常量
animation
filter:过滤器,
controller:控制器,使用控制器：1、对scope对象进行初始化；2、向scope对象添加方法
directive:指令
config
run
推荐使用链式定义这些组件，而不是声明一个全局的module变量
*/

.run(function($ionicPlatform,$ionicPopup,$location,$ionicHistory,$rootScope, $state,$ionicPickerI18n) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard  ,$localstorage
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });

  //退出功能start
  $ionicPlatform.registerBackButtonAction(function (e) {
      e.preventDefault();

    function showConfirm() {
      var confirmPopup = $ionicPopup.confirm({
        title: '<strong>退出应用?</strong>',
        template: '确定要退出应用吗?',
        okText: '退出',
        cancelText: '取消'
      });

      confirmPopup.then(function (res) {
        if (res) {
          ionic.Platform.exitApp();
        } else {
          // Don't close
        }
      });
    }

    // Is there a page to go back to?
    if (  $location.path() == '/tab/dash'
       || $location.path() == '/login'
       || $location.path() == '/tab/chats'
       || $location.path() == '/tab/account') {
      showConfirm();
    } else if ($ionicHistory.backView()) {
      $ionicHistory.goBack();
    } else {
      // This is the last page: Show confirmation popup
      showConfirm();
    }

    return false;
  }, 101);  
  //退出功能stop

  //登录start
  $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){

      if(toState.name === 'login')return;// 如果是进入登录界面则允许//$stateChangeSuccess
      // 如果用户不存在
      var userId = window.localStorage.getItem('userId');//window可省略
      if(!userId || userId == ''){
          //event.preventDefault();// 取消默认跳转行为
          //$state.go("login",{});//跳转到登录界面
          //代替上面两句的跳转方式.
          //上面两句会引起ionic.bundle.js报错，据说stateChangeStart事件会不停触发
          $location.path('/login');
          //$window.location.href
      } else {
          //Do nothing
      }
  });  
  //登录stop

  //ion-datetime-picker汉化功能start
  $ionicPickerI18n.weekdays = ["日","一", "二", "三", "四", "五", "六"];
  $ionicPickerI18n.months = ["01月", "02月", "03月", "04月", "05月", "06月", "07月", "08月", "09月", "10月", "11月", "12月"];
  //$ionicPickerI18n.ok = "确定";
  //$ionicPickerI18n.cancel = "取消";  
  //ion-datetime-picker汉化功能stop

})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider) {

  //将拦截器Interceptor添加到$httpProvider.interceptors数组
  $httpProvider.interceptors.push('Interceptor');

  // 对于视图的路由，ionic没有使用AngularJS的路由模块（ng-route），而是使用 了angular-ui项目的ui-route模块。
  // ionic.bundle.js已经打包了ui-route模块， 所以我们使用时不需要单独引入
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',                     
      controller: 'LoginController'   
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
    .state('tab.chat-detail', {
      url: '/dash/:smsAddress/:smsBody',
      views: {
        'tab-dash': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  //android环境，使Tab在底部
  $ionicConfigProvider.platform.android.tabs.position("bottom");
  $ionicConfigProvider.tabs.style('standard');

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});

})();