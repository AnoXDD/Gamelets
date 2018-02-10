import React, {Component} from "react";
import seedrandom from "seedrandom";

import Game from "../lib/Game";
import * as R from "../R";

const WIDTH = 300;
const HEIGHT = 550;
const BUBBLE_NUMBER = 20;
const TICK = 40; // milliseconds
const MAX_MOVING_SPEED = 5; // px/tick
const MIN_MOVING_SPEED = 1;
const INITIAL_RADIUS = 5.0;
const FINAL_RADIUS = 50;
const GROWING_SPEED = 2; // px/tick
const LIFE_SPAN = 5000.0 / TICK; // ticks

const COLORS = ["#FF8A80", "#FF5252", "#FF1744", "#D50000", "#FF80AB", "#FF4081", "#F50057", "#C51162", "#EA80FC", "#E040FB", "#D500F9", "#AA00FF", "#B388FF", "#7C4DFF", "#651FFF", "#6200EA", "#8C9EFF", "#536DFE", "#3D5AFE", "#304FFE", "#82B1FF", "#448AFF", "#2979FF", "#2962FF", "#80D8FF", "#40C4FF", "#00B0FF", "#0091EA", "#84FFFF", "#18FFFF", "#00E5FF", "#00B8D4", "#A7FFEB", "#64FFDA", "#1DE9B6", "#00BFA5", "#B9F6CA", "#69F0AE", "#00E676", "#00C853", "#CCFF90", "#B2FF59", "#76FF03", "#64DD17", "#F4FF81", "#EEFF41", "#C6FF00", "#AEEA00", "#FFFF8D", "#FFFF00", "#FFEA00", "#FFD600", "#FFE57F", "#FFD740", "#FFC400", "#FFAB00", "#FFD180", "#FFAB40", "#FF9100", "#FF6D00", "#FF9E80", "#FF6E40", "#FF3D00", "#DD2C00"];

export default class BubbleBurst extends Component {

  rand = null;
  state = {
    score             : 0,
    bubbles           : [],
    currentBubbleScore: this.getBaseBubbleScore(),
    nextBubbleScore   : this.getBaseBubbleScore(),
  };
  intervalId = -1;

  constructor(props) {
    super(props);

    this.startNewProblem = this.startNewProblem.bind(this);
    this.handleProblemSolved = this.handleProblemSolved.bind(this);
    this.getBaseBubbleScore = this.getBaseBubbleScore.bind(this);

    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  getBaseBubbleScore() {
    if (!this.state) {
      return 5;
    }

    return 5 * Math.ceil((BUBBLE_NUMBER - this.state.bubbles.length + 1) / 2);
  }

  handleResize() {
    // If the screen is resized, finish the game immediately because of the
    // level
    this.handleProblemSolved();
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
        horizontalSpeed: (MIN_MOVING_SPEED + this.rand() * (MAX_MOVING_SPEED - MIN_MOVING_SPEED)) * Math.sign(this.rand() - .5) * speed,
        verticalSpeed  : (MIN_MOVING_SPEED + this.rand() * (MAX_MOVING_SPEED - MIN_MOVING_SPEED)) * Math.sign(this.rand() - .5) * Math.sqrt(1 - speed * speed),
        color          : colors[i],
        size           : INITIAL_RADIUS,
        age            : -1,
      }
    });

    this.setState({
      bubbles,
    }, () => {
      this.intervalId = setInterval(() => {
        let {currentBubbleScore, nextBubbleScore} = this.state;

        let blowing = this.state.bubbles.filter(b => b.age !== -1);

        let bubbles = [];

        for (let b of this.state.bubbles) {
          let {top, left, horizontalSpeed, verticalSpeed} = b;

          // Check if current position should trigger a burst
          if (b.age === -1) {
            for (let blow of blowing) {
              if (Math.pow(b.top - blow.top, 2) + Math.pow(b.left - blow.left, 2)
                <= Math.pow((b.size + blow.size) / 2, 2)) {
                // Blow this one as well
                b.age = 0;

                b.score = nextBubbleScore;
                nextBubbleScore += currentBubbleScore;
                currentBubbleScore = b.score;

                break;
              }
            }
          }

          if (b.age === -1) {
            let nextTop = top + horizontalSpeed;
            let nextLeft = left + verticalSpeed;

            // Check if they are out of bound
            if (nextTop < 0 || nextTop > HEIGHT) {
              horizontalSpeed = -horizontalSpeed;
            }

            if (nextLeft < 0 || nextLeft > WIDTH) {
              verticalSpeed = -verticalSpeed;
            }

            b.top = nextTop;
            b.left = nextLeft;
            b.horizontalSpeed = horizontalSpeed;
            b.verticalSpeed = verticalSpeed;
          }

          bubbles.push({...b});
        }

        bubbles = bubbles.map(b => {
          if (b.age === -1) {
            return b;
          }

          b.size += GROWING_SPEED;
          b.size = Math.min(b.size, FINAL_RADIUS);

          ++b.age;
          return b;
        }).filter(b => b.age <= LIFE_SPAN);

        this.setState({
          currentBubbleScore, nextBubbleScore,
          bubbles: bubbles,
        });
      }, TICK);
    });
  }

  /**
   * Handles the click
   * @param {MouseEvent} e
   */
  handleClick(e) {
    if (this.state.bubbles.some(b => b.age !== -1)) {
      // There is another bubble going on
      return;
    }

    let top = e.pageY - e.target.getBoundingClientRect().top;
    let left = e.pageX - e.target.getBoundingClientRect().left;
    console.log(top, left);

    this.setState({
      currentBubbleScore: this.getBaseBubbleScore(),
      nextBubbleScore   : this.getBaseBubbleScore(),
      bubbles           : [...this.state.bubbles, {
        top,
        left,
        horizontalSpeed: 0,
        verticalSpeed  : 0,
        color          : "#000",
        size           : INITIAL_RADIUS,
        age            : 0,
      }],
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
             onClick={this.handleClick}
             style={{width: WIDTH, height: HEIGHT}}>
          {this.state.bubbles.map(b =>
            <span className="bubble"
                  key={b.color}
                  style={{
                    top       : b.top - b.size / 2,
                    left      : b.left - b.size / 2,
                    background: b.color,
                    width     : b.size,
                    height    : b.size,
                    opacity   : 1 - b.age / LIFE_SPAN,
                  }}>
              {b.score ? <span className="score">{b.score}</span> : null}
            </span>
          )}
        </div>
      </Game>
    );
  }
};