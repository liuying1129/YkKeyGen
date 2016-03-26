;(function() {
    //设立"严格模式"的目的
    //1、消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
    //2、消除代码运行的一些不安全之处，保证代码运行的安全；
    //3、提高编译器效率，增加运行速度；
    //4、为未来新版本的Javascript做好铺垫
    "use strict";

    angular.module('starter.commonValue', [])

//angularjs 设置全局变量
.value('CommonValue', {
    globalVar1:"全局变量1初始值",
    globalVar2:"全局变量2初始值"
});

})();
