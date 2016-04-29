/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

/**
 * Unicode algorithms for Hangul script, the Korean writing system
 *
 * Hangul script has three encoded models in Unicode:
 *
 * A) Conjoining Jamo (covers modern and historic elements)
 *    * U+1100..U+11FF ; Hangul Jamo
 *    * U+A960..U+A97F ; Hangul Jamo Extended-A
 *    * U+D7B0..U+D7FF ; Hangul Jamo Extended-B
 *
 * B) Conjoined Syllables (only covers modern Korean language)
 *    * U+AC00..U+D7AF ; Hangul Syllables
 *
 * C) Compatibility Jamo (one code-point for each "shape")
 *    * U+3130..U+318F ; Hangul Compatibility Jamo
 *
 * This modules helps you convert characters from one model to another.
 * Primary functionalities are:
 *
 * 1) Convert from any encodings to Conjoining Jamo characters (A),
 *    e.g. for prefix matching
 *
 * 2) Convert from any encodings to Syllable characters, when possible (B),
 *    e.g. to reach the normal Unicode form (NFC)
 */

'use strict';

var HANGUL_COMPATIBILITY_OR_SYLLABLE_REGEX = /[\u3130-\u318F\uAC00-\uD7AF]/;

/**
 * Returns true if the input includes any Hangul Compatibility Jamo or
 * Hangul Conjoined Syllable.
 *
 * @param {string} str
 */
function hasCompatibilityOrSyllable(str) {
  return HANGUL_COMPATIBILITY_OR_SYLLABLE_REGEX.test(str);
}

/* Compatibility Jamo -> Conjoining Jamo
 *
 * Maps a compatibility character to the Conjoining Jamo character,
 * positioned at (compatibilityCodePoint - 0x3131).
 *
 * Generated by:
 * $ grep '^31[3-8].;' UnicodeData.txt |\
 *     awk -F';' '{print $6}' | awk '{print "  0x"$2","}'
 */
var CMAP = [0x1100, 0x1101, 0x11AA, 0x1102, 0x11AC, 0x11AD, 0x1103, 0x1104, 0x1105, 0x11B0, 0x11B1, 0x11B2, 0x11B3, 0x11B4, 0x11B5, 0x111A, 0x1106, 0x1107, 0x1108, 0x1121, 0x1109, 0x110A, 0x110B, 0x110C, 0x110D, 0x110E, 0x110F, 0x1110, 0x1111, 0x1112, 0x1161, 0x1162, 0x1163, 0x1164, 0x1165, 0x1166, 0x1167, 0x1168, 0x1169, 0x116A, 0x116B, 0x116C, 0x116D, 0x116E, 0x116F, 0x1170, 0x1171, 0x1172, 0x1173, 0x1174, 0x1175, 0x1160, 0x1114, 0x1115, 0x11C7, 0x11C8, 0x11CC, 0x11CE, 0x11D3, 0x11D7, 0x11D9, 0x111C, 0x11DD, 0x11DF, 0x111D, 0x111E, 0x1120, 0x1122, 0x1123, 0x1127, 0x1129, 0x112B, 0x112C, 0x112D, 0x112E, 0x112F, 0x1132, 0x1136, 0x1140, 0x1147, 0x114C, 0x11F1, 0x11F2, 0x1157, 0x1158, 0x1159, 0x1184, 0x1185, 0x1188, 0x1191, 0x1192, 0x1194, 0x119E, 0x11A1];

var CBASE = 0x3131;
var CCOUNT = CMAP.length;
var CTOP = CBASE + CCOUNT;

/**
 * Maps one Hangul Compatibility Jamo code-point to the equivalent Hangul
 * Conjoining Jamo characters, as defined in UnicodeData.txt.
 *
 * @param {number} codePoint  One Unicode code-point
 * @output {string}
 */
function fromCompatibility(codePoint) {
  return String.fromCharCode(CMAP[codePoint - CBASE]);
}

/**
 * Conjoined Syllable -> Conjoining Jamo
 *
 * Based on the "Hangul Syllable Decomposition" algorithm provided in
 * 3.12 Conjoining Jamo Behavior, The Unicode Standard, Version 6.3.0.
 * <http://www.unicode.org/versions/Unicode6.2.0/ch03.pdf>
 */

var LBASE = 0x1100;
var VBASE = 0x1161;
var TBASE = 0x11A7;
var SBASE = 0xAC00;
var LCOUNT = 19;
var VCOUNT = 21;
var TCOUNT = 28;
var NCOUNT = VCOUNT * TCOUNT;
var SCOUNT = LCOUNT * NCOUNT;
var STOP = SBASE + SCOUNT;

/**
 * Maps one Hangul Syllable code-point to the equivalent Hangul
 * Conjoining Jamo characters, as defined in UnicodeData.txt.
 *
 * @param {number} codePoint  One Unicode character
 * @output {string}
 */
function decomposeSyllable(codePoint) {
  var sylSIndex = codePoint - SBASE;
  var sylTIndex = sylSIndex % TCOUNT;
  return String.fromCharCode(LBASE + sylSIndex / NCOUNT) + String.fromCharCode(VBASE + sylSIndex % NCOUNT / TCOUNT) + (sylTIndex > 0 ? String.fromCharCode(TBASE + sylTIndex) : '');
}

/* To Conjoining Jamo */

/**
 * Return Unicode characters as they are, except for Hangul characters, which
 * will be converted to the Conjoining Jamo form.
 *
 * @param {string} string
 * @output {string}
 */
function toConjoiningJamo(string) {
  if (!hasCompatibilityOrSyllable(string)) {
    return string;
  }

  var result = [];
  for (var i = 0; i < string.length; i++) {
    var charStr = string.charAt(i);
    var codeUnit = charStr.charCodeAt(0);
    result.push(CBASE <= codeUnit && codeUnit < CTOP ? fromCompatibility(codeUnit) : SBASE <= codeUnit && codeUnit < STOP ? decomposeSyllable(codeUnit) : charStr);
  }
  return result.join('');
}

var UnicodeHangulKorean = {
  toConjoiningJamo: toConjoiningJamo
};

module.exports = UnicodeHangulKorean;