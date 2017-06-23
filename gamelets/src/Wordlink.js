/**
 * Created by Anoxic on 6/22/2017.
 */


import React, {Component} from "react";

import Grid from "./Grid";

export default class Wordlink extends Component {
    state = {
        word: "",
    };

    constructor(props) {
        super(props);

        this.handleNewWord = this.handleNewWord.bind(this);
    }

    handleNewWord(word) {
        this.setState({
            word: word,
        });
    }

    render() {
        return (
            <div className="wordlink">
                <div className="letter-selected">{this.state.word}</div>
                <Grid onWordChange={this.handleNewWord}/>
            </div>
        );
    }
}