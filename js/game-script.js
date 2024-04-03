const board = document.querySelector(".grid-container");
const botScore = document.querySelector(".bot-score");
const playerScore = document.querySelector(".player-score");
const retryButton = document.querySelector(".retry");
const body = document.querySelector(".body");

let turn;
let scores = [0, 0];
let boardPosition =
    [[0, 0, 0],
     [0, 0, 0],
     [0, 0, 0]];
let playerMoveList = [];

retryButton.addEventListener("click", retry);

function retry () {

    try {

        const removed = document.querySelector(".popup-container");
        removed.style.animation = "disappear 1s 1 forwards";
        setTimeout(() => {

            body.removeChild(document.querySelector(".popup-container"));
        }, 1000);
        game();
    } catch {

        game();
    }
}

const showPopup = (s, message, buttonText) => {

    const fragment = document.createDocumentFragment();
    const popupContainer = document.createElement("DIV");
    const popup = document.createElement("DIV");
    const div = document.createElement("DIV");
    const b = document.createElement("B");
    const button = document.createElement("BUTTON");

    popupContainer.setAttribute("class", "popup-container");
    popup.setAttribute("class", "popup");
    b.setAttribute("class", "popup__b");
    button.setAttribute("class", "popup__button");

    b.innerHTML = message;
    button.innerHTML = buttonText;

    button.addEventListener("click", retry);

    div.appendChild(b);
    div.appendChild(button);
    popup.appendChild(div);
    popupContainer.appendChild(popup);
    fragment.appendChild(popupContainer);
    body.appendChild(fragment);

    scores[s] += 1;

    if (s == 0) {

        botScore.innerHTML = scores[s];
        changeBackground();
    } else if (s == 1) {

        playerScore.innerHTML = scores[s];
        changeBackground();
    }
}

const changeBackground = () => {

    if(scores[0] < scores[1]) {
        
        body.style = "animation: drawToWining 1s 1 forwards; --current-pos: 100%;";
    } else if (scores[0] > scores[1]) {

        body.style = "animation: drawToLosing 1s 1 forwards; --current-pos: 0%;";
    } else {

        body.style.animation = "draw 1s 1 forwards";
    }
}

const checkPlayerWin = (x, y) => {

    if (!boardPosition[y].includes(0) && !boardPosition[y].includes(2)) {

        showPopup(1, "¡Has Ganado!", "Jugar otra vez");
        return true;
    }

    for (let i = 0; i < 3; i++) {

        if (boardPosition[i][x] != 1) {
                
            break;
        }

        if(i == 2) {

            showPopup(1, "¡Has Ganado!", "Jugar otra vez");
            return true;
        }
    }

    if (boardPosition[1][1] == 1) {

        if (x == 0 && y == 0) {

            if(boardPosition[2][2] == 1) {

                showPopup(1, "¡Has Ganado!", "Jugar otra vez");
                return true;
            }
        } else if (x == 0 && y == 2) {

            if(boardPosition[0][2] == 1) {

                showPopup(1, "¡Has Ganado!", "Jugar otra vez");
                return true;
            }
        } else if (x == 2 && y == 0) {

            if (boardPosition[2][0] == 1) {

                showPopup(1, "¡Has Ganado!", "Jugar otra vez");
                return true;
            }
        } else if (x == 2 && y == 2) {

            if (boardPosition[0][0] == 1) {

                showPopup(1, "¡Has Ganado!", "Jugar otra vez");
                return true;
            }
        }
    }
}

class Bot {

    constructor () {

        this.threat = [];
        this.win = false;
        this.moveList = [];
        this.currentMove = [];
    }

    retry () {

        this.threat = [];
        this.win = false;
        this.moveList = [];
        this.currentMove = [];
    }

    moveDefault () {

        if (boardPosition[1][1] == 0) {

            this.currentMove[0] = [1, 1];
        } else {

            this.currentMove[0] = [Math.round(Math.random() * 2), Math.round(Math.random() * 2)];

            while (boardPosition[this.currentMove[0][0]][this.currentMove[0][1]] != 0) {
                
                this.currentMove[0] = [Math.round(Math.random() * 2), Math.round(Math.random() * 2)];
            }
        }
    }

    moveWhenThreat () {

        for (const i in playerMoveList) {

            for (let ii = i; ii < playerMoveList.length; ii++) {
    
                if (playerMoveList[i] == playerMoveList[ii]) {
    
                    continue;
                } else {
    
                    if (playerMoveList[i][0] == playerMoveList[ii][0]) {

                        for (const a in boardPosition[playerMoveList[i][0]]) {
    
                            if (boardPosition[playerMoveList[i][0]].includes(0)) {
        
                                if (boardPosition[playerMoveList[i][0]][a] == 0) {
        
                                    this.currentMove.push([playerMoveList[i][0], a]);
                                    this.threat.push(true);
                                    break;
                                }
                            } else break;
                        }
                    } else if (playerMoveList[i][1] == playerMoveList[ii][1]) {

                        let column = [];
    
                        for (let a = 0; a < 3; a++) {
    
                            column.push(boardPosition[a][playerMoveList[i][1]]);
                        }
    
                        for (const a in column) {
    
                            if(column.includes(0)) {

                                if(column[a] == 0) {
    
                                    this.currentMove.push([a, playerMoveList[i][1]]);
                                    this.threat.push(true)
                                    break;
                                }
                            } else break;
                        }
                    }
                }
            }

            if (boardPosition[1][1] == 1) {

                if (playerMoveList[i][0] == 0 && playerMoveList[i][1] == 0) {

                    if (boardPosition[2][2] == 0) {

                        this.currentMove.push([2, 2]);
                        this.threat.push(true);
                        break;
                    }
                } else if (playerMoveList[i][0] == 0 && playerMoveList[i][1] == 2) {

                    if (boardPosition[2][0] == 0) {

                        this.currentMove.push([2, 0]);
                        this.threat.push(true);
                        break;
                    }
                } else if (playerMoveList[i][0] == 2 && playerMoveList[i][1] == 0) {

                    if (boardPosition[0][2] == 0) {

                        this.currentMove.push([0, 2]);
                        this.threat.push(true);
                        break;
                    }
                } else if (playerMoveList[i][0] == 2 && playerMoveList[i][1] == 2) {

                    if (boardPosition[0][0] == 0) {
                        
                        this.currentMove.push([0, 0]);
                        this.threat.push(true);
                        break;
                    }
                }
            }
        }
    }

