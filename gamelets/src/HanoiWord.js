/**
 * Created by Anoxic on 9/6/2017.
 */

import React, {Component} from "react";

import Game from "./lib/Game";
import Button from "./lib/Button";

const START_LENGTH = 3;
const END_LENGTH = 7;

class Tower extends Component {
  render() {
    return (
      <div className={`tower tower-${this.props.level || START_LENGTH}`}>
        <div className="base"></div>
        <div className="stick"></div>
      </div>
    )
  }
}

export default class HanoiWord extends Component {

  /**
   * Resets the internal state
   */
  resetData() {
    this.state = {
      letters    : [[], [], []],
      level      : START_LENGTH,
      words      : [],
      currentWord: "",
    };
  }

  /**
   * Returns if a letter can be moved from `from` to `to`
   * @param from - the source tower
   * @param to - the target tower
   */
  isMovable(from, to) {

  }

  /**
   * Moves a letter from `from ` to `to`
   * @param from - the source tower
   * @param to - the target tower
   */
  moveLetter(from, to) {

  }


  render() {
    let words = [];
    for (let i = 0; i < this.state.level; ++i) {
      let className = "word";
      if (this.state.words[i]) {
        if (this.state.words[i] === this.state.currentWord) {
          className += " selected";
        } else {
          className += " valid";
        }
      }

      words.push(
        <span
          className={className}
        >{this.state.words[i] || ""}</span>
      );
    }

    return (
      <Game name="hanoiword"
            timeCountDown={false}
      >
        <div className="progress-bar">{words}</div>
        <div className="towers-letters">
          <div className="towers">
            <Tower height={this.state.level}/>
            <Tower height={this.state.level}/>
            <Tower height={this.state.level}/>
          </div>
          <div className="letters"></div>
        </div>
        <div className="actions">
          <div className="action">
            <Button
              disabled={this.isMovable(0, 1)}
              onClick={this.moveLetter(0, 1)}
            >keyboard_arrow_right</Button>
          </div>
          <div className="action">
            <Button
              disabled={this.isMovable(1, 0)}
              onClick={this.moveLetter(1, 0)}
            >keyboard_arrow_left</Button>
          </div>
          <div className="action">
            <Button
              disabled={this.isMovable(1, 2)}
              onClick={this.moveLetter(1, 2)}
            >keyboard_arrow_right</Button>
          </div>
          <div className="action">
            <Button
              disabled={this.isMovable(2, 1)}
              onClick={this.moveLetter(2, 1)}
            >keyboard_arrow_left</Button>
          </div>
        </div>
      </Game>
    );
  }
}