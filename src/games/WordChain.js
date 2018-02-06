/**
 * Created by Anoxic on 6/24/2017.
 */

import React, {Component} from "react";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Scrollbars} from 'react-custom-scrollbars';

import Button from "../lib/Button";
import Game from "../lib/Game";
import Letter from "../lib/Letter";

import * as R from "../R";

const ROUND_TIME = 60000;
// How many letters in the pool
const LETTER_NUM = 8;
const LETTER_LIFESPAN = 10000;
const WORD_LENGTH_LIMIT = 10;

export default class WordChain extends Component {

  newGame = true;
  timeouts = [];
  id = 0;

  constructor(props) {
    super(props);

    this.state = {
      // With each element {letter:string, key:int}
      word      : [],
      // With each element {letter:string, key:int}
      letters   : [],
      wordList  : [],
      score     : 0,
      /**
       * To show a flash of them near the letters
       * With each element {word:string, length:int}
       */
      flashWords: [],

      classClassName: "",
    };

    this.startNewGame = this.startNewGame.bind(this);

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleLetterClick = this.handleLetterClick.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleLetterPerish = this.handleLetterPerish.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
    this.onFinishGame = this.onFinishGame.bind(this);

    this.isWordLongEnough = this.isWordLongEnough.bind(this);
    this.getScore = this.getScore.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.classClassName.length) {
      nextState.classClassName = "";
    }

    // Check if new word has arrived
    let nextStateWord = nextState.word.map(o => o.letter).join("");
    if (nextStateWord.length >= 3
      && nextStateWord !== this.state.word.map(o => o.letter).join("")) {
      // Word is changed, check if each header is a valid word
      for (let i = 3; i <= nextStateWord.length; ++i) {
        let word = nextStateWord.substr(0, i);

        if (!nextState.wordList.includes(word)
          && R.isSelectedWordValid(word)) {
          nextState.wordList.push(word);
          nextState.flashWords.push({
            word  : nextStateWord,
            length: i,
          });
          nextState.score += this.getScore(word);
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.word.length !== this.state.word.length) {
      let {scrollbars} = this.refs;
      scrollbars.scrollToBottom();
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeydown);
  }

  componentWillUnmount() {
    this.clearTimeouts();

    window.removeEventListener("keydown", this.handleKeydown);
  }

  handleKeydown(e) {
    let key = e.key;

    if (key === " ") {
      this.handleShuffle();
    }

    let keyIndex = this.state.letters.findIndex(o => o.letter === key);
    if (keyIndex !== -1) {
      this.handleLetterClick(keyIndex);
    }
  }

  generateNewLetter(index = LETTER_NUM - 1) {
    return {
      letter: R.randomWeightedLetter(),
      key   : ++this.id,
    }
  }

  /**
   * Generate initial letters
   */
  generateInitialLetters() {
    return new Array(LETTER_NUM).fill("")
      .map(index => this.generateNewLetter(index));
  }

  startNewGame() {
    this.newGame = false;

    this.setState({
      word      : [],
      letters   : this.generateInitialLetters(),
      wordList  : [],
      flashWords: [],
      score     : 0,
      time      : 0,
    });
  }

  isWordLongEnough() {
    return this.state.word.length >= 3;
  }

  /**
   * Returns the current score calculated by level and length
   */
  getScore(word) {
    return word.length * word.length * 5;
  }

  handleShuffle() {
    let {letters} = this.state;

    for (let i = 0; i < letters.length; ++i) {
      let shuffleTarget = Math.floor(Math.random() * letters.length);
      [letters[i], letters[shuffleTarget]] = [letters[shuffleTarget], letters[i]];
    }

    this.setState({
      letters,
    });
  }

  handleLetterClick(index) {
    // Do not add more if it reaches the limit
    if (this.state.word.length >= WORD_LENGTH_LIMIT) {
      this.setState({
        classClassName: "wrong",
      });
      return;
    }

    let letter = this.state.letters[index];

    if (!letter) {
      return;
    }

    let {letters} = this.state;
    // Add a new letter
    letters[index] = this.generateNewLetter(index);

    this.setState({
      word: [...this.state.word, letter],
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
    this.clearTimeouts();

    this.setState({
      score: this.state.score,
    });

    this.time = 0;
  }

  clearTimeouts() {
    for (let timeout of this.timeouts) {
      clearTimeout(timeout);
    }

    this.timeouts = [];
  }

  render() {
    return (
      <Game name="word-chain"
            className={this.state.classClassName}
            gameSummary={[
              <div key="1" className="word">Nice!</div>,
              <div key="2"
                   className="word-list">{this.state.wordList.join(" | ")}</div>
            ]}
            gameIntro={[
              "Send letters to the box and score when the letters in the box start with an (or several) English word",
              `Each letter disappears after ${Math.floor(ROUND_TIME / 1000)} seconds`,
              `Max ${WORD_LENGTH_LIMIT} letters in the box`
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
        <div className="word-list-wrapper">
          <Scrollbars
            autoHide
            autoHeight
            autoHeightMax={"40vh"}
            className="word-list"
            ref="scrollbars"
          >
            {this.state.wordList.map((word, i) =>
              <span key={word} className={"word"}>{word}</span>,
            )}
          </Scrollbars>
        </div>
        <div className="flex-bubble-wrap"></div>
        <div className="flex-bubble-wrap"></div>
        <div className="letter-selected flex-center">
          <TransitionGroup className="flex-inner-extend flex-center">
            {this.state.word.map(o =>
              <CSSTransition
                key={o.key}
                classNames="letter"
                className="letter perishing"
                timeout={200}
              >
                <span>{o.letter}</span>
              </CSSTransition>
            )}
          </TransitionGroup>

          {this.state.flashWords.map(o =>
            <div
              key={`${o.word}-${o.length}`}
              className={`flex-inner-extend flex-center flash-word flash-word-${o.length}`}
            >
              {o.word.split("").map((l, i) =>
                <span
                  className={`flash-word-letter ${i >= o.length ? "transparent" : ""}`}
                  key={i}>{l}</span>
              )}
            </div>
          )}
        </div>
        <div
          className="grid flex-center">
          <div className={`grid-wrapper level-${LETTER_NUM - 4}`}>
            {this.state.letters.map((o, index) =>
              <Letter
                key={o.key}
                letter={o.letter}
                onClick={() => this.handleLetterClick(index)}
                className={`letter-pos-${index}`}
              />
            )}
          </div>
        </div>
        <div className="flex-bubble-wrap"></div>
        <div className="btns">
          <Button
            onClick={this.handleShuffle}
            text="shuffle">
            shuffle
          </Button>
        </div>
      </Game>
    );
  }
}