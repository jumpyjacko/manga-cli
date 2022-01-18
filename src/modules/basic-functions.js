import promptSync from 'prompt-sync';
const prompt = promptSync();

import { exec } from 'child_process';

export function read() {
    if (prompt('Read? (y/n) ') == 'y') {
        exec('feh -.n src/manga');
    }
}
