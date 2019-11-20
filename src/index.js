import "./styles/styles.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./builder/Builder";

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

let active = false;
let searchMap = [];
let rarities;
let races;
let classes;
let heroes;

if (active) {
  rarities = loadRarity();
  races = loadByCategory("Races", populateEffect);
  classes = loadByCategory("Classes", populateEffect);
  heroes = loadByCategory("Heroes", populateHeroe);
  // let races = {};
  // let classes = {};
  // let heroes = {};
  for (let i = 0; i < races.length; i++) {
    searchMap.push(races[i]);
  }
  for (let i = 0; i < classes.length; i++) {
    searchMap.push(classes[i]);
  }
  for (let i = 0; i < heroes.length; i++) {
    searchMap.push(heroes[i]);
  }
  console.log(searchMap);
}

function populateRarity(rarity) {
  let innerHtml = getRequest(rarity.link);
  let explanation = innerHtml.getElementsByClassName(
    "mw-content-ltr mw-content-text"
  )[0].textContent;
  rarity.cost = explanation.substring(
    explanation.indexOf(" mana crystal.\n") - 1,
    explanation.indexOf(" mana crystal.\n")
  );
  return rarity;
}

function populateHeroe(heroe) {
  let innerHtml = getRequest(heroe.link);

  if (innerHtml === undefined) {
    return heroe;
  }

  let skillHtml = innerHtml.getElementsByClassName("WikiaArticle")[0];
  if (
    skillHtml.getElementsByTagName("p")[1].textContent.startsWith("Extension")
  ) {
    skillHtml = skillHtml.getElementsByTagName("p")[2];
  } else {
    skillHtml = skillHtml.getElementsByTagName("p")[1];
  }
  heroe.skill = {};
  let pictureLink = innerHtml
    .getElementsByClassName("WikiaArticle")[0]
    .getElementsByTagName("span")[0]
    .getElementsByTagName("img")[0];
  if (pictureLink !== undefined) {
    heroe.skill.pictureUrl = getPicutreLink(
      pictureLink.getAttribute("data-src")
    );
  }

  heroe.skill.name = skillHtml.getElementsByTagName("b")[0].textContent;
  heroe.skill.description = skillHtml.textContent.substring(
    skillHtml.textContent.indexOf("	>") + 3 + heroe.skill.name.length,
    skillHtml.textContent.length
  );
  heroe.rarity = innerHtml
    .getElementsByClassName("pi-data-value pi-font")[0]
    .getElementsByTagName("a")[0]
    .getAttribute("title");
  heroe.cost = rarities[heroe.rarity].cost;
  let heroeStatsHtmls = innerHtml
    .getElementsByClassName("pi-item pi-panel pi-border-color")[0]
    .getElementsByClassName("pi-section-contents")[0]
    .querySelectorAll(".pi-section-content");
  heroe.stats = [];
  for (let i = 0; i < heroeStatsHtmls.length; i++) {
    let stats = {};
    stats.level = parseInt(heroeStatsHtmls[i].getAttribute("data-ref"), 10) + 1;
    if (heroeStatsHtmls[i].getElementsByTagName("img")[0] !== undefined) {
      stats.pictureUrl = getPicutreLink(
        heroeStatsHtmls[i].getElementsByTagName("img")[0].getAttribute("srcset")
      );
    }
    let statsHtml = heroeStatsHtmls[i].getElementsByClassName(
      "pi-smart-data-value pi-data-value pi-font pi-item-spacing"
    );
    if (statsHtml.length >= 6) {
      stats.healthPoints = statsHtml[0].innerText;
      stats.attackDamage = statsHtml[1].innerText;
      stats.armorLevel = statsHtml[2].innerText;
      stats.attackSpeed = statsHtml[3].innerText;
      stats.magicResist = statsHtml[4].innerText;
      stats.attackRange = statsHtml[5].innerText;
      heroe.stats.push(stats);
    }
  }
  let races = [];
  let classes = [];
  let racesAndClassesHtmlsValue = innerHtml.getElementsByClassName(
    "image image-thumbnail link-internal"
  );
  let racesAndClassesHtmlsKey = innerHtml.getElementsByClassName(
    "pi-horizontal-group-item pi-data-label pi-secondary-font pi-border-color pi-item-spacing"
  );
  for (let i = 0; i < racesAndClassesHtmlsKey.length; i++) {
    if (racesAndClassesHtmlsKey[i].innerText === "Race") {
      races.push(racesAndClassesHtmlsValue[i].getAttribute("title"));
    } else if (racesAndClassesHtmlsKey[i].innerText === "Class") {
      classes.push(racesAndClassesHtmlsValue[i].getAttribute("title"));
    }
  }
  heroe.races = races;
  heroe.classes = classes;
  let synergies = innerHtml.getElementsByClassName(
    "pi-item pi-data pi-item-spacing pi-border-color"
  );
  let synergyRaces = {};
  let synergyClasses = {};
  //Caution STARTS FROM 1 !!!
  for (let i = 1; i < synergies.length; i++) {
    if (synergies[i].getAttribute("data-source").includes("race")) {
      let races = [];
      for (let j = 0; j < synergies[i].getElementsByTagName("li").length; j++) {
        races.push(synergies[i].getElementsByTagName("li")[j].innerText);
      }
      synergyRaces[synergies[i].getElementsByTagName("h3").innerText] = races;
    } else if (synergies[i].getAttribute("data-source").includes("class")) {
      let classes = [];
      for (let j = 0; j < synergies[i].getElementsByTagName("li").length; j++) {
        classes.push(synergies[i].getElementsByTagName("li")[j].innerText);
      }
      synergyClasses[
        synergies[i].getElementsByTagName("h3").innerText
      ] = classes;
    }
  }
  heroe.synergies = {};
  heroe.synergies.races = synergyRaces;
  heroe.synergies.classes = synergyClasses;

  return heroe;
}

