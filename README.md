# JS Boyer-Moore-Horspool Matcher

简单的 Boyer-Moore-Horspool 算法的实现，用于学习之目的，代码当中有每一部分的详细说明。

## 算法简介

Boyer-Moore-Horspool 算法（是 Boyer-Moore 算法的简化版，有时也简称为 Horspool 算法）是一种字符串搜索算法。字符串搜索是指在 `目标字符串` 里搜索指定 `关键字` 所出现的位置，比如在各种文本编辑器里使用 "查找" 功能就是字符串搜索。

Horspool 算法跟 [KMP](https://github.com/hemashushu/js-kmp-matcher) 算法类似，也是在暴力搜索 （Brute-force search） 的基础之上，利用一些巧妙的方法跳过那些显然无需匹配的部分而达到加速之目的。跟 KMP 不同的是，该算法很容易实现，而且对大字符集（比如中文）的加速效果也很好。

### 简单思想

1. Horspool 假设 `目标字符串` 里有些字符在 `关键字` 里不存在，或者在 `关键字` 里有重复的字符；
2. 在每轮跟 `关键字` 比较字符时，都是从 `关键字` 最右边开始逐个字符比较；

示例:

```text
       01234567890123456789012345678
start--v    v-- i
.......bamboo.isevergreenplantdefine... <-- 目标字符串
       define                           <-- 关键字字符串
            ^-- j
```

在上图中，先从 `关键字` 最右边字符 `e` 开始比较，发现第一个字符就不匹配，因为 `关键字` `define` 里不存在字符 `o`，所以可以直接跳过 6 个字符，然后从 `ever` 的 `e` 字母开始比较：

```text
       01234567890123456789012345678
      start--v    v-- i
.......bamboo.isevergreenplantdefine... <-- 目标字符串
             define                     <-- 关键字字符串
                  ^-- j
```

这次第一个字符 `e` 是匹配的，然后将 `i` 和 `j` 的位置同时往左边移动，然后发现字符 `v` 不匹配，因为这次是从字符 `e` 开始匹配的，所以查看关键字里有没有字符 `e`（注意不是查找失败匹配的那个字符，而是本次第一个开始的字符），这个例子里有，所以让关键字右移，让最靠近右侧的 `e` 跟 `目标字符串` 的 `e` 对齐：

```text
       01234567890123456789012345678
          start--v    v-- i
.......bamboo.isevergreenplantdefine... <-- 目标字符串
                 define                 <-- 关键字字符串
                      ^-- j
```

然后再次从关键字最右侧开始搜索，这次第一个字符 `e` 仍然是匹配的，所以将 `i` 和 `j` 的位置同时往左边移动，然后发现字符 `r` 不匹配：

```text
       01234567890123456789012345678
          start--v   v-- i
.......bamboo.isevergreenplantdefine... <-- 目标字符串
                 define                 <-- 关键字字符串
                     ^-- j
```

查看关键字存在 `e`，右移关键字对齐 `e`，并从关键字最右侧开始搜索。

```text
       01234567890123456789012345678
              start--v    v-- i
.......bamboo.isevergreenplantdefine... <-- 目标字符串
                     define             <-- 关键字字符串
                          ^-- j
```

第一个字符 `l` 不匹配，且关键字当中不存在，所以放心跳过 6 个字符。

```text
       01234567890123456789012345678
                    start--v    v-- i
.......bamboo.isevergreenplantdefine... <-- 目标字符串
                           define             <-- 关键字字符串
                                ^-- j
```

右移关键字，对齐 `f`：

```text
       01234567890123456789012345678
                       start--v    v-- i
.......bamboo.isevergreenplantdefine... <-- 目标字符串
                              define    <-- 关键字字符串
                                   ^-- j
```

`j` 减少到 0：

```text
       01234567890123456789012345678
                       start--v-- i
.......bamboo.isevergreenplantdefine... <-- 目标字符串
                              define    <-- 关键字字符串
                              ^-- j
```

这时表示已经找到完全匹配的字符串，且 `i` 就是该字符串的位置。

从上面的原理可见：

1. 每次匹配都是 "从关键字最右侧开始匹配"；
2. 当匹配目标字符串上的字符失败时，都先查看 `关键字` 里是否存在同样的字符，为了加速这个查看过程，可以事先准备好一张 "字符跳转表"；
3. 当 `关键字` 不存在指定的字符时，可以放心跳过整个关键字长度；
4. 当 `关键字` 存在指定的字符时，就让关键字右移（移动的数量刚好是最靠近右侧的该字符到右侧的距离），让这两个字符对齐，然后再重复 "从关键字最右侧开始匹配" 这个过程。

### 建立 "字符跳转表" 的方法

"字符跳转表" 就是 `关键字` 里每个字符距离最右侧的长度，如果有重复的字符则只算最靠近右侧的那个，其中最右侧的第一个字符不算入该表（因为该字符距离右侧的值是 0）。

比如关键字 "abcnabcd" 的 "字符跳转表" 是：

| 索引 | 字符 | 距离     |
|----:|:----:|---------:|
| 7   | d    | 不算     |
| 6   | c    | 1        |
| 5   | b    | 2        |
| 4   | a    | 3        |
| 3   | n    | 4        |
| 2   | c    | 已存在，1 |
| 1   | b    | 已存在，2 |
| 0   | a    | 已存在，3 |

对于 `关键字` 当中不存在的字符，跳转距离显然是整个 `关键字` 的长度，即 8。

该表可以使用一个二叉树来存储，如果字符集很小，比如仅限搜索 ascii，则可以使用一个 256 大小的数组来存储。

## 单元测试

执行命令：

`$ npm test`

应该能看到 `testHorspool() passed.` 字样。

## 单步调试/跟踪

有时跟踪程序的运行过程，能帮助对程序的理解，启动单步调试的方法是：

在 vscode 里打开该项目，然后在单元测试文件里设置断点，再执行 `Run and Debug` 即可。

## 字符串搜索算法系列项目

- JS Rabin-Karp Matcher
  https://github.com/hemashushu/js-rabin-karp-matcher

- JS Boyer-Moore-Horspool Matcher
  https://github.com/hemashushu/js-boyer-moore-horspool-matcher

- JS KMP Matcher
  https://github.com/hemashushu/js-kmp-matcher

- JS Aho-Corasick Matcher
  https://github.com/hemashushu/js-aho-corasick-matcher

- JS Regexp Interpreter
  https://github.com/hemashushu/js-regexp-interpreter
