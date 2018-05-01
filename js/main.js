let picking = false;
let moving = false;
let turn = 0;
let board = {
  row1: ["", "", "", "", "", "", "", ""],
  row2: ["", "", "", "", "", "", "", ""],
  row3: ["", "", "", "", "", "", "", ""],
  row4: ["", "", "", "", "", "", "", ""],
  row5: ["", "", "", "", "", "", "", ""],
  row6: ["", "", "", "", "", "", "", ""],
  row7: ["", "", "", "", "", "", "", ""],
  row8: ["", "", "", "", "", "", "", ""],
  rows: ["BLANK", "row1", "row2", "row3", "row4", "row5", "row6", "row7", "row8"]
}
let squares = {};
let pieces = {};
let totalHighlighted = 0;
let totalRedPieces = 12;
let totalWhitePieces = 12;
$(document).ready(function() {
  let rowFrom;
  let columnFrom;
  let highlighted = [];
  let redOut = {};
  let whiteOut = {};
  for (let i = 1; i < 13; i++) {
    redOut[`$piece${i}`] = eval(`$('#red${i}')`);
  }
  for (let i = 1; i < 13; i++) {
    whiteOut[`$piece${i}`] = eval(`$('#white${i}')`);
  }
  for (let i = 1; i < 65; i++) {
    highlighted[i] = false;
    squares[`$box${i}`] = eval(`$('.box${i}')`);
    squares[`$box${i}`].on("click", function() {
      if (picking) {
        rowTo = board.rows[Math.ceil(i/8)];
        columnTo = (i-1)%8;
        if (turn === 1) {
          if (board[rowTo][columnTo] === "1") {
            if (highlighted[i]) {
              squares[`$box${i}`].css({backgroundColor: "#2B7A78"});
              highlighted[i] = false;
              totalHighlighted = 0;
            } else if (!highlighted[i] && totalHighlighted === 0) {
              squares[`$box${i}`].css({backgroundColor: "#3AAFA9"});
              highlighted[i] = true;
              totalHighlighted = 1;
              rowFrom = rowTo;
              columnFrom = columnTo;
            }
            return;
          }
          if (totalHighlighted === 1) {
            highlighted[i] = false;
            moveTo(rowFrom, columnFrom, rowTo, columnTo, turn);
            return;
          }
        }
        else if (turn === 0) {
          if (board[rowTo][columnTo] === "0") {
            if (highlighted[i]) {
              squares[`$box${i}`].css({backgroundColor: "#2B7A78"});
              highlighted[i] = false;
              totalHighlighted = 0;
            } else if (!highlighted[i] && totalHighlighted === 0) {
              squares[`$box${i}`].css({backgroundColor: "#3AAFA9"});
              highlighted[i] = true;
              totalHighlighted = 1;
              rowFrom = rowTo;
              columnFrom = columnTo;
            }
            return;
          }
          if (totalHighlighted === 1) {
            highlighted[i] = false;
            moveTo(rowFrom, columnFrom, rowTo, columnTo, turn);
            return;
          }
        }
      }
    });
  }
  const moveTo = function (rowFrom, columnFrom, rowTo, columnTo, turnLocal) {
    let changeRowFrom = rowFrom;
    let changeRowTo = rowTo;
    rowFrom = Number(rowFrom.slice(3, 4));
    rowTo = Number(rowTo.slice(3, 4));
    console.log("Row From:",rowFrom, "Column From:", columnFrom, "Row To:", rowTo,"Column To:", columnTo,"Turn:", turnLocal);
    if (turnLocal === 0) {
      // Single Move
      if (rowFrom === rowTo-1) {
        if (columnFrom >= 1 && columnFrom <= 7) {
          if (columnFrom === columnTo+1 && board[changeRowTo][columnTo] === "") {
            //Setting square IDs for the move from and move to
            let moveFromID = ((rowFrom-1)*8)+columnFrom+1;
            let moveToID = ((rowTo-1)*8)+columnTo+1;
            squares[`$box${moveFromID}`].css({backgroundColor: "#2B7A78"});
            pieces[`$piece${moveFromID}`].removeAttr("class", "whitePiece");
            pieces[`$piece${moveToID}`].attr("class", "whitePiece");
            totalHighlighted = 0;
            board[changeRowFrom][columnFrom] = "";
            board[changeRowTo][columnTo] = "0";
            turn = 1;
            changeTurn();
            return;
          }
        }
        if (columnFrom >= 0 && columnFrom <= 6) {
          if (columnFrom === columnTo-1 && board[changeRowTo][columnTo] === "") {
            //Setting square IDs for the move from and move to
            let moveFromID = ((rowFrom-1)*8)+columnFrom+1;
            let moveToID = ((rowTo-1)*8)+columnTo+1;
            squares[`$box${moveFromID}`].css({backgroundColor: "#2B7A78"});
            pieces[`$piece${moveFromID}`].removeAttr("class", "whitePiece");
            pieces[`$piece${moveToID}`].attr("class", "whitePiece");
            totalHighlighted = 0;
            board[changeRowFrom][columnFrom] = "";
            board[changeRowTo][columnTo] = "0";
            turn = 1;
            changeTurn();
            return;
          }
        }
      }
      // Jump move
      if (rowFrom === rowTo-2) {
        // debugger;
        let middleRow = `row${rowTo-1}`;
        if (columnFrom >= 2 && columnFrom <= 7) {
          if (columnFrom === columnTo+2 && board[changeRowTo][columnTo] === "" && board[middleRow][columnTo+1] === "1") {
            let moveFromID = ((rowFrom-1)*8)+columnFrom+1;
            let middleID = ((rowFrom)*8)+columnFrom;
            let moveToID = ((rowTo-1)*8)+columnTo+1;
            squares[`$box${moveFromID}`].css({backgroundColor: "#2B7A78"});
            pieces[`$piece${moveFromID}`].removeAttr("class", "whitePiece");
            pieces[`$piece${moveToID}`].attr("class", "whitePiece");
            pieces[`$piece${middleID}`].removeAttr("class", "redPiece");
            totalHighlighted = 0;
            board[changeRowFrom][columnFrom] = "";
            board[middleRow][columnFrom-1] = "";
            board[changeRowTo][columnTo] = "0";
            totalRedPieces -= 1;
            if (rowTo <= 6) {
              let nextRow = `row${rowTo+1}`;
              let nextRow2 = `row${rowTo+2}`;
              if (board[nextRow][columnTo+1] === "1" && board[nextRow2][columnTo+2] === "") {
                window.setTimeout( function() {
                  moveTo(changeRowTo, columnTo, nextRow2, columnTo+2, 0); }, 500 );
                  return;
              }
              if (board[nextRow][columnTo-1] === "1" && board[nextRow2][columnTo-2] === "") {
                window.setTimeout( function() {
                  moveTo(changeRowTo, columnTo, nextRow2, columnTo-2, 0); }, 500 );
                  return;
              }
            }
            turn = 1;
            changeTurn();
            return;
          }
        }
        if (columnFrom >= 0 && columnFrom <= 5) {
          if (columnFrom === columnTo-2 && board[changeRowTo][columnTo] === "" && board[middleRow][columnTo-1] === "1") {
            let moveFromID = ((rowFrom-1)*8)+columnFrom+1;
            let middleID = ((rowFrom)*8)+columnFrom+2;
            let moveToID = ((rowTo-1)*8)+columnTo+1;
            squares[`$box${moveFromID}`].css({backgroundColor: "#2B7A78"});
            pieces[`$piece${moveFromID}`].removeAttr("class", "whitePiece");
            pieces[`$piece${moveToID}`].attr("class", "whitePiece");
            pieces[`$piece${middleID}`].removeAttr("class", "redPiece");
            totalHighlighted = 0;
            board[changeRowFrom][columnFrom] = "";
            board[middleRow][columnFrom+1] = "";
            board[changeRowTo][columnTo] = "0";
            totalRedPieces -=1;
            if (rowTo <= 6) {
              let nextRow = `row${rowTo+1}`;
              let nextRow2 = `row${rowTo+2}`;
              if (board[nextRow][columnTo+1] === "1" && board[nextRow2][columnTo+2] === "") {
                window.setTimeout( function() {
                   moveTo(changeRowTo, columnTo, nextRow2, columnTo+2, 0); }, 500 );
                   return;
              }
              if (board[nextRow][columnTo-1] === "1" && board[nextRow2][columnTo-2] === "") {
                window.setTimeout( function() {
                  moveTo(changeRowTo, columnTo, nextRow2, columnTo-2, 0); }, 500 );
                  return;
              }
            }
            turn = 1;
            changeTurn();
            return;
          }
        }
      }
    }
    else if (turnLocal === 1) {
      //Single Move
      if (rowFrom === rowTo+1) {
        if (columnFrom >= 1 && columnFrom <= 7) {
          if (columnFrom === columnTo+1 && board[changeRowTo][columnTo] === "") {
            //Setting square IDs for the move from and move to
            let moveFromID = ((rowFrom-1)*8)+columnFrom+1;
            let moveToID = ((rowTo-1)*8)+columnTo+1;
            squares[`$box${moveFromID}`].css({backgroundColor: "#2B7A78"});
            pieces[`$piece${moveFromID}`].removeAttr("class", "redPiece");
            pieces[`$piece${moveToID}`].attr("class", "redPiece");
            totalHighlighted = 0;
            board[changeRowFrom][columnFrom] = "";
            board[changeRowTo][columnTo] = "1";
            turn = 0;
            changeTurn();
            return;
          }
        }
        if (columnFrom >= 0 && columnFrom <= 6) {
          if (columnFrom === columnTo-1 && board[changeRowTo][columnTo] === "") {
            //Setting square IDs for the move from and move to
            let moveFromID = ((rowFrom-1)*8)+columnFrom+1;
            let moveToID = ((rowTo-1)*8)+columnTo+1;
            squares[`$box${moveFromID}`].css({backgroundColor: "#2B7A78"});
            pieces[`$piece${moveFromID}`].removeAttr("class", "redPiece");
            pieces[`$piece${moveToID}`].attr("class", "redPiece");
            totalHighlighted = 0;
            board[changeRowFrom][columnFrom] = "";
            board[changeRowTo][columnTo] = "1";
            turn = 0;
            changeTurn();
            return;
          }
        }
      }
      //Jump move
      if (rowFrom === rowTo+2) {
        let middleRow = `row${rowTo+1}`;
        if (columnFrom >= 2 && columnFrom <= 7) {
          // console.log(middleRowTo);
          // console.log(columnFrom, columnTo+2,"|", board[changeRowTo][columnTo], board[changeRowTo-1][columnTo+1]);
          // console.log(columnFrom, columnTo+2);
          // console.log(board[changeRowTo][columnTo]);
          if (columnFrom === columnTo+2 && board[changeRowTo][columnTo] === "" && board[middleRow][columnTo+1] === "0") {
            let moveFromID = ((rowFrom-1)*8)+columnFrom+1;
            let middleID = ((rowFrom-2)*8)+columnFrom;
            console.log(middleID);
            let moveToID = ((rowTo-1)*8)+columnTo+1;
            squares[`$box${moveFromID}`].css({backgroundColor: "#2B7A78"});
            pieces[`$piece${moveFromID}`].removeAttr("class", "redPiece");
            pieces[`$piece${moveToID}`].attr("class", "redPiece");
            pieces[`$piece${middleID}`].removeAttr("class", "whitePiece");
            totalHighlighted = 0;
            board[changeRowFrom][columnFrom] = "";
            board[middleRow][columnFrom-1] = "";
            board[changeRowTo][columnTo] = "1";
            totalWhitePieces -= 1;
            if (rowTo >= 3) {
              let nextRow = `row${rowTo-1}`;
              let nextRow2 = `row${rowTo-2}`;
              if (board[nextRow][columnTo+1] === "0" && board[nextRow2][columnTo+2] === "") {
                window.setTimeout( function() {
                  moveTo(changeRowTo, columnTo, nextRow2, columnTo+2, 1); }, 500 );
                  return;
              }
              if (board[nextRow][columnTo-1] === "0" && board[nextRow2][columnTo-2] === "") {
                window.setTimeout( function() {
                  moveTo(changeRowTo, columnTo, nextRow2, columnTo-2, 1); }, 500 );
                  return;
              }
            }
            turn = 0;
            changeTurn();
            return;
          }
        }
        if (columnFrom >= 0 && columnFrom <= 5) {
          console.log(board[changeRowTo][columnTo]);
          if (columnFrom === columnTo-2 && board[changeRowTo][columnTo] === "" && board[middleRow][columnTo-1] === "0") {
            let moveFromID = ((rowFrom-1)*8)+columnFrom+1;
            let middleID = ((rowFrom-2)*8)+columnFrom+2;
            console.log(middleID);
            let moveToID = ((rowTo-1)*8)+columnTo+1;
            squares[`$box${moveFromID}`].css({backgroundColor: "#2B7A78"});
            pieces[`$piece${moveFromID}`].removeAttr("class", "redPiece");
            pieces[`$piece${moveToID}`].attr("class", "redPiece");
            pieces[`$piece${middleID}`].removeAttr("class", "whitePiece");
            totalHighlighted = 0;
            board[changeRowFrom][columnFrom] = "";
            board[middleRow][columnFrom+1] = "";
            board[changeRowTo][columnTo] = "1";
            totalWhitePieces -= 1;
            if (rowTo >= 3) {
              let nextRow = `row${rowTo-1}`;
              let nextRow2 = `row${rowTo-2}`;
              if (board[nextRow][columnTo+1] === "0" && board[nextRow2][columnTo+2] === "") {
                window.setTimeout( function() {
                  moveTo(changeRowTo, columnTo, nextRow2, columnTo+2, 1); }, 500 );
                  return;
              }
              if (board[nextRow][columnTo-1] === "0" && board[nextRow2][columnTo-2] === "") {
                window.setTimeout( function() {
                  moveTo(changeRowTo, columnTo, nextRow2, columnTo-2, 1); }, 500 );
                  return;
              }
            }
            turn = 0;
            changeTurn();
            return;
          }
        }
      }
    }
  }
  const gameStart = function () {
    totalRedPieces = 12;
    totalWhitePieces = 12;
    board.row1 = ["", "0", "", "0", "", "0", "", "0"];
    board.row2 = ["0", "", "0", "", "0", "", "0", ""];
    board.row3 = ["", "0", "", "0", "", "0", "", "0"];
    board.row6 = ["1", "", "1", "", "1", "", "1", ""];
    board.row7 = ["", "1", "", "1", "", "1", "", "1"];
    board.row8 = ["1", "", "1", "", "1", "", "1", ""];
    for (let i = 1; i <= 64; i++) {
      piece = $(`<div id="piece${i}">`);
      squares[`$box${i}`].append(piece);
      pieces[`$piece${i}`] = eval(`$('#piece${i}')`);
    }
    for (let i = 2; i <= 24; i+=2) {
      pieces[`$piece${i}`].attr("class", "whitePiece");
      if (i === 8) {
        i = 7;
      }
      if (i === 15) {
        i = 16;
      }
    }
    for (let i = 41; i <=64; i+=2) {
      pieces[`$piece${i}`].attr("class", "redPiece");
      if (i === 47) {
        i = 48;
      }
      if (i === 56) {
        i = 55;
      }
    }
    picking = true;
  }
  const $currentTurn = $('.currentTurn');
  let toggle = 0;
  const changeTurn = function () {
    let showReds = 12-totalRedPieces;
    if (toggle === 1) {
      redOut.$piece1.text(`${Math.abs(totalRedPieces-12)}`);
      whiteOut.$piece1.text(`${Math.abs(totalWhitePieces-12)}`);
    }
    for (let i = 1; i <= showReds; i++) {
      redOut[`$piece${i}`].css({visibility: "visible"});
    }
    let showWhites = 12-totalWhitePieces;
    for (let i = 1; i <= showWhites; i++) {
      whiteOut[`$piece${i}`].css({visibility: "visible"});
    }
    if (totalRedPieces === 0) {
      console.log("White Wins!");
    } else if (totalWhitePieces === 0) {
      console.log("Red Wins!");
    }
    if (turn === 1) {
      $currentTurn.css({backgroundColor: "red"});
    } else {
      $currentTurn.css({backgroundColor: "white"});
    }
  }
  const $toggleButton = $('.toggle');
  let wigout = 0;
  let counter = 0;
  $toggleButton.on("click", function() {
    if (wigout === 0) {
      counter = 0;
      wigout = 1;
    } else if (wigout === 1 && toggle === 1) {
      counter = 2;
    } else {
      counter = 0;
    }
    console.log(counter);
    console.log("HELLO");
    for (j = 0; j <= counter; j++) {
      if (toggle === 0) {
        for (i = 2; i < 13; i++) {
          redOut[`$piece${i}`].css({visibility: "hidden"});
          whiteOut[`$piece${i}`].css({visibility: "hidden"});
        }
        $currentTurn.css({width: "60px", height: "60px", border: "1px solid black", top: "-762px", left: "-166px"});
        redOut.$piece1.text(`${Math.abs(totalRedPieces-12)}`).css({top: "-460px", visibility: "visible"});
        whiteOut.$piece1.text(`${Math.abs(totalWhitePieces-12)}`).css({left: "625px", top: "-229px", visibility: "visible"});
        $toggleButton.css({marginTop: "-9.7%"});
        toggle = 1;
      }
      else {
        $currentTurn.css({width: "200px", height: "200px", border: "2px solid black", top: "-685px", left: "-1000px"});
        redOut.$piece1.html("&nbsp;").css({top: "-534px", visibility: "hidden"});
        whiteOut.$piece1.html("&nbsp;").css({left: "626px", top: "-304px", visibility: "hidden"});
        whiteOut.$piece1.toggle();
        $toggleButton.css({marginTop: "-9.7%"});
        for (i = 1; i <= 12-totalWhitePieces; i++) {
          whiteOut[`$piece${i}`].css({visibility: "visible"});
        }
        for (i = 1; i <= 12-totalRedPieces; i++) {
          redOut[`$piece${i}`].css({visibility: "visible"});
        }
        toggle = 0;
      }
    }
  });
  gameStart();
});
