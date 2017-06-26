/**
 * Created by Anoxic on 6/22/2017.
 */

import React, {Component} from "react";
import TouchPad from "../TouchPad";

const WORD = require("../Word.json");

const ROW = 5, COLUMN = 5;

const LETTER_FREQUENCY = [0.08167, 0.09659, 0.12441, 0.16694, 0.29396, 0.31624, 0.33639, .39733, 0.46699, 0.46852, 0.47624, 0.51649, 0.54055, 0.60804, 0.68311, 0.7024, 0.70335, 0.76322, 0.82649, 0.91705, 0.94463, 0.95441, 0.97801, 0.97951, 0.99925, 1],
    CHARCODE_A = 97;

const LETTER_OUTER_SIZE = 100,
    LETTER_OUTER_SIZE_MINI = 60;

const LETTER_SCORE = {
  a: 1,
  b: 4,
  c: 4,
  d: 3,
  e: 1,
  f: 5,
  g: 3,
  h: 5,
  i: 1,
  j: 8,
  k: 6,
  l: 2,
  m: 4,
  n: 2,
  o: 1,
  p: 4,
  q: 10,
  r: 2,
  s: 1,
  t: 2,
  u: 2,
  v: 5,
  w: 6,
  x: 8,
  y: 6,
  z: 10,
};

const SELECT_WORD_COOLDOWN = 500;

const GRID_SIZE = 80,
    MARGIN_SIZE = 10,
    GRID_SIZE_MINI = 50,
    MARGIN_SIZE_MINI = 5;

export default class Grid extends Component {

  style = {};

  state = {
    // The elements are from bottom to top, left to right
    letters        : [],
    selectedLetters: [],
    hoveredLetterId: -1,
  };

  idVersion = 0;

  isMouseDown = false;
  isCoolingDown = false;

  /**
   * A map to map from any id TO another id block
   * @type {{}}
   */
  relativePositions = {};

  constructor(props) {
    super(props);

    this.generateRandomLetterBlock = this.generateRandomLetterBlock.bind(
        this);
    this.fillLetters = this.fillLetters.bind(this);
    this.findLetterById = this.findLetterById.bind(this);
    this.findPositionById = this.findPositionById.bind(this);
    this.isAdjacent = this.isAdjacent.bind(this);
    this.isSelectedWordValid = this.isSelectedWordValid.bind(this);
    this.removeSelectedWord = this.removeSelectedWord.bind(this);
    this.getSelectedWord = this.getSelectedWord.bind(this);
    this.calculateSelectedWordScore = this.calculateSelectedWordScore.bind(
        this);
    this.restart = this.restart.bind(this);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleNewSelectedLetters = this.handleNewSelectedLetters.bind(this);
  }

