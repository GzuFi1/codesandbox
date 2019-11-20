import React, { Component } from "react";
import "../styles/box.css";

class Champion extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      link: "",
      name: "",
      picture: "",
      skills: [],
      rarity: "",
      cost: 0,
      stats: [],
      races: [],
      classes: [],
      synergies: []
    };
    this.state = this.initialState;
  }

  render() {
    const { index } = this.props;
    const {
      link,
      name,
      picture,
      skill,
      rarity,
      cost,
      stats,
      races,
      classes,
      synergies
    } = this.props.champion;
    console.log(link);
    return <div className="box">{name}</div>;
  }
}

export default Champion;
