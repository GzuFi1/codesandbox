import React, { Component } from "react";

class Champion extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      champions: require("../jsons/Heroes.json")
    };
    console.log(this.initialState);
    this.state = this.initialState;
  }

  render() {
    return <h1>hi</h1>;
  }
}

export default Champions;
