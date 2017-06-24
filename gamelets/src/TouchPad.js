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

    constructor(props) {
        super(props);

        this.getPosition = this.getPosition.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleStart = this.handleStart.bind(this);
    }

    getPosition(event) {
        if (this.isMouseEvent(event)) {
            return {x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY};
        }

        // Don't do anything if multiple touches detected
        if (event.targetTouches.length !== 1) {
            return null;
        }

        let $picker = event.target.getBoundingClientRect();

        return {
            x: event.targetTouches[0].pageX - $picker.left,
            y: event.targetTouches[0].pageY - $picker.bottom,
        };
    }

    isMouseEvent(e) {
        if (!e || !(e.type)) {
            console.log("Not a valid event");
            return true;
        }

        return !(e.type.startsWith("touch"));
    }

    handleStart(e) {
        console.log("start", this.getPosition(e));
    }

    handleMove(e) {
        console.log("move", this.getPosition(e));
    }

    handleEnd(e) {
        console.log("end", this.getPosition(e));
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
                {this.props.children}
            </div>
        );
    };
}


