/**
 * Created by luodan on 2016/10/12.
 * 执行webpack：webpack --display-error-details
 * 后面的参数“--display-error-details”是推荐加上的，方便出错时能查阅更详尽的信息（比如 webpack 寻找模块的过程），从而更好定位到问题
 * webpack --config XXX.js   //使用另一份配置文件（比如webpack.config2.js）来打包
 * webpack --watch   //监听变动并自动打包
 * webpack -p    //压缩混淆脚本，这个非常非常重要
 * webpack -d    //生成map映射文件，告知哪些模块被最终打包到哪里了
 * 其中的 -p 是很重要的参数，曾经一个未压缩的 700kb 的文件，压缩后直接降到 180kb（主要是样式这块一句就独占一行脚本，导致未压缩脚本变得很大）
 * 模块引入：
 * 直接在页面引入 webpack 最终生成的页面脚本即可
 */
var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    //插件项 使用了一个 CommonsChunkPlugin 的插件，它用于提取多个入口文件的公共脚本部分，然后生成一个 common.js 来方便多页面之间进行复用
    plugins: [commonsPlugin, new ExtractTextPlugin("[name].css")],
    /*
    entry 是页面入口文件配置，output 是对应输出项配置（即入口文件最终要生成什么名字的文件、存放到哪里）
    entry: {
     page1: "./page1",
     //支持数组形式，将加载数组中的所有模块，但以最后一个模块作为输出
     page2: ["./entry1", "./entry2"]
     },
    output: {
     path: "dist/js/page",
     filename: "[name].bundle.js"
     该段代码最终会生成一个 page1.bundle.js 和 page2.bundle.js，并存放到 ./dist/js/page 文件夹下。
     }
    */
    //页面入口文件配置
    entry: {
        //支持数组形式，将加载数组中的所有模块，但以最后一个模块作为输出
        // index : './src/js/page/index.js'
    },
    //入口文件输出配置
    output: {
        // path: 'dist/js/page',
        // filename: '[name].js'
    },
    module: {
        /*
        * 加载器配置——告知 webpack 每一种文件都需要使用什么加载器来处理
        * "-loader"其实是可以省略不写的，多个loader之间用“!”连接起来
        * 注意所有的加载器都需要通过 npm 来加载  eg.npm install url-loader -save-dev
        */
        loaders: [
            //.css 文件使用 style-loader 和 css-loader 来处理
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            //.js 文件使用 jsx-loader 来编译处理
            { test: /\.js$/, loader: 'jsx-loader?harmony' },
            //.scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    //其它解决方案配置
    resolve: {
        //查找module的话从这里开始查找
        root: 'E:/github/flux-example/src', //绝对路径
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['', '.js', '.json', '.scss'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            AppStore : 'js/stores/AppStores.js', //后续直接 require('AppStore') 即可
            ActionType : 'js/actions/ActionType.js',
            AppAction : 'js/actions/AppAction.js'
        }
    }
};