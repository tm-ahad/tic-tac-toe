import config from './config/config.json' assert {type: 'json'};
import data from './ml/data.json' assert {type: 'json'};

let playerText = document.getElementById('playerText')
let restartBtn = document.getElementById('restartBtn')
let boxes = Array.from(document.getElementsByClassName('box'))

let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks')

const O_TEXT = "O"
const X_TEXT = "X"

var is_players_turn = true;

var currentPlayer = O_TEXT
var spaces = Array(9).fill(null)
var timeMap = Array(9).fill(null)
var remain = [0, 1, 2, 3, 4, 5, 6, 7, 8]
var mov = 1;

function placeNextMove() {
    console.log(remain)
    let s_board = data.filter(item => {
        for (let key in board) {
            if (board.hasOwnProperty(key)) {
                if (!item.hasOwnProperty(key) || item[key] !== board[key]) {
                    return false;
                }
            }
        }
        return true;
    })

    s_board.forEach((pos, ind) => {
        if (pos.index == mov+1)
        {
            return ind;
        }
    });
    
    if (!remain) 
    {
        return Math.floor(Math.random()*8)
    }

    const randomIndex = Math.floor(Math.random() * remain.length);
    const rnd = remain[randomIndex];

    delete remain[randomIndex];
    return rnd;
}

const startGame = () => 
{
    let id = String(placeNextMove())
    document.getElementById(id).innerHTML = currentPlayer
    spaces[id] = currentPlayer
    boxes.forEach(box => box.addEventListener('click', boxClicked))
    currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT
}

function boxClicked(e) 
{
    if (is_players_turn) 
    {
        const id = e.target.id
        remain = remain.filter(elem => elem != id)

        if(!spaces[id]){
            spaces[id] = currentPlayer
            e.target.innerText = currentPlayer
            timeMap[id] = mov;

            won()

            const _id = String(placeNextMove())
            const temp = currentPlayer == X_TEXT ? O_TEXT : X_TEXT
            document.getElementById(_id).innerHTML = temp
            spaces[_id] = temp
            timeMap[id] = mov+1;

            won()
            
            currentPlayer == temp
            mov+=2
        }
    }
}

function won() 
{
    if(playerHasWon() !== false)
    {
        playerText.innerHTML = `has won!`
        let winning_blocks = playerHasWon()

        winning_blocks.map(box => boxes[box].style.backgroundColor=winnerIndicator)
        return
    }
}

function playerHasWon() 
{
    for (const condition of config.win) 
    {
        let [a, b, c] = condition

        if(spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) 
        {
            return [a,b,c]
        }
    }
    return false
}

restartBtn.addEventListener('click', restart)

function restart() 
{
    fetch({
        method: 'POST',
        pathname: "/learn",
        body: JSON.stringify([spaces, timeMap])
    })

    window.location.reload(true);
}

startGame()