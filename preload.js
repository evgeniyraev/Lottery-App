// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const fs = require('fs');
const path = require('path');
let parceFile = require("./parceFile")

let people = []
let nIntervId;
let winners = []

const saveFiles = (data, outputLocation = "./") => {
  fs.writeFile(
      outputLocation,
      JSON.stringify(data, null, 4),
      'utf-8',
      (err) => {
          if(err)
              throw err;
      }
  )
}

window.addEventListener('DOMContentLoaded', () => {
  let random = null;
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

replaceText("random", `pleace drop a list of contestens`)
  document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
  
    for (const f of event.dataTransfer.files) {
      // Using the path attribute to get absolute file path
      console.log('File Path of dragged files: ', f.path)
      people = parceFile(f.path);

      if(people.length > 0) {
        replaceText("random", `предстоящо теглене`)
        window.addEventListener('keypress', keyboardListener);
      } else {
        replaceText("random", `there are no people `)
      }
    }
  });
  
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  
  document.addEventListener('dragenter', (event) => {
    console.log('File is in the Drop Space');
  });
  
  document.addEventListener('dragleave', (event) => {
    console.log('File has left the Drop Space');
  });

  const keyboardListener = (e) => {
    if(e.code == "Space") {
      if(nIntervId == null) {
        startSpin()
      } else {
        stopSpin()
        addToWinners()
      }
    }
  }
  
  const startSpin = () => {
    if (!nIntervId) {
      nIntervId = setInterval(flashText, 50);
    }
  }
  function stopSpin() {
    clearInterval(nIntervId);
    // release our intervalID from the variable
    nIntervId = null; 
  }
  const flashText = () => {
    random = (Math.random() * people.length) >> 0

    let percon = people[random]

    replaceText("random", `${percon.fullname}, ${percon.place}`)
  }

  

  const addToWinners = () => {
    if (random != null) {
      let winner = people.splice(random, 1)[0];
      
      winners.push(winner)
      if(winners.length > 2) {
        window.removeEventListener('keypress', keyboardListener)
        saveFiles(winners, "winners.json")
        console.log(winners)
      } else {
        
      }
      displayWinners()
    }
  }

  const displayWinners = () => {
    let winnersDiv = document.getElementById("winners")

    winnersDiv.innerHTML = ""

    winners.forEach(winner => {
      let row = document.createElement("div")
      row.innerHTML = `${winner.fullname}, ${winner.place}`

      winnersDiv.appendChild(row)
    })
  }
})
