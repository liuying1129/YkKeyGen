用法：

    yklis.commfuction.getSmsList(
      function(success) {
        alert('读取短信成功:'+ JSON.stringify(success).substring(0,200) );
    },
    function(errorStr) {
        alert('读取短信失败:'+ errorStr );
    });
    //注：JSON.stringify：将json对象转换为json字符串


success为JSON对象，格式如下：

    [{"body":"你好","address":"12345678901"},{"body":"第二条短信","address":"10987654321"},{"body":"第三条短信","address":"5677444545"}]



    yklis.commfuction.doSendSms(
      AAA,BBB,
      function(successStr) {
        alert('发送短信成功:'+ successStr );
    },
    function(errorStr) {
        alert('发送短信失败:'+ errorStr );
    });

    AAA--电话号码
    BBB--内容