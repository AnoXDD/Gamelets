/**
 * Created by Anoxic on 6/23/2017.
 */

import React, {Component} from "react";

const DEFAULT_TIME = 60;

export default class Timer extends Component {

    intervalId = -1;
    version = 0;

    state = {
        timeLeft: 0,
    };

    constructor(props) {
        super(props);

        this.startTimer = this.startTimer.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.version !== this.version || this.state.timeLeft > 0;
    }

    componentDidUpdate() {
        if (this.state.timeLeft <= 0) {
            // Time!
            clearInterval(this.intervalId);

            if (this.props.onFinish) {
                this.props.onFinish();
            }
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.version > this.version) {
            // Reset timer
            this.version = nextProps.version;
            nextState.timeLeft = nextProps.start || DEFAULT_TIME;
            this.startTimer();
        }
    }

    startTimer() {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            this.setState({
                timeLeft: this.state.timeLeft - 1,
            });
        }, 1000);
    }

    render() {
        return (
            <div className="timer flex-center">
                {this.state.timeLeft}
            </div>
        );
    }
}