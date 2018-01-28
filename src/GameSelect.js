/**
 * Created by Anoxic on 6/28/2017.
 */

import React, {Component} from "react";
import Ink from "react-ink";
import screenfull from "screenfull";

import Button from "./lib/Button";
import Wordlink from "./Wordlink";
import LetterPrompt from "./LetterPrompt";
import ScrabbleMarathon from "./ScrabbleMarathon";
import WordChain from "./WordChain";
import ScreenSizeWarning from "./components/ScreenSizeWarning";

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
  },
  {
    name: "Word Chain",
    game: <WordChain/>,
  }
];

const MIN_WIDTH = 350;
const MIN_HEIGHT = 650;

export default class GameSelect extends Component {

  state = {
    currentGameIndex      : -1,
    isShowingScreenWarning: false,
  };

  constructor(props) {
    super(props);

    this.handleBack = this.handleBack.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentWillMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentDidMount() {
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize() {
    let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    let height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    let isShowingScreenWarning = width < MIN_WIDTH || height < MIN_HEIGHT;
    this.setState({
      isShowingScreenWarning,
    });
  }

  handleBack() {
    this.setState({
      currentGameIndex: -1,
    });
  }

  handleFullScreen() {
    if (screenfull.enabled) {
      screenfull.request();
    }
  }

  render() {
    return (
      <div
        className={`game-select ${this.state.currentGameIndex === -1 ? "" : "in-game"}`}>
        <Button
          className="back top-left top"
          onClick={this.handleBack}
        >arrow_back</Button>
        <Button
          className="full-screen top-right top"
          onClick={this.handleFullScreen}
        >zoom_out_map</Button>
        {this.state.isShowingScreenWarning ?
          <ScreenSizeWarning
            width={window.innerWidth}
            minWidth={MIN_WIDTH}
            height={window.innerHeight}
            minHeight={MIN_HEIGHT}
            handleDismiss={() => this.setState({isShowingScreenWarning: false})}
          /> : null}
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