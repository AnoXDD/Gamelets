import React, {Component} from "react";
import Game from "../lib/Game";

export default class SokobanInfinite extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };

    this.startNewProblem = this.startNewProblem.bind(this);
  }

  startNewProblem() {
  }

  handleSwipeUp(e) {
    console.log("up");
  }

  handleSwipeDown(e) {
    console.log("down");
  }

  handleSwipeLeft(e) {
    console.log("left");
  }

  handleSwipeRight(e) {
    console.log("right");
  }

  render() {
    return (
      <Game name="sokoban-infinite"
            className={this.state.classClassName}
            gameIntro={["Endless levels of Sokoban", "Swipe or use arrow keys to control"]}
            onStart={this.startNewProblem}
            swipable={true}
            onSwipeUp={this.handleSwipeUp}
            onSwipeDown={this.handleSwipeDown}
            onSwipeLeft={this.handleSwipeLeft}
            onSwipeRight={this.handleSwipeRight}
            restartText="next"
            restartIcon="skip_next"
      >
      </Game>
    );
  }

};