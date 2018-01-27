/**
 * Created by Anoxic on 6/28/2017.
 */

import React, {Component} from "react";
import Ink from "react-ink";

import Button from "./lib/Button";
import Wordlink from "./Wordlink";
import LetterPrompt from "./LetterPrompt";
import ScrabbleMarathon from "./ScrabbleMarathon";

const GAME_LIST = [
  {
    name: "Word Link",
    game: <Wordlink/>,
  },
  {
    name: "Letter Prompt",
    game: <LetterPrompt/>,
  },
  {
    name: "Scrabble Marathon",
    game: <ScrabbleMarathon/>,
  }
  // {
  //   name: "Word Train",
  //   game: <WordTrain/>,
  // }
];

export default class GameSelect extends Component {

  state = {
    currentGameIndex: -1,
  };

  constructor(props) {
    super(props);

    this.handleBack = this.handleBack.bind(this);
  }

  handleBack() {
    this.setState({
      currentGameIndex: -1,
    });
  }

  render() {
    return (
      <div
        className={`game-select ${this.state.currentGameIndex === -1 ? "" : "in-game"}`}>
        <Button
          className="back"
          onClick={this.handleBack}
        >arrow_back</Button>
        <div className="game-list flex-center">
          <div className="title">Gamelets!</div>
          {GAME_LIST.map((game, i) =>
            <div className="game"
                 key={game.name}
                 onClick={() => this.setState({currentGameIndex: i})}
            >
              <div className="flex-inner-extend flex-center">
                <Ink/>
                <span>{game.name}</span>
              </div>
            </div>
          )}
        </div>
        <div className="game-real">
          {this.state.currentGameIndex === -1 ? null : GAME_LIST[this.state.currentGameIndex].game}
        </div>
      </div>
    )
  }
}