;(function() {
	//设立"严格模式"的目的
	//1、消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
	//2、消除代码运行的一些不安全之处，保证代码运行的安全；
	//3、提高编译器效率，增加运行速度；
	//4、为未来新版本的Javascript做好铺垫
	"use strict";

	angular.module("common.directive",[])
.directive("lyScanbarcode",function(){
	return {
		template : "<button class='button button-clear icon-left ion-qr-scanner button-calm' ng-click='scanBarcode()'></button>",
        /*link : function(scope, element, attrs) {
            scope.scanBarcode = function() {
                alert("点击事件link");
            };
        },*/
        controller: function($scope,$element,$ionicPopup,$timeout){  
            $scope.scanBarcode = function() {
			    //扫描前的延时
			    var alertPopup = $ionicPopup.alert({
			        template: '扫描中...'
			    });
			    alertPopup.then(function(res) {});
			    $timeout(function() {
			        alertPopup.close(); //由于某种原因3秒后关闭弹出
			    }, 1000);

		        cordova.plugins.barcodeScanner.scan(
		          function (result) {
			        $scope.$apply(function(){
			            //$scope.$apply更新该$scope.enCryptSmsBody到view
			            $scope.barcodeResult = result;
			        });         		          	
	                /*alert("We got a barcode\n" +
	                    "Result: " + result.text + "\n" +
	                    "Format: " + result.format + "\n" +
	                    "Cancelled: " + result.cancelled);*/
		          }, 
		          function (error) {
		              alert("Scanning failed: " + error);
		          }
		        );
            };
        }                    
            
	};
});

})();