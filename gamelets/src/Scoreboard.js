/**
 * Created by Anoxic on 6/23/2017.
 */

import React, {Component} from "react";

export default  class Scoreboard extends Component {

    difference = 0;
    toggleClass = true;

    shouldComponentUpdate(nextProps) {
        return nextProps.score !== this.props.score;
    }

    componentWillUpdate(nextProps) {
        this.difference = nextProps.score - this.props.score;
        this.toggleClass = !this.toggleClass;
    }

    render() {
        return (
            <div className="score">
                {this.props.score}
                <div
                    className={`difference difference-${this.toggleClass ? "1" : "2"} ${this.props.reset || ""}`}>
                    {this.difference}
                </div>
            </div>
        );
    }
}