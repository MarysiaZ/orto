
// 🔧 STEP 1: Replace the following config with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCjiVFX0HHhSd0RC03LPfpZpUjGDsUBwzo",
  authDomain: "decoding-1bba4.firebaseapp.com",
  databaseURL: "https://decoding-1bba4-default-rtdb.firebaseio.com",
  projectId: "decoding-1bba4",
  storageBucket: "decoding-1bba4.appspot.com",
  messagingSenderId: "417887788383",
  appId: "1:417887788383:web:e99b2dd35976c102dfeaea",
  measurementId: "G-GYEVJR5WNH"
};

firebase.initializeApp(firebaseConfig);
firebase.auth().signInAnonymously().catch(function(error) {
  console.error("Firebase auth error:", error);
});

const db = firebase.database();

// ✅ Initialize jsPsych properly (for v7)
const jsPsych = initJsPsych({
  on_finish: function() {
    const data = jsPsych.data.get().json();
    const timestamp = new Date().toISOString();

    db.ref("experiments/" + timestamp).set({
      data: JSON.parse(data)
    }).then(() => {
      console.log("Data saved to Firebase.");
    }).catch((error) => {
      console.error("Firebase save error:", error);
    });
  }
});

// === Your jsPsych timeline and logic ===

Papa.parse("words_cleaned.csv", {
  download: true,
  header: true,
  complete: function(results) {
    const stimuli = results.data.map(row => row.word);

    const timeline = [];

    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: "Welcome to the word experiment. Click below to start.",
      choices: ["Start"]
    });

    stimuli.forEach(word => {
      timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: word,
        choices: ["OK"]
      });
    });

    timeline.push({
      type: jsPsychSurveyHtmlForm,
      html: '<p>Any comments?</p><textarea name="comments" rows="5" cols="50"></textarea>',
      button_label: "Submit"
    });

    jsPsych.run(timeline);
  }
});
