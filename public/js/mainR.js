// Whose turn it is, White: 0, Red: 1
let turn = 0;
// Board array storing all the square states
let board = [];
// Object holding all the square jQuery elements
let squares = {};
// Object holding all the pieces jQuery elements
let pieces = {};
// Total squares highlighter, either 0 or 1
let totalHighlighted = 0;
// Total red pieces taken
let redPieces = 0;
// Total white pieces taken
let whitePieces = 0;
// Array storing whether that square is a king or not
let king = [];
// jQuery element holding the circle that tells the user who they are, either White, Red or Spectator
let $whoAmI;
$(document).ready(function() {
  const $body = $('body');
  // Array storing whether that square is highlighted
  let highlighted = [];
  // Object holding all the Red Pieces that are out
  let redOut = {};
  // Object  holding all the White Pieces that are out
  let whiteOut = {};
  // Creating Side Red Pieces
  for (let i = 1; i < 13; i++) {
    redOut[`piece${i}`] = $(`#red${i}`);
  }
  // Creating Side White Pieces
  for (let i = 1; i < 13; i++) {
    whiteOut[`piece${i}`] = $(`#white${i}`);
  }
  // Variables to hold the square the user is moving from and to
  let squareFrom;
  let squareTo;
  // Creating and setting whoAmI
  $whoAmI = $('<p>');
  $whoAmI.css({fontSize: "50px", position: "absolute", top: "50px", left: "220px", backgroundColor: "#2B7A78", border: "2px solid black", borderRadius: "50%", padding: "20px"});
  $body.append($whoAmI);
  // Startup loop that creates all the boxes and pieces and assigns onClick features
  for (let i = 1; i < 65; i++) {
    // Setting highlighted and king Array to 65 length and all false
    highlighted[i] = false;
    king[i] = false;
    // Assinging all squares to a key value pair in the squares object
    squares[`$box${i}`] =  $(`.box${i}`);
    squares[`$box${i}`].on("click", function() {
      // Only allows Player 0 to move White pieces on their go and Player 1 to move Red Pieces on their go
      // This is to stop spectators from making moves
      if (turn === 1 && board[i] === "1" && playerID === 1 || turn === 0 && board[i] === "0" && playerID === 0) {
        // If the current square isn't highlighted and no squares have been highlighted yet.
        if (!highlighted[i] && totalHighlighted === 0) {
          // Changes background of square to show selection
          squares[`$box${i}`].css({backgroundColor: "#3AAFA9"});
          // Sets index of square in highlighted array to show that it is highlighted
          highlighted[i] = true;
          // Setting variable to show that a square is highlighted, allowing the next click to make a move.
          totalHighlighted = 1;
          // Assinging square from to highlighted square
          squareFrom = i;
          // Loop which runs moveCheck to highlight all posssible moves
          for (let i = 0; i < 65; i++) {
            moveCheck(squareFrom, i, turn, true)
          }
        }
      }
      // If a square is selected and the user picks another of their pieces, selects that piece instead.
      if (totalHighlighted === 1 && playerID === 1 && turn === 1 && board[i] === "1" || totalHighlighted === 1 && playerID === 0 && turn === 0 && board[i] === "0") {
        // Resets all highlighted squares
        resetShowMoves();
        // Highlighting new squares background
        squares[`$box${i}`].css({backgroundColor: "#3AAFA9"});
        // Changing original squares highlight to false and setting new one to true
        highlighted[squareFrom] = false;
        highlighted[i] = true;
        // Re-assigning squareFrom to new square
        squareFrom = i;
        // Loop which runs moveCheck to highlight all posssible moves
        for (let i = 0; i < 65; i++) {
          moveCheck(squareFrom, i, turn, true)
        }
      }
      // If a square is highlighted and the user tries to move, checks to see if this move can be made
      if (totalHighlighted === 1 && playerID === turn) {
        highlighted[i] = false;
        moveCheck(squareFrom, i, turn);
        return;
      }
    });
  }
  // Function to reset all squares backgrounds to un-highlighted
  const resetShowMoves = function () {
    for (let i = 1; i < 65; i++) {
      squares[`$box${i}`].css({backgroundColor: "#2B7A78"});
    }
  }
  // Move check, has 2 uses, first is to see if a move can be made when the user defines their move. Also will check possible moves and shows the user when they select their initial piece
  const moveCheck = function (squareFrom, squareTo, turnLocal, show) {
    let validMove = false;
    if (turnLocal === 0) { // White moves
      if ( // Down left // Down right // Up right king // Up left king
        squareFrom === squareTo-7 && squareFrom%8 !== 1 && board[squareTo] === "" ||
        squareFrom === squareTo-9 && squareFrom%8 !== 0 && board[squareTo] === "" ||
        squareFrom === squareTo+7 && squareFrom%8 !== 0 && board[squareTo] === "" && king[squareFrom] ||
        squareFrom === squareTo+9 && squareFrom%8 !== 1 && board[squareTo] === "" && king[squareFrom]) {
          validMove = true; jump = false;
        }
      else if ( // Jump down left // Jump down right // Jump up right king // Jump up left king
        squareFrom === squareTo-14 && board[squareFrom+7] === "1" && (squareFrom-1)%8 > 1 && board[squareTo] === "" ||
        squareFrom === squareTo-18 && board[squareFrom+9] === "1" && (squareFrom-1)%8 < 6 && board[squareTo] === "" ||
        squareFrom === squareTo+14 && board[squareFrom-7] === "1" && (squareFrom-1)%8 < 6 && board[squareTo] === "" && king[squareFrom] || squareFrom === squareTo+18 && board[squareFrom-9] === "1" && (squareFrom-1)%8 > 1 && board[squareTo] === "" && king[squareFrom]) {
          validMove = true; jump = true;
        }
    }
    else { //Red moves
      if ( // Up right // Up left // Down left king // Down right king
        squareFrom === squareTo+7 && squareFrom%8 !== 0 && board[squareTo] === "" ||
        squareFrom === squareTo+9 && squareFrom%8 !== 1 && board[squareTo] === "" ||
        squareFrom === squareTo-7 && squareFrom%8 !== 1 && board[squareTo] === "" && king[squareFrom] ||
        squareFrom === squareTo-9 && squareFrom%8 !== 0 && board[squareTo] === "" && king[squareFrom]) {
          validMove = true; jump = false;
      }
      else if ( // Jump up right // Jump up left // Jump down left king // Jump down right king
        squareFrom === squareTo+14 && board[squareFrom-7] === "0" && (squareFrom-1)%8 < 6 && board[squareTo] === "" ||
        squareFrom === squareTo+18 && board[squareFrom-9] === "0" && (squareFrom-1)%8 > 1 && board[squareTo] === "" ||
        squareFrom === squareTo-14 && board[squareFrom+7] === "0" && (squareFrom-1)%8 > 1 && board[squareTo] === "" && king[squareFrom] || squareFrom === squareTo-18 && board[squareFrom+9] === "0" && (squareFrom-1)%8 < 6 && board[squareTo] === "" && king[squareFrom])  {
          validMove = true; jump = true;
        }
    }
    // If a move/ possible move is valid, valid move would be set to true in one of the above if statements, this check will now run.
    if(validMove){
      if (show) { // If the program is just showing possible moves, this will run
        squares[`$box${squareTo}`].css({backgroundColor: "#3AAFA9"})
      } else { // Else the function was run to move a piece, moveTo is called to actually move the piece
        moveTo(squareFrom, squareTo, turnLocal, jump);
      }
    }
  }
  // The move is considered valid and this moveTo will move the piece
  const moveTo = function (squareFrom, squareTo, turnLocal, jump) {// Takes the start square, the end square, whose turn it is and if the move is a jump
    // Reset all highlighted squares
    resetShowMoves();
    // Sets colour based on whose turn it is, used to update classes in moveTo. Checks if the piece has been moved to the end row. If it has, assign the piece as a king
    if (turnLocal === 0) {
      colour = "white";
      if (squareTo/8 > 7) {
        king[squareTo] = true;
      }
    }
    else {
      colour = "red";
      if (squareTo/8 <= 1) {
        king[squareTo] = true;
      }
    }
    // If the piece was already a king, change the initial square to false and the new square to true for king.
    if (king[squareFrom]) {
      king[squareFrom] = false;
      king[squareTo] = true;
    }
    // Remove the piece from the initial square, and add it to the new square
    pieces[`piece${squareFrom}`].removeAttr("class");
    pieces[`piece${squareTo}`].attr("class", `${colour}Piece`);
    // Also add king class if the piece is a king
    if (king[squareTo]) {
      pieces[`piece${squareTo}`].addClass("king");
    }
    // Reset total highlighted
    totalHighlighted = 0;
    // Updating board array to show where the piece is now
    board[squareFrom] = "";
    board[squareTo] = `${turnLocal}`;
    // If the move was a jump, also run this to update the middle square as well as how many pieces are left
    if (jump) {
      // Assigning a middleSquare based on if the user went up or down
      if (squareFrom > squareTo) {
        middleSquare = ((squareFrom-squareTo)/2)+squareTo;
      }
      else {
        middleSquare = ((squareTo-squareFrom)/2)+squareFrom;
      }
      // Removing the middle piece
      pieces[`piece${middleSquare}`].removeAttr("class");
      // Updating board array getting rid of middle piece
      board[middleSquare] = "";
      // Updates how many pieces are taken.
      if (turnLocal === 0) {
        redPieces +=1;
      } else {
        whitePieces +=1;
      }
      // Checks to see if the piece can do another jump, using the jumpCheck function
      console.log(squareTo/8, (squareTo-1)%8);
      if (squareTo/8 <= 6 && (squareTo-1)%8 > 1) {
        jumpCheck(squareTo, squareTo+7, squareTo+14, turnLocal);
      }
      if (squareTo/8 <= 6 && (squareTo-1)%8 < 6) {
        jumpCheck(squareTo, squareTo+9, squareTo+18, turnLocal);
      }
      if (squareTo/8 > 2 && (squareTo-1)%8 < 6) {
        jumpCheck(squareTo, squareTo-7, squareTo-14, turnLocal);
      }
      if (squareTo/8 > 2 && (squareTo-1)%8 > 1) {
        jumpCheck(squareTo, squareTo-9, squareTo-18, turnLocal);
      }
    }
    // Running the changeTurn function
    changeTurn(turnLocal);
    return;
  }
  // This fuction is to check if, once the original jump has happened, if there is another jump that the piece can perform.
  const jumpCheck = function (squareTo, middleSquare, squareTo2, turnLocal) { // This test is run 4 times per piece, testing each of the 4 possible jump spots
    // Temporary variable so that we can change the turn variable to the opposite
    let tempTurn;
    if (turnLocal === 0) {
      tempTurn = 1;
    }
    else {
      tempTurn = 0;
    }
    // Checks if the jump is valid meaning that there is a piece in the middle square of the opposite side and the square after is free
    if (board[middleSquare] === String(tempTurn) && board[squareTo2] === "") {
      window.setTimeout( function() {
        moveCheck(squareTo, squareTo2, turnLocal);
      }, 500);
      return;
    }
  }
  // Function which is run when the game is started, sets variables.
  const gameStart = function () {
    redPieces = 0;
    whitePieces = 0;
    board = ["", "", "0", "", "0", "", "0", "", "0", "0", "", "0", "", "0", "", "0", "", "", "0", "", "0", "", "0", "", "0", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1", "", "1", "", "1", "", "1", "", "", "1", "", "1", "", "1", "", "1", "1", "", "1", "", "1", "", "1", ""];
    // Loop to create pieces and jQuery elements for them
    for (let i = 1; i <= 64; i++) {
      piece = $(`<div id="piece${i}">`);
      squares[`$box${i}`].append(piece);
      pieces[`piece${i}`] = eval(`$('#piece${i}')`);
    }
    // Assinging class names to pieces on the board so they appear
    for (let i = 2; i <= 24; i+=2) {
      pieces[`piece${i}`].attr("class", "whitePiece");
      if (i === 8) {
        i = 7;
      }
      if (i === 15) {
        i = 16;
      }
    }
    for (let i = 41; i <=64; i+=2) {
      pieces[`piece${i}`].attr("class", "redPiece");
      if (i === 47) {
        i = 48;
      }
      if (i === 56) {
        i = 55;
      }
    }
  }
  // The circles which show the colour of whose turn it is
  const $currentTurn = $('.currentTurn');
  const $currentTurnSmall = $('.currentTurnSmall');
  // Function that changes the turn as well as updating taken pieces
  const changeTurn = function (turnLocal) {
    // For the small circle, this updates the number inside of them
    if (toggle === 1) {
      redOut.piece1.text(redPieces);
      whiteOut.piece1.text(whitePieces);
    }
    else if (toggle === 0) {
      let tempCount = 1;
      // If the view is default view, show the amount of pieces taken. The IDs for the pieces for the order they come out are 1,3,5,7,9,11,2,4,6,8,10,12 so these loops go in that order for each of the colours
      for (let i = 1; i <= redPieces; i++) {
        if (tempCount === 13) {
          tempCount = 2;
        }
        redOut[`piece${tempCount}`].css({visibility: "visible"});
        tempCount += 2
      }
      tempCount = 1;
      for (let i = 1; i <= whitePieces; i++) {
        if (tempCount === 13) {
          tempCount = 2;
        }
        whiteOut[`piece${tempCount}`].css({visibility: "visible"});
        tempCount += 2
      }
    }
    // Check to see if all of a players pieces are taken
    if (redPieces === 12) {
      console.log("White Wins!");
    } else if (whitePieces === 12) {
      console.log("Red Wins!");
    }
    // Updating the colour for the small and big current Turn circles
    if (turnLocal === 0) {
      $currentTurn.css({backgroundColor: "red"});
      $currentTurnSmall.css({backgroundColor: "red"});
      turn = 1;
    } else {
      $currentTurn.css({backgroundColor: "white"});
      $currentTurnSmall.css({backgroundColor: "white"});
      turn = 0;
    }
    // This is to stop all spectators from updating the games state to their current state.
    // For players after every turn they will update the database to match their values and then it sends it to the opponent and spectators
    if (playerID !== 2) {
      boardRef.set(board);
      turnRef.set(turn);
      kingRef.set(king);
      whitePiecesRef.set(whitePieces);
      redPiecesRef.set(redPieces);
    }
  }
  // Toggle button at the bottom, toggles UI types
  const $toggleButton = $('.toggle');
  let toggle = 0;
  $toggleButton.on("click", function() {
    // Default toggle state, for every piece taken a piece is shown on the right as well as a big turn circle on the left
    if (toggle === 0) {
      for (i = 2; i < 13; i++) {
        redOut[`piece${i}`].css({visibility: "hidden"});
        whiteOut[`piece${i}`].css({visibility: "hidden"});
      }
      $currentTurn.css({visibility: "hidden"});
      $currentTurnSmall.css({visibility: "visible"});
      redOut.piece1.text(redPieces).css({visibility: "visible", top: "32%"});
      whiteOut.piece1.text(whitePieces).css({visibility: "visible", top: "32%"});
      toggle = 1;
    }
    // Other toggle state, shows amount of pieces taken in a single piece with a number in the middle. The turn circle is between these and is smaller
    else {
      $currentTurn.css({visibility: "visible"});
      $currentTurnSmall.css({visibility: "hidden"});
      redOut.piece1.html("&nbsp;").css({visibility: "hidden", top: "-3%"})
      whiteOut.piece1.html("&nbsp;").css({visibility: "hidden", top: "-3%"})
      redOut.piece2.css({top: "4%"});
      whiteOut.piece2.css({top: "4%"});
      let tempCount = 1;
      // Same loops as earlier showing the right pieces based on how many are taken, 1,3,5,7,9,11,2,4,6,8,10,12
      for (let i = 1; i <= redPieces; i++) {
        if (tempCount === 13) {
          tempCount = 2;
        }
        redOut[`piece${tempCount}`].css({visibility: "visible"});
        tempCount += 2
      }
      tempCount = 1;
      for (let i = 1; i <= whitePieces; i++) {
        if (tempCount === 13) {
          tempCount = 2;
        }
        whiteOut[`piece${tempCount}`].css({visibility: "visible"});
        tempCount += 2
      }
      toggle = 0;
    }
  });
  // Multiplayer code
  // Each time a value in the database is updated, the following code grabs the database values and updates the users code with them
  // The board array in the database
  boardRef.on('value', function(data) {
    // Setting local board to database board
    board = data.val();
    // Loops through the board array, and updates the pieces shown on the board to match that
    for (let i = 1; i < 65; i++) {
      if (board[i] === "0") {
        pieces[`piece${i}`].addClass("whitePiece");
      } else if (board[i] === "1") {
        pieces[`piece${i}`].addClass("redPiece");
      } else {
        pieces[`piece${i}`].removeAttr("class");
      }
    }
  })
  // The king array in the database
  kingRef.on('value', function(data) {
    // Setting local king to database king
    king = data.val();
    // Loops through the king array, and updates the pieces shown on the board to match that
    for (let i = 1; i < 65; i++) {
      if (king[i]) {
        pieces[`piece${i}`].addClass("king");
      } else {
        pieces[`piece${i}`].removeClass("king");
      }
    }
  })
  // The turn variable
  turnRef.on('value', function(data) {
    // Setting local turn to database turn
    turn = data.val();
    // Updating the turn circle based on whose turn it is
    if (data.val() === 1) {
      $currentTurn.css({backgroundColor: "red"})
    }
    if (data.val() === 0) {
      $currentTurn.css({backgroundColor: "white"});
    }
  })
  // White pieces captured
  whitePiecesRef.on('value', function(data) {
    whitePieces = data.val();
    let tempCount = 1;
    tempCount = 1;
    for (let i = 1; i <= whitePieces; i++) {
      if (tempCount === 13) {
        tempCount = 2;
      }
      whiteOut[`piece${tempCount}`].css({visibility: "visible"});
      tempCount += 2
    }
  });
  // Red pieces captured
  redPiecesRef.on('value', function(data) {
    redPieces = data.val();
    let tempCount = 1;
    for (let i = 1; i <= redPieces; i++) {
      if (tempCount === 13) {
        tempCount = 2;
      }
      redOut[`piece${tempCount}`].css({visibility: "visible"});
      tempCount += 2
    }
  });
  gameStart();
});
// Updating the database to match the default board state on startup if a player has joined.
const loadFirebase = function () {
  // This tells the user what player they are based on playerID, the first player to join will be player 0, and be white.
  // The second player will be player 1 and be red, and anyone past this will be player 2 and be considered a spectator
  if (playerID === 0) {
    $whoAmI.css({color: "white"})
    $whoAmI.text("White");
  }
  else if (playerID === 1) {
    $whoAmI.css({color: "red", left: "240px"});
    $whoAmI.text("Red");
  }
  else if (playerID === 2) {
    $whoAmI.css({color: "black", left: "220px", top: "70px", fontSize: "30px"});
    $whoAmI.text("Spectator");
  }qqqq
  if (playerID !== 2) {
    boardRef.set(board);
    turnRef.set(turn);
    kingRef.set(king);
    whitePiecesRef.set(whitePieces);
    redPiecesRef.set(redPieces);
  }
}
