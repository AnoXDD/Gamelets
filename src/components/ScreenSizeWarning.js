/**
 * Created by Anoxic on 1/28/2018.
 */

import React, {Component} from "react";
import PropTypes from "prop-types";

import Button from "../lib/Button";

export default class ScreenSizeWarning extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.width !== this.props.width
      || nextProps.height !== this.props.height;
  }

  render() {
    return (
      <div
        className="full-screen-cover flex-center"
        onClick={this.props.handleDismiss}
      >
        <div className="screen-size-warning">
          <Button
            className="top top-right"
            onClick={this.props.handleDismiss}
          >close</Button>
          <div className="title">Screen Too Small!</div>
          <p>This website may not function properly with current size of
            screen. Putting it in portrait mode, or clicking the fullscreen
            button
            (which can be found on the top right corner in the home page)
            might help. </p>
          <div className="diagnosis">
            <div
              className={`diagnosis-test ${this.props.width >= this.props.minWidth ? "passed" : "failed"}`}>
              <span>Screen width: <span>{this.props.width}</span> </span>
              <span>(Required: <span>{this.props.minWidth}</span>)</span>
            </div>
            <div
              className={`diagnosis-test ${this.props.height >= this.props.minHeight ? "passed" : "failed"}`}>
              <span>Screen height: <span>{this.props.height}</span> </span>
              <span>(Required: <span>{this.props.minHeight}</span>)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ScreenSizeWarning.propTypes = {
  handleDismiss: PropTypes.func,

  width    : PropTypes.number.isRequired,
  minWidth : PropTypes.number.isRequired,
  height   : PropTypes.number.isRequired,
  minHeight: PropTypes.number.isRequired,
};