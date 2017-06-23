var express = require('express');
var router = express.Router();


function isValidWord(word) {
    word = word.toLowerCase();

    // Do a binary search
    let l = 0, r = words.length;
    while (l < r) {
        let mid = parseInt((l + r) / 2, 10),
            midWord = words[mid];
        if (midWord === word) {
            return true;
        }

        if (word.localeCompare(midWord) < 0) {
            r = mid - 1;
        } else {
            l = mid + 1;
        }
    }

    return words[r] === word;
}

/* GET home page. */
router.get('/word/:word', function(req, res, next) {
    let word = req.params.word;

    if (isValidWord(word)) {
        console.log(word, "good");
        res.status(200).send();
    } else {
        console.log(word, "not good");
        res.status(404).send();
    }
});

module.exports = router;