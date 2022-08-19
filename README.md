# 基于行云封装的npm包
1.在场车管理<br>
2.固定车管理<br>
3.黑名单管理<br>
# 项目中使用
1.main.js入口文件中引入行云npm包<br>
2.import 包<br>
3.<car-park :npmParams="npmParams"></car-park> 页面中使用<br>
npmParams:{
    // 必须，当前要展示的组件【inParkCar（在场车管理）；2.fixedCar（固定车管理）；3.blackList（黑名单管理）】
    currentComponent: "",
    // 车场名称
    parkName: ""   
} 

# 注意
注：<br>
1.根据服务器ip不同来区分调用行云和管家云后台api【目前包中所使用api和行云之前的结构一模一样】<br>
2.vuex公用【可能行云中的变量，管家云中没有的话需要补充完整】<br>
3.行云的全局依赖可能存在管家云没有的情况，所以需要打入到包中。（理论上components|utils中的代码要和行云主项目中的保持一致）<br>
4.包中的组件引导都使用相对路径【因为最终下载包是放在node_modules中，如果不用相对路径，而使用@/views|@/src等路径的话，会导致引用组件异常】<br>
5.这次行云封装的包【黑名单-编辑（目前注释掉了）】有用到依赖lodash，如果要开启此功能要么管家云也要对应安装此依赖包，要么改用其他写法（不用lodash）实现此功能。<br>
6.行云运用到的第三方依赖dayjs|xlsx，管家云要对应安装<br>
7.行云业务组件样式文件引入，样式可能冲突=>放到封装的根组件中引入样式文件【不能用scoped，增加s-iot根类名来做css隔离。<br>
8.在哪个项目工程中使用，需要在对应项目的window【目前放在request.js中】增加applyApp=> "erp"（erp工程项目）| "iot || 不增加此属性"（行云工程项目）<br>
9.xlsx@0.15.6，升级版本后会导致import导入异常，此依赖版本安装需慎重。<br>
