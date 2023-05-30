let HIGHLIGHT_START = '';
let HIGHLIGHT_END = '';
let BOX_WIDTH = 46;
let HIGHLIGHT_BORDER = 12;
let DEFAULT_HEIGHT_AND_WIDTH = `${BOX_WIDTH - HIGHLIGHT_BORDER}px`;
let HIGHLIGHT_INDEX = 0;
let WORDSEARCH_COMPLETE = false;

//Attempts to create a new highlight if one doesn't exist already.
function CreateHighlight(e) {
    if (GetCurrentHighlight() != null || WORDSEARCH_COMPLETE) {
        return;
    }

    let letterWrapper = e.target;
    HIGHLIGHT_START = letterWrapper.id;
    let highlight = document.createElement("div");
    highlight.setAttribute("id", `highlight${HIGHLIGHT_INDEX}`);
    highlight.setAttribute("class", "highlight");
    letterWrapper.appendChild(highlight);
}

// Checks if the current highlighted area is a word
function CheckHighlight(e) {
    let found = false;

    for (const key in SELECTED_WORDS) {
        const value = SELECTED_WORDS[key];

        if (!value.found && (value.start == HIGHLIGHT_START && value.end == HIGHLIGHT_END) || (value.start == HIGHLIGHT_END && value.end == HIGHLIGHT_START)) {
            value.found = true;
            found = true;

            document.getElementById(key).classList.add("found");
            break;
        }
    }

    if (found) {
        HIGHLIGHT_INDEX++;
    }
    else {
        RemoveCurrentHighlight();
    }

    IsWordsearchComplete();

    if (WORDSEARCH_COMPLETE) {
        alert("YOU WIN!!!");
    }
}

// Update the variable "WORDSEARCH_COMPLETE"
function IsWordsearchComplete() {
    WORDSEARCH_COMPLETE = true;

    for (const key in SELECTED_WORDS) {
        const value = SELECTED_WORDS[key];

        if (!value.found) {
            WORDSEARCH_COMPLETE = false;
            break;
        }
    }

    return WORDSEARCH_COMPLETE;
}

//Deletes the highlight element.
function RemoveCurrentHighlight(e) {
    let highlight = GetCurrentHighlight();
    if (highlight) {highlight.remove();}
}

//Highlights the current letter, adding it to the highlight chain.
function UpdateHighlight(e) {
    //Check if the mouse is down and there is a highlight element.
    if (e.buttons !== 1 || GetCurrentHighlight() == null) {
        return;
    }

    let letterWrapper = e.target;
    HIGHLIGHT_END = letterWrapper.id;

    let startRow = parseInt(HIGHLIGHT_START.split("-")[0]);
    let startCol = parseInt(HIGHLIGHT_START.split("-")[1]);
    let endRow = parseInt(HIGHLIGHT_END.split("-")[0]);
    let endCol = parseInt(HIGHLIGHT_END.split("-")[1]);

    let highlight = GetCurrentHighlight();

    let width = ComputeWidth(startCol, endCol);
    let height = ComputeHeight(startRow, endRow);
    let widthPx = `${width}px`;
    let heightPx = `${height}px`;

    let direction = ComputeDirection(startRow, startCol, endRow, endCol);

    // Update width, height, direction, and calculate the actual end point of the highlight
    switch(direction) {
        case DIRECTIONS_ENUM.Down:
        case DIRECTIONS_ENUM.Up:
            ResetHighlight();
            highlight.style.height = heightPx;
            endCol = startCol;

            if (direction == DIRECTIONS_ENUM.Down) {
                endRow = startRow + ((height + HIGHLIGHT_BORDER) / BOX_WIDTH - 1);
            }
            else {
                endRow = startRow - ((height + HIGHLIGHT_BORDER) / BOX_WIDTH - 1);
                highlight.style.transformOrigin = "50% 23px";
                highlight.style.rotate = "180deg";
            }
            break;

        case DIRECTIONS_ENUM.Right:
        case DIRECTIONS_ENUM.Left:
            ResetHighlight();
            highlight.style.width = widthPx;
            endRow = startRow;

            if (direction == DIRECTIONS_ENUM.Right) {
                endCol = startCol + ((width + HIGHLIGHT_BORDER) / BOX_WIDTH - 1);
            }
            else {
                endCol = startCol - ((width + HIGHLIGHT_BORDER) / BOX_WIDTH - 1);
                highlight.style.transformOrigin = "23px 50%";
                highlight.style.rotate = "180deg";
            }
            break;

        case DIRECTIONS_ENUM.DownRight:
        case DIRECTIONS_ENUM.UpLeft:
        case DIRECTIONS_ENUM.DownLeft:
        case DIRECTIONS_ENUM.UpRight:
            // Do not update if the End Square is OOB
            if (IsEndSquareOOB(startRow, startCol, endRow, endCol)) {
                return;
            }

            ResetHighlight();

            let maxDim = Math.max(height, width);
            // How many indices the diagonal highlight will span
            let indicesTraveled = ((maxDim + HIGHLIGHT_BORDER) / BOX_WIDTH - 1);
            // Calculate the width of the diagonal highlight.
            highlight.style.width = `${Math.sqrt(maxDim**2 + maxDim**2)}px`;

            switch(direction) {
                case DIRECTIONS_ENUM.DownRight:
                    endRow = startRow + indicesTraveled;
                    endCol = startCol + indicesTraveled;
                    highlight.style.rotate = "45deg";
                    break;

                case DIRECTIONS_ENUM.UpLeft:
                    endRow = startRow - indicesTraveled;
                    endCol = startCol - indicesTraveled;
                    highlight.style.rotate = "225deg";
                    break;

                case DIRECTIONS_ENUM.DownLeft:
                    endRow = startRow + indicesTraveled;
                    endCol = startCol - indicesTraveled;
                    highlight.style.rotate = "135deg";
                    break;

                case DIRECTIONS_ENUM.UpRight:
                    endRow = startRow - indicesTraveled;
                    endCol = startCol + indicesTraveled;
                    highlight.style.rotate = "315deg";
            }
    }

    HIGHLIGHT_END = `${endRow}-${endCol}`;
    console.log("HIGHLIGHT_END = " + HIGHLIGHT_END);
}

