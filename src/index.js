#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';

import { fetchMangaByTitle } from './manga-fetch.js';

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
    console.log(chalk.grey(`Only works if you know exactly what you want to read\nbecause there is no search function.`));
}

const run = async () => {
    // CLI introduction
    init();
    fetchMangaByTitle();
}

run();
