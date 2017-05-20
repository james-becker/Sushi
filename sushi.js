/* TODO:

-- remove ability to "overclick" on other squares during your move or the 
computer's move.
-- implement depth limit in MiniMax recursion.
-- implement prototypes (create AI prototype and board prototype)

'*/


$(document).ready(function() {
  
  // ======================================================== \\
  // ======================= GENERAL ======================== \\
  // ======================================================== \\

  var state = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
  ];
  
  var currentPlayer = 1;
  var aiFirst = false;
  var xMoves = [];
  var oMoves = [];
  var availableMoves = []; // Important.
  var winner = 'none';
  const winConds =

    [
      //horz
      [0, 1, 2], // 0
      [3, 4, 5], // 1
      [6, 7, 8], // 2
      //vert
      [0, 3, 6], // 3
      [1, 4, 7], // 4
      [2, 5, 8], // 5
      //diag
      [0, 4, 8], // 6
      [2, 4, 6] // 7
    ];

  var aColor = 'rgba(80,0,0,0.5)',
      bColor = 'rgba(0,80,0,0.5)';

  // ======================================================== \\
  // ======================= SOUNDS ========================= \\
  // ======================================================== \\
  const sounds = {
    'hover': new Audio(
      'https://www.dropbox.com/s/fxerdydu2hpny87/hover.mp3?raw=1'),
    'flip': new Audio(
      'https://www.dropbox.com/s/mhbsmym0hmi8u6g/flip.mp3?raw=1'),
    'ambience': new Audio(
      'https://www.dropbox.com/s/q09hwcst2lx2qcg/ambience.mp3?raw=1'),
    'gong': new Audio(
      'https://www.dropbox.com/s/hw2qp5rpmq573iz/gong.mp3?raw=1')
  };

  var sound = true;
  // ------------------------- Loop / Play Ambience ------- \\
  sounds['ambience'].addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);

  sounds['ambience'].play();

  // ======================================================== \\
  // ======================= GAMEPLAY ======================= \\
  // ======================================================== \\

  function initialize() {
    state = [
      0, 0, 0,
      0, 0, 0,
      0, 0, 0
    ];
    xMoves = [];
    oMoves = [];
    availableMoves = [];
    winner = 'none';
    $('.front').removeClass('no-click');
    $('.flip-container').removeClass('levitate');
    renderBoard();
    updateConsole();
    
    startGame();
    
  };

  // --------------------------- Move --------------------- \\

  function startGame() {
    if (aiFirst) {
      aiTurn();
      changeTurn();
    };
  };

  function makeMove(pos, currentPlayer) {
    
    state.splice(pos, 1, currentPlayer);
    
    updateMoves();
    renderBoard();
    updateConsole();
    checkState();
    changeTurn();
    renderBoard();
    updateConsole();
    
    if (currentPlayer === 1 && winner === 'none' &&
      availableMoves.length > 0) {
      aiTurn();
    };
    
  };

  // ---------------- Change Player ----------------------- \\
  function changeTurn() {
    currentPlayer = -currentPlayer;
  };
  // ---------------- Mark Square ------------------------- \\
  function renderMove(position, occupant) {
    sounds['flip'].play();
    let back = $('#' + position + '-back');
    let cont = $('#' + position + '-cont');
    switch (occupant) {
      case 1:
        back.addClass('player-a').text('寿');
        cont.addClass("flip no-click");
        break;
      case -1:
        back.addClass('player-b').text('司');
        cont.addClass("flip no-click");
        break;
      case 0:
        cont.removeClass('flip no-click levitate');
        setTimeout(function() {
          back.removeClass('player-a player-b').text('')
        }, 1000);
        break;
    };
  };
  // -------------------- Update Board -------------------- \\
  function renderBoard() {
    for (let i = 0; i < 9; i++) {
      renderMove(i, state[i]);
    };
  };
  // ---------------------- Get Moves --------------------- \\
  function updateMoves() {
    xMoves = [];
    oMoves = [];
    availableMoves = [];
    for (let i = 0; i < 9; i++) {
      if (state[i] === 1) { // switch case possible here?
        xMoves.push(i);
      } else if (state[i] === -1) {
        oMoves.push(i);
      } else if (state[i] === 0) {
        availableMoves.push(i);
      }
    };
  }
  // -------------------- Check for Wins ------------------ \\
  function checkState() {
    for (i = 0; i < winConds.length; i++) {
      if (xMoves.indexOf(winConds[i][0]) > -1 &&
        xMoves.indexOf(winConds[i][1]) > -1 &&
        xMoves.indexOf(winConds[i][2]) > -1) {
        winner = 'x';
        endGame(winner, winConds[i]);
        return;
      } else if (oMoves.indexOf(winConds[i][0]) > -1 &&
        oMoves.indexOf(winConds[i][1]) > -1 &&
        oMoves.indexOf(winConds[i][2]) > -1) {
        winner = 'o';
        endGame(winner, winConds[i]);
        return;
      };
    };
    if (availableMoves.length === 0) {
      winner = 'tie';
      endGame(winner, []);
    };
    console.log("Hmm, it doesn't look like the game is over yet.");
  };

