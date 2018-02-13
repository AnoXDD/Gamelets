/**
 * Created by Anoxic on 041817.
 * A toggle with material icon that has two state
 */

import React, {Component} from "react";
import Ink from "react-ink";
import PropTypes from "prop-types";

export default class Toggle extends Component {

  state = {
    onFirst: true
  };

  render() {
    let {className, toggleOnHover, toggled, onClick, firstIcon, secondIcon} = this.props;
    let tag = this.props["data-tag"];

    let disabled = {};
    if (this.props.disabled) {
      disabled.disabled = "disabled";
    }

    return (
      <a
        className={`toggle ${this.props.loading ? "loading" : ""} ${className || ""} ${toggleOnHover ? "change-hover" : ""} ${toggled ? "show-second" : ""} `}
        onClick={onClick}
        {...disabled}
      >
        <Ink/>
        <div
          data-tag={tag}
          className={`flex-center first icon-wrapper ${!this.props.loading ? "" : "transparent"}`}>
          <i className="material-icons">{firstIcon}</i>
        </div>
        <div
          data-tag={tag}
          className={`flex-center second icon-wrapper ${!this.props.loading ? "" : "transparent"}`}>
          <i className="material-icons">{secondIcon}</i>
        </div>
        {this.props.tooltip ? (
          <div className="tooltip flex-center">
                <span className="tooltip-text">
                  {this.props.tooltip}
                </span>
          </div>) : null}
        {this.props.tooltip ? (
          <div className="tooltip flex-center">
                <span className="tooltip-text">
                  {this.props.tooltip}
                </span>
          </div>) : null}
        <div
          className={`flex-center icon-wrapper loading-icon ${this.props.loading ? "" : "transparent"}`}>
          <i className="material-icons">remove</i>
        </div>
      </a>
    );
  }
}

Toggle.propTypes = {
  className: PropTypes.string,

  toggleOnHover: PropTypes.bool,
  toggled      : PropTypes.bool,
  disabled     : PropTypes.bool,
  loading      : PropTypes.bool,

  onClick: PropTypes.func,

  firstIcon : PropTypes.string.isRequired,
  secondIcon: PropTypes.string.isRequired,
  tooltip   : PropTypes.string,
};