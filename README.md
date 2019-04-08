## 微信小秘书

让你闲置的微信号成为你的日常小秘书（没有闲置的也没关系，添加我的小助手微信号，给你分配一个小秘书）
## 功能

很听你话的私人小秘书，帮你创建定时任务，每日提醒，纪念日提醒，当日提醒

文字支持格式：（关键词之间需要用空格分开，）

* “提醒 我 18:30 快要下班了，准备一下，不要忘记带东西” **（当天指定时间提醒）**
* “提醒 其他人昵称 2019-09-10 10:00 工作再忙，也要记得喝水”**（委托小秘书提醒其他人）**
* “提醒 我 每天 8:00 出门记得带钥匙，公交卡还有饭盒”**（每日指定时间提醒）**
* “提醒 wo 2019-09-10 10:00 还有两天就是女朋友的生日，要提前准备一下” **（指定日期时间提醒）**

效果图如下：

提醒自己

![](https://user-gold-cdn.xitu.io/2019/4/1/169d8644f45b3b0e?w=1080&h=1920&f=png&s=605076)

委托提醒（前提是你和你想要提醒的人都是小秘书的好友，采用的是昵称查找用户，不是备注要注意）

![](https://user-gold-cdn.xitu.io/2019/4/2/169dc3941879e3d6?w=1137&h=1080&f=png&s=425417)

数据库中已添加任务

![](https://user-gold-cdn.xitu.io/2019/4/1/169d865ac41c305c?w=2136&h=904&f=png&s=249991)

## 安装

为了让数据持久化，使用了mongodb数据库，保存所有的定时任务，所以需要本地安装好mongodb数据库，本项目mongodb端口默认27017

## 项目运行

由于需要安装chromium,所以要先配置一下镜像，注意由于wechaty的限制，必须使用node10以上版本

### npm或者yarn 配置淘宝源

**(很重要，防止下载chromium失败，因为下载文件在150M左右，所以在执行npm run start后需要等待下载大概一两分钟以上，请耐心等待)**
npm

    npm config set registry https://registry.npm.taobao.org
    npm config set disturl https://npm.taobao.org/dist
    npm config set puppeteer_download_host https://npm.taobao.org/mirrors
yarn

    yarn config set registry https://registry.npm.taobao.org
    yarn config set disturl https://npm.taobao.org/dist
    yarn config set puppeteer_download_host https://npm.taobao.org/mirrors


### 下载项目安装依赖

    git clone git@github.com:gengchen528/wechat-assistant.git
    cd wechat-assistant.git
    npm install
    npm run start
    
### 扫描登录

用微信扫描控制台显示的二维码，在手机上同意登录即可。使用其他微信发送指定格式文字进行添加定时任务。

## 服务器部署
1、如果需要在服务器中部署，需要先扫描二维码登录一次，生成微信维持登录状态的json文件，如下图：

![](https://user-gold-cdn.xitu.io/2019/4/2/169dc2e62b83dca6?w=784&h=272&f=png&s=31668)
2、生成此文件后，可以使用pm2工具进行进程守护。由于为了方便，本地开发的时候，我设置的`npm run start`同时执行了两条命令，所以在服务器端部署的时候，建议先启动`koa.js`后再启动`index.js`


## 常见问题

1. 我的微信号无法登陆

    从2017年6月下旬开始，使用基于web版微信接入方案存在大概率的被限制登陆的可能性。 主要表现为：无法登陆Web 微信，但不影响手机等其他平台。 验证是否被限制登陆： https://wx.qq.com 上扫码查看是否能登陆。 更多内容详见：

    [Can not login with error message: 当前登录环境异常。为了你的帐号安全，暂时不能登录web微信。](https://github.com/Chatie/wechaty/issues/603)

    [[谣言] 微信将会关闭网页版本](https://github.com/Chatie/wechaty/issues/990)

    [新注册的微信号无法登陆](https://github.com/Chatie/wechaty/issues/872)

2. 执行npm run start时无法安装puppet-puppeteer&&Chromium

    * Centos7下部署出现以下问题
        ![](https://user-gold-cdn.xitu.io/2019/4/2/169dc293e5113f27?w=2812&h=2052&f=jpeg&s=708875)
        
        问题原因:[https://segmentfault.com/a/1190000011382062](https://segmentfault.com/a/1190000011382062)
        
        解决方案:
        
            #依赖库
            yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 -y
        
            #字体
            yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y
    *  windows下，下载puppeteer失败
    
       链接：https://pan.baidu.com/s/1YF09nELpO-4KZh3D2nAOhA 
       提取码：0mrz 
       
       把下载的文件放到如下图路径，并解压到当前文件夹中即可
       ![](https://user-gold-cdn.xitu.io/2019/4/2/169dc293e777f981?w=867&h=186&f=png&s=11203)
3. 支持 红包、转账、朋友圈… 吗

   支付相关 - 红包、转账、收款 等都不支持

4. 更多关于wechaty功能相关接口

     [参考wechaty官网文档](https://docs.chatie.io/v/zh/)

5. 其他问题解决方案
    * 本地是否安装了mongodb数据库
    * 先检查node版本是否大于10
    * 确认npm或yarn已经配置好淘宝源  
    * 存在package-lock.json文件先删除
    * 删除`node_modules`后重新执行`npm install` 或`cnpm install`

## 注意

 本项目属于个人兴趣开发，开源出来是为了技术交流，请勿使用此项目做违反微信规定或者其他违法事情。
 建议使用小号进行测试，有被微信封禁网页端登录权限的风险（客户端不受影响），请确保自愿使用。
 
 ## 最后
 
 我的小秘书已经学会了自动加好友功能，所以有兴趣的小伙伴可以加我的微信进行测试，她也可以是你的私人小秘书😆（注意别发太多信息，会把她玩坏的）
 
 ![](https://user-gold-cdn.xitu.io/2019/2/28/1693401c6c3e6b02?w=430&h=430&f=png&s=53609)

赶快亲自试一试吧，相信你会挖掘出更多好玩的功能

github:[https://github.com/gengchen528/wechat-assistant](https://github.com/gengchen528/wechat-assistant)
