// main.js
import { changeBackgroundColor } from './colorChanger.js';
import { updateText } from './textUpdater.js';
import { toggleBox } from './toggleBox.js';

document.getElementById('btnColor').addEventListener('click', changeBackgroundColor);
document.getElementById('btnText').addEventListener('click', updateText);
document.getElementById('btnBox').addEventListener('click', toggleBox);
