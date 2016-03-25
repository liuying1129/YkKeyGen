angular.module('common.constants', [])

.constant('AppConstant', {
	'APP_NAME':'oxostore',
	//https用手机访问没有任何问题，用浏览器调试时，需要先在浏览器地址中访问下，手动信任。为了省去浏览器调试时的麻烦，用http访问
	//'BASE_URL':'https://211.97.0.5:8443/YkAPI/service',
	'BASE_URL':'http://211.97.0.5:8080/YkAPI/service'
	//'https://yklis.vicp.net:8443/YkAPI/service'
});