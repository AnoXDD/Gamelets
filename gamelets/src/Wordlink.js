/**
 * Created by Anoxic on 6/22/2017.
 */


import React, {Component} from "react";

import Grid from "./Grid";

export default class Wordlink extends Component {
    state = {
        word: "",
        score: 0,
    };

    constructor(props) {
        super(props);

        this.handleNewWord = this.handleNewWord.bind(this);
        this.handleNewScore = this.handleNewScore.bind(this);
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

    render() {
        return (
            <div className="wordlink">
                <div className="letter-selected">{this.state.word}</div>
                <div className="score">{this.state.score}</div>
                <Grid onWordChange={this.handleNewWord}
                      onScoreChange={this.handleNewScore}
                />
            </div>
        );
    }
}