import React, {Component} from 'react';

import './App.css';

// import Wordlink from "./Wordlink";
import TouchPad from "./TouchPad";

class App extends Component {
    render() {
        return (
            <div className="App">
                <TouchPad gridWidth={30} gridHeight={30} marginWidth={10}
                          onStart={console.log}
                          onMove={console.log}
                          onEnd={console.log}
                          marginHeight={10}>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                    <div className="blk"></div>
                </TouchPad>
            </div>
        );
    }
}

export default App;
