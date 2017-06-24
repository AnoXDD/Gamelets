/**
 * Created by Anoxic on 6/24/2017.
 */

const KEYS = [
  {
    prompt : "red",
    letters: "flagdyebo",
    words  : ["flag", "dye", "blood", "eye", "leaf"]
  },
  {
    prompt : "apple",
    letters: "fruitecdo",
    words  : ["fruit", "tree", "cider", "food", "red", "doctor", "feed"]
  },
  {
    prompt : "egg",
    letters: "birdyolkf",
    words  : ["bird", "yolk", "food", "brood", "roll", "fry", "oil", "blood", "york"]
  },
  {
    prompt : "bee",
    letters: "honeyisct",
    words  : ["honey", "insect", "nest", "host"]
  },
  {
    prompt : "foot",
    letters: "musclegho",
    words  : ["muscle", "leg", "heel", "shoe"]
  },
  {
    prompt : "hand",
    letters: "fingerbop",
    words  : ["finger", "bone", "ring", "grip", "green", "forefinger"]
  },
  {
    prompt : "door",
    letters: "hingeopsw",
    words  : ["hinge", "open", "swing", "spin"]
  },
  {
    prompt : "cat",
    letters: "domesticp",
    words  : ["domestic", "species", "pet", "mice", "tom"]
  },
  {
    prompt : "fish",
    letters: "watersymg",
    words  : ["water", "system", "egg", "sea"]
  },
  {
    prompt : "water",
    letters: "icelqudfo",
    words  : ["ice", "liquid", "life", "cloud", "fluid", "flood", "cold"]
  },
  {
    prompt : "sport",
    letters: "gamefotbl",
    words  : ["game", "football", "team", "goal", "ball"]
  },
  {
    prompt : "window",
    letters: "framepnou",
    words  : ["frame", "pane", "roof", "open", "room"]
  },
  {
    prompt : "computer",
    letters: "progamey",
    words  : ["program", "memory", "ram", "rom", "programmer", "error", "game"]
  },
  {
    prompt : "sun",
    letters: "solarethn",
    words  : ["solar", "earth", "star", "nasa", "heat", "stellar", "hot"]
  },
  {
    prompt : "moon",
    letters: "lunareths",
    words  : ["lunar", "earth", "nasa", "sun", "nature", "star"]
  },
  {
    prompt : "black",
    letters: "lightnksy",
    words  : ["light", "ink", "list", "sky", "night"]
  },
  {
    prompt : "pencil",
    letters: "graphites",
    words  : ["graphite", "eraser", "paper", "art", "sharp"]
  },
  {
    prompt : "music",
    letters: "soundtyle",
    words  : ["sound", "style", "notes", "tone", "solo", "tune", "lesson"]
  },
  {
    prompt : "mobile_phone",
    letters: "networkxi",
    words  : ["network", "text", "internet", "tower"]
  },
  {
    prompt : "party",
    letters: "evntdirf",
    words  : ["event", "dinner", "friend", "eve", "invite"]
  },
  {
    prompt : "face",
    letters: "emotinsl",
    words  : ["emotion", "smile", "nose", "sense", "smell"]
  },
  {
    prompt : "map",
    letters: "scaleftur",
    words  : ["scale", "features", "surface", "east", "atlas", "sea"]
  },
  {
    prompt : "winter",
    letters: "snowcldie",
    words  : ["snow", "cold", "ice", "wind", "low", "cool", "die"]
  },
  {
    prompt : "shoe",
    letters: "botfhelg",
    words  : ["boot", "foot", "heel", "toe", "feet", "leg"]
  },
  {
    prompt : "team",
    letters: "groupmebl",
    words  : ["group", "member", "people", "peer"]
  },
  {
    prompt : "key_(lock)",
    letters: "carpinset",
    words  : ["car", "pin", "set", "access", "pattern"]
  },
];

import React, {Component} from "react";
import Ink from "react-ink";

import Button from "./Button";

const LETTER_OUTER_SIZE = 100;

export default class LetterPrompt extends Component {

  remainingLetters = {a: 1, b: 3, c: 5, d: 3, e: 2, f: 3, g: 2, i: 1};

  constructor(props) {
    super(props);

    this.state = {

      word   : "",
      letters: "abcdefgi".split(""),

      isSelectedWordValid: "",
    };

    this.generateLetterStyle = this.generateLetterStyle.bind(this);
    this.shuffleLetters = this.shuffleLetters.bind(this);

    this.handleLetterClick = this.handleLetterClick.bind(this);
    this.handleSendShuffle = this.handleSendShuffle.bind(this);
    this.handleBackspace = this.handleBackspace.bind(this);
  }

  generateLetterStyle(i) {
    if (this.state.letters.length !== 9 && i >= 4) {
      ++i;
    }

    return {
      top : LETTER_OUTER_SIZE * Math.floor(i / 3),
      left: LETTER_OUTER_SIZE * (i % 3),
    };
  }

  shuffleLetters() {
    let letters = this.state.letters;

    for (let i = 0; i < letters.length; ++i) {
      let shuffleTarget = Math.floor(Math.random() * letters.length);
      // Swap it
      let tmp = letters[i];
      letters[i] = letters[shuffleTarget];
      letters[shuffleTarget] = tmp;
    }

    this.setState({
      letters: letters,
    });
  }

  handleLetterClick(letter) {
    if (this.remainingLetters[letter]) {
      --this.remainingLetters[letter];

      this.setState({
        word: this.state.word + letter,
      });
    }
  }

  handleSendShuffle() {
    if (this.state.word.length) {
      // Send
    } else {
      // Shuffle
      this.shuffleLetters();
    }
  }

  handleBackspace() {
    let lastLetter = this.state.word[this.state.word.length - 1];
    ++this.remainingLetters[lastLetter];

    this.setState({
      word: this.state.word.slice(0, -1),
    });
  }

  render() {
    return (
        <div className="letter-prompt game">
          <div className="game-area">
            <div
                className="flex-inner-extend flex-center game-area-inner">
              <div className="letter-selected flex-center">
                {this.state.word}
              </div>
              <div
                  className={`grid flex-center ${this.state.isSelectedWordValid}`}>
                <div className="grid-wrapper">
                  {this.state.letters.map((letter, i) =>
                      <div
                          key={letter}
                          className={`letter-grid letter-${this.remainingLetters[letter]}`}
                          style={this.generateLetterStyle(i)}
                      >
                        <div
                            data-tag={letter}
                            onClick={() => this.handleLetterClick(letter)}
                            className="letter-inner flex-center">
                          <Ink/>
                          <span>{letter}</span>
                        </div>
                      </div>
                  )}
                </div>
              </div>
              <div className="btns">
                <Button
                    onClick={this.handleSendShuffle}
                    text={this.state.word.length ? "submit" : "shuffle"}>
                  {this.state.word.length ? "send" : "shuffle"}
                </Button>
                <Button
                    onClick={this.handleBackspace}
                    className={this.state.word.length ? "" : "hidden"}>
                  backspace
                </Button>
              </div>
            </div>
          </div>
        </div>
    );
  }
}