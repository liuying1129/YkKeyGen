// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic'
  ,'ngCordova'
  , 'starter.controllers'
  , 'starter.services'
  , 'common.directive'
  , 'common.constants'
  , 'starter.commonService'
  , 'hideTabs.directive'
  , 'ion-datetime-picker'
  ])

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

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  //将拦截器Interceptor添加到$httpProvider.interceptors数组
  $httpProvider.interceptors.push('Interceptor');

  // Ionic uses AngularUI Router which uses the concept of states
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
