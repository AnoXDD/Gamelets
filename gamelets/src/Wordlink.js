/**
 * Created by Anoxic on 6/22/2017.
 */


import React, {Component} from "react";

import Grid from "./Wordlink/Grid";
import Scoreboard from "./Scoreboard";
import Timer from "./Timer";
import Button from "./Button";

const DEFAULT_TIME = 3000,
    COUNTDOWN = 3;

const GAME_STATE = {
    IDLE: -1,
    READY: 1,
    START: 2,
};

const MINI_THRESHOLD = 510;

export default class Wordlink extends Component {

    newGame = true;

    state = {
        mini: false,

        word: "",
        score: 0,
        isSelectedWordValid: "",

        gameState: GAME_STATE.IDLE,
        timeVersion: 0,
    };

    constructor(props) {
        super(props);


        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.handleNewWord = this.handleNewWord.bind(this);
        this.handleNewScore = this.handleNewScore.bind(this);
        this.handleTimeFinish = this.handleTimeFinish.bind(this);

        this.readyGame = this.readyGame.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    componentDidMount() {
        this.handleWindowResize();

        window.addEventListener("resize", this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize)
    }

    handleWindowResize() {
        let width = window.outerWidth;

        this.setState({
            mini: width <= MINI_THRESHOLD,
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

    handleTimeFinish() {
        if (this.state.gameState === GAME_STATE.READY) {
            this.startGame();
        } else {
            this.setState({
                gameState: GAME_STATE.IDLE,
            });
        }
    }

    readyGame() {
        this.counter = COUNTDOWN;

        this.setState({
            gameState: GAME_STATE.READY,
            timeVersion: this.state.timeVersion + 1,
            score: 0,
        })
    }

    startGame() {
        this.newGame = false;
        this.counter = DEFAULT_TIME;

        this.setState({
            gameState: GAME_STATE.START,
            timeVersion: this.state.timeVersion + 1,
        });
    }

    render() {
        return (
            <div
                className={`wordlink game ${this.state.isSelectedWordValid} ${this.state.gameState === GAME_STATE.IDLE ? "idle" : ""} ${this.state.gameState === GAME_STATE.READY ? "ready" : ""}`}>
                <header className="flex-center">
                    <Timer
                        version={this.state.timeVersion}
                        start={this.counter}
                        onFinish={this.handleTimeFinish}/>
                    {this.newGame ? null :
                        <Scoreboard score={this.state.score}/>}
                    <div
                        className={`btns ${this.state.gameState === GAME_STATE.START ? "hidden" : ""} ${this.newGame ? "" : "replay"}`}>
                        <Button
                            onClick={this.readyGame}
                            text={`${this.newGame ? "" : "re"}start`}
                        >
                            {this.newGame ? "play_arrow" : "refresh"}
                        </Button>
                    </div>
                </header>
                <div className="game-area">
                    <div
                        className="flex-inner-extend flex-center game-area-inner">
                        <div
                            className="letter-selected flex-center">{this.state.word}</div>
                        <Grid onWordChange={this.handleNewWord}
                              onScoreChange={this.handleNewScore}
                              onWordValidChange={
                                  v => this.setState({isSelectedWordValid: v})}
                              active={this.state.gameState === GAME_STATE.START}
                              mini={this.state.mini}
                        />
                    </div>
                </div>
            </div>
        );
    }
}