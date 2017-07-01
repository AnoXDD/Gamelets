/**
 * Created by Anoxic on 6/23/2017.
 * A touch pad for both mouse and touch events
 */

import React, {Component} from "react";

/*
 Props: gridWidth, gridHeight, marginWidth, marginHeight, onStart, onMove, onEnd
 For events: return a object {x: , y: ,}
 */
export default class TouchPad extends Component {

  state = {
    debug: [],
  };

  top = -1;
  left = -1;

  lastGrid = null;

  constructor(props) {
    super(props);

    this.getPosition = this.getPosition.bind(this);
    this.getGrid = this.getGrid.bind(this);
    this.recordPosition = this.recordPosition.bind(this);
    this.isNewGrid = this.isNewGrid.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.log = this.log.bind(this);
  }

  getPosition(event) {
    if (this.isMouseEvent(event)) {
      return {
        x: event.pageX - this.left,
        y: event.pageY - this.top,
      };
    }

    // Don't do anything if multiple touches detected
    if (event.targetTouches.length !== 1) {
      return null;
    }

    let x = event.targetTouches[0].clientX - this.left;
    let y = event.targetTouches[0].clientY - this.top;

    // this.log(`pageX: ${Math.floor(event.targetTouches[0].pageX)}\tpageY: ${Math.floor(
    //     event.targetTouches[0].pageY)}\t left: ${Math.floor($picker.left)}\t top: ${Math.floor(
    //     $picker.top)}\t x: ${Math.floor(x)}\t y: ${Math.floor(y)} `)

    return {
      x: x,
      y: y,
    };
  }

  getGrid(e) {
    let position = this.getPosition(e);
    if (!position) {
      return null;
    }

    let {gridWidth, gridHeight, marginWidth, marginHeight} = this.props;

    // First, determine the box it's in, including the margin
    let outerWidth = gridWidth + 2 * marginWidth,
        outerHeight = gridHeight + 2 * marginHeight;

    let x = Math.floor(position.x / outerWidth),
        y = Math.floor(position.y / outerHeight);

    // Then determine if the position is not on the margin
    let innerX = position.x - outerWidth * x - marginWidth,
        innerY = position.y - outerHeight * y - marginHeight;

    if (innerX > 0 && innerX < gridWidth && innerY > 0 && innerY < gridHeight) {
      return {
        x: x, y: y
      };
    }

    return null;
  }

  isMouseEvent(e) {
    if (!e || !(e.type)) {
      console.log("Not a valid event");
      return true;
    }

    return !(e.type.startsWith("touch"));
  }

  isNewGrid(grid) {
    let lastGrid = this.lastGrid;
    this.lastGrid = grid;

    if (!grid || !lastGrid) {
      return grid || lastGrid;
    }

    return grid.x !== lastGrid.x || grid.y !== lastGrid.y;
  }

  // Fix the position of the canvas
  recordPosition(e) {
    let $picker = e.target.getBoundingClientRect();

    this.top = $picker.top;
    this.left = $picker.left;
  }

  handleStart(e) {
    this.recordPosition(e);
    let grid = this.getGrid(e);
    this.props.onStart(grid);
  }

  handleMove(e) {
    let grid = this.getGrid(e);
    if (this.isNewGrid(grid)) {
      this.props.onMove(grid);
    }
  }

  handleEnd(e) {
    let grid = this.getGrid(e);
    this.props.onEnd(grid);
  }

  log(m) {
    this.setState({
      debug: [m, ...this.state.debug],
    });
  }

  render() {
    return (
        <div style={{height: "100%", width: "100%"}}
             onMouseDown={this.handleStart}
             onMouseUp={this.handleEnd}
             onMouseMove={this.handleMove}
             onTouchStart={this.handleStart}
             onTouchEnd={this.handleEnd}
             onTouchCancel={this.handleEnd}
             onTouchMove={this.handleMove}
        >
          <div style={{
            position  : "fixed",
            top       : 0,
            left      : 0,
            height    : "300px",
            width     : "100%",
            color     : "red"
          }}>{this.state.debug.map(d => <p>{d}</p>)}</div>
          {this.props.children}
        </div>
    );
  };
}


