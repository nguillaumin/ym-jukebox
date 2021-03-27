# YM Jukebox

HTML player for YM music files (Atari ST).

Uses an [Emscripten](https://emscripten.org/) port of the [ST-Sound library by Leonard](http://leonard.oxg.free.fr/).
Music is from the defunct [BrainBug ST-Sound archive](http://www.brainbug.ch/stsound/) and [Modland](http://modland.com/).

## Build Setup

Install dependencies:

```bash
npm install
```

### Building the ST-Sound library Emscripten port

```bash
docker run --rm -v $PWD/stsound:/data -w /data emscripten/emsdk:1.39.15 emmake make clean libym.js
```

### Generating the songs JSON index file

```bash
npm run scan-songs
```

### Running in development mode

⚠️ In development mode you must manually copy `stsound/libym.wasm` to the
root of the project.

```bash
npm run dev
```

This will serve the app at http://0.0.0.0:8080/ with hot reload.

### Building the production version

```
npm run build
```

## Contributing

Feel free to contribute with new features and improvements via pull requests.

Another way to contribute is to help curate and organize the song library. There
are issues such as invalid or missing metadata, as well as duplicate songs (that
have different metadata, but are actually the same song). To assist in doing so,
consider using the [YMTool](https://github.com/nguillaumin/ymtool) utility.
