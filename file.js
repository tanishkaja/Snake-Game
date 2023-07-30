// as the food is not showing as It's possible that the JavaScript code is being executed before the DOM is fully loaded, so use DOMContentLoaded 
document.addEventListener("DOMContentLoaded",()=>{
    const playboard = document.querySelector(".play-board");
    const game = document.querySelector('.gameover');
    const restartbutton = document.querySelector('.restart-button');
    const scoreelement = document.querySelector('.score');
    const highscor = document.querySelector('.high-score');
    const controls = document.querySelectorAll('.controls i')

    let gameover = false;
    let foodX, foodY;
    let snakeX=5, snakeY=10;
    let snakeBody = [];
    let velocityX=0, velocityY=0;
    let setintervalID;// it is the id when the body hit wall then gameover so for that to restart every id is different.
    let score = 0;
    // getting high score from the local storage
    let highscore = localStorage.getItem('high-score')||0;
    highscor.innerText = `High Score: ${highscore}`;

    const changefoodposition = () => {
        // we multiply by 30 as there are 30 grids, passinf random value between 0-30
        foodX = Math.floor(Math.random()*40) +1; 
        foodY = Math.floor(Math.random()*40) +1; 
    }

    const handleGameOver = ()=>{
        game.style.display = 'block';// if gameover then it display the block
        restartbutton.addEventListener('click', () => {
            clearInterval(setintervalID);
            location.reload();
    
        });    
    }



    const changedirection = (e) => {
        // add keys to arrows
        if(e.key=='ArrowUp' && velocityY!=1){// this velocityY will restrict the snake from changing to the opposite side
            velocityX = 0;
            velocityY = -1;
        }
        else if(e.key=='ArrowDown' && velocityY!=-1){
            velocityX = 0;
            velocityY = 1;
        }
        else if(e.key=='ArrowLeft' && velocityX!=1){
            velocityX = -1;
            velocityY = 0;
        }
        else if(e.key=='ArrowRight' && velocityX!=-1){
            velocityX = 1;
            velocityY = 0;
        }
        initGame();
    }

    controls.forEach(key=>{
        // calling changedirection on each key click and passing key dataset value as an object
        key.addEventListener('click',()=>changedirection({key:key.dataset.key}));
    });

    const initGame = () =>{
        // first check if gameover then call handgameover function
        if(gameover) return handleGameOver();

        // grid area is a shorthand prperty that sets values for grid items start and end lines for both the row and column.
        let htmlMarkup = `<div class = "food" style = "grid-area: ${foodY}/${foodX}"></div>`;

         // checking if snake eat food
        
        if(snakeX===foodX && snakeY === foodY){
            changefoodposition();
            snakeBody.push([foodX,foodY]);//adding food body to snake.
            score++;
            
            highscore = score>=highscore? score : highscore;
            localStorage.setItem('high-score', highscore);
            scoreelement.innerText = `Score: ${score}`;
            highscor.innerText = `High Score: ${highscore}`;
        }

        for(let i = snakeBody.length-1; i>0;i--){
            // shifting forward the values of the elements in the snake body by one.
            snakeBody[i] = snakeBody[i-1];
        }

        snakeBody[0] = [snakeX,snakeY]; // setting first element of snake body to current snake position.

        // updating the snake hesd based on current velocity
        snakeX+=velocityX;
        snakeY+=velocityY;

        // checking if body hits the wall
        if(snakeX<=0 || snakeX>40 || snakeY<=0 || snakeY>40 ){
            gameover = true;
        }
        
        for(let i=0; i<snakeBody.length;i++){
            // to join food and snake in the html
            htmlMarkup+= `<div class = "head" style = "grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;

            // Checking if the snake head hit the body, if so set gameover
            if(i!==0 && snakeBody[0][1]===snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
                gameover = true;
            }
        }
        // put food in the html
        playboard.innerHTML = htmlMarkup;
    }


    changefoodposition();
    setintervalID = setInterval(initGame,80);
    document.addEventListener('keydown',changedirection);
});