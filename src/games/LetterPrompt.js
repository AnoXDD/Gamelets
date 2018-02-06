/**
 * Created by Anoxic on 6/24/2017.
 */
import React, {Component} from "react";

import Button from "../lib/Button";
import Game from "../lib/Game";
import Letter from "../lib/Letter";

import * as R from "../R";
import WordDashboard from "../components/WordDashboard";

const HIDDEN_CHAR = "·";

const KEYS = [
  {
    prompt : "red",
    letters: "flagdyebo",
    words  : ["flag", "dye", "blood", "eye", "leaf"],
  },
  {
    prompt : "apple",
    letters: "fruitecdo",
    words  : ["fruit", "tree", "cider", "food", "red", "doctor", "feed"],
  },
  {
    prompt : "egg",
    letters: "birdyolkf",
    words  : ["bird", "yolk", "food", "brood", "roll", "fry", "oil", "blood", "york"],
  },
  {
    prompt : "bee",
    letters: "honeyisct",
    words  : ["honey", "insect", "nest", "host"],
  },
  {
    prompt : "foot",
    letters: "musclegho",
    words  : ["muscle", "leg", "heel", "shoe"],
  },
  {
    prompt : "hand",
    letters: "fingerbop",
    words  : ["finger", "bone", "ring", "grip", "green", "forefinger"],
  },
  {
    prompt : "door",
    letters: "hingeopsw",
    words  : ["hinge", "open", "swing", "spin"],
  },
  {
    prompt : "cat",
    letters: "domesticp",
    words  : ["domestic", "species", "pet", "mice", "tom"],
  },
  {
    prompt : "fish",
    letters: "watersymg",
    words  : ["water", "system", "egg", "sea"],
  },
  {
    prompt : "water",
    letters: "icelqudfo",
    words  : ["ice", "liquid", "life", "cloud", "fluid", "flood", "cold"],
  },
  {
    prompt : "sport",
    letters: "gamefotbl",
    words  : ["game", "football", "team", "goal", "ball"],
  },
  {
    prompt : "window",
    letters: "framepnou",
    words  : ["frame", "pane", "roof", "open", "room"],
  },
  {
    prompt : "computer",
    letters: "progamey",
    words  : ["program", "memory", "ram", "rom", "programmer", "error", "game"],
  },
  {
    prompt : "sun",
    letters: "solarethn",
    words  : ["solar", "earth", "star", "nasa", "heat", "stellar", "hot"],
  },
  {
    prompt : "moon",
    letters: "lunareths",
    words  : ["lunar", "earth", "nasa", "sun", "nature", "star"],
  },
  {
    prompt : "black",
    letters: "lightnksy",
    words  : ["light", "ink", "list", "sky", "night"],
  },
  {
    prompt : "pencil",
    letters: "graphites",
    words  : ["graphite", "eraser", "paper", "art", "sharp"],
  },
  {
    prompt : "music",
    letters: "soundtyle",
    words  : ["sound", "style", "notes", "tone", "solo", "tune", "lesson"],
  },
  {
    prompt : "cellphone",
    letters: "networkxi",
    words  : ["network", "text", "internet", "tower"],
  },
  {
    prompt : "party",
    letters: "evntdirf",
    words  : ["event", "dinner", "friend", "eve", "invite"],
  },
  {
    prompt : "face",
    letters: "emotinsl",
    words  : ["emotion", "smile", "nose", "sense", "smell"],
  },
  {
    prompt : "map",
    letters: "scaleftur",
    words  : ["scale", "features", "surface", "east", "atlas", "sea"],
  },
  {
    prompt : "winter",
    letters: "snowcldie",
    words  : ["snow", "cold", "ice", "wind", "low", "cool", "die"],
  },
  {
    prompt : "shoe",
    letters: "botfhelg",
    words  : ["boot", "foot", "heel", "toe", "feet", "leg"],
  },
  {
    prompt : "team",
    letters: "groupmebl",
    words  : ["group", "member", "people", "peer"],
  },
  {
    prompt : "key",
    letters: "carpinset",
    words  : ["car", "pin", "set", "access", "pattern"],
  },
];

