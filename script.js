const sleep = ms => new Promise(r => setTimeout(r, ms));

var turns = 0;
var mistakes = 0;
var selectedCards = [null, null]

var Intervall;


window.onload = function()
{
  var seconds = 0;
  var minutes = 0 ;

  clearInterval(Intervall);
  Intervall = setInterval(startTimer, 1000);

  

  function startTimer()
  {
    seconds++;
    if (seconds % 60 == 0) {
      minutes++
      seconds = 0;
    }
    if (seconds <= 9)
    {
      document.getElementById("seconds").innerHTML = "0" + seconds;
    }
    else {
      document.getElementById("seconds").innerHTML = seconds;
    }
    if (minutes <= 9)
    {
      document.getElementById("minutes").innerHTML = "0" + minutes;
    }
    else {
      document.getElementById("minutes").innerHTML = minutes;
    }
  }

}




function returnToHome() {
  window.location.href = "./main.html";
}

function getURLParams()
{
  const queryString =  window.location.search;
  const urlParams =  new URLSearchParams(queryString);
  return [urlParams.get('theme') || "base", Number(urlParams.get('size')) || 0];

}


function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}


async function fetchTheme(theme) {
  try {
    const response = await fetch(`./themes/${theme}/theme.json`);
    const themeJson = await response.json();
    return themeJson;
  } catch (e) {
    throw(e);
  }
}

function shuffle(list) {
  return list
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

}

function makeList(themeJson, numbers) {
  numbers = numbers/2;
  // let newList = themeJson.cards.slice(0, numbers).flatMap(i => [i,i]);
  // newList.sort(() => .5 - Math.random());

  let newList = shuffle(themeJson.cards).slice(0, numbers).flatMap(i => [i,i]);
  newList = shuffle(newList);

  return newList;
}

function genCard(themeJson, theme, elem) {

  let card = createElementFromHTML(`
  
  <div class="flip-card">
    <div class="flip-card-inner">
      <div class="flip-card-front">
      
      </div>
      <div class="flip-card-back">
        <img src="./themes/${theme}/${elem}" alt="Background" width="100%" height="100%">
      </div>
    </div>
  </div>
  `);
  card.elem = elem;
  return card;
}

async function checkCards() {
  if(!selectedCards[0] || !selectedCards[1]) return;
  turns++;
  
  document.getElementById("turns").innerHTML = "TURNS : " + turns;
  if(selectedCards[0].elem == selectedCards[1].elem) {
    selectedCards[0].classList.add('turned');
    selectedCards[0].classList.remove("clicked");
    selectedCards[1].classList.add('turned');
    selectedCards[1].classList.remove("clicked");

    selectedCards = [null,null];

  } else {
    await sleep(400);
    selectedCards[0].classList.remove("clicked");
    selectedCards[1].classList.remove("clicked");
    selectedCards = [null, null];
    mistakes++;
    document.getElementById("mistakes").innerHTML = "MISTAKES : " + mistakes;
  }
}

function checkWin(sizeJson)
{
  let gameTable = document.getElementById('gameTable');

  for(let i = 0; i < sizeJson.h * sizeJson.w; i++)
  {
    if (!gameTable.children[Math.floor(i/sizeJson.w)].children[i%sizeJson.h].children[0].classList.contains("turned")) return false;
  }
  return true;
}


function getClickEvent(cell, sizeJson) {
  return () => {
    if(cell.children[0].classList.contains('turned') || cell.children[0].classList.contains('clicked')) return;
    
    if(!selectedCards[0]) {
      selectedCards[0] = cell.children[0];
      selectedCards[0].classList.add('clicked');
    } else if(!selectedCards[1]) {
      selectedCards[1] = cell.children[0];
      selectedCards[1].classList.add('clicked');
      checkCards();
      if (checkWin(sizeJson))
      {
        if(document.getElementById("win") == undefined) document.body.appendChild(createElementFromHTML(`<div class="win" id="win"><h1> Congrats you won !</h1></div>`))
        clearInterval(Intervall);
      }
    }
  }
}

function addCustomCss(content) {
  content = `.flip-card-back img {
    ${content}
  }`;

  const style = document.createElement('style');
  style.textContent = content;
  document.head.append(style);
}

async function init() {

  let [theme, size] = getURLParams();
  fetchTheme(theme)
    .catch((err) => {
      returnToHome();
    })
    .then((themeJson) => {
      console.log(themeJson)
      let sizeJson = themeJson.sizes[size] ?? themeJson.sizes[0] ?? null;
      if(sizeJson == null) returnToHome();

      let cardsList = makeList(themeJson,sizeJson.w * sizeJson.h);

      if(themeJson.customcss) addCustomCss(themeJson.customcss);

      let gameTable = document.getElementById('gameTable');

      for(var y = 0; y < sizeJson.h; y++) {
        let line = document.createElement("tr");

        for(var x = 0; x < sizeJson.w; x++) {
          let cell = document.createElement("td");
          cell.appendChild(genCard(themeJson,theme, cardsList[y*sizeJson.w + x]));
          cell.onclick = getClickEvent(cell, sizeJson);
          line.appendChild(cell);
        }

        gameTable.appendChild(line);
      }

        
    if (parseInt(document.location.href.split("&")[1].split("=")[1]) > 0) {
      for (var i=0; i < document.getElementsByClassName("flip-card").length; ++i) {
        document.getElementsByClassName("flip-card")[i].style.width="100px";
       
        
      }
      document.querySelector(".gameMap").style.margin="0px";
    }

    });

    
}



init();