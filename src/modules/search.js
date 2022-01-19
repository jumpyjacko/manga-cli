// Mangadex api
import { Manga, login } from 'mangadex-full-api';

// Terminal formatting imports
import chalk from 'chalk';

// User input imports, probably not the best module to use
import promptSync from 'prompt-sync';
const prompt = promptSync();

// Internal module imports
import { fetchMangaByTitle } from './fetch-manga-by-title.js';
import options from '../options.json' assert { type: 'json' };

let running = true;

export async function search() {
    // thanks https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
    const wrap = (s) => s.replace(
        /(?![^\n]{1,70}$)([^\n]{1,70})\s/g, '$1\n'
    );

    login(options.username, options.password).then(() => {
        Manga.search({
            title: prompt("Manga Search: "),
            limit: Infinity
        }).then(results => {
            console.log(chalk.yellow(results.length) + ` result(s): \n`);
            
            // Determines language to use for titles and descriptions
            // if they exist, defaults to whatever the first in the arrray is
            console.log(chalk.gray('If a localised version does not exist, it defaults to english.'))
            let language = prompt('Pick a language (two or four letter code): ');

            let i;
            let page_counter = 1;
            for (i = 0; i < results.length; i++) {
                let localizedTitle = results[i].localizedTitle;
                let title_language;
                
                // There has to be a better way to do this check
                // Its this bad bceause I want it to work individually per
                // element, for exmaple:
                //    if the title had a chinese localised title, but
                //    the description had no localised version, it would
                //    display a chinese title, and display an english title
                if (localizedTitle.availableLocales.length > 1) {
                    for (let k = 0; k < localizedTitle.availableLocales.length; k++) {
                        if (language == localizedTitle.availableLocales[k]) {
                            title_language = localizedTitle.availableLocales[k];
                        }
                    }
                    console.log(`\n${i}. ` + chalk.yellow(localizedTitle[title_language]));
                } else {
                    console.log(`\n${i}. ` + chalk.yellow(results[i].title));
                }
                
                // Pages
                if ((i+1) % 10 == 0) {
                    console.log(`\nPage ` + chalk.yellow(page_counter) + ' of ' + chalk.yellow(Math.floor(results.length/2)));
                    page_counter++
                    if (page_counter == results.length/10) {
                        break;
                    }
                    while (running) {
                        let user_input = prompt(chalk.red('search (help) > '));
                        if (user_input == 'help') {
                            console.log(chalk.blue.underline('help') + '         - brings up this text');
                            console.log(chalk.yellow('read [num]') + '   - read selected manga');
                            console.log(chalk.yellow('desc [num]') + '   - read the description of the selected manga');
                            console.log(chalk.yellow('next, n') + '      - next page');
                            console.log(chalk.yellow('quit, ^C') + '     - quits the program');
                        } else if (user_input.includes("read")) {
                            let arg = user_input.split(" ");
                            fetchMangaByTitle(results[arg[1]].title);
                            return;
                        } else if (user_input.includes("desc")) {
                            let arg = user_input.split(" ");
                            console.log(wrap(results[arg[1]].localizedDescription.localString))
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
            }
        }).catch(console.error);
    }).catch(console.error);
}
