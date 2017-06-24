import React, {Component} from 'react';

import './App.css';

import Wordlink from "./Wordlink";
// import LetterpadGenerator from "./Letterpad/LetterpadGenerator"

class App extends Component {
    render() {
        return (
            <div className="App">
                <Wordlink/>
                {/*<LetterpadGenerator/>*/}
            </div>
        );
    }
}

export default App;