function loadByCategory(category, additionBuilder) {
  let effects = [];

  let htmlEffects = getRequest(
    "https://chessrush.fandom.com/wiki/Category:" + category
  ).querySelectorAll(".category-page__member-left");
  console.log("Category: " + category);
  console.log("Size: " + htmlEffects.length);
  for (let i = 0; i < htmlEffects.length; i++) {
    let effect = {};

    let htmlEffect = htmlEffects[i].getElementsByTagName("a")[0];

    effect.link =
      "https://chessrush.fandom.com" + htmlEffect.getAttribute("href");
    effect.name = htmlEffect.getAttribute("title");
    effect.picture = getPicutreLink(
      htmlEffect.getElementsByTagName("img")[0].getAttribute("data-src")
    );
    effect = additionBuilder(effect);
    effects.push(effect);
  }
  return effects;
}

function loadRarity() {
  let rarities = {};

  let htmlRarities = getRequest(
    "https://chessrush.fandom.com/wiki/Category:Rarity"
  ).querySelectorAll("a[title][class=category-page__member-link]");
  for (let i = 0; i < htmlRarities.length; i++) {
    let rarity = {};

    rarity.name = htmlRarities[i].getAttribute("title");
    rarity.link =
      "https://chessrush.fandom.com" + htmlRarities[i].getAttribute("href");

    rarity = populateRarity(rarity);
    rarities[rarity.name] = rarity;
  }
  return rarities;
}

function getPicutreLink(fullLink) {
  return fullLink.substring(0, fullLink.indexOf("/revision"));
}

function populateEffect(effect) {
  let innerHtml = getRequest(effect.link)
    .getElementsByClassName("WikiaPageContentWrapper")[0]
    .getElementsByTagName("dl")[0];

  if (innerHtml === undefined) {
    return effect;
  }

  let raceEffects = [];
  let numbersRequests = innerHtml.querySelectorAll("dt");
  let effects = innerHtml.querySelectorAll("dd");

  for (let i = 0; i < numbersRequests.length; i++) {
    let raceEffect = {};
    raceEffect.numbersRequest = numbersRequests[i].innerText.substring(
      0,
      numbersRequests[i].innerText.indexOf(" ")
    );
    raceEffect.effectDescription = effects[i].innerText;
    raceEffects.push(raceEffect);
  }

  effect.raceEffects = raceEffects;

  return effect;
}

function getRequest(url) {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "https://api.codetabs.com/v1/proxy?quest=" + url, false);
  // xmlHttp.open("GET", "https://api.allorigins.win/raw?url=" + url, false);
  xmlHttp.send(null);
  let html = document.createElement("html");
  html.innerHTML = xmlHttp.responseText;
  return html;
}
