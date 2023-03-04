const startGame = () => {
  const grid = document.querySelector('.grid');
  const flagsLeft = document.querySelector('#flags-left');
  const result = document.querySelector('#result');

  let width = 16
  let bombAmount = 40
  let flags = 0
  let squares = []
  let isGameOver = false
   
  //create Board
  function createBoard() {
    flagsLeft.innerHTML = bombAmount
  
  
    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width*width - bombAmount).fill('valid')
    const shuffledArray = [...bombsArray, ...emptyArray].sort(() => Math.random() -0.5)
  
    for(let i = 0; i < width*width; i++) {
      const square = document.createElement('div')
      square.setAttribute('id', i)
      square.classList.add(shuffledArray[i])
      grid.appendChild(square)
      squares.push(square)
        
      square.addEventListener('click', function(e) {
        click(square)
      })
       
      square.oncontextmenu = function(e) {
        e.preventDefault()
        addFlag(square)
      }
    }
     
    for (let i = 0; i < squares.length; i++) {
      let total = 0
      const isLeftEdge = (i % width === 0)
      const isRightEdge = (i % width === width -1)
  
      if (squares[i].classList.contains('valid')) {
        if(i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++
        if(i > 15 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++
        if(i > 16 && squares[i -width].classList.contains('bomb')) total ++
        if(i > 17 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++
        if(i < 254 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++
        if(i < 240 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
        if(i < 238 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++
        if(i < 239 && squares[i +width].classList.contains('bomb')) total ++
          squares[i].setAttribute('data', total)
      }
    }
  }
  
  createBoard()

  //create timer
  let seconds = 0;
  let minutes = 0;
  let hours = 0;

  let displaySeconds = 0;
  let displayMinutes = 0;
  let displayHours =  0;

  let interval = '';
  function StartWatch(){
	seconds++;
	if(seconds/60 === 1)
	{
		seconds=0;
		minutes++;
		if(minutes/60 === 1)
		{
			minutes=0;
			hours++;
		}
	}
	if(seconds < 10 ){
		displaySeconds = '0' + seconds.toString();
	}
	else{displaySeconds = seconds;}
	if(minutes < 10 ){displayMinutes = '0' + minutes.toString();}
	else{displayMinutes = minutes;}
	if(hours < 10 ){displayHours = '0' + hours.toString();}
	else{displayHours = hours;}
	document.getElementById('display').innerHTML = displayHours + ":" + displayMinutes + ":" + displaySeconds;
}
  interval = window.setInterval(StartWatch,1000);

  //add Flag 
  function addFlag(square) {
    if (isGameOver) return
      if (!square.classList.contains('checked') && (flags < bombAmount)) {
        if (!square.classList.contains('flag')) {
          square.classList.add('flag')
          square.innerHTML = ' 🚩'
          flags ++
          flagsLeft.innerHTML = bombAmount- flags
          checkForWin()
        } else {
          square.classList.remove('flag')
          square.innerHTML = ''
          flags --
          flagsLeft.innerHTML = bombAmount- flags
        }
      }
    }

  
  //click on square actions
  function click(square) {
    let currentId = square.id
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return
    if (square.classList.contains('bomb')) {
      gameOver(square)
    } else {
      let total = square.getAttribute('data')
      if (total !=0) {
        square.classList.add('checked')
        if(total == 1) square.classList.add('one')
        if(total == 2) square.classList.add('two')
        if(total == 3) square.classList.add('three')
        if(total == 4) square.classList.add('four')
          square.innerHTML = total
          return
      }
      checkSquare(square, currentId)
      }
    square.classList.add('checked')
  }
  
  
  //check neighboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width -1)
  
    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 15 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 -width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 16) {
        const newId = squares[parseInt(currentId -width)].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 17 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 -width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 254 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 240 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 +width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 238 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 +width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 239) {
        const newId = squares[parseInt(currentId) +width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
    }, 10)
  }

    //game over
    function gameOver(square) {
      result.innerHTML = '😔'
      isGameOver = true
  
      //show bombs
      squares.forEach(square => {
        if (square.classList.contains('bomb')) {
          square.innerHTML = '💣'
          square.classList.remove('bomb')
          square.classList.add('checked')
        }
      })
    }

    function checkForWin() {
      let matches = 0
      for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
          matches ++
        }
        if (matches === bombAmount) {
          result.innerHTML = '🥳'
          isGameOver = true
        }
      }
    }
    result.addEventListener('click', () => window.location.reload())
  }

document.addEventListener('DOMContentLoaded', () => startGame());

  