import prompts from './prompts.js';

const promptElement = document.getElementById('prompt');

const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
const dailyPrompt = prompts[dayOfYear % prompts.length];

promptElement.textContent = dailyPrompt;
