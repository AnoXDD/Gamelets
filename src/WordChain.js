/**
 * Created by Anoxic on 6/24/2017.
 */

import React, {Component} from "react";

import Button from "./lib/Button";
import Game from "./lib/Game";
import Letter from "./lib/Letter";

import * as R from "./R";

const ROUND_TIME = 900000;
// How many letters in the pool
const LETTER_NUM = 8;
const LETTER_LIFESPAN = 10000;
// todo enforce this
const WORD_LIMIT = 10;

export default class WordChain extends Component {

  newGame = true;
  timeouts = [];
  //todo clear it at game ends

  constructor(props) {
    super(props);

    this.state = {
      word    : [],
      letters : [],
      wordList: [],
      score   : 0,

      classClassName: "",
    };

    this.startNewGame = this.startNewGame.bind(this);

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleLetterClick = this.handleLetterClick.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleLetterPerish = this.handleLetterPerish.bind(this);
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

    let keyIndex = this.state.letters.indexOf(key);
    if (keyIndex !== -1) {
      this.handleLetterClick(keyIndex);
    }
  }

  /**
   * Generate initial letters
   */
  generateInitialLetters() {
    return new Array(LETTER_NUM).fill().map(i => R.randomWeightedLetter());
  }

  startNewGame() {
    this.newGame = false;

    this.setState({
      word    : [],
      letters : this.generateInitialLetters(),
      wordList: [],
      score   : 0,
      time    : 0,
    });
  }

  isWordLongEnough() {
    return this.state.word.length >= 3;
  }

  maybeLevelUp() {
    if (this.state.levelProgress < this.state.levelReq) {
      return;
    }

    return;
  }

  /**
   * Returns the current score calculated by level and length
   */
  getCurrentScore() {
    return /*(this.state.level + 1) **/ this.state.word.length * this.state.word.length * 5;
  }

  handleLetterClick(index) {
    let letter = this.state.letters[index];

    if (!letter) {
      return;
    }

    let {letters} = this.state;
    letters[index] = R.randomWeightedLetter();

    this.setState({
      word: [...this.state.word, {letter, key: Date.now(),}],
      letters,
    });

    // Set timer to remove this letter
    this.timeouts.push(setTimeout(this.handleLetterPerish, LETTER_LIFESPAN));
  }

  /**
   * Called when a letter is about to be disappeared
   */
  handleLetterPerish() {
    let {word} = this.state;

    this.setState({
      word: word.slice(1),
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
      score: this.state.score,
    });

    this.time = 0;
  }

  render() {
    let bubbles = [];
    for (let i = 0; i < this.state.levelReq; ++i) {
      bubbles.push(0);
    }

    return (
      <Game name="word-chain"
            className={this.state.classClassName}
            gameSummary={[
              <div key="1" className="word">Nice!</div>,
              <div key="2"
                   className="word-list">{this.state.wordList.join(" | ")}</div>
            ]}
            onStart={this.startNewGame}
            onStateChange={this.handleStateChange}
            restartText="play again"
            restartIcon="refresh"
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
        <div className="letter-selected flex-center">
          {this.state.word.map(o =>
            <span key={o.key} className="letter perishing">{o.letter}</span>,
          )}
        </div>
        <div
          className="grid flex-center">
          <div className={`grid-wrapper level-${LETTER_NUM - 4}`}>
            {this.state.letters.map((letter, index) =>
              <Letter
                key={`${letter}-${index}`}
                letter={letter}
                onClick={() => this.handleLetterClick(index)}
                className={`letter-pos-${index}`}
              />
            )}
          </div>
        </div>
      </Game>
    );
  }
}