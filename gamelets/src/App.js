import React, {Component} from 'react';

import './App.css';

// import Wordlink from "./Wordlink";
import TouchPad from "./TouchPad";

class App extends Component {
    render() {
        return (
            <div className="App">
                <TouchPad/>
            </div>
        );
    }
}

export default App;
