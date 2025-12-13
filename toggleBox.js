// toggleBox.js
export function toggleBox() {
    const box = document.getElementById('box');
    box.style.display = box.style.display === 'none' || box.style.display === '' ? 'block' : 'none';
}
