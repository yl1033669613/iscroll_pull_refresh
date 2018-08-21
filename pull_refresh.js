// refresh
;
(function(win) {
    var options = {
        mouseWheel: false,
        scrollY: true,
        scrollX: false,
        probeType: 2,
        bindToWrapper: true,
        startY: 0,
        click: true,
        tap: true
    };

    var pullRefresh = function() {
        // 对象继承
        this.init.apply(this, arguments);
    };

    pullRefresh.prototype = {
        init: function() {
            this.config = {};
            this.scrollOptions = {};
            this.ele = null;
            this.myScroll = null;
            this.loadingStep = 0;
            this.isLoading = false;
            this.pullUpEnd = false;
            this.down = true;
            this.up = true;

            var args = Array.prototype.slice.call(arguments);

            if (args && args.length > 0) {
                this.ele = args[0];
                var config = args[1];
                var getType = Object.prototype.toString;
                if (config && getType.call(config) == "[object Object]") {
                    var c = extend(config, options);
                    this.config = c;
                    for (var key in c) {
                        if (key != "pullDownRefresh" && key != "pullUpRefresh") {
                            this["scrollOptions"][key] = c[key]
                        }
                    };

                    //判断是否启用下拉刷新或上拉加载
                    if (!this.config.pullDownRefresh) this.down = false;
                    if (!this.config.pullUpRefresh) this.up = false;
                }
            };

            this.start();
        },
        start: function() {
            var self = this;

            var scrollBox = win.document.querySelector(self.ele + " #i_scroller");
            var labelHtml = '<div class="pull-down-label">下拉刷新</div><div class="pull-up-label">上拉加载</div>';
            self.append(scrollBox, labelHtml); //添加refresh label

            pullDownLabel = win.document.querySelector(self.ele + " .pull-down-label");
            pullUpLabel = win.document.querySelector(self.ele + " .pull-up-label");

            //判断上拉 或者 下拉是否显示
            if (self.down) {
                self.showEle(pullDownLabel);
            };
            if (self.up) {
                self.showEle(pullUpLabel);
            };

            // 获取了label高度
            var pullDownOffset = pullDownLabel.offsetHeight,
                pullUpOffset = pullUpLabel.offsetHeight;

            self.myScroll = new IScroll(self.ele, self.scrollOptions); //实例化iscroll

            // iscroll 滚动事件
            self.myScroll.on("scroll", function() {
                if (self.loadingStep == 0) {
                    if (this.y >= pullDownOffset) { //下拉刷新操作  
                        if (self.down) {
                            self.loadingStep = 1;
                            pullDownLabel.innerText = "松手刷新数据";
                        }
                    };
                    if (this.y <= (this.maxScrollY - pullUpOffset)) { //上拉加载更多   
                        if (self.up) {
                            if (self.pullUpEnd) {
                                pullUpLabel.innerText = "没有更多了";
                                return;
                            };
                            self.loadingStep = 2;
                            pullUpLabel.innerText = "松手加载数据";
                        }
                    }
                }
            });

            //监听全局touchend事件 
            win.document.querySelector(self.ele).addEventListener("touchend", function(e) {
                e.preventDefault();
                if (self.isLoading) return;

                if (self.loadingStep == 1) {
                    self.loadingStep = 3;
                    self.myScroll.scrollTo(0, pullDownOffset, 800);
                    pullDownLabel.innerText = "刷新中...";
                    self.config.pullDownRefresh(self);
                    self.isLoading = true; //回调刷新开始
                } else if (self.loadingStep == 2) {
                    self.loadingStep = 4;
                    self.myScroll.scrollTo(0, self.myScroll.maxScrollY - pullUpOffset, 800);
                    pullUpLabel.innerText = "加载中...";
                    self.config.pullUpRefresh(self);
                    self.isLoading = true; //回调刷新开始
                }
            });

            //Event: refresh
            self.myScroll.on("refresh", function() {
                if (self.loadingStep == 3) {
                    pullDownLabel.innerText = "下拉刷新";
                    self.pullUpEnd = false;
                } else if (self.loadingStep == 4) {
                    pullUpLabel.innerText = "上拉加载";
                };

                self.loadingStep = 0;
                console.log('refresh finished!');
            });
        },
        stopPullRefresh: function() { //停止加载动作
            var self = this;
            setTimeout(function() {
                    self.iscrollRefash();
                    self.isLoading = false;
                }, 300) // 上下拉   div能自动被撑开  时间可以设置的短一些
        },
        iscrollRefash: function() { //更新icroll 
            this.myScroll.refresh();
        },
        /**
         * 设置上拉加载是否加载完所有数据
         * @param bool
         */
        isPullUpEnd: function(bool) {
            this.pullUpEnd = bool;
            if (this.pullUpEnd) {
                win.document.querySelector(".pull-up-label").innerText = "没有更多了";
            }
        },
        /**
         * javascrit原生实现jquery的append()函数
         * @param parent
         * @param text
         */
        append: function(parent, text) {
            if (typeof text === 'string') {
                var temp = win.document.createElement('div');
                temp.innerHTML = text;
                // 防止元素太多 进行提速
                var frag = win.document.createDocumentFragment();
                while (temp.firstChild) {
                    frag.appendChild(temp.firstChild);
                }
                parent.appendChild(frag);
            } else {
                parent.appendChild(text);
            }
        },
        hideEle: function(ele) {
            ele.style.visibility = "hidden";
        },
        showEle: function(ele) {
            ele.style.visibility = "visible";
        }
    };

    win.pullRefresh = function(ele, config) {
        return new pullRefresh(ele, config);
    };

    function extend(des, src, override) {
        if (src instanceof Array) {
            for (var i = 0, len = src.length; i < len; i++)
                extend(des, src[i], override);
        }
        for (var i in src) {
            if (override || !(i in des)) {
                des[i] = src[i];
            }
        }
        return des;
    }
})(window)