export default class LetterPrompt extends Component {

  wordList = [];
  problemIndex = -1;
  solvedIndex = [];

  newGame = true;

  constructor(props) {
    super(props);

    this.state = {
      prompt          : "",
      correctWordIndex: [],
      word            : "",
      letters         : {},

      classClassName: "",
    };

    this.findUnresolvedProblem = this.findUnresolvedProblem.bind(this);
    this.startNewProblem = this.startNewProblem.bind(this);

    this.generateLetterClassName = this.generateLetterClassName.bind(this);
    this.shuffleLetters = this.shuffleLetters.bind(this);

    this.handleLetterClick = this.handleLetterClick.bind(this);
    this.handleSendShuffle = this.handleSendShuffle.bind(this);
    this.handleBackspace = this.handleBackspace.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleProblemSolved = this.handleProblemSolved.bind(this);

    this.isAnswerForEasterEgg = this.isAnswerForEasterEgg.bind(this);

    this.returnAllLetters = this.returnAllLetters.bind(this);
  }


  componentWillUpdate(nextProps, nextState) {
    if (this.state.classClassName === "wrong") {
      nextState.classClassName = "";
    }

    if (nextState.gameState && this.state.gameState) {
      nextState.gameState = undefined;
    }
  }

  findUnresolvedProblem() {
    while (this.solvedIndex.length !== KEYS.length) {
      let index = Math.floor(Math.random() * KEYS.length);

      if (this.solvedIndex.indexOf(index) === -1) {
        // This is not solved yet
        this.problemIndex = index;
        return JSON.parse(JSON.stringify(KEYS[index]));
      }
    }

    return null;
  }

  /**
   * Generate the object that this.state.letters needs
   * @param words
   */
  generateLetterState(words) {
    let state = {},
      currentIndex = 0;

    for (let word of words) {
      for (let letter of word) {
        if (!state[letter]) {
          state[letter] = {count: 0, index: currentIndex++};
        }

        ++state[letter].count;
      }
    }

    this.shuffleLetters(state);

    return state;
  }

  startNewProblem() {
    this.newGame = false;
    let problem = this.findUnresolvedProblem();

    this.wordList = problem.words;
    this.setState({
      prompt          : problem.prompt,
      correctWordIndex: [],
      word            : "",
      letters         : this.generateLetterState(problem.words),
    });
  }

  generateLetterClassName(i) {
    if (Object.keys(this.state.letters).length !== 9 && i >= 4) {
      ++i;
    }

    return "letter-position-3-3-" + i;
  }

  shuffleLetters(letterObjects) {
    letterObjects = letterObjects || this.state.letters;
    let letters = Object.keys(letterObjects);

    for (let i = 0; i < letters.length; ++i) {
      let shuffleTarget = Math.floor(Math.random() * letters.length);
      // Swap it
      let src = letters[i],
        dest = letters[shuffleTarget];

      let tmp = letterObjects[src].index;
      // eslint-disable-next-line
      letterObjects[src].index = letterObjects[dest].index;
      // eslint-disable-next-line
      letterObjects[dest].index = tmp;
    }

    this.forceUpdate();
  }

  isAnswerForEasterEgg() {
    let letters = Object.keys(this.state.letters);

    if (letters.length !== 9) {
      return false;
    }

    // Must use every letter
    for (let letter of letters) {
      if (this.state.letters[letter].count !== 0) {
        return false;
      }
    }

    let ee = [8, 5, 2, 4, 7, 9, 3, 6, 1],
      e = -1,
      index = 0;

    for (e of ee) {
      while (this.state.letters[this.state.word[index]].index === e - 1) {
        if (++index >= this.state.word.length) {
          break;
        }
      }
    }

    return e === 1 && index >= this.state.word.length;
  }

  handleLetterClick(letter) {
    if (this.state.letters[letter].count) {
      --this.state.letters[letter].count;

      this.setState({
        word: this.state.word + letter,
      });
    }
  }

