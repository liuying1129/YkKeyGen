
angular.module('live.directive.imgBoxScroll', [])
    .directive('imgBoxScroll', function ($timeout,$ionicModal,$ionicHistory,$ionicSlideBoxDelegate,$ionicScrollDelegate) {
        return {
            restrict:"E",
            scope:{
                imgarray:"=",
                candelete:"=",
                show:"="
            },
            templateUrl:"js/directive/imgBoxScroll.html",
            controller:function(){
                //console.log($ionicSlideBoxDelegate)

            },
            link:function(scope, el, attr){
                //alert(scope.candelete)
              //弹出筛选列表
              $ionicModal.fromTemplateUrl('imgBoxModal.html', {
                scope: scope,
                animation: 'slide-in-up',
                backdropClickToClose: false
              }).then(function (modal) {
                scope.imgBoxModal = modal;
                //scope.imgBoxModal.show();
                scope.$watch('show',function(){
                  if(scope.show){
                    scope.imgBoxModal.show();
                  }else{
                    scope.imgBoxModal.hide();
                  }
                })
                $timeout(function(){
                  $ionicSlideBoxDelegate.enableSlide(false);
                  //alert($ionicSlideBoxDelegate.enableSlide())
                  //$ionicScrollDelegate.zoomTo(2);
                  //alert(document.body.clientWidth)
                })

              });
              scope.myActiveSlide=0;
              var screenWidth=Number(document.body.clientWidth);
              var canSlide=true;
              scope.goSlide=function(i){
                var delegate = $ionicScrollDelegate.$getByHandle("scroll_"+i);
                var scrollPosition=delegate.getScrollPosition();
                //screenWidth*scrollPosition.zoom（总图片宽）-(screenWidth-screenWidth/5)当前图片向左拖50可见图片宽度==向左拖动了多少
                if(scrollPosition.left>=screenWidth*scrollPosition.zoom-(screenWidth-50)){
                  //alert("right")
                  if(canSlide){
                    $ionicSlideBoxDelegate.next();
                  }
                  canSlide=false;
                  $timeout(function(){
                    canSlide=true;
                  },300)
                }
                if(scrollPosition.left<50*-1){
                  if(canSlide) {
                    $ionicSlideBoxDelegate.previous();
                  }
                  canSlide=false;
                  $timeout(function(){
                    canSlide=true;
                  },300)
                }
              }
              /*滑动切换图片*/
              scope.slideHasChanged = function (index) {
                $ionicScrollDelegate.zoomTo(1);
                //var scroll=angular.element('#imgBox').find('.scroll');
                //scroll.each(function(i,e){
                //  if(i!=index){
                //    scroll.eq(i).css('-webkit-transform','translate3d(0px, 0px, 0px) scale(1)');
                //  }
                //});

              }

              scope.topHidden=false;
              /*控制顶栏显示&隐藏*/
              scope.topControl=function(){
                scope.topHidden=scope.topHidden?false:true;
              }

              /*删除当前图片*/
              scope.deletePicture = function () {
                var index = $ionicSlideBoxDelegate.currentIndex();
                if (scope.imgarray.length != 1) {
                  scope.imgarray.splice(index, 1);
                }

              }

              scope.$watch('imgarray', function () {
                if(scope.imgarray) {
                  var index = $ionicSlideBoxDelegate.currentIndex();
                  $timeout(function() {
                    $ionicSlideBoxDelegate.update();
                    if (index == scope.imgarray.length) {
                      $ionicSlideBoxDelegate.previous();
                    }
                  },50);
                }

              },true);

              scope.backToCamera=function(){
                //scope.show=false;
                scope.imgBoxModal.hide();
              }

            }
        }
    })
