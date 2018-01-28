/**
 * Created by Anoxic on 6/22/2017.
 */


import React, {Component} from "react";

import Game from "./lib/Game";
import Grid from "./Wordlink/Grid";
import WordDashboard from "./components/WordDashboard";

const DEFAULT_TIME = 60000;

const GAME_STATE = {
  IDLE : -1,
  READY: 1,
  START: 2,
};

export default class Wordlink extends Component {

  state = {
    mini: false,

    word : "",
    score: 0,

    timeVersion: 0,

    isSelectedWordValid: "",
  };

  constructor(props) {
    super(props);


    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleNewWord = this.handleNewWord.bind(this);
    this.handleNewScore = this.handleNewScore.bind(this);
    this.handleNewState = this.handleNewState.bind(this);

    this.readyGame = this.readyGame.bind(this);
  }

  handleWindowResize(state) {
    this.setState({
      mini: state,
    });
  }

  handleNewWord(word) {
    this.setState({
      word: word,
    });
  }

  handleNewScore(score) {
    this.setState({
      score: this.state.score + score,
    });
  }

  readyGame() {
    this.setState({
      score      : 0,
      timeVersion: new Date().getTime(),
    });
  }

  handleNewState(state) {
    this.setState({
      gameState: state,
    });
  }

  render() {
    return (
      <Game name="wordlink"
            className={this.state.isSelectedWordValid}
            gameIntro={["Find English words from the matrix"]}
            roundTime={DEFAULT_TIME}
            score={this.state.score}
            onResize={this.handleWindowResize}
            onStart={this.readyGame}
            onStateChange={this.handleNewState}
      >
        <WordDashboard word={this.state.word}/>
        <Grid key={this.state.timeVersion}
              onWordChange={this.handleNewWord}
              onScoreChange={this.handleNewScore}
              onWordValidChange={
                v => this.setState({isSelectedWordValid: v})}
              active={this.state.gameState === GAME_STATE.START}
              mini={this.state.mini}
        />
      </Game>
    );
  }
}