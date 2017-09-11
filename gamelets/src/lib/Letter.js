/**
 * Created by Anoxic on 9/10/2017.
 *
 * A class for a single letter block
 */

import React, {Component} from "react";
import Ink from "react-ink";

export default class Letter extends Component {
  render() {
    return (
      <div
        className={`letter-grid ${typeof this.props.badge !== "undefined" ? `letter-${this.props.badge}` : "no-badge"} ${this.props.className || ""}`}
      >
        <div
          onClick={this.props.onClick}
          className="letter-inner flex-center">
          {this.props.onClick ? <Ink/> : null}
          <span>{this.props.letter}</span>
        </div>
      </div>
    )
  }
}
