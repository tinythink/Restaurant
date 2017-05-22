下载到本地查看效果，步骤如下:

	git clone https://github.com/tinythink/Restaurant.git
	cd Restaurant && cnpm install
	node app.js
	
然后再本地浏览器中输入 localhost:5000 即可查看网页。

后台管理登录界面: localhost:5000/login.html,管理员账户名:restroot, 密码: restroot

由于后台信息全部存储在 `MongoDB` 中，所以在后台添加信息的时候需要运行 `MongoDB` 服务。

接下来的任务有：

1. 支持上传食物图片和新闻图片，并且保存在 `MongoDB` 中
2. 书写后台管理界面以及样式
3. 用户各页面以及样式

### 更新记录

##### 20170522
已经支持后台添加新闻和修改新闻并且在前端显示出来。