// ------------------------------------------------------ \\

// ======================= END GAME ======================= \\

function endGame (v, winArray) {
  $('.front').addClass('no-click');
  if (v === 'x') {
    sounds['gong'].play();
  } else if (v === 'o') {
    sounds['gong'].play();
  } else if (v === 'tie') {
  };
  for (i = 0; i < winArray.length; i++) {
    $('#' + winArray[i] + '-cont').addClass('levitate');
  };
  
  // Restart in 5 seconds
  setTimeout(function() {
    initialize();
  }, 5000)
  
}

// ============== DISPLAY ASCII BOARD STATE =============== \\

function updateConsole () {
  
  // Used by comment() and consoleDisplay() (below)
  let xo = function(n) {
    if (n === 0) return '.';
    if (n === 1) return 'X';
    if (n === -1) return 'O';
  };

  let comment = function (n) {
    if (winner === 'x' || winner === 'o') {
        return 'Game over. ' + xo(-currentPlayer) + ' won. より多くの寿司を食べます!';
    } else if (winner === 'tie') {
      return "Game over. It's a tie and the final state is: " + state;
    } else {
      switch (n) {
        case 1:
          return "It's X's turn.";
          break;
        case -1:
          return "It's O's turn.";
          break;
      }
    };
  };
  
  let consoleDisplay =

        '  +-------------+\n'+
        '  |  '+xo(state[0])+'   '+xo(state[1])+'   '+xo(state[2])+'  |  X moves: '+xMoves+'\n'+
        '  |             |  O moves: ' + oMoves + '\n'+
        '  |  '+xo(state[3])+'   '+xo(state[4])+'   '+xo(state[5])+'  |  Open moves: '+availableMoves+'\n'+
        '  |             |\n'+
        '  |  '+xo(state[6])+'   '+xo(state[7])+'   '+xo(state[8])+'  |  ' + comment(currentPlayer)+'\n'+
        '  |             |\n'+
        '  +-----------寿司'

  //console.clear();
  console.log(consoleDisplay);
};
// ======================================================== \\

// ======================================================== \\
// ======================== USER EVENTS =================== \\
// ======================================================== \\

$('#ai-mode').click(function() {
  aiMode === 'off' ? aiOn() : aiOff();

  function aiOn() {
    aiMode = 'on';
    $('#ai-mode').text('ai on');
  };
  
  function aiOff() {
    aiMode = 'off';
    $('#ai-mode').text('ai off');
  };

});

$('#move-first').click(function() {
  aiFirst === false ? aiFirstOn() : aiFirstOff();

  function aiFirstOn() {
    aiFirst = true;
    $('#move-first').text('寿司 move first');
  };

  function aiFirstOff() {
    aiFirst = false;
    $('#move-first').text('human move first');
  };
});

$('#new-game').click(function() {
  initialize();
});

$('.front').mouseover(function() {
  sounds['hover'].play();
});

$('.front').click(function() {
  makeMove($(this).attr('id'), currentPlayer);
});

