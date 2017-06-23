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

    constructor(props) {
        super(props);

        this.generateRandomLetterBlock = this.generateRandomLetterBlock.bind(
            this);
        this.fillLetters = this.fillLetters.bind(this);
        this.findPositionById = this.findPositionById.bind(this);
        this.isAdjacent = this.isAdjacent.bind(this);

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
    }

    componentDidMount() {
        this.fillLetters();
    }

    generateLetterStyle(row, col) {
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

    /**
     * Returns the position given an id
     * @param id
     * @returns {{col: number, row: number}}
     */
    findPositionById(id) {
        let col = -1, row = -1;

        col = this.state.letters.findIndex(
            letterRow => (row = letterRow.findIndex(
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

    // Fill this.state.letters
    fillLetters() {
        let letters = this.state.letters;

        for (let row = 0; row < ROW; ++row) {
            if (!letters[row]) {
                letters[row] = [];
            }

            while (letters[row].length < COLUMN) {
                letters[row].push(this.generateRandomLetterBlock());
            }
        }

        this.setState({
            letters: letters,
        });
    }

    handleMouseDown(e) {
        if (e.target.dataset.tag) {
            this.isMouseDown = true;
            this.handleMouseOver(e);
        }
    }

    handleMouseUp() {
        this.isMouseDown = false;

        this.setState({
            selectedLetters: [],
        });
    }

    handleMouseOver(e) {
        if (this.isMouseDown) {
            let id = e.target.dataset.tag;

            // Removing
            let letters = this.state.selectedLetters;
            if (letters[letters.length - 2] === id) {
                letters.pop();
                this.setState({
                    selectedLetters: letters,
                });
            } else if (letters.indexOf(id) === -1) {
                // Check if they are adjacent
                let lastLetter = letters[letters.length - 1];
                if (!lastLetter || this.isAdjacent(lastLetter, id)) {
                    // Add this
                    this.setState({
                        selectedLetters: [...letters, id],
                    });
                }
            }
        }
    }

    render() {
        return (
            <div className="grid flex-center">
                <div className="grid-wrapper"
                     onMouseDown={this.handleMouseDown}
                     onMouseUp={this.handleMouseUp}
                >
                    {this.state.letters.map((letters, row) =>
                        letters.map((letter, col) =>
                            <div
                                key={letter.id}
                                className={`letter-grid letter-${letter.letter} ${this.state.selectedLetters.indexOf(
                                    letter.id) === -1 ? "" : "selected" }`}
                                style={this.generateLetterStyle(row, col)}
                            >
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