const dynamicContent = document.getElementById("dynamic-text");

const phrases = ["Software Engineer...", "24 years of age", "BSIT Graduate..."];
let phraseIndex = 0;
let letterIndex = 0;
const typingSpeed = 150;
const erasingSpeed = 75;
function printLetter(phrase){
    if(letterIndex == phrase.length){
        clearLetter();
    }
    else if(letterIndex < phrase.length){
        dynamicContent.textContent += phrase.charAt(letterIndex);
        letterIndex += 1;
        setTimeout(function(){
            printLetter(phrase);
        }, typingSpeed)
    }
    
}

function clearLetter(){
    if(letterIndex == -1){
        phraseIndex = (phraseIndex+1) % phrases.length;
        letterIndex = 0;
        printLetter(phrases[phraseIndex]);
    }
    else if(letterIndex > -1){
        let updatedPhrase = "";
        for(let index = 0; index < letterIndex; index++){
            updatedPhrase += phrases[phraseIndex].charAt(index);
        }
        // console.log(updatedPhrase);
        dynamicContent.textContent = updatedPhrase;
        letterIndex -= 1;
        setTimeout(clearLetter, erasingSpeed);
    }
} 
printLetter(phrases[phraseIndex]);

window.addEventListener("scroll", function(){
    let intro = this.document.querySelector(".intro");
    console.log(this.window.scrollY)
    if(this.window.scrollY >= intro.offsetHeight + intro.offsetTop){
        this.document.querySelector(".header").style.position = 'sticky';
    } else{
        this.document.querySelector(".header").style.position = 'revert';   
    }
})