import React, {Component} from "react";
import Ink from "react-ink";

import Button from "./Button";

/**
 * Created by Anoxic on 6/24/2017.
 */

const HIDDEN_CHAR = "·";

const KEYS = [
    {
        prompt : "red",
        letters: "flagdyebo",
        words  : ["flag", "dye", "blood", "eye", "leaf"],
    },
    {
        prompt : "apple",
        letters: "fruitecdo",
        words  : ["fruit", "tree", "cider", "food", "red", "doctor", "feed"],
    },
    {
        prompt : "egg",
        letters: "birdyolkf",
        words  : ["bird", "yolk", "food", "brood", "roll", "fry", "oil", "blood", "york"],
    },
    {
        prompt : "bee",
        letters: "honeyisct",
        words  : ["honey", "insect", "nest", "host"],
    },
    {
        prompt : "foot",
        letters: "musclegho",
        words  : ["muscle", "leg", "heel", "shoe"],
    },
    {
        prompt : "hand",
        letters: "fingerbop",
        words  : ["finger", "bone", "ring", "grip", "green", "forefinger"],
    },
    {
        prompt : "door",
        letters: "hingeopsw",
        words  : ["hinge", "open", "swing", "spin"],
    },
    {
        prompt : "cat",
        letters: "domesticp",
        words  : ["domestic", "species", "pet", "mice", "tom"],
    },
    {
        prompt : "fish",
        letters: "watersymg",
        words  : ["water", "system", "egg", "sea"],
    },
    {
        prompt : "water",
        letters: "icelqudfo",
        words  : ["ice", "liquid", "life", "cloud", "fluid", "flood", "cold"],
    },
    {
        prompt : "sport",
        letters: "gamefotbl",
        words  : ["game", "football", "team", "goal", "ball"],
    },
    {
        prompt : "window",
        letters: "framepnou",
        words  : ["frame", "pane", "roof", "open", "room"],
    },
    {
        prompt : "computer",
        letters: "progamey",
        words  : ["program", "memory", "ram", "rom", "programmer", "error", "game"],
    },
    {
        prompt : "sun",
        letters: "solarethn",
        words  : ["solar", "earth", "star", "nasa", "heat", "stellar", "hot"],
    },
    {
        prompt : "moon",
        letters: "lunareths",
        words  : ["lunar", "earth", "nasa", "sun", "nature", "star"],
    },
    {
        prompt : "black",
        letters: "lightnksy",
        words  : ["light", "ink", "list", "sky", "night"],
    },
    {
        prompt : "pencil",
        letters: "graphites",
        words  : ["graphite", "eraser", "paper", "art", "sharp"],
    },
    {
        prompt : "music",
        letters: "soundtyle",
        words  : ["sound", "style", "notes", "tone", "solo", "tune", "lesson"],
    },
    {
        prompt : "mobile_phone",
        letters: "networkxi",
        words  : ["network", "text", "internet", "tower"],
    },
    {
        prompt : "party",
        letters: "evntdirf",
        words  : ["event", "dinner", "friend", "eve", "invite"],
    },
    {
        prompt : "face",
        letters: "emotinsl",
        words  : ["emotion", "smile", "nose", "sense", "smell"],
    },
    {
        prompt : "map",
        letters: "scaleftur",
        words  : ["scale", "features", "surface", "east", "atlas", "sea"],
    },
    {
        prompt : "winter",
        letters: "snowcldie",
        words  : ["snow", "cold", "ice", "wind", "low", "cool", "die"],
    },
    {
        prompt : "shoe",
        letters: "botfhelg",
        words  : ["boot", "foot", "heel", "toe", "feet", "leg"],
    },
    {
        prompt : "team",
        letters: "groupmebl",
        words  : ["group", "member", "people", "peer"],
    },
    {
        prompt : "key_(lock)",
        letters: "carpinset",
        words  : ["car", "pin", "set", "access", "pattern"],
    },
];

export default class LetterPrompt extends Component {

    wordList = [];
    solvedIndex = [];

    constructor(props) {
        super(props);

        this.state = {

            prompt          : "",
            correctWordIndex: [],
            word            : "",
            letters         : {},

            classClassName: "",
        };

        this.findUnresolvedProblem = this.findUnresolvedProblem.bind(this);
        this.generateNewProblem = this.generateNewProblem.bind(this);

        this.generateLetterClassName = this.generateLetterClassName.bind(this);
        this.shuffleLetters = this.shuffleLetters.bind(this);

        this.handleLetterClick = this.handleLetterClick.bind(this);
        this.handleSendShuffle = this.handleSendShuffle.bind(this);
        this.handleBackspace = this.handleBackspace.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }

