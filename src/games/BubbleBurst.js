import React, {Component} from "react";
import seedrandom from "seedrandom";

import Game from "../lib/Game";
import * as R from "../R";

const WIDTH = 300;
const HEIGHT = 550;
const BUBBLE_NUMBER = 20;
const TICK = 40; // milliseconds
const MOVING_SPEED = 3; // px/tick
const INITIAL_RADIUS = 5;
const FINAL_RADIUS = 20;
const GROWING_SPEED = 1.5; // px/tick
const LIFE_SPAN = 5000 / TICK; // ticks

const COLORS = ["#FF8A80", "#FF5252", "#FF1744", "#D50000", "#FF80AB", "#FF4081", "#F50057", "#C51162", "#EA80FC", "#E040FB", "#D500F9", "#AA00FF", "#B388FF", "#7C4DFF", "#651FFF", "#6200EA", "#8C9EFF", "#536DFE", "#3D5AFE", "#304FFE", "#82B1FF", "#448AFF", "#2979FF", "#2962FF", "#80D8FF", "#40C4FF", "#00B0FF", "#0091EA", "#84FFFF", "#18FFFF", "#00E5FF", "#00B8D4", "#A7FFEB", "#64FFDA", "#1DE9B6", "#00BFA5", "#B9F6CA", "#69F0AE", "#00E676", "#00C853", "#CCFF90", "#B2FF59", "#76FF03", "#64DD17", "#F4FF81", "#EEFF41", "#C6FF00", "#AEEA00", "#FFFF8D", "#FFFF00", "#FFEA00", "#FFD600", "#FFE57F", "#FFD740", "#FFC400", "#FFAB00", "#FFD180", "#FFAB40", "#FF9100", "#FF6D00", "#FF9E80", "#FF6E40", "#FF3D00", "#DD2C00"];

export default class BubbleBurst extends Component {

  rand = null;
  state = {
    score  : 0,
    bubbles: [],
  };
  intervalId = -1;

  constructor(props) {
    super(props);

    this.startNewProblem = this.startNewProblem.bind(this);
    this.handleProblemSolved = this.handleProblemSolved.bind(this);

    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
    // If the screen is resized, finish the game immediately because of the
    // level
    this.handleProblemSolved();
  }

  componentDidUpdate() {

  }

  startNewProblem() {
    clearInterval(this.intervalId);

    // Generate bubbles
    this.rand = seedrandom(Date.now());
    let colors = [...COLORS].map(a => [this.rand(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);

    let bubbles = new Array(BUBBLE_NUMBER).fill().map((a, i) => {
      let speed = this.rand();

      return {
        top            : Math.floor(this.rand() * HEIGHT),
        left           : Math.floor(this.rand() * WIDTH),
        horizontalSpeed: MOVING_SPEED * Math.sign(this.rand() - .5) * speed,
        verticalSpeed  : MOVING_SPEED * Math.sign(this.rand() - .5) * Math.sqrt(1 - speed * speed),
        color          : colors[i],
        size           : INITIAL_RADIUS,
        life           : 0,
      }
    });

    this.setState({
      bubbles,
    }, () => {
      this.intervalId = setInterval(() => {
        let bubbles = [...this.state.bubbles].map(b => {
          let {top, left, horizontalSpeed, verticalSpeed} = b;

          let nextTop = top + horizontalSpeed;
          let nextLeft = left + verticalSpeed;

          // Check if they are out of bound
          if (nextTop < b.size || nextTop > HEIGHT) {
            horizontalSpeed = -horizontalSpeed;
          }

          if (nextLeft < b.size || nextLeft > WIDTH) {
            verticalSpeed = -verticalSpeed;
          }

          b.top = nextTop;
          b.left = nextLeft;
          b.horizontalSpeed = horizontalSpeed;
          b.verticalSpeed = verticalSpeed;

          return b;
        });

        this.setState({
          bubbles,
        });
      }, TICK);
    });
  }

  handleProblemSolved() {
    this.setState({
      gameState: R.GAME_STATE.IDLE,
    });
  }

  render() {
    return (
      <Game name="bubble-burst"
            className={`${this.state.locked ? "blurred" : ""} ${this.state.step === 0 ? "game-over" : ""}`}
            gameIntro={[
              "Click anywhere inside the canvas the create a ripple",
              "Any bubbles touching the ripple will create another ripple",
              "Cause chain reaction to get higher score!",
            ]}
            onStart={this.startNewProblem}
            onResize={this.handleResize}
            restartText="Play again"
            restartIcon="refresh"
            score={this.state.score}
      >
        <div className="bubble-canvas flex-center"
             style={{width: WIDTH, height: HEIGHT}}>
          {this.state.bubbles.map(b =>
            <span className="bubble"
                  key={b.color}
                  style={{
                    top       : b.top - b.size,
                    left      : b.left - b.size,
                    background: b.color,
                    width     : b.size,
                    height    : b.size,
                    opacity   : 1 - b.life / LIFE_SPAN,
                  }}/>
          )}
        </div>
      </Game>
    );
  }
};