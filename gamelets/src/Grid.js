/**
 * Created by Anoxic on 6/22/2017.
 */

import React, {Component} from "react";

const ROW = 5, COLUMN = 5;

const LETTER_FREQUENCY = [0.08167, 0.09659, 0.12441, 0.16694, 0.29396, 0.31624, 0.33639, .39733, 0.46699, 0.46852, 0.47624, 0.51649, 0.54055, 0.60804, 0.68311, 0.7024, 0.70335, 0.76322, 0.82649, 0.91705, 0.94463, 0.95441, 0.97801, 0.97951, 0.99925, 1],
    CHARCODE_A = 97;

const LETTER_OUTER_SIZE = 100;

export default class Grid extends Component {

    style = {};

    state = {
        // The elements are from bottom to top, left to right
        letters: [],
        selectedLetters: [],
    };

    idVersion = 0;

    isMouseDown = false;

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

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleNewSelectedLetters = this.handleNewSelectedLetters.bind(this);
    }

    componentDidMount() {
        this.fillLetters();
    }

    generateLetterStyle(col, row) {
        return {
            bottom: row * LETTER_OUTER_SIZE,
            left: col * LETTER_OUTER_SIZE,
        };
    }

    generateRandomLetterBlock() {
        let random = Math.random(),
            letter = String.fromCharCode(CHARCODE_A +
                LETTER_FREQUENCY.findIndex(i => i > random));

        return {
            id: '' + this.idVersion++,
            letter: letter,
        };
    }

    findLetterById(id) {
        let pos = this.findPositionById(id);

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

    isSelectedWordValid() {
        return true;
    }

    removeSelectedWord() {
        for (let id of this.state.selectedLetters) {
            let pos = this.findPositionById(id);
            this.state.letters[pos.col].splice(pos.row, 1);
        }

        this.forceUpdate();
    }

    handleMouseDown(e) {
        if (e.target.dataset.tag) {
            this.isMouseDown = true;
            this.handleMouseOver(e);
        }
    }

    handleMouseUp() {
        this.isMouseDown = false;

        if (this.isSelectedWordValid()) {
            this.removeSelectedWord();
            this.fillLetters();
        }

        this.relativePositions = {};
        this.handleNewSelectedLetters([]);
    }

    handleMouseOver(e) {
        if (this.isMouseDown) {
            let id = e.target.dataset.tag;

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

    handleNewSelectedLetters(letters) {
        this.setState({
            selectedLetters: letters,
        });

        if (this.props.onWordChange) {
            this.props.onWordChange(letters.map(id => this.findLetterById(id))
                .join(""));
        }
    }

    render() {
        return (
            <div className="grid flex-center">
                <div className="grid-wrapper"
                     onMouseDown={this.handleMouseDown}
                     onMouseUp={this.handleMouseUp}
                >
                    {this.state.letters.map((letters, col) =>
                        letters.map((letter, row) =>
                            <div
                                key={letter.id}
                                className={`letter-grid letter-${letter.letter} ${this.state.selectedLetters.indexOf(
                                    letter.id) === -1 ? "" : "selected"}`}
                                style={this.generateLetterStyle(col, row)}
                            >
                                <span
                                    className={`arrow ${this.relativePositions[letter.id] || ""}`}/>
                                <div
                                    onMouseOver={this.handleMouseOver}
                                    data-tag={letter.id}
                                    className="letter-inner flex-center">
                                    <span>{letter.letter}</span></div>
                            </div>
                        )
                    )}
                </div>
            </div>
        )
    }
}