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
