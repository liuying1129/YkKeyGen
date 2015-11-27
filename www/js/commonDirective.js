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