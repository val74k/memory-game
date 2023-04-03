var theme = "base"
var size = 0;

window.onload = function()
{
    updateTheme();

    const blob = document.getElementById('blob');
    const blobBlur = document.getElementById("blob-blur");

    document.body.onpointermove = (event) => {
    const { clientX, clientY } = event;


    blob.animate({
        left : `${clientX}px`,
        top : `${clientY + window.scrollY}px`
    },{duration : 3000, fill:"forwards", fill: "forwards",timing : "ease-out",})

    blobBlur.style.top = window.scrollY + "px";

    }

}

function updateTheme()
{
    theme = document.getElementById("selected-theme").value;
    updateSizeSelection();
    updatePlayButton();
}


function redirect()
{
    window.location.href ='game.html?theme='+ theme + '&size=' + size;    
}


function updatePlayButton()
{
    let playButton = document.getElementById("play-button");
    playButton.onclick = function () {
        redirect();
    };

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


function updateSize()
{
    size = document.getElementById("size-selection").value;
    updatePlayButton();
}


function updateSizeSelection()
{
    fetchTheme(theme)
    .then((themeJson) => {
        let sizesJson = themeJson.sizes;
        let sizeSelect = document.getElementById("size-selection");
        sizeSelect.textContent = "";

        for(let i = 0; i < sizesJson.length; i++)
        {
            sizeSelect.appendChild(createElementFromHTML(
                `
                <option value=${i}>width : ${sizesJson[i].w} height : ${sizesJson[i].h}</option>
                
                `
            ));
        }
    });
}




