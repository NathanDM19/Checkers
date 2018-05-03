//Board
//turn
// red/whitePieces
//king
let turn = 0;
let board = [];
let squares = {};
let pieces = {};
let totalHighlighted = 0;
let redPieces = 0;
let whitePieces = 0;
let king = [];
let $whoAmI;
let show = false;
$(document).ready(function() {
  const $body = $('body');
  let highlighted = [];
  let redOut = {};
  let whiteOut = {};
  // Creating Side Red Pieces
  for (let i = 1; i < 13; i++) {
    redOut[`piece${i}`] = eval(`$('#red${i}')`);
  }
  // Creating Side White Pieces
  for (let i = 1; i < 13; i++) {
    whiteOut[`piece${i}`] = eval(`$('#white${i}')`);
  }
  // Assinging squares variables // Add HTML
  let squareFrom;
  let squareTo;
  $whoAmI = $('<p>');
  $whoAmI.css({fontSize: "50px", position: "absolute", top: "50px", left: "50px", zIndex: "10", width: "200px", height: "200px"});
  $body.append($whoAmI);
  for (let i = 1; i < 65; i++) {
    highlighted[i] = false;
    king[i] = false;
    squares[`$box${i}`] =  $(`.box${i}`);  //eval(`$('.box${i}')`);
    squares[`$box${i}`].on("click", function() {
      if (turn === 1 && board[i] === "1" && playerID === 1 || turn === 0 && board[i] === "0" && playerID === 0) {
        if (highlighted[i]) {
          squares[`$box${i}`].css({backgroundColor: "#2B7A78"});
          highlighted[i] = false;
          totalHighlighted = 0;
          resetShowMoves();
        } else if (!highlighted[i] && totalHighlighted === 0) {
          squares[`$box${i}`].css({backgroundColor: "#3AAFA9"});
          highlighted[i] = true;
          totalHighlighted = 1;
          squareFrom = i;
          for (let i = 0; i < 65; i++) {
            moveCheck(squareFrom, i, turn, true)
          }
        }
      }
      if (totalHighlighted === 1 && playerID === 1 && turn === 1 && board[i] === "1" || totalHighlighted === 1 && playerID === 0 && turn === 0 && board[i] === "0") {
        resetShowMoves();
        squares[`$box${squareFrom}`].css({backgroundColor: "#2B7A78"});
        squares[`$box${i}`].css({backgroundColor: "#3AAFA9"});
        highlighted[squareFrom] = false;
        highlighted[i] = true;
        squareFrom = i;
        for (let i = 0; i < 65; i++) {
          moveCheck(squareFrom, i, turn, true)
        }
      }
      if (totalHighlighted === 1 && playerID === turn) {
        highlighted[i] = false;
        moveCheck(squareFrom, i, turn);
        return;
      }
    });
  }
  const resetShowMoves = function () {
    for (let i = 1; i < 65; i++) {
      squares[`$box${i}`].css({backgroundColor: "#2B7A78"});
    }
  }
  const moveCheck = function (squareFrom, squareTo, turnLocal, show) {
    let validMove = false;
    if (turnLocal === 0) { // White
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
        squareFrom === squareTo+14 && board[squareFrom-7] === "1" && (squareFrom-1)%8 < 6 && board[squareTo] === "" && king[squareFrom] || squareFrom === squareTo+18 && board[squareFrom-9] === "1" && (squareFrom-1)%8 > 1 && board[squareTo] === " "&& king[squareFrom]) {
          validMove = true; jump = true;
        }
    }
    else { //Red
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
    if(validMove){
      if (show) {
        squares[`$box${squareTo}`].css({backgroundColor: "#3AAFA9"})
      } else {
        moveTo(squareFrom, squareTo, turn, jump);
      }
    }
  }
  const moveTo = function (squareFrom, squareTo, turn, jump) {
    resetShowMoves();
    if (turn === 0) {
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
    if (king[squareFrom]) {
      king[squareFrom] = false;
      king[squareTo] = true;
    }
    squares[`$box${squareFrom}`].css({backgroundColor: "#2B7A78"});
    pieces[`piece${squareFrom}`].removeAttr("class");
    pieces[`piece${squareTo}`].attr("class", `${colour}Piece`);
    if (king[squareTo]) {
      pieces[`piece${squareTo}`].addClass("king");
    }
    totalHighlighted = 0;
    board[squareFrom] = "";
    board[squareTo] = `${turn}`;
    if (jump) {
      if (squareFrom > squareTo) {
        middleSquare = ((squareFrom-squareTo)/2)+squareTo;
      }
      else {
        middleSquare = ((squareTo-squareFrom)/2)+squareFrom;
      }
      pieces[`piece${middleSquare}`].removeAttr("class");
      board[middleSquare] = "";
      if (turn === 0) {
        redPieces +=1;
      } else {
        whitePieces +=1;
      }
      if (squareTo/8 <= 6 && (squareTo-1)%8 > 1) {
        jumpCheck(squareTo, squareTo+7, squareTo+14, turn);
      }
      if (squareTo/8 <= 6 && (squareTo-1)%8 < 6) {
        jumpCheck(squareTo, squareTo+9, squareTo+18, turn);
      }
      if (squareTo/8 >= 3 && (squareTo-1)%8 < 6) {
        jumpCheck(squareTo, squareTo-7, squareTo-14, turn);
      }
      if (squareTo/8 >= 3 && (squareTo-1)%8 > 1) {
        jumpCheck(squareTo, squareTo-9, squareTo-18, turn);
      }
    }
    changeTurn();
    return;
  }
  const jumpCheck = function (squareTo, middleSquare, squareTo2, turn) {
    let tempTurn;
    if (turn === 0) {
      tempTurn = 1;
    }
    else {
      tempTurn = 0;
    }
    if (board[middleSquare] === String(tempTurn) && board[squareTo2] === "") {
      window.setTimeout( function() {
        moveCheck(squareTo, squareTo2, turn);
      }, 500);
      return;
    }
  }
  const gameStart = function () {
    redPieces = 0;
    whitePieces = 0;
    board = ["", "", "0", "", "0", "", "0", "", "0", "0", "", "0", "", "0", "", "0", "", "", "0", "", "0", "", "0", "", "0", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1", "", "1", "", "1", "", "1", "", "", "1", "", "1", "", "1", "", "1", "1", "", "1", "", "1", "", "1", ""];
    for (let i = 1; i <= 64; i++) {
      piece = $(`<div id="piece${i}">`);
      squares[`$box${i}`].append(piece);
      pieces[`piece${i}`] = eval(`$('#piece${i}')`);
    }
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
  const $currentTurn = $('.currentTurn');
  const $currentTurnSmall = $('.currentTurnSmall');
  const changeTurn = function () {
    if (toggle === 1) {
      redOut.piece1.text(redPieces);
      whiteOut.piece1.text(whitePieces);
    }
    if (toggle === 0) {
      let tempCount = 1;
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
    if (redPieces === 12) {
      console.log("White Wins!");
    } else if (whitePieces === 12) {
      console.log("Red Wins!");
    }
    if (turn === 0) {
      $currentTurn.css({backgroundColor: "red"});
      $currentTurnSmall.css({backgroundColor: "red"});
      turn = 1;
    } else {
      $currentTurn.css({backgroundColor: "white"});
      $currentTurnSmall.css({backgroundColor: "white"});
      turn = 0;
    }
    if (playerID !== 2) {
      boardRef.set(board);
      turnRef.set(turn);
      kingRef.set(king);
      whitePiecesRef.set(whitePieces);
      redPiecesRef.set(redPieces);
    }
  }
  const $toggleButton = $('.toggle');
  let toggle = 0;
  $toggleButton.on("click", function() {
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
    else {
      $currentTurn.css({visibility: "visible"});
      $currentTurnSmall.css({visibility: "hidden"});
      redOut.piece1.html("&nbsp;").css({visibility: "hidden", top: "-3%"})
      whiteOut.piece1.html("&nbsp;").css({visibility: "hidden", top: "-3%"})
      redOut.piece2.css({top: "4%"});
      whiteOut.piece2.css({top: "4%"});
      let tempCount = 1;
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
  boardRef.on('value', function(data) {
    board = data.val();
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
  kingRef.on('value', function(data) {
    king = data.val();
    for (let i = 1; i < 65; i++) {
      if (king[i]) {
        pieces[`piece${i}`].addClass("king");
      } else {
        pieces[`piece${i}`].removeClass("king");
      }
    }
  })
  turnRef.on('value', function(data) {
    turn = data.val();
    if (data.val() === 1) {
      $currentTurn.css({backgroundColor: "red"})
    }
    if (data.val() === 0) {
      $currentTurn.css({backgroundColor: "white"});
    }
  })
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
const loadFirebase = function () {
  if (playerID === 0) {
    $whoAmI.css({color: "white"})
    $whoAmI.text("YOU ARE WHITE");
  }
  else if (playerID === 1) {
    $whoAmI.css({color: "red"});
    $whoAmI.text("YOU ARE RED");
  }
  else if (playerID === 2) {
    $whoAmI.css({color: "black"});
    $whoAmI.text("YOU ARE A SPECTATOR");
  }
  if (playerID !== 2) {
    boardRef.set(board);
    turnRef.set(turn);
    kingRef.set(king);
    whitePiecesRef.set(whitePieces);
    redPiecesRef.set(redPieces);
  }
}
