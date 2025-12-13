// textUpdater.js
export function updateText() {
    const textElement = document.getElementById('text');
    const messages = ["Hello World!", "Modular JS!", "Import Works!", "CDN Magic!", "JS is Fun!"];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    textElement.textContent = randomMsg;
}
