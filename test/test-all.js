/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { strict as assert } from 'assert';

import { Horspool } from '../src/horspool.js';

function testMakeJumpTable() {
    let key1 = 'abcnabcd';
    let chars1 = Horspool.stringToChars(key1);
    let len1 = chars1.length;

    let table1 = Horspool.makeJumpTable(chars1);
    assert.equal(Horspool.getDistance(table1, 'd', len1), len1);
    assert.equal(Horspool.getDistance(table1, 'c', len1), 1);
    assert.equal(Horspool.getDistance(table1, 'b', len1), 2);
    assert.equal(Horspool.getDistance(table1, 'a', len1), 3);
    assert.equal(Horspool.getDistance(table1, 'n', len1), 4);
    assert.equal(Horspool.getDistance(table1, 'x', len1), len1);

    let key2 = 'define';
    let chars2 = Horspool.stringToChars(key2);
    let len2 = chars2.length;

    let table2 = Horspool.makeJumpTable(chars2);
    assert.equal(Horspool.getDistance(table2, 'n', len2), 1);
    assert.equal(Horspool.getDistance(table2, 'i', len2), 2);
    assert.equal(Horspool.getDistance(table2, 'f', len2), 3);
    assert.equal(Horspool.getDistance(table2, 'e', len2), 4);
    assert.equal(Horspool.getDistance(table2, 'd', len2), 5);
    assert.equal(Horspool.getDistance(table2, 'x', len2), len2);
}

function testFind() {

    // 这里设置断点可以跟 README 的分析过程同步
    let i = Horspool.find(
        'bamboo.isevergreenplantdefineend',
        'define');

    assert.equal(i,
        'bamboo.isevergreenplantdefineend'.indexOf('define'));

    // 下面是跟其他几个字符串搜索算法相同的目标字符串和关键字

    let s = 'ababbbabbbabaababaaabaaaaabababaabcdabdbabab';

    let k1 = 'abaab';
    assert.equal(Horspool.find(s, k1), s.indexOf(k1));

    let k2 = 'aaaab';
    assert.equal(Horspool.find(s, k2), s.indexOf(k2));

    let k3 = 'aabaaa';
    assert.equal(Horspool.find(s, k3), s.indexOf(k3));

    let k4 = 'abcdabd';
    assert.equal(Horspool.find(s, k4), s.indexOf(k4));
}

function testHorspool() {
    testMakeJumpTable();
    testFind();
    console.log('testHorspool() passed.');
}

(() => {
    testHorspool();
})();