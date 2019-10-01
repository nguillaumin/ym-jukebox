# YM Jukebox

HTML player for YM music files (Atari ST).

Uses an [Emscripten](https://emscripten.org/) port of the [ST-Sound library by Leonard](http://leonard.oxg.free.fr/).
Music is from the defunct [BrainBug ST-Sound archive](http://www.brainbug.ch/stsound/) and [Modland](http://modland.com/).

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## Building the ST-Sound library Emscripten port

```bash
docker run --rm -v $PWD:/data -w /data trzeci/emscripten emmake make clean libym.js
```

## Generating the songs JSON index file

```bash
npm run scan-songs
```

## Contributing

Feel free to contribute with new features and improvements via pull requests.

Another way to contribute is to help curate and organize the song library. There
are issues such as invalid or missing metadata, as well as duplicate songs (that
have different metadata, but are actually the same song). To assist in doing so,
consider using the [YMTool](https://github.com/nguillaumin/ymtool) utility.
