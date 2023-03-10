
const gameCanvas=document.getElementById("gameCanvas");
const p1_score=document.getElementById("player1");
const p2_score=document.getElementById("player2");
const currentPlayer=document.getElementById("currentPlayer");
const currentOrWinner=document.getElementById("currentOrWinner");
gameCanvas.height=window.innerHeight;
gameCanvas.width=window.innerWidth;

// game flags:
let makeConfetti = true;    // start confetti 
let start = false;          // game has started
let pauseGame = false;      // the game is paused

const gameCtx = gameCanvas.getContext("2d");
const game = new Game(gameCanvas.width, gameCanvas.height);



animate();

function updateMousekMove(e){
    let rect = gameCanvas.getBoundingClientRect();

    if(game.repositionWhiteBall){
        game.whiteBall.position.x = e.clientX - rect.left;
        game.whiteBall.position.y = e.clientY - rect.top;
    }
    else{
        game.stick.update(e.clientX - rect.left, e.clientY - rect.top, game.whiteBall);
    }
        
}

function onClick(){

    if(!pauseGame && start){
        if(game.repositionWhiteBall){
            if(game.checkValidReposition()){
                game.repositionWhiteBall = false;
            }
        }
        else{
            game.stick.shoot();
            game.isShot = true;
        }
    }
    
}

function resizeGame(){
    
    gameCanvas.height=window.innerHeight;
    gameCanvas.width=window.innerWidth;
    game.resize(window.innerWidth, window.innerHeight);
}

document.addEventListener("mousemove", updateMousekMove);
document.addEventListener("click", onClick);

function confetti(){
    startConfetti();
    setTimeout(() => {stopConfetti();}, 5000);
    setTimeout(() => {  pause();}, 5000);
}

function pause(){
    pauseGame = true;
    var btn =
    document.getElementById("startGame");

    if(start){
        btn.innerHTML = "Resume";
    }else{
        btn.innerHTML = "Start Game";
    }

    var elemnt =
    document.getElementById("body");

    elemnt.classList.toggle("switch");
}

function startGame(){

    var elemnt =
    document.getElementById("body");

    var btn =
    document.getElementById("startGame");

    if(start){
        if(pauseGame){
            btn.innerHTML = "Resume";
            elemnt.classList.toggle("switch");
            setTimeout(() => {
            pauseGame = false;
            }, 1000);
        }else{
            
        }
    }else{
        btn.innerHTML = "Start Game";
        elemnt.classList.toggle("switch");
        
        if(game.status != 0){
            makeConfetti = true;
            start = false;       
            pauseGame = false;      
            game.resetGame();
            currentOrWinner.innerHTML = "Current player is";
            currentPlayer.innerHTML = game.currentTurn==1?"RED":"YELLOW";
            currentPlayer.style.color = game.currentTurn==1?"red":"goldenrod";
        }
        setTimeout(() => {
        start = true;
        }, 1000);
    }
}

function animate(time){
    
    if(pauseGame == false){
        game.update();
        game.draw(gameCtx);
    }

    p1_score.innerHTML = game.score_player1;
    p2_score.innerHTML = game.score_player2;
    if(game.status == 0){
        currentPlayer.innerHTML = game.currentTurn==1?"RED":"YELLOW";
        currentPlayer.style.color = game.currentTurn==1?"red":"goldenrod";
    }
    else {
        if(game.status != 3){
            currentOrWinner.innerHTML = "The winner is";
            currentPlayer.innerHTML = game.status==1?"????RED????":"????YELLOW????";
            currentPlayer.style.color = game.status==1?"red":"goldenrod";
        }
        else{
            currentOrWinner.innerHTML = "It's a";
            currentPlayer.innerHTML = "TIE!";
            currentPlayer.style.color = "black";
        }

        if(makeConfetti){
            makeConfetti = false;
            confetti();
        }

        start = false;
    }
    
    requestAnimationFrame(animate);    
}