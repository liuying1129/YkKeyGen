;(function() {
    //设立"严格模式"的目的
    //1、消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
    //2、消除代码运行的一些不安全之处，保证代码运行的安全；
    //3、提高编译器效率，增加运行速度；
    //4、为未来新版本的Javascript做好铺垫
    "use strict";

    angular.module("hideTabs.directive",[])
//实现进入二级页面时隐藏tabs导航栏
//修改tabs.html,在其中增加ng-class="{'tabs-item-hide': $root.hideTabs}"
//希望处理的二级页面的标签ion-view上添加表达式hide-tabs="true"
.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$on('$ionicView.beforeEnter', function() {
                scope.$watch(attributes.hideTabs, function(value){
                    $rootScope.hideTabs = value;
                });
            });

            scope.$on('$ionicView.beforeLeave', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
});

})();