    closeWin () {

        for (const i in this.moveList) {

            for (let ii = i; ii < this.moveList.length; ii++) {
    
                if (this.moveList[i] == this.moveList[ii]) {
    
                    continue;
                } else {
    
                    if (this.moveList[i][0] == this.moveList[ii][0]) {
    
                        this.win = true;
    
                        for (const a in boardPosition[this.moveList[i][0]]) {
    
                            if (boardPosition[this.moveList[i][0]].includes(0)) {
        
                                if (boardPosition[this.moveList[i][0]][a] == 0) {
        
                                    this.currentMove.push([this.moveList[i][0], a]);
                                    break;
                                }
                            } else {
        
                                this.win = false;
                                break;
                            }
                        }
                    } else if (this.moveList[i][1] == this.moveList[ii][1]) {
    
                        this.win = true;
                        let column = [];
    
                        for (let a = 0; a < 3; a++) {
    
                            column.push(boardPosition[a][this.moveList[i][1]]);
                        }
    
                        for (const a in column) {
    
                            if(column.includes(0)) {

                                if(column[a] == 0) {
    
                                    this.currentMove.push([a, this.moveList[i][1]]);
                                    break;
                                }
                            } else {
    
                                this.win = false;
                                break;
                            }
                        }
                    }
                }
            }

            if (!this.win) {

                if (boardPosition[1][1] == 2) {

                    if (this.moveList[i][0] == 0 && this.moveList[i][1] == 0) {

                        if (boardPosition[2][2] == 0) {

                            this.currentMove.push([2, 2]); 
                            this.win = true;
                            break;
                        } 
                    } else if (this.moveList[i][0] == 0 && this.moveList[i][1] == 2) {

                        if (boardPosition[2][0] == 0) {

                            this.currentMove.push([2, 0]), this.win = true;
                            break;
                        }
                    } else if (this.moveList[i][0] == 2 && this.moveList[i][1] == 0) {

                        if (boardPosition[0][2] == 0) {

                            this.currentMove.push([0, 2]), this.win = true;
                            break;
                        }
                    } else if (this.moveList[i][0] == 2 && this.moveList[i][1] == 2) {

                        if (boardPosition[0][0] == 0) {

                            this.currentMove.push([0, 0]), this.win = true;
                            break;
                        }
                    } 
                }
            }
        }
    }

    botMove () {

        let move;

        this.moveDefault();
        this.moveWhenThreat();
        this.closeWin();

        if (this.threat[0]) {

            if (this.threat[1]) {

                let probably = (Math.round(Math.random() * 9)) + 1;

                if (probably < 6) {

                    move = this.currentMove[1];
                } else {

                    move = this.currentMove[2];
                }
            } else move = this.currentMove[1];
        } else {

            move = this.currentMove[0];
        }

        if (this.win) move = this.currentMove[this.currentMove.length - 1];

        boardPosition[move[0]][move[1]] = 2;
        this.moveList.push(move);

        let gridItem = document.getElementById(`${move[0]}-${move[1]}`);
        let movement = document.createElement("IMG");
        movement.setAttribute("src", "assets/img/circle.png");
        gridItem.appendChild(movement);

        this.currentMove = [];
        this.threat = [];

        if (!this.win) {

            turn++
        } else {

            showPopup (0, "Has perdido", "Reintentar");
        }
    }
}

const bot = new Bot();

const game = () => {

    turn = 1;
    boardPosition =
        [[0, 0, 0],
         [0, 0, 0],
         [0, 0, 0]];

    board.innerHTML = `
        <div class="grid-item" id="0-0"></div>
        <div class="grid-item" id="0-1"></div>
        <div class="grid-item" id="0-2"></div>
        <div class="grid-item" id="1-0"></div>
        <div class="grid-item" id="1-1"></div>
        <div class="grid-item" id="1-2"></div>
        <div class="grid-item" id="2-0"></div>
        <div class="grid-item" id="2-1"></div>
        <div class="grid-item" id="2-2"></div>
    `;

    bot.retry();
    playerMoveList = [];

    for (const child of board.children) {

        child.addEventListener("click", () => {

            if(turn % 2 == 1) {

                let pos = child.getAttribute("id");
                pos = pos.split("-");
    
                if (boardPosition[pos[0]][pos[1]] == 0) {

                    const fragment = document.createDocumentFragment();
                    const xImg = document.createElement("IMG");
                    xImg.setAttribute("src", "assets/img/cross.png");
                    fragment.appendChild(xImg);
                    child.appendChild(fragment);
        
                    boardPosition[pos[0]][pos[1]] = 1;
                    playerMoveList.push([pos[0],pos[1]]);
                    turn++;
                
                    if (!checkPlayerWin(pos[1], pos[0])) {

                        for (const i in boardPosition) {

                            if (boardPosition[i].includes(0)) {
    
                                bot.botMove();
                                break;
                            }

                            if (i == 2) {

                                showPopup(NaN, "¡Empate!", "Jugar otra vez")
                            }
                        }
                    }
                }
            }
        });
    }
}

game();