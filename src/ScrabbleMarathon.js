/**
 * Created by Anoxic on 6/24/2017.
 */
import React, {Component} from "react";

import Button from "./lib/Button";
import Game from "./lib/Game";
import Letter from "./lib/Letter";

import * as R from "./R";
import {CSSTransition, TransitionGroup} from "react-transition-group";

const CANDIDATES = [
  "aers aeps aehs aest aert ehst aeht elst aelt aist airt aels apst aept esty aety aesy aery elsy aent aort".split(
    " "), "aeprs aehrs acers aerst aehst aehrt acest eilst aelst aelrt airst ailst abest abelt aelrs aeirs aders adels aprst aepst aeprt aesty aersy aelsy aelry aenst aenrt aorst".split(
    " "), "aehprs aceprs acehrs aehrst acerst acehrt eilrst aelrst aeirst aeilst aberst abelst aeilrs adelrs adeirs adeils aderst adelst aeprst aelpst aelprt aelsst acelst aeerst aeelst aersst aerstv aelstv aelrsv aersty aelrsy aenrst adeprs acders aeiprs aeorst".split(
    " "), "acehprs acehrst aeilrst abelrst adeilrs adelrst aelprst aelpsst acelrst aeelrst aelrsst aelrstv aelrsty acenrst aeenrst acdeprs aceprss aceprst adeiprs aeprsst aceerst aceorst acersst".split(
    " "),
];
const LEVEL_REQ = [6, 18, 40, 70];
const UNUSED_TIME_MULTIPLIER = .5;
const ROUND_TIME = 90000;

export default class ScrabbleMarathon extends Component {

  newGame = true;
  time = 0;

  constructor(props) {
    super(props);

    this.state = {
      word         : "",
      letters      : {},
      level        : 0,
      levelReq     : LEVEL_REQ[0],
      levelProgress: 0,
      wordList     : [],
      score        : 0,

      classClassName: "",
    };

    this.findNewLetters = this.findNewLetters.bind(
      this);
    this.startNewGame = this.startNewGame.bind(this);

    this.shuffleLetters = this.shuffleLetters.bind(this);

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleLetterClick = this.handleLetterClick.bind(this);
    this.handleSendShuffle = this.handleSendShuffle.bind(this);
    this.handleBackspace = this.handleBackspace.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.onFinishGame = this.onFinishGame.bind(this);

    this.isWordLongEnough = this.isWordLongEnough.bind(this);
    this.maybeLevelUp = this.maybeLevelUp.bind(this);
    this.getCurrentScore = this.getCurrentScore.bind(this);
  }


