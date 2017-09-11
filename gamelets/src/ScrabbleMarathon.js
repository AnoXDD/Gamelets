/**
 * Created by Anoxic on 6/24/2017.
 */
import React, {Component} from "react";

import Button from "./lib/Button";
import Game from "./lib/Game";
import Letter from "./lib/Letter";

import * as R from "./R";

const HIDDEN_CHAR = "·";

const CANDIDATES = {
  7: "acehprs acehrst aeilrst abelrst adeilrs adelrst aelprst aelpsst acelrst aeelrst aelrsst aelrstv aelrsty acenrst aeenrst acdeprs aceprss aceprst adeiprs aeprsst aceerst aceorst acersst".split(
    " "),
  6: "aehprs aceprs acehrs aehrst acerst acehrt eilrst aelrst aeirst aeilst aberst abelst aeilrs adelrs adeirs adeils aderst adelst aeprst aelpst aelprt aelsst acelst aeerst aeelst aersst aerstv aelstv aelrsv aersty aelrsy aenrst adeprs acders aeiprs aeorst".split(
    " "),
  5: "aeprs aehrs acers aerst aehst aehrt acest eilst aelst aelrt airst ailst abest abelt aelrs aeirs aders adels aprst aepst aeprt aesty aersy aelsy aelry aenst aenrt aorst".split(
    " "),
  4: "aers aeps aehs aest aert ehst aeht elst aelt aist airt aels apst aept esty aety aesy aery elsy aent aort".split(
    " "),
};

export default class ScrabbleMarathon extends Component {

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
      // Not a match
      // Return all the letters
      for (let letter of this.state.word) {
        ++this.state.letters[letter].count;
      }

      this.setState({
        word          : "",
        classClassName: "wrong",
      });
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
                  className={`word ${this.state.correctWordIndex.indexOf(
                    i) === -1 ? "empty" : ""}`}>
                                    {
                                      this.state.correctWordIndex.indexOf(i) === -1 ?
                                        word.replace(/./g, HIDDEN_CHAR) :
                                        word
                                    }
                                </span>,
          )}
        </div>
        <div className="flex-bubble-wrap"></div>
        <div className="letter-selected flex-center">
          {this.state.word.split("").map((letter, i) =>
            <span key={letter + i}
                  className="letter">
                                    {letter}
                                </span>,
          )}
        </div>
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