import React, {Component} from "react";
import seedrandom from "seedrandom";

import Game from "../lib/Game";
import * as R from "../R";

const WIDTH = 300;
const HEIGHT = 400;
const MAX_BUBBLE_NUMBER = 35;
const TICK = 25; // milliseconds
const MAX_MOVING_SPEED = 150 / TICK; // px/tick
const MIN_MOVING_SPEED = 35 / TICK;
const SPEED_CHANGE_RATE = 1 / 1000 * TICK; // *100%/tick
const INITIAL_RADIUS = 5.0;
const FINAL_RADIUS = 50;
const GROWING_SPEED = 200 / TICK; // px/tick
const LIFE_SPAN = 2500.0 / TICK; // ticks
const ATTEMPTS = 1;
const AWARD_INTERVAL = 3;
const AWARD_BUBBLES = 4;

const COLORS = ["#FF8A80", "#FF5252", "#FF1744", "#D50000", "#FF80AB", "#FF4081", "#F50057", "#C51162", "#EA80FC", "#E040FB", "#D500F9", "#AA00FF", "#B388FF", "#7C4DFF", "#651FFF", "#6200EA", "#8C9EFF", "#536DFE", "#3D5AFE", "#304FFE", "#82B1FF", "#448AFF", "#2979FF", "#2962FF", "#80D8FF", "#40C4FF", "#00B0FF", "#0091EA", "#84FFFF", "#18FFFF", "#00E5FF", "#00B8D4", "#A7FFEB", "#64FFDA", "#1DE9B6", "#00BFA5", "#B9F6CA", "#69F0AE", "#00E676", "#00C853", "#CCFF90", "#B2FF59", "#76FF03", "#64DD17", "#F4FF81", "#EEFF41", "#C6FF00", "#AEEA00", "#FFFF8D", "#FFFF00", "#FFEA00", "#FFD600", "#FFE57F", "#FFD740", "#FFC400", "#FFAB00", "#FFD180", "#FFAB40", "#FF9100", "#FF6D00", "#FF9E80", "#FF6E40", "#FF3D00", "#DD2C00"];

export default class BubbleBurst extends Component {

  rand = null;
  bubbleId = 0;
  speedPercentage = 1;

  state = {
    score     : 0,
    bubbles   : [],
    newBubbles: [],
    attempts  : ATTEMPTS,
  };

  intervalId = -1;
  timeoutId = -1;

