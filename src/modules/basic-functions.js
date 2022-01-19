import promptSync from 'prompt-sync';
const prompt = promptSync();

import { exec } from 'child_process';

export function read() {
    if (prompt('Read? (y/n) ') == 'y') {
        console.log('Use arrow keys or scroll wheel to change pages.')
        exec('feh -.n src/manga');
    }
}
