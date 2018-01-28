/**
 * Created by Anoxic on 1/28/2018.
 */

import React, {Component} from "react";
import PropTypes from "prop-types";
import {CSSTransition, TransitionGroup} from "react-transition-group";

export default class WordDashboard extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.word !== nextProps.word;
  }

  render() {
    return (
      <TransitionGroup className="letter-selected flex-center">
        {this.props.word.split("").map((letter, i) =>
          <CSSTransition
            key={letter + i}
            className="letter"
            classNames="letter"
            timeout={200}
          >
            <span key={letter + i} className="letter">{letter}</span>
          </CSSTransition>
        )}
      </TransitionGroup>
    );
  }
}


WordDashboard.propTypes = {
  word: PropTypes.string,
};


WordDashboard.defaultProps = {
  word: "",
};