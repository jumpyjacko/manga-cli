import { Manga, login } from 'mangadex-full-api';
import { exec } from 'child_process';

import promptSync from 'prompt-sync';
const prompt = promptSync();

import cliProgress from 'cli-progress';
const bar = new cliProgress.SingleBar({
    format: chalk.yellow('Fetching Pages') +  ' | [{bar}] | {percentage}% | {value}/{total} Pages',
    barCompleteChar: '=',
    barIncompleteChar: ' ',
    hideCursor: true
});

import chalk from 'chalk';

import options from '../options.json' assert { type: 'json' };
import { read } from './basic-functions.js';

export async function fetchMangaByTitle() {
    let manga_title = prompt(`Manga Title: `);

    login(options.username, options.password).then(async () => {
        let manga = await Manga.getByQuery(manga_title);

        // To pick a language to use, change "language" in options.json to the
        // two(or four)-letter language code, like from this list https://www.andiamo.co.uk/resources/iso-language-codes/
        let chapters = await manga.getFeed({ translatedLanguage: [options.language] }, true);
        
        console.log(`Fetching from ` + chalk.yellow.underline(manga.title) + `...`)

        // Sorts the chapter list
        let chapter_numbers = [];
        for (let i = 0; i < Object.keys(chapters).length; i++) {
            chapter_numbers.push(chapters[i].chapter)
        }
        let sorted = chapter_numbers.sort((a, b) => {
            return a - b;
        });
       
        // Display the chapter list, if wanted
        // TODO: make this display nicer, i.e. not in an array, but still a grid.
        if (prompt(`List Chapters? (y/n) `) == 'y') {
            console.log(sorted);
        }

        let manga_chapter = prompt(`Chapter Number: `);
     
        let chapter;
        for (let j = 0; j < sorted.length; j++) {
            if (chapters[j].chapter == manga_chapter) {
                chapter = chapters[j]
            } else {
                continue;
            }
        }

        let pages = await chapter.getReadablePages();
        
        // TODO: find a better way to do this,
        // because its a function just so that these run syncronously
        function download_pages() {
            exec('find -type f -name \'*page*\' -delete') // Clears the previously downloaded manga
            bar.start(pages.length, 0);
            let k;
            let counter = 0;
            for (k = 0; k < pages.length; k++) {
                let id = '.';
                let l;
                for (l = 1; l < k; l++) {
                    id = id + ".";
                }
                
                // Fetches the individual pages, should I use wget?
                exec(`curl -o ./src/manga/page-${id}.png ${pages[k]}`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(error);
                    } else if (stderr) {
                        bar.increment();
                        counter++;
                        if (counter == pages.length) {
                            bar.stop();
                            read();
                        }
                    } else {
                        console.log(stdout);
                    }
                });
            }
        }
        
        // Confirmation to check if it fetched the right manga
        if (prompt(`Fetching from ` + chalk.yellow.underline(manga.title) + ` at Chapter ` + chalk.yellow.underline(chapter.chapter) + `. Is this correct? (y/n) `) == 'y') {
            download_pages();
        } else {
            console.log('Fetch aborted.')
        }
    })
}
