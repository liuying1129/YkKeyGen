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