  componentDidMount() {
    this.fillLetters();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.active;
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.active && this.props.active) {
      this.restart();
    }
  }

  generateLetterStyle(col, row) {
    return {
      bottom: row * (this.props.mini ? LETTER_OUTER_SIZE_MINI : LETTER_OUTER_SIZE),
      left  : col * (this.props.mini ? LETTER_OUTER_SIZE_MINI : LETTER_OUTER_SIZE),
    };
  }

  generateRandomLetterBlock() {
    let random = Math.random(),
        letter = String.fromCharCode(CHARCODE_A +
            LETTER_FREQUENCY.findIndex(i => i > random));

    return {
      id    : '' + this.idVersion++,
      letter: letter,
    };
  }

  findLetterById(id) {
    let pos = this.findPositionById(id);

    if (pos.col === -1 || pos.row === -1) {
      return null;
    }

    return this.state.letters[pos.col][pos.row].letter;
  }

  /**
   * Returns the position given an id
   * @param id
   * @returns {{col: number, row: number}}
   */
  findPositionById(id) {
    let col = -1, row = -1;

    col = this.state.letters.findIndex(
        letterCol => (row = letterCol.findIndex(
            letter => letter.id === id)) !== -1);

    return {
      col: col,
      row: row,
    };
  }

  isAdjacent(id1, id2) {
    let pos1 = this.findPositionById(id1),
        pos2 = this.findPositionById(id2);

    return Math.abs(pos1.col - pos2.col) <= 1 && Math.abs(pos1.row - pos2.row) <= 1;
  }

  /**
   * Finds the position of id2 relatively to id1 if they are adjacent,
   * otherwise returns an empty string
   * @param id1
   * @param id2
   */
  findRelativePositionOf(id1, id2) {
    let pos1 = this.findPositionById(id1),
        pos2 = this.findPositionById(id2);

    if (Math.abs(pos1.col - pos2.col) > 1 || Math.abs(pos1.row - pos2.row) > 1) {
      return "";
    }

    return `${pos1.col - pos2.col === 1 ? "l" : (pos1.col - pos2.col === -1 ? "r" : "")}${pos1.row - pos2.row === 1 ? "d" : (pos1.row - pos2.row === -1 ? "u" : "")}`;
  }

  // Fill this.state.letters
  fillLetters() {
    let letters = this.state.letters;

    for (let col = 0; col < COLUMN; ++col) {
      if (!letters[col]) {
        letters[col] = [];
      }

      while (letters[col].length < ROW) {
        letters[col].push(this.generateRandomLetterBlock());
      }
    }

    this.setState({
      letters: letters,
    });
  }

  getSelectedWord(letterIds) {
    return (letterIds || this.state.selectedLetters)
        .map(id => this.findLetterById(id))
        .join("");
  }

  calculateSelectedWordScore(word) {
    let score = 0;

    for (let i = 0; i < word.length; ++i) {
      let char = word[i];
      score += LETTER_SCORE[char];
    }

    return score * word.length * word.length;
  }

  isSelectedWordValid(word) {
    word = word.toLowerCase();

    // Do a binary search
    let l = 0, r = WORD.length;
    while (l < r) {
      let mid = parseInt((l + r) / 2, 10),
          midWord = WORD[mid];

      if (midWord === word) {
        return true;
      }

      if (word.localeCompare(midWord) < 0) {
        r = mid - 1;
      } else {
        l = mid + 1;
      }
    }

    return WORD[r] === word;
  }

  removeSelectedWord() {
    for (let id of this.state.selectedLetters) {
      let pos = this.findPositionById(id);
      this.state.letters[pos.col].splice(pos.row, 1);
    }

    this.forceUpdate();
  }

  restart() {
    this.setState({
      letters: [[]],
    });
    this.fillLetters();
  }

  handleMouseDown(pos) {
    if (this.props.active && pos && !this.isCoolingDown) {
      this.isMouseDown = true;
      this.handleMouseOver(pos);
    }
  }

  handleMouseUp(e) {
    let onFinish = () => {
      this.setState({
        hoveredLetterId: -1,
      });

      this.isCoolingDown = false;
      this.relativePositions = {};
      this.handleNewSelectedLetters([]);
      this.props.onWordValidChange("");
    };

    this.isMouseDown = false;
    this.isCoolingDown = true;

    let word = this.getSelectedWord();

    if (word.length <= 1) {
      onFinish();
      return;
    }

    if (this.isSelectedWordValid(word)) {
      this.props.onWordValidChange("valid");

      let score = this.calculateSelectedWordScore(word);
      this.props.onScoreChange(score);

      setTimeout(() => {
        this.removeSelectedWord();
        this.fillLetters();
        onFinish();
      }, SELECT_WORD_COOLDOWN);
    } else {
      this.props.onWordValidChange("not-valid");

      setTimeout(() => {
        onFinish();
      }, SELECT_WORD_COOLDOWN);
    }
  }

  handleMouseOver(pos) {
    if (pos && pos.x >= 0 && pos.x < COLUMN && pos.y >= 0 && pos.y < ROW) {
      let id = this.state.letters[pos.x][ROW - pos.y - 1].id;
      this.setState({
        hoveredLetterId: id,
      });

      if (this.isMouseDown) {
        // Removing
        let letters = this.state.selectedLetters,
            lastLetter = letters[letters.length - 1];

        if (letters[letters.length - 2] === id) {
          delete this.relativePositions[id];

          letters.pop();
          this.handleNewSelectedLetters(letters);
        } else if (letters.indexOf(id) === -1) {
          // Check if they are adjacent
          let position = lastLetter ? this.findRelativePositionOf(
              lastLetter, id) : lastLetter;
          if (!lastLetter || position) {
            this.relativePositions[lastLetter] = position;

            // Add this
            this.handleNewSelectedLetters([...letters, id]);
          }
        }
      }
    }
  }

  handleNewSelectedLetters(letterIds) {
    this.setState({
      selectedLetters: letterIds,
    });

    if (this.props.onWordChange) {
      this.props.onWordChange(this.getSelectedWord(letterIds));
    }
  }

  render() {
    return (
        <div
            className={`grid flex-center ${this.state.classClassName}`}>
          <div className="grid-wrapper">
            <TouchPad
                marginHeight={this.props.mini ? MARGIN_SIZE_MINI : MARGIN_SIZE}
                marginWidth={this.props.mini ? MARGIN_SIZE_MINI : MARGIN_SIZE}
                gridHeight={this.props.mini ? GRID_SIZE_MINI : GRID_SIZE}
                gridWidth={this.props.mini ? GRID_SIZE_MINI : GRID_SIZE}
                onStart={this.handleMouseDown}
                onMove={this.handleMouseOver}
                onEnd={this.handleMouseUp}
            >
              {this.state.letters.map((letters, col) =>
                  letters.map((letter, row) =>
                      <div
                          key={letter.id}
                          className={`letter-grid letter-${letter.letter} ${this.state.selectedLetters.indexOf(
                              letter.id) === -1 ? "" : "selected"} ${this.state.hoveredLetterId === letter.id ? "hover" : ""}`}
                          style={this.generateLetterStyle(col, row)}
                      >
                                <span
                                    className={`arrow ${this.relativePositions[letter.id] || ""}`}/>
                        <div
                            className="letter-inner flex-center">
                          <span>{letter.letter}</span></div>
                      </div>
                  )
              )}
            </TouchPad>
          </div>
        </div>
    )
  }
}