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
    };

    idVersion = 0;

    constructor(props) {
        super(props);

        this.generateRandomLetterBlock = this.generateRandomLetterBlock.bind(
            this);
        this.fillLetters = this.fillLetters.bind(this);
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

        console.log(random, letter);

        return {
            id: this.idVersion++,
            letter: letter,
        };
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

    render() {
        return (
            <div className="grid flex-center">
                <div className="grid-wrapper">
                    {this.state.letters.map((letters, row) =>
                        letters.map((letter, col) =>
                            <div
                                key={letter.id}
                                className={`letter-grid letter-${letter.letter}`}
                                style={this.generateLetterStyle(row, col)}
                            >
                                <div
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