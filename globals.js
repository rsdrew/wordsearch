var WORDSEARCH_HEIGHT = 10;
var WORDSEARCH_WIDTH = 10;

const ALL_WORDS = ['ryan', 'kayla', 'matt', 'hannah', 'julie', 'dennis'];

// Dictionary
// Key: Word
// Value: Dictionary with 
//          Key: start  Value: startSpace
//          Key: end    Value: endSpace
//          Key: found  Value: true if word has been found
var SELECTED_WORDS = {};

const DIRECTIONS = [
    { row: 1, col: 0 },     // Down
    { row: -1, col: 0 },    // Up
    { row: 0, col: 1 },     // Right
    { row: 0, col: -1 },    // Left
    { row: 1, col: 1 },     // Diagonal down-right
    { row: -1, col: -1 },   // Diagonal up-left
    { row: 1, col: -1 },    // Diagonal down-left
    { row: -1, col: 1 }     // Diagonal up-right
  ];

const DIRECTIONS_ENUM = {
  Down: 0,
  Up: 1,
  Right: 2,
  Left: 3,
  DownRight: 4,
  UpLeft: 5,
  DownLeft: 6,
  UpRight: 7,
  None: 8
}

function RNG(min, max) {
    return Math.floor(Math.random() * max) + min;
}