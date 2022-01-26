import promptSync from 'prompt-sync';
const prompt = promptSync();
import chalk from 'chalk';

import { exec } from 'child_process';
import { fetchMangaByTitle } from './fetch-manga-by-title.js';

export function read() {
    if (prompt('Read? (y/n) ') == 'y') {
        console.log('Use arrow keys or scroll wheel to change pages.')
        exec('feh -.n src/manga');
    }
}

// Planned to use for searching persistently downloaded manga
export function searchInput(res) {
    while (true) {
        let user_input = prompt(chalk.red('search (help) > '));
        if (user_input == 'help') {
            console.log(chalk.blue.underline('help') + '         - brings up this text');
            console.log(chalk.yellow('read [num]') + '   - read selected manga');
            console.log(chalk.yellow('desc [num]') + '   - read the description of the selected manga');
            console.log(chalk.yellow('next, n') + '      - next page');
            console.log(chalk.yellow('quit') + '         - quits the program');
        } else if (user_input.includes("read")) {
            let arg = user_input.split(" ");
            fetchMangaByTitle(res[arg[1]].title);
            return true;
        } else if (user_input.includes("desc")) {
            let arg = user_input.split(" ");
            console.log(wrap(res[arg[1]].localizedDescription.localString.toString()));
            continue;
        } else if (user_input == 'next' || user_input == 'n') {
            break;
        } else if (user_input == 'quit') {
            process.exit();
        } else {
            console.log('Unknown command (refer to help)')
        }
    }
}

// thanks https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
function wrap(s) {
    return s.replace(/(?![^\n]{1,70}$)([^\n]{1,70})\s/g, '$1\n');
}
