/**
 * Created by Anoxic on 6/28/2017.
 */

import React, {Component} from "react";
import Ink from "react-ink";

import Wordlink from "./Wordlink";
import LetterPrompt from "./LetterPrompt";

const GAME_LIST = [
  {
    name: "Word Link",
    game: <Wordlink/>,
  },
  {
    name: "Letter Prompt",
    game: <LetterPrompt/>,
  }
]

export default class GameSelect extends Component {

  state = {
    currentGameIndex: -1,
  };

  render() {
    return (
        <div className="game-select">
          { this.state.currentGameIndex === -1 ?
              <div className="game-list flex-center">
                <div className="title">Gamelets!</div>
                {GAME_LIST.map((game, i) =>
                    <div className="game"
                         onClick={() => this.setState({currentGameIndex: i})}
                    >
                      <div className="flex-inner-extend flex-center">
                        <Ink/>
                        <span>{game.name}</span>
                      </div>
                    </div>
                )}
              </div>
              : GAME_LIST[this.state.currentGameIndex].game
          }
        </div>
    )
  }
}