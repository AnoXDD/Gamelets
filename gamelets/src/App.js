import React, {Component} from 'react';

import './App.css';

import Wordlink from "./Wordlink";
// import LetterpadGenerator from "./Letterpad/LetterpadGenerator"
import LetterPrompt from "./LetterPrompt";

class App extends Component {
  render() {
    return (
        <div className="App">
          {/*<LetterPrompt/>*/}
          <Wordlink/>
          {/*<LetterpadGenerator/>*/}
        </div>
    );
  }
}

export default App;
