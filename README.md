# JS Boyer-Moore-Horspool Matcher

简单的 Boyer-Moore-Horspool 算法的实现，用于学习之目的，代码当中有每一部分的详细说明。

## 算法简介

Boyer-Moore-Horspool 是一种在字符串里搜索指定关键字的方法，比如在各种文本编辑器里使用 "查找" 功能就是字符串搜索。

### 简单思想

### 建立 "...表" 的方法

## 单元测试

执行命令：

`$ npm test`

应该能看到 `testKMP() passed.` 字样。

## 单步调试/跟踪

有时可能跟踪程序的运行也能帮助对程序的理解，启动单步调试的方法是：

在 vscode 里打开该项目，然后在单元测试文件 [test-all.js](./test/test-all.js) 或者源码 [horspool.js](./src/horspool.js) 里设置断点，然后执行 `Run and Debug` 即可。
