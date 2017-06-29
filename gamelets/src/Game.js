/**
 * Created by Anoxic on 6/28/2017.
 *
 * A general framework of a game
 */

import PropTypes from "prop-types";
import React, {Component} from "react";

import Timer from "./Timer";
import Scoreboard from "./Scoreboard";
import Button from "./Button";

const MINI_THRESHOLD = 510,
    COUNTDOWN = 3;

const GAME_STATE = {
  IDLE : -1,
  READY: 1,
  START: 2,
};


export default class Game extends Component {
  newGame = true;

  state = {
    gameState  : GAME_STATE.IDLE,
    timeVersion: 0,
  };

  constructor(props) {
    super(props);

    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleTimeFinish = this.handleTimeFinish.bind(this);

    this.readyGame = this.readyGame.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    this.handleWindowResize();

    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize)
  }

  handleWindowResize() {
    let width = window.outerWidth;

    this.props.onResize(width <= MINI_THRESHOLD);
  }

  handleTimeFinish() {
    if (this.state.gameState === GAME_STATE.READY) {
      this.startGame();
    } else {
      this.setState({
        gameState: GAME_STATE.IDLE,
      });
      this.props.onStateChange(GAME_STATE.IDLE);
    }
  }

  readyGame() {
    this.counter = COUNTDOWN;

    this.setState({
      gameState  : GAME_STATE.READY,
      timeVersion: this.state.timeVersion + 1,
      score      : 0,
    });

    this.props.onStateChange(GAME_STATE.READY);
  }

  startGame() {
    this.newGame = false;
    this.counter = this.props.roundTime;

    this.setState({
      gameState  : GAME_STATE.START,
      timeVersion: this.state.timeVersion + 1,
    });

    this.props.onStart();
    this.props.onStateChange(GAME_STATE.START);
  }

  render() {
    return (
        <div
            className={`game ${this.props.name} ${this.props.className} ${this.state.gameState === GAME_STATE.IDLE ? "idle" : ""} ${this.state.gameState === GAME_STATE.READY ? "ready" : ""}`}>
          <header className="flex-center">
            {typeof(this.props.roundTime) === "undefined" ? null :
                <Timer
                    version={this.state.timeVersion}
                    start={this.counter}
                    onFinish={this.handleTimeFinish}/>}
            {this.newGame && typeof(this.props.score) !== "undefined" ? null :
                <Scoreboard score={this.props.score}/>}
            <div
                className={`btns ${this.state.gameState === GAME_STATE.START ? "hidden" : ""} ${this.newGame ? "" : "replay"}`}>
              <Button
                  onClick={this.readyGame}
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

  name     : PropTypes.string.isRequired,
  className: PropTypes.string,

  roundTime  : PropTypes.number,
  score      : PropTypes.number,
  prompt     : PropTypes.string,
  gameSummary: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),

  restartText: PropTypes.string,
  restartIcon: PropTypes.string,

  onResize     : PropTypes.func,
  onStateChange: PropTypes.func,
  onStart      : PropTypes.func.isRequired,
};


Game.defaultProps = {
  className: "",

  restartText: "restart",
  restartIcon: "refresh",

  onResize     : e => void(e),
  onStateChange: e => void(e),
}