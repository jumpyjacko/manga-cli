const MFA = require('mangadex-full-api');
const exec = require('child_process').exec;

const prompt = require('prompt-sync')();

const options = require('./options.json');

let manga_title = prompt('Manga Title: ');

MFA.login(options.username, options.password).then(async () => {
    manga = await MFA.Manga.getByQuery(manga_title);
    chapters = await manga.getFeed({ translatedLanguage: ['en'] }, true);
    
    console.log(`Fetching from ${manga.title}...`)

    let check_chapters = prompt("List Chapters? (y/n) ");

    if (check_chapters == 'y') {
        let chapter_numbers = [];
        for (i = 0; i < Object.keys(chapters).length; i++) {
            chapter_numbers.push(chapters[i].chapter)
        }
        sorted = chapter_numbers.sort((a, b) => {
            return a - b;
        });
        console.log(sorted);
    }

    let manga_chapter = prompt('Chapter Number: ');
 
    for (i = 0; i < sorted.length; i++) {
        if (chapters[i].chapter == manga_chapter) {
            chapter = chapters[i]
        } else {
            continue;
        }
    }

    pages = await chapter.getReadablePages();

    function download_pages() {
        exec('find -type f -name \'*page*\' -delete')
        for (i = 0; i < pages.length; i++) {
            let id = '.';
            for (j = 1; j < i; j++) {
                id = id + ".";
            }
            exec(`curl -o ./src/manga/page-${id}.png ${pages[i]}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(error)
                } else if (stderr) {
                    console.log(`Fetched page`);
                } else {
                    console.log(stdout);
                }
            });
        }
    }
    let check = prompt(`Fetching from ${manga.title} at Chapter ${chapter.chapter}. Is this correct? (y/n) `)
    
    if (check == 'y') {
        download_pages()
    } else {
        console.log('Fetch failed.')
    }

}).catch(console.error);
