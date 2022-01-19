#!/usr/bin/env node

// Terminal formatting imports
import chalk from 'chalk';
import figlet from 'figlet';

// User input imports, probably not the best module to use
import promptSync from 'prompt-sync';
const prompt = promptSync();

// Internal module imports
import { fetchMangaByTitle } from './modules/fetch-manga-by-title.js';
import { search } from './modules/search.js';

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
    console.log(chalk.grey(`The program will crash when querying external manga. MangaPlus \n`))
    console.log(chalk.grey(`Only works if you know exactly what you want to read\nbecause there is no search function.\n`));
    console.log(chalk.grey(`Type \'help\' to bring up the list of commands.\n`));
}

const input = () => {
    let user_input = prompt(chalk.red("> "));
    if (user_input == 'help') {
            console.log(chalk.blue.underline('help') + '         - brings up this text');
            console.log(chalk.yellow('fetchByTitle') + ' - fetches manga pages/chapters by title');
            console.log(chalk.yellow('search') + '       - searches for manga and pulls up descriptions, tags etc.');
            console.log(chalk.yellow('quit') + '         - quits the program');
    } else if (user_input == 'fetchByTitle') {
        running = false;
        // TODO: find a way for this function (and subsequent functions) to drop back into the while loop
        let title = prompt(`Manga Title: `);
        fetchMangaByTitle(title);
    } else if (user_input == 'search') {
        running = false;
        search();
    } else if (user_input == 'quit') {
        process.exit();
    } else {
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

run();
