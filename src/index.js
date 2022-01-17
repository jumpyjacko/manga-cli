#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';

import promptSync from 'prompt-sync';
const prompt = promptSync();

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
    console.log(chalk.grey(`\nA MangaDex client from the comfort of your terminal!\n`));
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
            console.log(chalk.yellow.underline('search') + '       - searches for manga and pulls up descriptions, tags etc.');
            console.log(chalk.yellow.underline('quit, ^C') + '     - quits the program');
            break;
        case 'fetchByTitle':
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

export const run = async (first_run) => {
    // CLI introduction
    if (first_run == 'true') {
        init();
    }

    // Starts user input
    while (running) {
        input();
    }
}

run('true');
