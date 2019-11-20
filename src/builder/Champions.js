import React, { Component } from "react";

class Champions extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      champions: require("../jsons/Heroes.json")
    };
    console.log(this.initialState);
    this.state = this.initialState;
  }

  render() {
    const { champions } = this.state;
    let rows = champions.map((row, index) => {
      return (
        <tr key={index}>
          <td>{row.link}</td>
        </tr>
      );
    });
    return (
      <table>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default Champions;
