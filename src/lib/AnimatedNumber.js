import React, {Component} from "react";
import PropTypes from "prop-types";

class Digit extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.digit !== this.props.digit;
  }

  render() {
    return <span style={{
      overflow  : "hidden",
      lineHeight: 1,
      width     : "1ch",
      display   : "inline-block",
      position  : "relative",
    }}>
      <span style={{
        lineHeight: 1,
      }}>&nbsp;</span>
      <span style={{
        position: "absolute",
        top     : 0,
        left    : 0,
      }}>
        {/* Prop the component */}
        <span style={{
          opacity   : 0,
          lineHeight: 11,
        }}>&nbsp;</span>
        {/* Actual holder of digits*/}
        <span style={{
          position: "absolute",
          bottom  : 0,
          left    : 0,
          width   : "1ch"
        }}>
          <span style={{
            width        : "1ch",
            textAlign    : "center",
            wordWrap     : "break-word",
            display      : "inline-block",
            whiteSpace   : "pre-wrap",
            overflow     : "hidden",
            verticalAlign: "middle",
            lineHeight   : 1,
          }}
          >0123456789</span>
          <span style={{
            transition: "line-height .4s ease",
            lineHeight: this.props.digit + 1,
          }}>&nbsp;</span>
        </span>
      </span>
    </span>;
  }
}

Digit.propTypes = {
  digit: PropTypes.number.isRequired,
  size : PropTypes.number.isRequired,
};

export default class AnimatedNumber extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value
  }

  render() {
    return (
      <span className={this.props.className}>
        {`${this.props.value}`.split("").map((digit, i) =>
          <Digit key={i} digit={Number(digit)} size={this.props.fontSize}/>
        )}
      </span>
    )
  }
};

AnimatedNumber.propTypes = {
  value   : PropTypes.number.isRequired,
  className:PropTypes.string,
};

AnimatedNumber.defaultProps = {
  value: 0,
};
