/**
 * Created by Anoxic on 6/28/2017.
 */

import React, {Component} from "react";
import Ink from "react-ink";
import screenfull from "screenfull";
import {Scrollbars} from "react-custom-scrollbars";

import Button from "./lib/Button";
import Wordlink from "./games/Wordlink";
import LetterPrompt from "./games/LetterPrompt";
import ScrabbleMarathon from "./games/ScrabbleMarathon";
import WordChain from "./games/WordChain";
import ScreenSizeWarning from "./components/ScreenSizeWarning";
import SokobanInfinite from "./games/SokobanInfinite";
import BubbleBurst from "./games/BubbleBurst";

const GAME_LIST = [
  {
    category: "language",
    icon    : "translate",
  },
  {
    id  : "word-link",
    name: "Word Link",
    game: <Wordlink/>,
  },
  {
    id  : "letter-prompt",
    name: "Letter Prompt",
    game: <LetterPrompt/>,
  },
  {
    id  : "scrabble-marathon",
    name: "Scrabble Marathon",
    game: <ScrabbleMarathon/>,
  },
  {
    id  : "word-chain",
    name: "Word Chain",
    game: <WordChain/>,
  },
  {
    category: "puzzle",
    icon    : "extension",
  },
  {
    id  : "sokoban-infinite",
    name: "Sokoban Infinite",
    game: <SokobanInfinite/>,
  },
  {
    category: "strategy",
    icon    : "map",
  },
  {
    id  : "bubble-burst",
    name: "Bubble Burst",
    game: <BubbleBurst/>,
  }
];

const MIN_WIDTH = 350;
const MIN_HEIGHT = 600;


export default class GameSelect extends Component {

  state = {
    currentGameIndex      : -1,
    isShowingScreenWarning: false,
  };

  constructor(props) {
    super(props);

    this.handleBack = this.handleBack.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.goToGameFromUrl = this.goToGameFromUrl.bind(this);
    this.setGameIdInUrl = this.setGameIdInUrl.bind(this);
  }

  componentWillMount() {
    window.addEventListener("resize", this.handleResize);
    document.addEventListener("backbutton", this.handleBackButton);
  }

  componentDidMount() {
    this.handleResize();
    this.goToGameFromUrl();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("backbutton", this.handleBackButton);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentGameIndex !== this.state.currentGameIndex) {
      this.setGameIdInUrl();
    }
  }

  /**
   * From the hash in the url, go to a certain game
   */
  goToGameFromUrl() {
    let id = window.location.hash.substr(1);

    let i = GAME_LIST.findIndex(g => g.id === id);

    if (i !== -1) {
      this.setState({
        currentGameIndex: i,
      });
    }
  }

  /**
   * Set the name in hash
   */
  setGameIdInUrl() {
    let game = GAME_LIST[this.state.currentGameIndex];

    window.location.hash = game ? game.id : "";
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

  handleBackButton() {
    this.handleBack();
    return false;
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
          <div className="title app-title">Gamelets!</div>
          <div className="games-wrapper">
            <div className="flex-inner-extend">
              <Scrollbars
                className="games"
                ref="scrollbars"
              >
                {GAME_LIST.map((game, i) =>
                  game.category ?
                    <div className="category"
                         key={game.category}
                    >
                    <span className="icon-wrapper">
                      <i className="material-icons">{game.icon}</i>
                    </span>
                      <span className="category-inner">{game.category}</span>
                    </div> :
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
              </Scrollbars>
            </div>
          </div>
          <div className="author-wrapper">
            <a className="author" href="https://anoxic.me">by Anoxic</a>
          </div>
        </div>
        <div className="game-real">
          {this.state.currentGameIndex === -1 ? null : GAME_LIST[this.state.currentGameIndex].game}
        </div>
      </div>
    )
  }
}