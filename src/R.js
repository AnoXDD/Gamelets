/**
 * Created by Anoxic on 9/6/2017.
 */

const LETTER_FREQUENCY = [0.08167, 0.09659, 0.12441, 0.16694, 0.29396, 0.31624, 0.33639, .39733, 0.46699, 0.46852, 0.47624, 0.51649, 0.54055, 0.60804, 0.68311, 0.7024, 0.70335, 0.76322, 0.82649, 0.91705, 0.94463, 0.95441, 0.97801, 0.97951, 0.99925, 1],
  CHARCODE_A = 97,
  WORD = require("./lib/WordSortedByLength.json");

module.exports = {
  GAME_STATE      : {
    IDLE : -1,
    READY: 1,
    START: 2,
  },
  LETTER_FREQUENCY: LETTER_FREQUENCY,
  CHARCODE_A      : CHARCODE_A,

  /**
   * Generates a random letter based on frequency
   */
  randomWeightedLetter: () => {
    let random = Math.random();
    return String.fromCharCode(CHARCODE_A + LETTER_FREQUENCY.findIndex(
        i => i > random));
  },

  /**
   * Only accepts word between 3-10 characters
   * @param word
   * @returns {boolean}
   */
  isSelectedWordValid(word) {
    let length = word.length;
    if (length <= 2 || length > 10) {
      return false;
    }
    length = `${length}`;

    word = word.toLowerCase();

    // Do a binary search
    let l = 0, r = WORD[length].length;
    while (l < r) {
      let mid = parseInt((l + r) / 2, 10),
        midWord = WORD[length][mid];

      if (midWord === word) {
        return true;
      }

      if (word.localeCompare(midWord) < 0) {
        r = mid - 1;
      } else {
        l = mid + 1;
      }
    }

    return WORD[length][r] === word;
  }

};