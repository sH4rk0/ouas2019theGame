import * as firebase from "firebase";

export default class Leaderboard {
  private firebaseConfig = {
    apiKey: "AIzaSyBigqZoMti0BKt-_JoNNWHnNIXmlSIrI-c",
    authDomain: "ouas2019.firebaseapp.com",
    databaseURL: "https://ouas2019.firebaseio.com",
    projectId: "ouas2019",
    storageBucket: "ouas2019.appspot.com",
    messagingSenderId: "449930501997",
    appId: "1:449930501997:web:e2e2e8acfc4de46c"
  };
  private fireBaseApp: firebase.app.App;
  private fireBaseDb: firebase.database.Database;
  private scores: firebase.database.Reference;

  constructor() {
    this.fireBaseApp = firebase.initializeApp(this.firebaseConfig);
    this.fireBaseDb = this.fireBaseApp.database();
    this.scores = this.fireBaseDb.ref("scores");
  }

  insertScore(score: ScoreConfig) {
    //console.log(score);
    this.scores.push(score);
  }
}
