# manga-cli

A very simple MangaDex fetcher which can read manga with the help of [feh](https://wiki.archlinux.org/title/feh).

### Requirements
- feh
- curl
- a MangaDex account
- Node.js

### Usage
I haven't really set anything up yet, so you just clone the repo and `cd` into
it, and then run `npm test`.

To actually have it work, you need to make a `options.json` file in `src/`. It
should look like this:

```json
{
    "username": "MANGADEX USERNAME GOES HERE",
    "password": "MANGADEX PASSWORD GOES HERE"
}
```

You have to know exactly what you want to read and also you get rate limited
pretty easily, batch downloads for chapters are a feature that is coming later.
