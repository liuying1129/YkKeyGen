https://github.com/katemihalikova/ion-datetime-picker

使用方法：
1、ion-datetime-picker.min.css、ion-datetime-picker.min.js，将这两个文件复制到项目中
2、在index.html中引用上述的两个文件
3、在app.js中依赖模块"ion-datetime-picker"
4、在需要的地方进行调用
        <ion-datetime-picker ng-model="datetimeValue">
          {{datetimeValue | date: "yyyy-MM-dd HH:mm:ss"}}
        </ion-datetime-picker>


注意：
在Ionic v1.0.1下使用有问题：月份的排序乱了