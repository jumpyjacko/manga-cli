import { Manga, login } from 'mangadex-full-api';
import { exec, spawnSync } from 'child_process';

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
import { run } from '../index.js';

export async function fetchMangaByTitle() {
    let manga_title = prompt(`Manga Title: `);

    login(options.username, options.password).then(async () => {
        let manga = await Manga.getByQuery(manga_title);
        let chapters = await manga.getFeed({ translatedLanguage: ['en'] }, true);
        
        console.log(`Fetching from ` + chalk.yellow.underline(manga.title) + `...`)

        let check_chapters = prompt(`List Chapters? (y/n) `);


        let chapter_numbers = [];
        for (let i = 0; i < Object.keys(chapters).length; i++) {
            chapter_numbers.push(chapters[i].chapter)
        }
        let sorted = chapter_numbers.sort((a, b) => {
            return a - b;
        });
        
        if (check_chapters == 'y') {
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
        
        function read() {
            let read_check = prompt('Read? (y/n) ');
            
            if (read_check == 'y') {
                exec('feh -.n src/manga');
                run(false);
            }
        }

        function download_pages() {
            exec('find -type f -name \'*page*\' -delete')
            bar.start(pages.length, 0);
            let k;
            let counter = 0;
            for (k = 0; k < pages.length; k++) {
                let id = '.';
                let l;
                for (l = 1; l < k; l++) {
                    id = id + ".";
                }
                
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
        let check = prompt(`Fetching from ` + chalk.yellow.underline(manga.title) + ` at Chapter ` + chalk.yellow.underline(chapter.chapter) + `. Is this correct? (y/n) `)
        
        if (check == 'y') {
            download_pages();
        } else {
            console.log('Fetch aborted.')
        }
    })
}
