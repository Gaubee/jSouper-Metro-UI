console.group("加载应用程序核心jSouper");
console.group("加载jQuery");

define("common", ["jSouper", "jQuery"], function(jSouper) {
    console.groupEnd("加载应用程序核心jSouper");
    console.groupEnd("加载jQuery");

    console.info("核心组件加载完成");

    /*
     * 初始化jSouper程序
     */
    console.group("初始化jSouper程序");
    jSouper.ready(function() {
        jSouper.app({
            Id: "jSouperApp",
            Data: {
                title:"jSouper App"
            }
        })
    });
    console.groupEnd("初始化jSouper程序");
    console.group("加载通用样式");
    require(["r_css!./css/common.css"])
    console.groupEnd("加载通用样式");

    return jSouper;
});
