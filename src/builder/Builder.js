import React, { Component } from "react";
import SplitPane from "react-split-pane";
import "../styles.css";

class App extends Component {
  state = {
    characters: []
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
          <div>Champions</div>
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
