let LETTERS = 'abcdefghijklmnopqrstuvwxyz';

document.addEventListener("DOMContentLoaded", () => {
    // This is used later in the application.
    var wordsearch = document.getElementById("wordsearch");

    InitializeWordsearch();
});


function InitializeWordsearch() {
    CreateEmptyWordsearch();
    SelectWords(3);
    PlaceWords();
    FillInOpenSpots();
}

function CreateLetter(row, col) {
    //Create letter block
    let letterWrapper = document.createElement("div");
    letterWrapper.setAttribute("id", `${row}-${col}`);
    letterWrapper.setAttribute("class", "letter-wrapper");
    letterWrapper.addEventListener("mousedown", CreateHighlight);
    letterWrapper.addEventListener("mouseover", UpdateHighlight);
    wordsearch.appendChild(letterWrapper);
    document.addEventListener("mouseup", CheckHighlight);
    
    //Create letter flexbox
    let letterFlex = document.createElement("div");
    letterFlex.setAttribute("class", "letter-flex");
    letterWrapper.appendChild(letterFlex);

    //Create letter
    let letter = document.createElement("p");
    letter.setAttribute("id", `p${row}-${col}`)
    letter.setAttribute("class", "letter");
    letterFlex.appendChild(letter);
}

function CreateBreakpoint() {
    wordsearch.appendChild(document.createElement("br"));
}

function GetRandomLetter() {
    return LETTERS.charAt(RNG(0, LETTERS.length))
}

function GetLetter(row, col) {
    let letter = document.getElementById(`p${row}-${col}`);
    if (letter == null) {
        return "";
    }
    return letter.innerHTML;
}

function SetLetter(row, col, letter) {
    let element = document.getElementById(`p${row}-${col}`);
    if (element != null) {
        element.innerHTML = letter;
    }
}

function CreateEmptyWordsearch() {
    for (let i = 0; i < WORDSEARCH_HEIGHT; i++) {
        for (let j = 0; j < WORDSEARCH_WIDTH; j++) {
            CreateLetter(i,j);
        }
        CreateBreakpoint();
    }
}

function SelectWords(numWords) {
    for (let i = 0; i < numWords; i++) {
        // Select a word
        let index = RNG(0, ALL_WORDS.length);
        let word = ALL_WORDS[index];

        // Remove the word from the list of ALL_WORDS
        ALL_WORDS.splice(index, 1);

        // Initialize and add this word to SELECTED_WORDS
        SELECTED_WORDS[word] = {
            "start": "",
            "end": "",
            "found": false
        }
    }
}

function PlaceWords() {
    for (const key in SELECTED_WORDS) {
        const value = SELECTED_WORDS[key];

        let startRow;
        let startCol;
        let direction;

        let canBePlaced = false;

        // Find a spot to place the word
        while(!canBePlaced) {
            canBePlaced = true;

            // Choose a starting point and direction
            startRow = RNG(0, WORDSEARCH_HEIGHT);
            startCol = RNG(0, WORDSEARCH_WIDTH);
            direction = DIRECTIONS[RNG(0, DIRECTIONS.length)];

            // Check if we can place it
            for (let i = 0; i < key.length; i++) {
                let currRow = startRow + i * direction.row;
                let currCol = startCol + i * direction.col;

                // Check if OOB.
                if (currRow < 0 || currRow >= WORDSEARCH_HEIGHT || currCol < 0 || currCol >= WORDSEARCH_WIDTH) {
                    canBePlaced = false;
                    break;
                }

                let currLetter = key.charAt(i);
                let letterAtSpot = GetLetter(currRow, currCol);

                // Check if a different letter already exists in this spot.
                if (letterAtSpot != "" && letterAtSpot != currLetter) {
                    canBePlaced = false;
                    break;
                }
            }
        }

        // Place the word
        for (let i = 0; i < key.length; i++) {
            let currRow = startRow + i * direction.row;
            let currCol = startCol + i * direction.col;
            document.getElementById(`p${currRow}-${currCol}`).innerHTML = key.charAt(i);
        }

        // Update the SELECTED_WORDS dict
        SELECTED_WORDS[key] = {
            start: `${startRow}-${startCol}`,
            end: `${startRow + (key.length - 1) * direction.row}-${startCol + (key.length - 1) * direction.col}`,
            found: false
        };
    }
}

function FillInOpenSpots() {
    for (let i = 0; i < WORDSEARCH_HEIGHT; i++) {
        for (let j = 0; j < WORDSEARCH_WIDTH; j++) {
            if (GetLetter(i,j) == "") {
                SetLetter(i, j, GetRandomLetter());
            }
        }
    }
}