// Only used when the highlight is diagonal.
function IsEndSquareOOB(startRow, startCol, endRow, endCol) {
    startRow = parseInt(startRow);
    startCol = parseInt(startCol);
    endRow = parseInt(endRow);
    endCol = parseInt(endCol);

    let maxIndexDiff = Math.max(Math.abs(endRow - startRow), Math.abs(endCol - startCol));

    let actualEndRow;
    let actualEndCol;

    // Down and Right
    if (endRow > startRow && endCol > startCol) {
        actualEndRow = startRow + maxIndexDiff;
        actualEndCol = startCol + maxIndexDiff;
    }
    // Down and Left
    else if (endRow > startRow && endCol < startCol) {
        actualEndRow = startRow + maxIndexDiff;
        actualEndCol = startCol - maxIndexDiff;
    }
    // Up And Left
    else if (endRow < startRow && endCol < startCol) {
        actualEndRow = startRow - maxIndexDiff;
        actualEndCol = startCol - maxIndexDiff;
    }
    // Up and Right
    else {
        actualEndRow = startRow - maxIndexDiff;
        actualEndCol = startCol + maxIndexDiff;
    }

    return (document.getElementById(`${actualEndRow}-${actualEndCol}`) == null);
}

// Find out what direction the highlight is facing
function ComputeDirection(startRow, startCol, endRow, endCol) {
    let width = ComputeWidth(startCol, endCol);
    let height = ComputeHeight(startRow, endRow);

    // Calculate the diff between height and width. If they're close, have the highlight be a diagonal.
    let max = Math.max(height, width);
    let min = Math.min(height, width);

    if (min > (max / 2) && (startRow !== endRow && startCol !== endCol)) {
        // Down and Right
        if (endRow > startRow && endCol > startCol) {
            return DIRECTIONS_ENUM.DownRight;
        }
        // Down and Left
        else if (endRow > startRow && endCol < startCol) {
            return DIRECTIONS_ENUM.DownLeft;
        }
        // Up And Left
        else if (endRow < startRow && endCol < startCol) {
            return DIRECTIONS_ENUM.UpLeft;
        }
        // Up and Right
        else {
            return DIRECTIONS_ENUM.UpRight;
        }
    }
    // Highlight will be horizontal
    else if (width > height) {
        // Left to Right
        if (startCol < endCol) {
            return DIRECTIONS_ENUM.Right;
        }
        // Right to Left. Rotate highlight.
        else {
            return DIRECTIONS_ENUM.Left;
        }
    }
    // Highlight will be vertical
    else if (height > width) {
        // Up to Down
        if (startRow < endRow) {
            return DIRECTIONS_ENUM.Down;
        }
        // Down to Up
        else {
            return DIRECTIONS_ENUM.Up;
        }
    }
    // Start and End points are the same
    else {
        return DIRECTIONS_ENUM.None;
    }
}

// Calculates the width from the start of the highlight to the mouse
function ComputeWidth(startCol, endCol) {
    return ((Math.abs(endCol - startCol) + 1) * BOX_WIDTH) - HIGHLIGHT_BORDER;
}

// Calculates the height from the start of the highlight to the mouse
function ComputeHeight(startRow, endRow) {
    return ((Math.abs(endRow - startRow) + 1) * BOX_WIDTH) - HIGHLIGHT_BORDER;
}

function ResetHighlight() {
    let highlight = GetCurrentHighlight();
    highlight.style.width = DEFAULT_HEIGHT_AND_WIDTH;
    highlight.style.height = DEFAULT_HEIGHT_AND_WIDTH;
    highlight.style.transformOrigin = "23px 50%";
    highlight.style.rotate = "0deg";
}

function GetCurrentHighlight() {
    return document.getElementById(`highlight${HIGHLIGHT_INDEX}`);
}