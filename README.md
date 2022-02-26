# manga-cli (dead for now because im working on other stuff and school)

A very simple MangaDex fetcher (soon to be full client(if i finish it)) which can read manga with the help of [feh](https://wiki.archlinux.org/title/feh).

Kind of a lot of this is built off example code from [the mangadex-full-api](https://github.com/md-y/mangadex-full-api) node package because I have no idea what I'm doing.

### Requirements
- feh
- curl
- a MangaDex account
- Node.js

### Usage
I haven't really set anything up yet, so you just clone the repo and `cd` into it, and then run `npm install` to download the dependencies. Run `npm test` to run the program.

To actually have it work, you need to make a `options.json` file in `src/`. It should look like this, eventually this will be automated with a first-time setup prompt:

```json
{
    "username": "MANGADEX USERNAME GOES HERE",
    "password": "MANGADEX PASSWORD GOES HERE",
    "language": "two(or four) letter langauge code"
}
```

### Gallery
![manga-cli](https://user-images.githubusercontent.com/48436180/149846780-06ef6546-e784-4f39-91c8-e0c68e673c71.png)
