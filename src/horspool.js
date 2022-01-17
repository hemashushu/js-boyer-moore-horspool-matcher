/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class Horspool {

    static find(testStr, keywordStr) {
        let testChars = Horspool.stringToChars(testStr);
        let testLength = testChars.length;

        let keywordChars = Horspool.stringToChars(keywordStr);
        let keywordLength = keywordChars.length;

        let table = Horspool.makeJumpTable(keywordChars);

        let start = 0; // 开始查找的目标字符串里的字符位置
        while (start < testLength - keywordLength) {
            // 确定 i, j 的初始值
            let i = start + keywordLength - 1;
            let j = keywordLength - 1;

            // 从关键字的最右侧开始逐个字符比较
            while (j >= 0 && testChars[i] === keywordChars[j]) {
                // 如果字符匹配，则同时左移 i, j
                i--;
                j--;
            }

            if (j === -1) {
                // j 已经移动到最左边了，说明所有字符都匹配了
                return start;
            }

            let failedChar = testChars[start + keywordLength - 1]; // 这里取目标字符串当中本次失败匹配的最右侧的那个字符

            // 查看该字符有无存在关键字里，有的话，看看最靠近右侧的那个跟右侧的距离。
            let distance = Horspool.getDistance(table, failedChar, keywordLength);

            // 跳过关键字的长度，或者让关键字当中最靠近右侧的跟匹配失败字符一样的字符，跟失败字符对齐。
            start += distance;
        }

        return -1; // 找不到关键字
    }

    /**
     * "字符跳转表" 就是 `关键字` 里每个字符距离最右侧的长度，如果有重复的字符则只算最靠近右侧的
     * 那个，其中最右侧的第一个字符不算入该表（因为该字符距离右侧的值是 0）。
     *
     * 比如关键字 "abcnabcd" 的 "字符跳转表" 是：
     *
     * | 索引 | 字符 | 距离     |
     * |----:|:----:|---------:|
     * | 7   | d    | 不算     |
     * | 6   | c    | 1        |
     * | 5   | b    | 2        |
     * | 4   | a    | 3        |
     * | 3   | n    | 4        |
     * | 2   | c    | 已存在，1 |
     * | 1   | b    | 已存在，2 |
     * | 0   | a    | 已存在，3 |
     *
     * 对于 `关键字` 当中不存在的字符，跳转距离显然是整个 `关键字` 的长度，即 8。
     *
     * 该表可以使用一个二叉树来存储，如果字符集很小，比如仅限搜索 ascii，则可以使用一个 256 大小的数组来存储。
     *
     * @param {*} keywordChars
     */
    static makeJumpTable(keywordChars) {
        let table = new Map();
        let keywordLength = keywordChars.length;
        for (let idx = 0; idx < keywordLength - 1; idx++) { // 最右侧的那个字符不能算入跳转表，所以 `idx < keywordLength - 1`
            let distance = keywordLength - idx - 1;
            table.set(keywordChars[idx], distance);
        }

        return table;
    }

    static getDistance(table, char, keywordLength) {
        let i = table.get(char);
        return (i === undefined) ? keywordLength : i;
    }

    static stringToChars(str) {
        let chars = [];
        for (let c of str) {
            chars.push(c);
        }
        return chars;
    }
}

export { Horspool };