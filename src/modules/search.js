// Mangadex api
import { Manga, login } from 'mangadex-full-api';

// Terminal formatting imports
import chalk from 'chalk';

// User input imports, probably not the best module to use
import promptSync from 'prompt-sync';
const prompt = promptSync();

// Internal module imports
import { searchInput } from './basic-functions.js';
import options from '../options.json' // assert { type: 'json' }; node 17.x

export async function search() {
    login(options.username, options.password).then(() => {
        Manga.search({
            title: prompt("Manga Search: "),
            limit: Infinity
        }).then(results => {
            console.log(chalk.yellow(results.length) + ` result(s): \n`);
            
            let language = options.language;

            let i;
            let page_counter = 1;
            let entries_per_page = 10;
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

                // Make content rating red if erotica or pornographic
                if (results[i].contentRating == 'erotica' || results[i].contentRating == 'pornographic' || results[i].contentRating == 'suggestive') {
                    console.log(chalk.red(results[i].contentRating.charAt(0).toUpperCase() + results[i].contentRating.slice(1)));
                }
                // Get tags
                for (let j = 0; j < results[i].tags.length; j++) {
                    if (j+1 == results[i].tags.length) {
                        process.stdout.write(results[i].tags[j].localizedName.localString + `\n`);
                    } else {
                        process.stdout.write(results[i].tags[j].localizedName.localString + ', ');
                    }
                }
                
                // Display Entries
                // i + 1 % 10 == 0; every 10 iterations
                if ((i+1) % entries_per_page == 0) {
                    console.log(`\nPage ` + chalk.yellow(page_counter) + ' of ' + chalk.yellow(Math.ceil(results.length/entries_per_page)));
                    page_counter++
                    if (page_counter == results.length/entries_per_page) {
                        continue;
                    }
                    if (searchInput(results) == true) {
                        return;
                    }
                }

                // An attempt at fixing the 'no input' bug when at last
                // page/searched for something with fewer than 10 entries
                // TODO: deal with this
                if (i < results.length) {
                    continue;
                } else if (i == results.length) {
                    console.log(`\nPage ` + chalk.yellow(page_counter) + ' of ' + chalk.yellow(Math.ceil(results.length/entries_per_page)));
                    page_counter++
                    searchInput(results);
                }
            }
        }).catch(console.error);
    }).catch(console.error);
}
