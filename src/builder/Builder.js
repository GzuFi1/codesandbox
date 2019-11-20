import React, { Component } from "react";
import SplitPane from "react-split-pane";
import loadObjects from "./ObjectsLoader";
import "../styles/styles.css";
import Champions from "./Champions";

class App extends Component {
  state = {
    objects: loadObjects()
  };

  removeCharacter = index => {
    const { characters } = this.state;

    this.setState({
      characters: characters.filter((character, i) => {
        return i !== index;
      })
    });
  };

  handleSubmit = character => {
    this.setState({ characters: [...this.state.characters, character] });
  };

  render() {
    return (
      <div className="container">
        <SplitPane step="0" defaultSize="30%">
          <div>
            <Champions />
          </div>
          <div>
            <SplitPane split="horizontal" step="0" defaultSize="40%">
              <div>Team</div>
              <div>
                <SplitPane step="0" defaultSize="50%">
                  <div>Originin</div>
                  <div>Classes</div>
                </SplitPane>
              </div>
            </SplitPane>
          </div>
        </SplitPane>
      </div>
    );
  }
}

export default App;
