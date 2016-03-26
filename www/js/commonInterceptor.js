;(function() {
	//设立"严格模式"的目的
	//1、消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
	//2、消除代码运行的一些不安全之处，保证代码运行的安全；
	//3、提高编译器效率，增加运行速度；
	//4、为未来新版本的Javascript做好铺垫
	"use strict";
	
angular.module('starter.interceptor', [])

.factory('Interceptor', function() {

/*拦截器允许你:

通过实现 request 方法拦截请求: 
该方法会在 $http 发送请求到后台之前执行，因此你可以修改配置或做其他的操作。
该方法接收请求配置对象(request configuration object)作为参数，然后必须返回配置对象或者 promise 。
如果返回无效的配置对象或者 promise 则会被拒绝，导致 $http 调用失败。

通过实现 response 方法拦截响应: 
该方法会在 $http 接收到从后台过来的响应之后执行，因此你可以修改响应或做其他操作。
该方法接收响应对象(response object)作为参数，然后必须返回响应对象或者 promise。
响应对象包括了请求配置(request configuration)，头(headers)，状态(status)和从后台过来的数据(data)。
如果返回无效的响应对象或者 promise 会被拒绝，导致 $http 调用失败。

通过实现 requestError 方法拦截请求异常: 
有时候一个请求发送失败或者被拦截器拒绝了。请求异常拦截器会俘获那些被上一个请求拦截器中断的请求。
它可以用来恢复请求或者有时可以用来撤销请求之前所做的配置，比如说关闭进度条，激活按钮和输入框什么之类的。

通过实现 responseError 方法拦截响应异常: 
有时候我们后台调用失败了。也有可能它被一个请求拦截器拒绝了，或者被上一个响应拦截器中断了。
在这种情况下，响应异常拦截器可以帮助我们恢复后台调用。	
*/

//http://my.oschina.net/ilivebox/blog/290881?fromerr=v4eBybfq

	var myInterceptor={

        request : function(config) {

        	config.headers['X-Access-Token'] = window.localStorage.getItem('token');

            return config;

        }/*,
        response : function(config) {

            return config;

        },
        requestError : function(rejectReason) {

            return rejectReason;

        },
        responseError : function(response) {

            return response;

        }*/

	};

	return myInterceptor;
});

})();