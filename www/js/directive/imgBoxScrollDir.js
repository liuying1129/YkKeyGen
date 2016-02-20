angular.module('live.directive.imgBoxScroll', [])
    .directive('imgBoxScroll', function ($timeout, $ionicModal, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
        return {
            restrict: "E",
            scope: {
                imgarray: "=",
                candelete: "=",
                imgindex: "="
            },
            templateUrl: "js/directive/imgBoxScroll.html",
            controller: function () {
            },
            link: function (scope, el, attr) {
                var imgArrBak = [];//记录图片的序号
                var screenWidth = Number(document.body.clientWidth);
                var canSlide = true;
                scope.goSlide = function (i) {
                    //console.log(imgArrBak)
                    var delegate = $ionicScrollDelegate.$getByHandle("scroll_" + imgArrBak[i]);
                    var scrollPosition = delegate.getScrollPosition();
                    //screenWidth*scrollPosition.zoom（总图片宽）-(screenWidth-screenWidth/5)当前图片向左拖50可见图片宽度==向左拖动了多少
                    if (scrollPosition.left >= screenWidth * scrollPosition.zoom - (screenWidth - 50)) {
                        //alert("right")
                        if (canSlide) {
                            $ionicSlideBoxDelegate.next();
                        }
                        canSlide = false;
                        $timeout(function () {
                            canSlide = true;
                        }, 300)
                    }
                    if (scrollPosition.left < 50 * -1) {
                        if (canSlide) {
                            $ionicSlideBoxDelegate.previous();
                        }
                        canSlide = false;
                        $timeout(function () {
                            canSlide = true;
                        }, 300)
                    }
                }
                /*滑动切换图片*/
                scope.slideHasChanged = function (index) {
                    $ionicScrollDelegate.zoomTo(1);
                }

                scope.topHidden = false;
                /*控制顶栏显示&隐藏*/
                scope.topControl = function () {
                    scope.topHidden = scope.topHidden ? false : true;
                }

                /*删除当前图片*/
                scope.deletePicture = function () {
                    var index = $ionicSlideBoxDelegate.currentIndex();
                    if (imgArrBak.length == 0) {
                        for (var i = 0; i < scope.imgarray.length; i++) {
                            imgArrBak.push(i);
                        }
                    } else if (imgArrBak.length < scope.imgarray.length) {
                        var len = scope.imgarray.length - imgArrBak.length;
                        for (var i = 0; i < len; i++) {
                            imgArrBak.push(imgArrBak[imgArrBak.length - 1] + 1);
                        }
                    }
                    imgArrBak.splice(index, 1);
                    scope.imgarray.splice(index, 1);
                    if(scope.imgarray.length<=0){
                        scope.imgBoxModal.remove();
                    }else{
                        $timeout(function () {
                            $ionicSlideBoxDelegate.update();
                        },50)
                        $ionicSlideBoxDelegate.update();
                    }
                }

                scope.$watch('imgarray', function () {
                    if (scope.imgarray) {
                        var index = $ionicSlideBoxDelegate.currentIndex();
                        $timeout(function () {
                            //$ionicSlideBoxDelegate.update();
                            if (index == scope.imgarray.length) {
                                $ionicSlideBoxDelegate.previous();
                            }
                        }, 50);
                    }
                }, true);
                scope.$on('imgBoxModalShow', function(){
                    imgArrBak = [];
                    for (var i = 0; i < scope.imgarray.length; i++) {
                        imgArrBak.push(i);
                    }
                    //弹出筛选列表
                    $ionicModal.fromTemplateUrl('imgBoxModal.html', {
                        scope: scope,
                        animation: 'slide-in-up',
                        backdropClickToClose: false
                    }).then(function (modal) {
                        scope.imgBoxModal = modal;
                        scope.imgBoxModal.show();
                        $timeout(function () {
                            $ionicSlideBoxDelegate.enableSlide(false);
                            $ionicSlideBoxDelegate.slide(scope.imgindex, 0);
                        }, 50)
                    });
                });
                scope.$on('imgBoxModalHide',  function(){
                    scope.imgBoxModal.remove();
                });
                scope.backToCamera = function () {
                    scope.imgBoxModal.remove();
                    //scope.imgBoxModal.hide();
                }
            }
        }
    })
