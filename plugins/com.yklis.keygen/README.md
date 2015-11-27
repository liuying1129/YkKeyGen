用法：

    yklis.commfuction.getEnCrypt(待加密的字符串,
      function(successStr) {
        alert('加密字符串成功:'+ successStr );
    },
    function(errorStr) {
        alert('加密字符串失败:'+ errorStr );
    });