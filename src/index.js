#!/usr/bin/env node

// Terminal formatting imports
import chalk from 'chalk';
import figlet from 'figlet';

// User input imports, probably not the best module to use
import promptSync from 'prompt-sync';
const prompt = promptSync();

// Internal module imports
import { fetchMangaByTitle } from './modules/fetch-manga-by-title.js';

let running = true;
export var first = true;

const init = () => {
    console.log(chalk.yellow(
        figlet.textSync('manga - cli', {
            font: 'Big',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        })
    ));
    console.log(chalk.grey(`\nA MangaDex client (if I finish this project) from the comfort of your terminal!\n`));
    console.log(chalk.grey(`Currently does not support MangaPlus, it is noted that\nthe program will crash when querying MangaPlus manga.\n`))
    console.log(chalk.grey(`Only works if you know exactly what you want to read\nbecause there is no search function.\n`));
    console.log(chalk.grey(`Type \'help\' to bring up the list of commands.\n`));
}

const input = () => {
    let user_input = prompt(chalk.red("> "));
    switch(user_input) {
        case 'help':
            console.log(chalk.blue.underline('help') + '         - brings up this text');
            console.log(chalk.yellow.underline('fetchByTitle') + ' - fetches manga pages/chapters by title');
            console.log(chalk.yellow.underline('search') + '       - searches for manga and pulls up descriptions, tags etc. (coming soon)');
            console.log(chalk.yellow.underline('quit, ^C') + '     - quits the program');
            break;
        case 'fetchByTitle':
            // TODO: find a way for this function (and subsequent functions) to drop back into the while loop
            fetchMangaByTitle();
        case 'quit':
            running = false;
            break; 
        case '^C':
            running = false;
            break; 
        default:
            console.log('Unknown command (refer to help)')
    }
}

export const run = async () => {
    // CLI introduction
    init();
    
    // TODO: make a first time setup which generates an options.json

    // Starts user input
    while (running) {
        input();
    }
}

run('true');
