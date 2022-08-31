// Definiraj globalne varijable
var elems; // Spremi DOM elemente
var board; // Ploča
var turns; // Trenutni potez
var context; // Kontekst igre (x/o)
var currentContext; // Trenutni kontekst
var message; // Poruka o statusu igre
// Inicijaliziraj igru
var init = function() {
  // Postavi početne vrijednosti
  message = '';
  turns = 0;
  board = set().board(); // Definiraj 3x3 ploču
  context = set().context(); // Postavi kontekst igre
  currentContext = get().currentContext(); // Postavi trenutni kontekst
  elems = get().elements(); // Spremi DOM elemente
  bindClickEvents(); // Zakači click evente
};
// Postavi ploču/kontekst
var set = function() {
  // Postavi ploču
  function board() {
    return [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined]
    ];
  }
  // Postavi kontekst
  function context() {
    return {
      player1: 'x',
      player2: 'o'
    };
  }
  return {
    board: board,
    context: context
  };
};
// Dohvati elemente/trenutni kontekst
var get = function() {
  function elements() {
    return {
      game: document.getElementById('game'),
      boxes: document.querySelectorAll('li'),
      resetGame: document.getElementById('reset-game')
    };
  }
  // Izračunaj koji igrač je na potezu
  function currentContext() {
    return (turns % 2 === 0) ? context.player1 : context.player2;
  }
  return {
    elements: elements,
    currentContext: currentContext
  };
}
// Zakači click evente
var bindClickEvents = function() {
  Object.keys(elems.boxes).forEach(function(key) {
    var box = elems.boxes[key];
    box.addEventListener('click', clickHandler);
  });
  // Zakači click event na reset dugme
  elems.resetGame.addEventListener('click', resetGameHandler);
};
// Definiraj click handlere
var clickHandler = function() {
  this.removeEventListener('click', clickHandler);
  this.className = currentContext;
  this.innerHTML = currentContext;
  var pos = this.getAttribute('data-pos').split(',');
  board[pos[0]][pos[1]] = currentContext === 'x' ? 1 : 0;
  // Provjeri “won” status igre
  if (checkStatus()) {
    gameWon();
    return;
  }
  // Osvježi varijable
  turns++;
  currentContext = get().currentContext();
};
// Definiraj handler za resetiranje igre
var resetGameHandler = function() {
  // Clear board
  Object.keys(elems.boxes).forEach(function(key) {
    var box = elems.boxes[key];
    box.className = '';
    box.innerHTML = '';
  });
  clearEvents();
  init();
};
// Očisti click eventove
var clearEvents = function() {
  Object.keys(elems.boxes).forEach(function(key) {
    var box = elems.boxes[key];
    box.removeEventListener('click', clickHandler);
  });
};
// Provjeri status igre
var checkStatus = function() {
  var status = false; // Status igre (true -> won)
  var usedBoxes = 0;
  // Izračunaj poene redaka, stupaca (X = 1; O = 0;)
  board.map(function(row, i) {
    var rowTotal = 0;
    var colTotal = 0;
    row.map(function(col, j) {
      rowTotal += board[i][j];
      colTotal += board[j][i];
      if (typeof board[i][j] !== 'undefined') usedBoxes++;
    });
    // Provejri horizontalno/vertikalno
    if (rowTotal === 0 || rowTotal === 3 || colTotal === 0 || colTotal ===
      3) status = true;
    // Provjeri dijagonalno
    var diagonalLeft = board[0][0] + board[1][1] + board[2][2];
    var diagonalRight = board[0][2] + board[1][1] + board[2][0];
    if (diagonalLeft === 0 || diagonalLeft === 3 || diagonalRight === 0 ||
      diagonalRight === 3) status = true;
  });
  // Provejri “draw” status igre
  if (!status && usedBoxes === 9) {
    gameDraw();
    return;
  }
  return status;
};
// Igra dobivena
var gameWon = function() {
  switch (currentContext) {
    case 'x':
      message = 'Player 1 won the game!';
      break;
    case 'o':
      message = 'Player 2 won the game!';
      break;
  }
  alert(message);
  clearEvents();
};
// Igra neriješena
var gameDraw = function() {
  message = 'Game draw!';
  alert(message);
  clearEvents();
};
init();
