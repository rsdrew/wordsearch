document.addEventListener("DOMContentLoaded", () => {
    CreateWordList();
});

function CreateWordList() {
    let wordlist = document.getElementById("wordlist");

    for (const key in SELECTED_WORDS) {
        let word = document.createElement("li");
        word.innerHTML = key;
        word.setAttribute("id", key);
        word.setAttribute("class", "wordlist-word");
        wordlist.appendChild(word);
    }
}