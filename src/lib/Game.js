/**
 * Created by Anoxic on 6/28/2017.
 *
 * A general framework of a game
 */

import PropTypes from "prop-types";
import React, {Component} from "react";

import Timer from "../components/Timer";
import Scoreboard from "../components/Scoreboard";
import Button from "./Button";
import * as R from "../R";

const MINI_THRESHOLD = 510,
  COUNTDOWN = 3000;

/**
 * Required min distance traveled to be considered swipe
 * @type {number}
 */
const SWIPE_MIN_DIST = 10;
/**
 * Maximum distance allowed in the other directions, e.g. when dragging
 * vertically, the max distance allowed for horizontal move
 * @type {number}
 */
const SWIPE_TOLERANCE = 100;
/**
 * Maximum time allowed to travel that distance
 * @type {number}
 */
const SWIPE_MAX_TIME = 300;

export default class Game extends Component {
  newGame = true;
  ref = null;
  swipeStartX = 0;
  swipeStartY = 0;
  swipeStartTime = 0;

  state = {
    gameState  : R.GAME_STATE.IDLE,
    timeVersion: 0,
  };

  constructor(props) {
    super(props);

    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleTimeFinish = this.handleTimeFinish.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    this.readyGame = this.readyGame.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    this.handleWindowResize();

    window.addEventListener("resize", this.handleWindowResize);

    if (this.props.swipable && this.ref) {
      this.ref.addEventListener('touchstart', this.handleTouchStart, false);
      this.ref.addEventListener('touchend', this.handleTouchEnd, false);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.gameState) {
      nextState.gameState = nextProps.gameState;
    }
  }

  handleTouchStart(e) {
    let touch = e.changedTouches[0];
    this.swipeStartX = touch.pageX;
    this.swipeStartY = touch.pageY;
    this.swipeStartTime = Date.now();
  }

  handleTouchEnd(e) {
    let touch = e.changedTouches[0];
    let distX = touch.pageX - this.swipeStartX;
    let distY = touch.pageY - this.swipeStartY;

    if (Date.now() - this.swipeStartTime <= SWIPE_MAX_TIME) {
      if (Math.abs(distX) >= SWIPE_MIN_DIST && Math.abs(distY) <= SWIPE_TOLERANCE) { // 2nd condition for horizontal swipe met
        if (distX < 0) {
          this.props.onSwipeLeft(e);
        } else {
          this.props.onSwipeRight(e);
        }
      } else if (Math.abs(distY) >= SWIPE_MIN_DIST && Math.abs(distX) <= SWIPE_TOLERANCE) { // 2nd condition for vertical swipe met
        if (distY < 0) {
          this.props.onSwipeUp(e);
        } else {
          this.props.onSwipeDown(e);
        }
      }
    }
  }

  handleWindowResize() {
    // Stupid iOS, why???
    let width = window.innerWidth;

    this.props.onResize(width <= MINI_THRESHOLD);
  }

  handleTimeFinish() {
    if (this.state.gameState === R.GAME_STATE.READY) {
      this.startGame();
    } else {
      this.setState({
        gameState: R.GAME_STATE.IDLE,
      });
      this.props.onStateChange(R.GAME_STATE.IDLE);
    }
  }

  readyGame() {
    this.counter = COUNTDOWN;

    this.setState({
      gameState  : R.GAME_STATE.READY,
      timeVersion: this.state.timeVersion + 1,
      score      : 0,
    });

    this.props.onStateChange(R.GAME_STATE.READY);
  }

  startGame() {
    this.newGame = false;
    this.counter = this.props.roundTime;

    this.setState({
      gameState  : R.GAME_STATE.START,
      timeVersion: this.state.timeVersion + 1,
    });

    this.props.onStart();
    this.props.onStateChange(R.GAME_STATE.START);
  }

  render() {
    return (
      <div
        className={`game ${this.props.name} ${this.props.className} ${this.state.gameState === R.GAME_STATE.IDLE ? "idle" : ""} ${this.state.gameState === R.GAME_STATE.READY ? "ready" : ""}`}
        ref={ref => {
          this.ref = ref;
        }}
      >
        <header className="flex-center">
          {typeof(this.props.roundTime) === "undefined" ? null :
            <Timer
              version={this.state.timeVersion}
              start={this.counter}
              timeInterval={this.state.gameState !== R.GAME_STATE.START ? 1000 : this.props.timeInterval}
              countDown={this.state.gameState !== R.GAME_STATE.START ? true : this.props.timeCountDown}
              onFinish={this.handleTimeFinish}
              onChange={this.props.onTimeChange}
            />}
          {this.newGame || typeof(this.props.score) === "undefined" ? null :
            <Scoreboard score={this.props.score}/>}
          {this.props.prompt ? (<div
            className="prompt">{this.props.prompt}</div>) : null}
          {(this.newGame && (this.state.gameState === R.GAME_STATE.IDLE)) ?
            (<ul className="game-intro">
              {this.props.gameIntro.map((li, i) => <li key={i}>{li}</li>)}
            </ul> || null) : null}
          {(!this.newGame && (this.state.gameState === R.GAME_STATE.IDLE)) ?
            (this.props.gameSummary || null) : null}
          <div
            className={`btns ${this.state.gameState === R.GAME_STATE.START ? "hidden" : ""} ${this.newGame ? "" : "replay"}`}>
            <Button
              onClick={this.props.roundTime ? this.readyGame : this.startGame}
              text={this.newGame ? "start" : this.props.restartText}
            >
              {this.newGame ? "play_arrow" : this.props.restartIcon}
            </Button>
          </div>
        </header>
        <div className="game-area">
          <div
            className="flex-inner-extend flex-center game-area-inner">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Game.propTypes = {

  // The name being used to represent the html class of the game
  name     : PropTypes.string.isRequired,
  // Other html classes you want to add to this framework
  className: PropTypes.string,

  // The time of each round (in milliseconds)
  roundTime    : PropTypes.number,
  // The interval of time being refreshed (in milliseconds)
  timeInterval : PropTypes.number,
  // If the time is counting down
  timeCountDown: PropTypes.bool,
  // The score shown at the top bar
  score        : PropTypes.number,
  // The prompt being shown at the top bar
  prompt       : PropTypes.string,
  // The game summary to be shown at the end of the game
  gameSummary  : PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ])),
  // The introduction (or tutorial) of the game
  gameIntro    : PropTypes.array,

  // One of R.GAME_STATE
  gameState: PropTypes.number,

  // The text for the restart button, default is `restart`
  restartText: PropTypes.string,
  // The text for the restart icon, default is `refresh` (spinner)
  restartIcon: PropTypes.string,

  // The callback when the window is resized
  onResize     : PropTypes.func,
  // The callback when the state of the game has changed
  onStateChange: PropTypes.func,
  // The callback when the game is started
  onStart      : PropTypes.func.isRequired,
  // The callback when the timer is changed
  onTimeChange : PropTypes.func,

  // If the game should detect swipe
  swipable    : PropTypes.bool,
  onSwipeUp   : PropTypes.func,
  onSwipeDown : PropTypes.func,
  onSwipeLeft : PropTypes.func,
  onSwipeRight: PropTypes.func,
};


Game.defaultProps = {
  className: "",

  gameIntro: [],

  restartText: "restart",
  restartIcon: "refresh",

  timeInterval: 1000,

  onResize     : e => void(e),
  onStateChange: e => void(e),

  onSwipeUp   : e => void(e),
  onSwipeDown : e => void(e),
  onSwipeLeft : e => void(e),
  onSwipeRight: e => void(e),
};