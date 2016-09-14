;(function() {
	//设立"严格模式"的目的
	//1、消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
	//2、消除代码运行的一些不安全之处，保证代码运行的安全；
	//3、提高编译器效率，增加运行速度；
	//4、为未来新版本的Javascript做好铺垫
	"use strict";

	angular.module('common.constants', [])

.constant('AppConstant', {
	'APP_NAME':'oxostore',
	//https用手机访问没有任何问题，用浏览器调试时，需要先在浏览器地址中访问下，手动信任。为了省去浏览器调试时的麻烦，用http访问
	//'BASE_URL':'https://211.97.0.5:8443/YkAPI/service',
	'BASE_URL':'http://211.97.0.5:8080/YkAPI'
	//'https://yklis.vicp.net:8443/YkAPI/service'
});

})();