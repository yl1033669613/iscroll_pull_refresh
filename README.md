# iscroll_pull_refresh
运用iscroll.js 实现移动端上拉加载 下拉刷新
```javascript
<!-- 引用pull_refresh.css 刷新加载的基本样式 -->
...
<link rel="stylesheet" href="pull_refresh.css">
...
<body>
    <div class="i_wrapper111">
        <div class="iscroll_wraper" id="i_wrapper">
            <!-- scroll 容器 容器使用绝对定位请在父元素上使用position: relative; 请务必设置该元素高度 -->
            <div id="i_scroller">
                <!-- scroll 滚动层 -->
                <!-- html goes here -->
                <p id='icon_close'>test text!</p>
                <ul class="ul111">
                    <li></li>
                </ul>
            </div>
        </div>
    </div>
</body>
<!-- 引用iscroll-probe.js 适配移动端 -->
<script src="iscroll-probe.js"></script> 
<!-- 引用pull_refresh.js 上拉加载以及下拉刷新实现 -->
<script src="pull_refresh.js"></script>
<script>
/**
 * 下拉刷新 上拉加载
 * @param ele scroll容器
 * @param options  iscroll参数 以及动作触发后的回调函数
 */
var refresh = pullRefresh("#i_wrapper", {
    pullDownRefresh: function(ref) { //下拉刷新 ajax goes here
        setTimeout(function() {
            var liEle = "<li></li>";
            document.querySelector(".ul111").innerHTML = liEle;
            // ref 回调的返回参数 返回实例本身
            ref.stopPullRefresh();
        }, 1000)
    },
    pullUpRefresh: function(ref) { //上拉加载 ajax goes here
        setTimeout(function() {
            var liEle = document.createElement("li");
            document.querySelector(".ul111").appendChild(liEle);

            ref.stopPullRefresh(); //停止pull-to-refresh 动作
            ref.isPullUpEnd(true); //判断是否加载完所有数据，是 -> true
        }, 1000)
    }
});
</script>
```
## 注意事项
由于iscroll.js 接管大部分页面事件，因此不能在滚动区域以外监听dom元素的事件，请妥善处理页面布局。
