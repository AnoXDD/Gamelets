import React, {Component} from "react";
import seedrandom from "seedrandom";
import {CSSTransition, TransitionGroup} from "react-transition-group";

import Game from "../lib/Game";
import generateFlipIt from "./FlipIt/FlipItGenerator";
import * as R from "../R";
import Button from "../lib/Button";

const COLORS = ["#F44336",
  "#9C27B0",
  "#3F51B5",
  "#03A9F4",
  "#8BC34A",
  "#FFEB3B",
  "#795548",
  "#9E9E9E",
  "#607D8B"];
const MIN_COLOR = 3;

export default class FlipIt extends Component {

  // Translations from the state
  bulbs = [];
  switches = [];

  state = {
    switches : [],
    bulbs    : 0,
    colors   : [],
    size     : 5,
    gameState: R.GAME_STATE.IDLE,
  };

  timeoutId = -1;

  constructor(props) {
    super(props);

    this.startNewProblem = this.startNewProblem.bind(this);
    this.generateColors = this.generateColors.bind(this);

    this.handleFewerBulbs = this.handleFewerBulbs.bind(this);
    this.handleMoreBulbs = this.handleMoreBulbs.bind(this);
  }

  handleBulbClick(val) {
    this.setState({
      bulbs: this.state.bulbs ^ val,
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.bulbs !== this.state.bulbs) {
      this.bulbs = (new Array(nextState.size).join("0") + nextState.bulbs.toString(
        2))
        .split("")
        .slice(-nextState.size);
    }

    if (nextState.switches.join() !== this.state.switches.join()) {
      this.switches = nextState.switches.map(
        s => (new Array(nextState.size).join("0") + s.toString(2))
          .split("")
          .slice(-nextState.size)
          .reduce((acc, b, i) =>
              b === "1" ? acc.concat(i) : acc
            , [])
      );
    }
  }

  componentDidUpdate() {
    if (this.state.bulbs === 0 && this.state.gameState !== R.GAME_STATE.IDLE) {
      // Level finished
      this.setState({
        gameState: R.GAME_STATE.IDLE,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  generateColors(size = this.state.size) {
    let rng = seedrandom();
    return [...COLORS].sort(() => rng() - .5).slice(-size);
  }

  startNewProblem(size = this.state.size) {
    this.setState({
      size,
      ...generateFlipIt(size),
      colors   : this.generateColors(size),
      locked   : false,
      gameState: R.GAME_STATE.START,
    });
  }

  handleMoreBulbs() {
    let size = Math.min(COLORS.length, this.state.size + 1);
    this.startNewProblem(size);
  }

  handleFewerBulbs() {
    let size = Math.max(MIN_COLOR, this.state.size - 1);
    this.startNewProblem(size);
  }

  render() {
    return (
      <Game name="flip-it"
            gameIntro={["Fill 'em colors"]}
            gameState={this.state.gameState}
            gameSummary={["Nice!"]}
            onStart={this.startNewProblem}
            restartText="next"
            restartIcon="skip_next"
      >
        <div className="bulbs">
          {this.bulbs.map((b, i) =>
            <span
              key={i}
              onClick={() => this.handleBulbClick(this.state.switches[i])}
              className="bulb"
              style={{
                backgroundColor: b === "1" ? "#fff" : this.state.colors[i],
                boxShadow      : `0 0 10px ${this.state.colors[i]}`,
              }}
            >
              <TransitionGroup className="pixels">
                {this.switches[i].map(index =>
                  <CSSTransition
                    key={index}
                    className="pixel"
                    classNames="pixel"
                    exit={false}
                    timeout={400}
                  >
                    <span
                      className="pixel"
                      style={{
                        borderColor: this.state.colors[index],
                        background : this.bulbs[index] === "1" ? "#fff" : this.state.colors[index]
                      }}
                    />
                  </CSSTransition>
                )}
              </TransitionGroup>
            </span>
          )}
        </div>
        <div className="controls">
          <Button disabled={this.state.size === MIN_COLOR}
                  onClick={this.handleFewerBulbs}>remove</Button>
          <Button disabled={this.state.size === COLORS.length}
                  onClick={this.handleMoreBulbs}>add</Button>
        </div>
      </Game>
    );
  }
};