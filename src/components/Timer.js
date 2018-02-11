/**
 * Created by Anoxic on 6/23/2017.
 */

import PropTypes from "prop-types";
import React, {Component} from "react";
import AnimatedNumber from "../lib/AnimatedNumber";

const DEFAULT_TIME = 60;

export default class Timer extends Component {

  intervalId = -1;
  version = 0;

  state = {
    time: 0,
  };

  constructor(props) {
    super(props);

    this.startTimer = this.startTimer.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.version !== this.version || this.state.time > 0;
  }

  componentDidUpdate() {
    if (this.state.time <= 0) {
      // Time!
      clearInterval(this.intervalId);

      if (this.props.onFinish) {
        this.props.onFinish();
      }
    } else {
      if (this.props.onChange) {
        this.props.onChange(this.state.time);
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.version > this.version) {
      // Reset timer
      this.version = nextProps.version;
      nextState.time = nextProps.start || DEFAULT_TIME;
      this.startTimer(nextProps.timeInterval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);

    // Send a summary of time if the time is going up
    if (!this.props.countDown) {
      this.props.onFinish(this.state.time);
    }
  }

  startTimer(interval) {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(
        this.props.countDown ? () => {
          this.setState({
            time: this.state.time - this.props.timeInterval,
          });
        } : () => {
          this.setState({
            time: this.state.time + this.props.timeInterval,
          })
        }, interval || this.props.timeInterval);
  }

  render() {
    return (
        <div className="timer flex-center">
          <AnimatedNumber value={this.state.time / 1000} className="animated-number"/>
        </div>
    );
  }
}

Timer.propTypes = {
  countDown: PropTypes.bool,

  version     : PropTypes.number,
  timeInterval: PropTypes.number, // in milliseconds
  start       : PropTypes.number, // in milliseconds

  onFinish: PropTypes.func.isRequired,
  onChange: PropTypes.func, // the callback when time is changed
};


Timer.defaultProps = {
  countDown: true,

  timeInterval: 1000,

  onFinish: e => void(e),
};