  returnAllLetters(classClassName) {
    // Return all the letters
    for (let letter of this.state.word) {
      ++this.state.letters[letter].count;
    }

    this.setState({
      word          : "",
      classClassName: classClassName === undefined ? this.state.classClassName : classClassName,
    });
  }

  handleSend() {
    // Quick win, or an easter egg
    if (this.isAnswerForEasterEgg()) {
      this.handleProblemSolved();
    }

    let index = this.wordList.indexOf(this.state.word);

    if (index !== -1 && this.state.correctWordIndex.indexOf(index) === -1) {
      if (this.state.correctWordIndex.length + 1 === this.wordList.length) {
        // Puzzle solved
        this.handleProblemSolved();
      } else {
        // This word is correct and not being added to the list
        this.setState({
          word            : "",
          correctWordIndex: [...this.state.correctWordIndex, index],
        });
      }
    } else {
      // Not a match, try to see if it's part of the word
      if (this.state.word.length >= 3) {
        for (let i = 0; i < this.wordList.length; ++i) {
          if (this.state.correctWordIndex.indexOf(i) === -1) {
            // This word has not been filled in yet
            let word = this.wordList[i];

            if (this.state.word.indexOf(word) !== -1 || word.indexOf(this.state.word) !== -1) {
              // It's part of it. Let the user know.
              this.setState({
                classClassName: "shaking",
              });

              setTimeout(() => this.returnAllLetters(""), 2000);
              return;
            }
          }
        }
      }

      this.returnAllLetters("wrong");

    }
  }

  handleSendShuffle() {
    if (this.state.word.length) {
      // Send
      this.handleSend();
    } else {
      // Shuffle
      this.shuffleLetters();
    }
  }

  handleBackspace() {
    let lastLetter = this.state.word[this.state.word.length - 1];
    ++this.state.letters[lastLetter].count;

    this.setState({
      word: this.state.word.slice(0, -1),
    });
  }

  handleProblemSolved() {
    this.solvedIndex.push(this.problemIndex);

    this.setState({
      gameState: R.GAME_STATE.IDLE,
    });
  }

  render() {
    return (
      <Game name="letter-prompt"
            className={this.state.classClassName}
            gameSummary={[
              <div className="word">WORD!</div>,
              <div className="word-list">{this.wordList.join(" | ")}</div>
            ]}
            gameIntro={["One hint, several words"]}
            gameState={this.state.gameState}
            prompt={this.state.prompt}
            onStart={this.startNewProblem}
            restartText="next"
            restartIcon="skip_next"
      >
        <div className="flex-bubble-wrap"></div>
        <div className="word-list flex-center">
          {this.wordList.map((word, i) =>
            <span key={word}
                  className={`word ${!this.state.correctWordIndex.includes(i) ? "empty" : ""}`}>
               {!this.state.correctWordIndex.includes(i) ?
                 word.replace(/./g, HIDDEN_CHAR) : word}
            </span>,
          )}
        </div>
        <div className="flex-bubble-wrap"></div>
        <WordDashboard word={this.state.word}/>
        <div
          className="grid flex-center">
          <div className="grid-wrapper">
            {Object.keys(this.state.letters).map(letter =>
              <Letter
                key={letter}
                letter={letter}
                onClick={() => this.handleLetterClick(letter)}
                badge={this.state.letters[letter].count}
                className={`${this.state.word.indexOf(
                  letter) === -1 ? "" : "letter-in-use"} ${this.generateLetterClassName(
                  this.state.letters[letter].index)}`}
              />
            )}
          </div>
        </div>
        <div className="btns">
          <Button
            onClick={this.handleSendShuffle}
            text={this.state.word.length ? "submit" : "shuffle"}>
            {this.state.word.length ? "send" : "shuffle"}
          </Button>
          <Button
            onClick={this.handleBackspace}
            className={this.state.word.length ? "" : "hidden"}>
            backspace
          </Button>
        </div>
      </Game>
    );
  }
}