var letters = 'abcdefghijklmnopqrstuvwxyz';
var highlightStart = '';
var highlightEnd = '';
var boxWidth = 46;
var highlightBorder = 12;
let defaultHeightAndWidth = `${boxWidth - highlightBorder}px`;

document.addEventListener("DOMContentLoaded", () => {
    // This is used later in the application.
    var wordsearch = document.getElementById("wordsearch");

    InitializeWordsearch();
});


function InitializeWordsearch() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            CreateLetter(i,j);
        }
        CreateBreakpoint();
    }
}

function CreateLetter(row, col) {
    //Create letter block
    let letterWrapper = document.createElement("div");
    letterWrapper.setAttribute("id", `${row}-${col}`);
    letterWrapper.setAttribute("class", "letter-wrapper");
    letterWrapper.addEventListener("mousedown", CreateHighlight);
    document.addEventListener("mouseup", RemoveHighlight);
    letterWrapper.addEventListener("mouseover", UpdateHighlight);
    wordsearch.appendChild(letterWrapper);
    
    //Create letter flexbox
    let letterFlex = document.createElement("div");
    letterFlex.setAttribute("class", "letter-flex");
    letterWrapper.appendChild(letterFlex);

    //Create letter
    let letter = document.createElement("p");
    letter.setAttribute("class", "letter");
    letter.innerHTML = GetRandomLetter();
    letterFlex.appendChild(letter);
}

function CreateBreakpoint() {
    wordsearch.appendChild(document.createElement("br"));
}

function GetRandomLetter() {
    return letters.charAt(Math.floor(Math.random() * letters.length));
}

//Attempts to create a new highlight if one doesn't exist already.
function CreateHighlight(e) {
    if (document.getElementById('highlight') != null) {
        return;
    }

    let letterWrapper = e.target;
    highlightStart = letterWrapper.id;
    let highlight = document.createElement("div");
    highlight.setAttribute("id", "highlight");
    letterWrapper.appendChild(highlight);
}

//Deletes the highlight element.
function RemoveHighlight(e) {
    let highlight = document.getElementById('highlight');
    if (highlight) {highlight.remove();}
}

//Highlights the current letter, adding it to the highlight chain.
function UpdateHighlight(e) {
    //Check if the mouse is down and there is a highlight element.
    if (e.buttons !== 1 || document.getElementById('highlight') == null) {
        return;
    }

    let letterWrapper = e.target;
    highlightEnd = letterWrapper.id;
    ComputeHighlightSizeAndDirection();
}

function UnhighlightLetter(e) {
    document.getElementById("highlight").remove();
}

//Given the start and end point of the highlight, determine how large the highlight element should be.
function ComputeHighlightSizeAndDirection() {
    let startX = highlightStart.split("-")[0];
    let startY = highlightStart.split("-")[1];
    let endX = highlightEnd.split("-")[0];
    let endY = highlightEnd.split("-")[1];

    let highlight = document.getElementById('highlight');

    let width = ((Math.abs(endY - startY) + 1) * boxWidth) - highlightBorder;
    let height = ((Math.abs(endX - startX) + 1) * boxWidth) - highlightBorder;
    let widthPx = `${width}px`;
    let heightPx = `${height}px`;

    // Calculate the diff between height and width. If they're close, have the highlight be a diagonal.
    let max = Math.max(height, width);
    let min = Math.min(height, width);

    if (min > (max / 2) && (startX !== endX && startY !== endY)) {

        // maxIndexDiff is used to calculate the actual square where the highlight stops. If it's OOB, do not update the highlight.
        let maxIndexDiff = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));

        // Rotate the highlight depending on the direction of the end square
        // Down and Right
        if (endX > startX && endY > startY) {
            // Do not update if the End Square is OOB
            if (IsEndSquareOOB(startX, startY, endX, endY, maxIndexDiff)) {
                return;
            }

            UpdateHighlightWidthWhenDiagonal(height, width);
            highlight.style.rotate = "45deg";
        }
        // Down and Left
        else if (endX > startX && endY < startY) {
            // Do not update if the End Square is OOB
            if (IsEndSquareOOB(startX, startY, endX, endY, maxIndexDiff)) {
                return;
            }

            UpdateHighlightWidthWhenDiagonal(height, width);
            highlight.style.rotate = "135deg";
        }
        // Up And Left
        else if (endX < startX && endY < startY) {
            // Do not update if the End Square is OOB
            if (IsEndSquareOOB(startX, startY, endX, endY, maxIndexDiff)) {
                return;
            }

            UpdateHighlightWidthWhenDiagonal(height, width);
            highlight.style.rotate = "225deg";
        }
        // Up and Right
        else {
            // Do not update if the End Square is OOB
            if (IsEndSquareOOB(startX, startY, endX, endY, maxIndexDiff)) {
                return;
            }

            UpdateHighlightWidthWhenDiagonal(height, width);
            highlight.style.rotate = "315deg";
        }
    }
    // Highlight will be horizontal
    else if (width > height) {
        ResetHighlight();
        highlight.style.width = widthPx;

        // Rotate if going right to left
        if (endY < startY) {
            highlight.style.transformOrigin = "23px 50%";
            highlight.style.rotate = "180deg";
        }
    }
    // Highlight will be vertical
    else {
        ResetHighlight();
        highlight.style.height = heightPx;

        // Rotate if going down to up
        if (endX < startX)  {
            highlight.style.transformOrigin = "50% 23px";
            highlight.style.rotate = "180deg";
        }
    }
}

function UpdateHighlightWidthWhenDiagonal(height, width) {
    ResetHighlight();
    // Setup the width of the highlight
    let maxDim = Math.max(height, width);
    document.getElementById("highlight").style.width = `${Math.sqrt(maxDim**2 + maxDim**2)}px`;
}

function IsEndSquareOOB(startX, startY, endX, endY, maxIndexDiff) {
    startX = parseInt(startX);
    startY = parseInt(startY);
    endX = parseInt(endX);
    endY = parseInt(endY);

    let actualEndX = parseInt(startX) + maxIndexDiff;
    let actualEndY = parseInt(startY) + maxIndexDiff;

    // Down and Right
    if (endX > startX && endY > startY) {
        actualEndX = startX + maxIndexDiff;
        actualEndY = startY + maxIndexDiff;
    }
    // Down and Left
    else if (endX > startX && endY < startY) {
        actualEndX = startX + maxIndexDiff;
        actualEndY = startY - maxIndexDiff;
    }
    // Up And Left
    else if (endX < startX && endY < startY) {
        actualEndX = startX - maxIndexDiff;
        actualEndY = startY - maxIndexDiff;
    }
    // Up and Right
    else {
        actualEndX = startX - maxIndexDiff;
        actualEndY = startY + maxIndexDiff;
    }

    return (document.getElementById(`${actualEndX}-${actualEndY}`) == null);
}

function ResetHighlight() {
    let highlight = document.getElementById('highlight');
    highlight.style.width = defaultHeightAndWidth;
    highlight.style.height = defaultHeightAndWidth;
    highlight.style.transformOrigin = "23px 50%";
    highlight.style.rotate = "0deg";
}
  
function HasChildWithID(element, id) {
    return element.querySelector(`:scope > #${id}`) !== null;
}
  