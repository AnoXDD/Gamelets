/**
 * Created by Anoxic on 9/10/2017.
 *
 * A generator for generating candidates in Hanoi Tower
 */

/**
 Results:

 6: acehprs acehrst aeilrst abelrst adeilrs adelrst aelprst aelpsst acelrst aeelrst aelrsst aelrstv aelrsty acenrst aeenrst acdeprs aceprss aceprst adeiprs aeprsst aceerst aceorst acersst
 5: aehprs aceprs acehrs aehrst acerst acehrt eilrst aelrst aeirst aeilst aberst abelst aeilrs adelrs adeirs adeils aderst adelst aeprst aelpst aelprt aelsst acelst aeerst aeelst aersst aerstv aelstv aelrsv aersty aelrsy aenrst adeprs acders aeiprs aeorst
 4: aeprs aehrs acers aerst aehst aehrt acest eilst aelst aelrt airst ailst abest abelt aelrs aeirs aders adels aprst aepst aeprt aesty aersy aelsy aelry aenst aenrt aorst
 3: aers aeps aehs aest aert ehst aeht elst aelt aist airt aels apst aept esty aety aesy aery elsy aent aort

 */
"use strict";

const THRESHOLD = {
  3: 9,
  4: 16,
  5: 20,
  6: 24,
};

/**
 * Sort a string alphabetically
 */
function sortString(str) {
  return str.split("").sort().join("");
}

/**
 * Similar to ++map[key] in C++
 */
function incrementMap(map, key) {
  map[key] = map[key] ? ++map[key] : 1;
}

/**
 * Removes keys in the map whose value is smaller than the threshold
 */
function filterMap(map) {
  let keys = Object.keys(map);
  let threshold = THRESHOLD[keys[0].length - 1];
  return keys.filter(key => map[key] >= threshold);
}

function intersect(m, old) {
  let result = [];

  for (let oldWord of old) {
    for (let char = 97; char <= 122; ++char) { // a to z
      let newStr = sortString(oldWord + String.fromCharCode(char));
      if (m.indexOf(newStr) !== -1 && result.indexOf(newStr) === -1) {
        result.push(newStr);
      }
    }
  }

  return result;
}

console.log("Starting");
let data = require("../../lib/WordSortedByLength.json");
let old = [];
let raw = {};

for (let len = 3; len <= 6; ++len) {
  // Generate for 3-letter word
  let letters = data[`${len}`];
  let m = {};
  // Sort them
  for (let i = 0; i < letters.length; ++i) {
    for (let char = 97; char <= 122; ++char) { // a to z
      let newStr = sortString(letters[i] + String.fromCharCode(char));
      incrementMap(m, newStr);
    }
  }

  m = filterMap(m);
  if (len !== 3) {
    m = intersect(m, old);
  }
  old = m;
  raw[len] = old;
}

let result = {6:raw[6]};
for (let len = 6; len > 3; --len) {
  result[len - 1] = [];

  let words = result[len];
  for (let word of words) {
    for (let i = 0; i < len; ++i) {
      let cand = word.substring(0, i) + word.substring(i + 1, len + 1);
      if (raw[len - 1].indexOf(cand) !== -1 && result[len - 1].indexOf(cand) === -1) {
        result[len - 1].push(cand);
      }
    }
  }

  console.log(len + ": " + result[len].join(" "));
}

console.log("3: " + result[3].join(" "));