    componentDidMount() {
        this.generateNewProblem();
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.classClassName === "wrong") {
            nextState.classClassName = "";
        }
    }

    findUnresolvedProblem() {
        while (this.solvedIndex.length !== KEYS.length) {
            let index = Math.floor(Math.random() * KEYS.length);

            if (this.solvedIndex.indexOf(index) === -1) {
                // This is not solved yet
                return JSON.parse(JSON.stringify(KEYS[index]));
            }
        }

        return null;
    }

    /**
     * Generate the object that this.state.letters needs
     * @param words
     */
    generateLetterState(words) {
        let state = {},
            currentIndex = 0;

        for (let word of words) {
            for (let letter of word) {
                if (!state[letter]) {
                    state[letter] = {count: 0, index: currentIndex++};
                }

                ++state[letter].count;
            }
        }

        this.shuffleLetters(state);

        return state;
    }

    generateNewProblem() {
        let problem = this.findUnresolvedProblem();

        this.wordList = problem.words;
        this.setState({
            prompt          : problem.prompt,
            correctWordIndex: [],
            word            : "",
            letters         : this.generateLetterState(problem.words),
        });
    }

    generateLetterClassName(i) {
        if (Object.keys(this.state.letters).length !== 9 && i >= 4) {
            ++i;
        }

        return "letter-position-3-3-" + i;
    }

    shuffleLetters(letterObjects) {
        letterObjects = letterObjects || this.state.letters;
        let letters = Object.keys(letterObjects);

        for (let i = 0; i < letters.length; ++i) {
            let shuffleTarget = Math.floor(Math.random() * letters.length);
            // Swap it
            let src = letters[i],
                dest = letters[shuffleTarget];

            let tmp = letterObjects[src].index;
            // eslint-disable-next-line
            letterObjects[src].index = letterObjects[dest].index;
            // eslint-disable-next-line
            letterObjects[dest].index = tmp;
        }

        this.forceUpdate();
    }

    handleLetterClick(letter) {
        if (this.state.letters[letter].count) {
            --this.state.letters[letter].count;

            this.setState({
                word: this.state.word + letter,
            });
        }
    }

    handleSend() {
        let index = this.wordList.indexOf(this.state.word);

        if (index !== -1 && this.state.correctWordIndex.indexOf(index) === -1) {
            // This word is correct and not being added to the list
            this.setState({
                word            : "",
                correctWordIndex: [...this.state.correctWordIndex, index],
            });
        } else {
            // Not a match
            // Return all the letters
            for (let letter of this.state.word) {
                ++this.state.letters[letter].count;
            }

            this.setState({
                word          : "",
                classClassName: "wrong",
            });
        }
    }

    handleSendShuffle() {
        if (this.state.word.length) {
            // Send
            this.handleSend();
        } else {
            // Shuffle
            this.shuffleLetters();
        }
    }

    handleBackspace() {
        let lastLetter = this.state.word[this.state.word.length - 1];
        ++this.state.letters[lastLetter].count;

        this.setState({
            word: this.state.word.slice(0, -1),
        });
    }

    render() {
        return (
            <div className={`letter-prompt game ${this.state.classClassName}`}>
                <div className="game-area">
                    <header className="flex-center">
                        <div className="prompt">{this.state.prompt}</div>
                    </header>
                    <div
                        className="flex-inner-extend flex-center game-area-inner">
                        <div className="word-list">
                            {this.wordList.map((word, i) =>
                                <span key={word}
                                      className={`word ${this.state.correctWordIndex.indexOf(
                                          i) === -1 ? "empty" : ""}`}>
                                    {
                                        this.state.correctWordIndex.indexOf(i) === -1 ?
                                            word.replace(/./g, HIDDEN_CHAR) :
                                            word
                                    }
                                </span>,
                            )}
                        </div>
                        <div className="letter-selected flex-center">
                            {this.state.word}
                        </div>
                        <div
                            className="grid flex-center">
                            <div className="grid-wrapper">
                                {Object.keys(this.state.letters).map(letter =>
                                    <div
                                        key={letter}
                                        className={`letter-grid letter-${this.state.letters[letter].count}
                                    ${this.generateLetterClassName(this.state.letters[letter].index)}`}
                                    >
                                        <div
                                            onClick={() => this.handleLetterClick(
                                                letter)}
                                            className="letter-inner flex-center">
                                            <Ink/>
                                            <span>{letter}</span>
                                        </div>
                                    </div>,
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