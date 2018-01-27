/**
 * Created by Anoxic on 6/23/2017.
 */

import React, {Component} from "react";

export default  class Scoreboard extends Component {

  difference = 0;
  toggleClass = "";

  shouldComponentUpdate(nextProps) {
    return nextProps.score !== this.props.score;
  }

  componentWillUpdate(nextProps) {
    // eslint-disable-next-line
    if (this.difference = nextProps.score - this.props.score) {
      if (this.toggleClass === "difference-1") {
        this.toggleClass = "difference-2";
      } else {
        this.toggleClass = "difference-1";
      }
    }
  }

  render() {
    return (
        <div className="score">
          {this.props.score}
          {this.props.score ?
              <div
                  className={`difference ${this.toggleClass} ${this.props.reset || ""}`}>
                {this.difference}
              </div>
              : null }
        </div>
    );
  }
}