// -------------------- TOGGLE SOUND -------------------- \\

  $('#toggle-sound').click(function() {
    sound === true ? ambienceOff() : ambienceOn();
    // pause sound
    function ambienceOff() {
      sound = false;
      sounds['ambience'].pause();
      $('#toggle-sound').text("ambience off");
    };

    function ambienceOn() {
      sound = true;
      sounds['ambience'].play();
      $('#toggle-sound').text("ambience on");
    }
  });

  $('#console-log-best-move').click(function () {
    console.log('The best move is on square ' + findMove() + '.');
  });
  
  // ======================================================== \\
  // ========================== AI ========================== \\
  // ======================================================== \\
  
  var aiMode = 'off'; //can be 'off' or 'on'
  
  function aiTurn() {
    if (aiMode === 'off') {
      let randomPosition = availableMoves[
        Math.floor(Math.random() * availableMoves.length)
      ];
      setTimeout(function() {
        makeMove(randomPosition, -1)
      }, 1800);
    } else if (aiMode === 'on') {
      console.log('about to execute minimax...');
      setTimeout(function() {
        console.log('about to make move...');
        makeMove(findMove(), -1)
      }, 1800)
    };
  };
  
  // Written outside function, just in case... needed?
  var minPlayer = 1;
  var maxPlayer = -1;
  
  // Is this needed?
  function TicTacToeMiniMax () {
    console.log('TicTacToeMiniMax started...');
      minPlayer = 1;
      maxPlayer = -1;
  };

  // Is this needed?
  function setMinMaxPlayers (maxPlayer, minPlayer) {
    console.log('setMinMaxPlayers started...');
      minPlayer = minPlayer;
      maxPlayer = maxPlayer;
  };
  
  
  function cloneState (state) {
    console.log('cloneState started...');
      return state.slice(0);
  };

  // Utilized by minValue() and maxValue() to stop loop
  function checkWinner (player, state) {
    console.log('checkWinner started...');
      if (
          (state[0] == player && state[1] == player && state[2] == player) ||
          (state[3] == player && state[4] == player && state[5] == player) ||
          (state[6] == player && state[7] == player && state[8] == player) ||
          (state[0] == player && state[3] == player && state[6] == player) ||
          (state[1] == player && state[4] == player && state[7] == player) ||
          (state[2] == player && state[5] == player && state[8] == player) ||
          (state[0] == player && state[4] == player && state[8] == player) ||
          (state[2] == player && state[4] == player && state[6] == player)
          ) {
          return true;
      } else {
          return false;
      }
  };

  // Utilized by minValue() and maxValue() to stop loop
  function checkTie (state) {
    console.log('checkTie started...');
      for (var i = 0; i < state.length; i++) {
          if (state[i] == 0) {
              return false;
          }
      }
      return true;
  };

  // Test for valid moves (possibly redundant)
  function logicMove (move, player, state) {
    console.log('logicMove started...');
      var newState = cloneState(state);
      if (newState[move] === 0) {
          newState[move] = player;
        console.log(newState);
          return newState;
      } else {
          return null;
      }
  };

  // Alternates between maxValue() and minValue()
  function findMove () {
    console.log('findMove started...');
      var bestMoveValue = -100;
      var move = 0;
      for (var i = 0; i < state.length; i++) {
          var newState = logicMove(i, maxPlayer, state);
          if (newState) {
              var predictedMoveValue = minValue(newState);
              if (predictedMoveValue > bestMoveValue) {
                  bestMoveValue = predictedMoveValue;
                  move = i;
              }
          }
      }
      return move;
  };

  function minValue (state) {
    console.log('minValue started...');
      // stop conditions
      if (checkWinner(maxPlayer, state)) {
          return 1;
      } else if (checkWinner(minPlayer, state)) {
          return -1;
      } else if (checkTie(state)) {
          return 0;
      } else {
          var bestMoveValue = 100;
          var move = 0;
          for (var i = 0; i < state.length; i++) {
              var newState = logicMove(i, minPlayer, state);
              if (newState) {
                  var predictedMoveValue = maxValue(newState);
                  if (predictedMoveValue < bestMoveValue) {
                      bestMoveValue = predictedMoveValue;
                      move = i;
                  }
              }
          }
          return bestMoveValue;
      }
  };

  function maxValue (state) {
    console.log('maxValue started...');
      if (checkWinner(maxPlayer, state)) {
          return 1;
      } else if (checkWinner(minPlayer, state)) {
          return -1;
      } else if (checkTie(state)) {
          return 0;
      } else {
          var bestMoveValue = -100;
          var move = 0;
          for (var i = 0; i < state.length; i++) {
              var newState = logicMove(i, maxPlayer, state);
              if (newState) {
                  var predictedMoveValue = minValue(newState);
                  if (predictedMoveValue > bestMoveValue) {
                      bestMoveValue = predictedMoveValue;
                      move = i;
                  }
              }
          }
          return bestMoveValue;
      }
  };
  
  



}); // Close Document Ready

// ================== END OF JAVASCRIPT =================== \\
