import fs from 'fs'
import path from 'path'
import walk from 'walk'
import libymModule from '../stsound/libym.js'

function extractString(heap, start) {
  var str = []
  for (var i = start; heap[i] !== 0; i++) {
    str.push(String.fromCharCode(heap[i]))
  }

  return str.join('')
}

var walker

libymModule().then(function (libym) {
  if (!process.argv[2]) {
    throw new Error('The path to scan must be provided')
  }

  var songs = []
  var authors = {}
  var dir = process.argv[2]
  walker = walk.walk(dir)

  var ym = libym.ccall('ymMusicCreate', 'number')

  walker.on('file', function (root, fileStats, next) {
    if (/\.ym$/i.test(fileStats.name)) {
      console.log('Processing ' + root + '/' + fileStats.name)

      var data = fs.readFileSync(path.resolve(root, fileStats.name))

      var byteArray = new Uint8Array(data)
      var ptr = libym._malloc(byteArray.byteLength)

      libym.HEAPU8.set(byteArray, ptr)

      if (
        0 ===
        libym.ccall(
          'ymMusicLoadMemory',
          'number',
          ['number', 'number', 'number'],
          [ym, ptr, byteArray.byteLength]
        )
      ) {
        var err = libym.ccall('ymMusicGetLastError', 'string', ['number'], [ym])

        console.log('Error loading music ' + fileStats.name + ' from memory', err)
      }

      // The ymMusicInfo_t struct is 28 bytes long
      var infoPtr = libym._malloc(28)

      libym.ccall('ymMusicGetInfo', '', ['number', 'number'], [ym, infoPtr])

      var defaultName = path.basename(fileStats.name, path.extname(fileStats.name))

      var name = extractString(libym.HEAPU8, libym.getValue(infoPtr, '*'))
      if (name === '' || /unknown/i.test(name)) {
        name = defaultName
      }

      var song = {
        path: root + (root.endsWith('/') ? '' : '/') + fileStats.name,
        name: name,
        author: extractString(libym.HEAPU8, libym.getValue(infoPtr + 4, '*')) || '[n/a]',
        comment: extractString(libym.HEAPU8, libym.getValue(infoPtr + 8, '*')),
        type: extractString(libym.HEAPU8, libym.getValue(infoPtr + 12, '*')),
        player: extractString(libym.HEAPU8, libym.getValue(infoPtr + 16, '*')),
        durationMs: libym.getValue(infoPtr + 24, 'i32')
      }

      songs.push(song)
      if (song.author in authors) {
        authors[song.author]++
      } else {
        authors[song.author] = 1
      }

      libym._free(infoPtr)
      libym._free(ptr)
    }

    next()
  })

  walker.on('end', function () {
    console.log(songs.length + ' songs found')

    songs = songs.sort(function (a, b) {
      return a.name.localeCompare(b.name)
    })

    libym.ccall('ymMusicDestroy', 'number', ['number'], [ym])
    fs.writeFile(
      path.resolve(dir, 'songs.json'),
      JSON.stringify(songs, null, '  '),
      function (err) {
        if (err) {
          throw err
        }
      }
    )

    var sortedAuthors = new Map(
      Object.keys(authors)
        .sort()
        .map((author) => [author, authors[author]])
    )

    fs.writeFile(
      path.resolve(dir, 'authors.json'),
      JSON.stringify(Object.fromEntries(sortedAuthors), null, '  '),
      function (err) {
        if (err) {
          throw err
        }
      }
    )
  })
})
