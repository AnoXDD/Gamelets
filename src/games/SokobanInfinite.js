import React, {Component} from "react";
import {generateSokobanLevel} from "sokoban-generator";

import Game from "../lib/Game";

const WALL = "#";
const PLAYER = "@";
const PLAYER_GOAL = "+";
const BOX = "$";
const BOX_GOAL = "*";
const GOAL = ".";
const FLOOR = " ";

const cssMap = {
  [WALL] : "wall",
  [GOAL] : "goal",
  [FLOOR]: "floor",
}

const WIDTH = 9;
const HEIGHT = 9;
const MAX_ATTEMPTS = 10;

const GRID_SIZE = 54,
  GRID_SIZE_MINI = 30;

export default class SokobanInfinite extends Component {

  state = {
    // An 2d grid with only WALL, and GOAL
    grid  : [],
    // A list of boxes, with each {x:number, y:number, completed:boolean}
    boxes : [],
    // Player position
    player: {
      x: Math.floor(WIDTH / 2),
      y: Math.floor(HEIGHT / 2),
    },
    size  : GRID_SIZE,
  };

  constructor(props) {
    super(props);

    this.startNewProblem = this.startNewProblem.bind(this);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this._movePlayer = this._movePlayer.bind(this);
    this._findBox = this._findBox.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleResize(isMiniSize) {
    this.setState({
      size: isMiniSize ? GRID_SIZE_MINI : GRID_SIZE,
    });
  }

  handleKeyDown(e) {
    let {key} = e;

    if (key === "ArrowUp") {
      this.moveUp(e);
    } else if (key === "ArrowDown") {
      this.moveDown(e);
    } else if (key === "ArrowLeft") {
      this.moveLeft(e);
    } else if (key === "ArrowRight") {
      this.moveRight(e);
    }
  }

  /**
   * Returns if (x,y) is a valid position for player or box
   * @param x
   * @param y
   * @private
   */
  _isValidPosition(x, y) {
    if (x < 0 || x >= WIDTH || y < 0 || y > HEIGHT) {
      return false;
    }

    let tile = this.state.grid[y][x];
    return !(tile === BOX || tile === BOX_GOAL || tile === WALL);
  }

  _findBox(x, y) {
    let index = this.state.boxes.findIndex(b => b.x === x && b.y === y);

    if (index === -1) {
      return null;
    }

    return this.state.boxes[index];
  }

  /**
   * Returns the boxes with updated (actually we don't need to ...)
   * @private
   */
  _updateBoxStatus(grid = this.state.grid, boxes = this.state.boxes) {
    for (let box of boxes) {
      box.completed = grid[box.y][box.x] === GOAL;
    }

    return boxes;
  }

  /**
   * Moves the player with a delta of (dx,dy)
   * @param dx
   * @param dy
   * @private
   */
  _movePlayer(dx, dy) {
    let {x, y} = this.state.player;

    x += dx;
    y += dy;

    let box = this._findBox(x, y);
    if (box) {
      if (!this._isValidPosition(x + dx, y + dy)) {
        return;
      }

      // Move together, which already changes the box object
      box.x = x + dx;
      box.y = y + dy;
    } else if (!this._isValidPosition(x, y)) {
      return;
    }

    let boxes = this._updateBoxStatus();

    this.setState({
      boxes,
      player: {x, y},
    });
  }

  moveUp(e) {
    this._movePlayer(0, -1);
  }

  moveDown(e) {
    this._movePlayer(0, 1);
  }

  moveLeft(e) {
    this._movePlayer(-1, 0);
  }

  moveRight(e) {
    this._movePlayer(1, 0);
  }

  _applyLevel(level) {
    let grid = level.split("\n").map(a => a.split(""));

    // Find the player and all the boxes
    let boxes = [];
    let player = {};
    for (let x = 0; x < WIDTH; ++x) {
      for (let y = 0; y < HEIGHT; ++y) {
        switch (grid[y][x]) {
          case PLAYER:
            grid[y][x] = FLOOR;
            player = {x, y};
            break;

          case PLAYER_GOAL:
            grid[y][x] = GOAL;
            player = {x, y};
            break;

          case BOX:
            grid[y][x] = FLOOR;
            boxes.push({x, y});
            break;

          case BOX_GOAL:
            grid[y][x] = GOAL;
            boxes.push({x, y});
            break;

          default:
        }
      }
    }

    boxes = this._updateBoxStatus(grid, boxes);

    this.setState({
      grid, boxes, player,
    });
  }

  startNewProblem() {
    let level = null;
    let attempt = MAX_ATTEMPTS;
    let seed;
    while (--attempt > 0 && !level) {
      seed = Date.now();

      level = generateSokobanLevel({
        width          : WIDTH,
        height         : HEIGHT,
        initialPosition: {...this.state.player},
        seed,
      });
    }

    console.log(seed);

    // Apply level
    this._applyLevel(level);
  }

  render() {
    let size = this.state.size;

    return (
      <Game name="sokoban-infinite"
            className={this.state.classClassName}
            gameIntro={["Endless levels of Sokoban", "Swipe or use arrow keys to control"]}
            onStart={this.startNewProblem}
            swipable={true}
            onSwipeUp={this.moveUp}
            onSwipeDown={this.moveDown}
            onSwipeLeft={this.moveLeft}
            onSwipeRight={this.moveRight}
            onResize={this.handleResize}
            restartText="next"
            restartIcon="skip_next"
      >
        <div className="grid-area flex-center">
          <div
            style={{
              width : WIDTH * this.state.size,
              height: HEIGHT * this.state.size,
            }}
            className="grid-wrapper"
          >
            <span className="grid-gradient-cover"/>
            <span
              className="cell player"
              style={{
                "top" : size * this.state.player.y,
                "left": size * this.state.player.x,
              }}
            />
            {this.state.grid.map((row, y) =>
              row.map((cell, x) =>
                <span
                  key={`${x}-${y}`}
                  className={`cell ${cssMap[cell]}`}
                  style={{
                    "top" : y * size,
                    "left": x * size,
                  }}
                />
              )
            )}
            {this.state.boxes.map((b, i) =>
              <span key={i}
                    className={`cell box ${b.completed ? "completed" : ""}`}
                    style={{
                      "top" : b.y * size,
                      "left": b.x * size,
                    }}/>
            )}
          </div>
        </div>
      </Game>
    );
  }
};