  componentWillUpdate(nextProps, nextState) {
    if (this.state.classClassName === "wrong") {
      nextState.classClassName = "";
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  }

  /**
   * Returns if `long` can be used as continuing problem set of `set`. For
   * example, "abcd" is a good pair with "abc", but not "afg". `long` should
   * only have letter different from `short`
   * @param short
   * @param long
   */
  static isGoodCandidatePair(short, long) {
    let s = 0, l = 0;
    let flag = false;
    while (s < short.length) {
      if (short[s++] !== long[l++]) {
        if (flag) {
          return false;
        }

        // Compare this again
        --s;
        flag = true;
      }
    }

    return flag;
  }

  handleKeydown(e) {
    let key = e.key;

    if (key === "Enter") {
      this.handleSendShuffle();
      return;
    }

    if (key === "Backspace") {
      if (!this.state.word.length) {
        return;
      }

      this.handleBackspace();
    }

    if (this.state.letters[key]) {
      this.handleLetterClick(key);
    }
  }

  /**
   * Finds a problem
   * @param isNewGame - if this is a new game. If so, a new set of letters will
   *   be generated, otherwise the new problem will be based on current letters
   */
  findNewLetters(isNewGame) {
    if (isNewGame) {
      let index = Math.floor(Math.random() * CANDIDATES[0].length);
      return CANDIDATES[0][index];
    }

    let currentLetters = Object.keys(this.state.letters).sort().join("");
    let level = this.state.level + 1;
    // Find the suitable candidates
    let words = [];
    for (let word of CANDIDATES[level]) {
      if (ScrabbleMarathon.isGoodCandidatePair(currentLetters, word)) {
        words.push(word);
      }
    }

    if (!words.length) {
      alert(
        "Looks like something goes wrong with this game. Could you restart the game?");
      this.onFinishGame();
    }

    let index = Math.floor(Math.random() * words.length);
    return words[index];
  }

  /**
   * Generate the object that this.state.letters needs
   * @param letters
   */
  generateLetterState(letters) {
    let state = {},
      currentIndex = 0;

    for (let letter of letters) {
      state[letter] = {count: 1, index: currentIndex++};
    }

    this.shuffleLetters(state);

    return state;
  }

  startNewGame() {
    this.newGame = false;
    let problem = this.findNewLetters(true);

    this.setState({
      word         : "",
      letters      : this.generateLetterState(problem),
      wordList     : [],
      score        : 0,
      level        : 0,
      levelReq     : LEVEL_REQ[0],
      levelProgress: 0,
      time         : 0,
    });
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

    this.setState({
      letters: letterObjects,
    });
  }

  isWordLongEnough() {
    return this.state.word.length >= 3;
  }

  maybeLevelUp() {
    if (this.state.levelProgress < this.state.levelReq) {
      return;
    }

    if (this.state.level + 1 === LEVEL_REQ.length) {
      // Max level, just stop the game
      this.onFinishGame();
      return;
    }

    // Find the next letter
    let newLevel = this.state.level + 1;
    this.setState({
      level        : newLevel,
      levelProgress: 0,
      levelReq     : LEVEL_REQ[newLevel],
      letters      : this.generateLetterState(this.findNewLetters()),
    });
  }

  /**
   * Returns the current score calculated by level and length
   */
  getCurrentScore() {
    return (this.state.level + 1) * this.state.word.length * this.state.word.length * 5;
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
    // Return all the letters
    for (let letter of this.state.word) {
      ++this.state.letters[letter].count;
    }

    let index = this.state.wordList.indexOf(this.state.word);

    if (index === -1 && R.isSelectedWordValid(this.state.word)) {
      // This word is correct and not being added to the list
      this.setState({
        word         : "",
        wordList     : [...this.state.wordList, this.state.word],
        levelProgress: this.state.levelProgress + this.state.word.length,
        score        : this.state.score + this.getCurrentScore(),
      }, () => {
        this.maybeLevelUp();

        // Scroll to the bottom
        if (this.wordListEnd) {
          this.wordListEnd.scrollIntoView({behavior: "smooth"});
        }
      });
    } else {
      // Not a match
      this.setState({
        word          : "",
        classClassName: "wrong",
      });
    }
  }

  handleSendShuffle() {
    if (this.isWordLongEnough()) {
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

  handleStateChange(state) {
    if (state === R.GAME_STATE.IDLE) {
      this.onFinishGame();
    }
  }

  handleTimeChange(time) {
    this.time = time;
  }

  onFinishGame() {
    this.setState({
      score: this.state.score + (this.time - 1000) * UNUSED_TIME_MULTIPLIER,
    });

    this.time = 0;
  }

  render() {
    let bubbles = [];
    for (let i = 0; i < this.state.levelReq; ++i) {
      bubbles.push(0);
    }
    let bubbleStyle = {width: `${100 / LEVEL_REQ[this.state.level]}%`};

    return (
      <Game name="scrabble-marathon"
            className={this.state.classClassName}
            gameSummary={[
              <div key="1" className="word">Nice!</div>,
              <div key="2"
                   className="word-list">{this.state.wordList.join(" | ")}</div>
            ]}
            onStart={this.startNewGame}
            onStateChange={this.handleStateChange}
            restartText="next"
            restartIcon="skip_next"
            score={this.state.score}
            roundTime={ROUND_TIME}
            onTimeChange={this.handleTimeChange}
      >
        <div className="flex-bubble-wrap"></div>
        <div className="flex-bubble-wrap"></div>
        <div className="word-list-wrapper flex-center">
          <div className="flex-inner-extend flex-center">
            <div className="word-list">
              {this.state.wordList.map((word, i) =>
                <span key={word} className={"word"}>{word}</span>,
              )}
              <div style={{float: "left", clear: "both"}}
                   ref={(el) => {
                     this.wordListEnd = el;
                   }}/>
            </div>
          </div>
        </div>
        <div className="flex-bubble-wrap"></div>
        <div className="flex-bubble-wrap"></div>
        <div className="progress flex-center">
          <span className="progress-bar"
                style={{width: `${100 * this.state.levelProgress / this.state.levelReq}%`}}/>
          {bubbles.map((bubble, i) =>
            <span key={i}
                  style={bubbleStyle}
                  className="progress-bubble"/>
          )}
        </div>
        <TransitionGroup className="letter-selected flex-center">
          {this.state.word.split("").map((letter, i) =>
            <CSSTransition
              key={letter + i}
              className="letter"
              classNames="letter"
              timeout={200}
            >
              <span key={letter + i} className="letter">{letter}</span>
            </CSSTransition>
          )}
        </TransitionGroup>
        <div
          className="grid flex-center">
          <div className={`grid-wrapper level-${this.state.level}`}>
            {Object.keys(this.state.letters).map(letter =>
              <Letter
                key={letter}
                letter={letter}
                onClick={() => this.handleLetterClick(letter)}
                className={`${this.state.word.indexOf(
                  letter) === -1 ? "" : "letter-in-use"} letter-pos-${this.state.letters[letter].index}`}
              />
            )}
          </div>
        </div>
        <div className="flex-bubble-wrap"></div>
        <div className="btns">
          <Button
            onClick={this.handleSendShuffle}
            text={this.isWordLongEnough() ? "submit" : "shuffle"}>
            {this.isWordLongEnough() ? "send" : "shuffle"}
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