import React, {Component} from 'react';

import './App.css';
import GameSelect from "./GameSelect";

// import LetterpadGenerator from "./Letterpad/LetterpadGenerator"

class App extends Component {
  render() {
    return (
        <div className="App">
          <GameSelect/>
          {/*<LetterpadGenerator/>*/}
        </div>
    );
  }
}

export default App;