  constructor(props) {
    super(props);

    this.startNewProblem = this.startNewProblem.bind(this);
    this.handleProblemSolved = this.handleProblemSolved.bind(this);
    this.endGameIfNecessary = this.endGameIfNecessary.bind(this);

    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    // Award bubbles based on score change
    if (nextState.score > this.state.score && this.state.score) {
      let nextThreshold = Math.floor(nextState.score / AWARD_INTERVAL);
      let thisThreshold = Math.floor(this.state.score / AWARD_INTERVAL);

      let newBubbleNum = (nextThreshold - thisThreshold) * AWARD_BUBBLES;

      newBubbleNum = Math.min(newBubbleNum, MAX_BUBBLE_NUMBER - nextState.bubbles.length);

      if (newBubbleNum <= 0) {
        return;
      }

      let newBubbles = new Array(newBubbleNum).fill()
        .map(_ => this.newBubble(true));

      nextState.bubbles = [
        ...nextState.bubbles,
        ...newBubbles
      ];

      // Partial clean up
      if (nextState.newBubbles.length > 100) {
        nextState.newBubbles = [];
      }

      nextState.newBubbles = [
        ...nextState.newBubbles,
        ...newBubbles.map(b => ({...b}))
      ];
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    clearInterval(this.timeoutId);
  }

  handleResize() {
    // If the screen is resized, finish the game immediately because of the
    // level
    this.handleProblemSolved();
  }

  /**
   * Creates a new bubble
   * @param isAwarded
   * @return {{top: number, left: number, horizontalSpeed: number,
   *   verticalSpeed: number, color: string, size: number, age: number,
   *   isAwarded: boolean}}
   */
  newBubble(isAwarded = false) {
    let speed = this.rand();

    return {
      top            : Math.floor(this.rand() * HEIGHT),
      left           : Math.floor(this.rand() * WIDTH),
      horizontalSpeed: (MIN_MOVING_SPEED + this.rand() * (MAX_MOVING_SPEED - MIN_MOVING_SPEED)) * Math.sign(this.rand() - .5) * speed,
      verticalSpeed  : (MIN_MOVING_SPEED + this.rand() * (MAX_MOVING_SPEED - MIN_MOVING_SPEED)) * Math.sign(this.rand() - .5) * Math.sqrt(1 - speed * speed),
      color          : COLORS[Math.floor(this.rand() * COLORS.length)],
      size           : INITIAL_RADIUS,
      age            : -1,
      id             : `${Date.now()}-${this.bubbleId++}`,
      isAwarded,
    }
  }

  startNewProblem() {
    clearInterval(this.intervalId);
    clearInterval(this.timeoutId);

    // Generate bubbles
    this.rand = seedrandom(Date.now());

    let bubbles = new Array(MAX_BUBBLE_NUMBER).fill()
      .map(_ => this.newBubble());

    this.setState({
      bubbles,
      gameState      : R.GAME_STATE.START,
      attempts       : ATTEMPTS,
      score          : 0,
      speedPercentage: 1,
      isAccelerating : true,
    }, () => {
      let zIndex = 1;

      this.intervalId = setInterval(() => {
        let {score} = this.state;

        // Change speedPercentage
        // this.speedPercentage = Math.min(1, this.speedPercentage +
        // SPEED_CHANGE_RATE);

        let blowing = this.state.bubbles.filter(b => b.age !== -1);

        let bubbles = [];

        for (let b of this.state.bubbles) {
          let {top, left, horizontalSpeed, verticalSpeed} = b;

          // Check if current position should trigger a burst
          if (b.age === -1) {
            for (let blow of blowing) {
              let sizeSum = b.size + blow.size / 2;
              let dTop = b.top - blow.top;

              if (dTop > sizeSum) {
                continue;
              }

              let dLeft = b.left - blow.left;
              if (dLeft <= sizeSum
                && dTop * dTop + dLeft * dLeft <= sizeSum * sizeSum) {
                // Blow this one as well
                b.age = 0;
                b.zIndex = zIndex++;

                ++score;

                break;
              }
            }
          }

          if (b.age === -1) {
            let nextTop = top + this.speedPercentage * horizontalSpeed;
            let nextLeft = left + this.speedPercentage * verticalSpeed;

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

        let bubbleSize = bubbles.length;

        bubbles = bubbles.map(b => {
          if (b.age === -1) {
            return b;
          }

          b.size += GROWING_SPEED;
          b.size = Math.min(b.size, FINAL_RADIUS);

          ++b.age;
          return b;
        }).filter(b => b.age <= LIFE_SPAN);

        let aliveBubbleSize = bubbles.length;

        if (bubbleSize !== aliveBubbleSize) {
          this.endGameIfNecessary();
        }

        this.setState({
          score,
          newBubblePosition: [],
          bubbles          : bubbles,
        });
      }, TICK);
    });
  }

  /**
   * Handles the click
   * @param {MouseEvent} e
   */
  handleClick(e) {
    if (this.state.bubbles.some(
        b => b.age !== -1) || this.state.attempts <= 0) {
      // There is another bubble going on
      return;
    }

    let top = e.pageY - e.target.getBoundingClientRect().top;
    let left = e.pageX - e.target.getBoundingClientRect().left;

    this.setState({
      attempts  : this.state.attempts - 1,
      bubbles   : [...this.state.bubbles, {
        top,
        left,
        horizontalSpeed: 0,
        verticalSpeed  : 0,
        color          : "#000",
        size           : INITIAL_RADIUS,
        id             : Date.now(),
        age            : 0,
      }],
      newBubbles: [],
    });
  }

  handleProblemSolved() {
    clearInterval(this.intervalId);
    clearInterval(this.timeoutId);

    this.setState({
      gameState: R.GAME_STATE.IDLE,
    });
  }

  endGameIfNecessary() {
    clearInterval(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      if (!this.state.bubbles.some(b => b.age !== -1)) {
        this.handleProblemSolved();
      }
    }, 500);
  }

  handleMouseDown() {
    this.speedPercentage = 0;
  }

  handleMouseUp() {
    this.speedPercentage = 1;
  }

  render() {
    return (
      <Game name="bubble-burst"
            className={`${this.state.locked ? "blurred" : ""} ${this.state.step === 0 ? "game-over" : ""}`}
            gameIntro={[
              "Click to create a ripple that bursts other bubbles",
              "Hold to stop the bubbles moving",
              "Four new bubbles for every third burst bubble",
            ]}
            onStart={this.startNewProblem}
            onResize={this.handleResize}
            restartText="Play again"
            restartIcon="refresh"
            gameState={this.state.gameState}
            score={this.state.score}
      >
        {/*<div className="attempts">*/}
        {/*{new Array(ATTEMPTS).fill().map((a, i) =>*/}
        {/*<span className={`bubble ${i >= this.state.attempts ? "used" : ""}`}*/}
        {/*key={i}/>*/}
        {/*)}*/}
        {/*</div>*/}
        <div className="bubble-canvas flex-center"
             onClick={this.handleClick}
             onMouseDown={this.handleMouseDown}
             onTouchStart={this.handleMouseDown}
             onMouseUp={this.handleMouseUp}
             onTouchEnd={this.handleMouseUp}
             style={{width: WIDTH, height: HEIGHT}}>
          {this.state.bubbles.map(b =>
            <span className="bubble flex-center"
                  key={b.id}
                  style={{
                    top       : b.top - b.size / 2,
                    left      : b.left - b.size / 2,
                    background: b.color,
                    width     : b.size,
                    height    : b.size,
                    opacity   : 1 - b.age / LIFE_SPAN,
                    zIndex    : b.zIndex || 0,
                  }}>
              {b.score ? <span className="score">{b.score}</span> : null}
            </span>
          )}
          {this.state.newBubbles.map(b =>
            <span className="new-bubble"
                  key={b.id}
                  style={{
                    top  : b.top - b.size / 2,
                    left : b.left - b.size / 2,
                    color: b.color,
                  }}
            />
          )}
        </div>
      </Game>
    );
  }
};