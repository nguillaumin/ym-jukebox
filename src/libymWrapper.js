import axios from 'axios'
import libymModule from '../stsound/libym'

const libym = libymModule()

// Chrome requires a user interaction to create an audio context, so
// only create it when we play a song
var audioCtx
var scriptNode

var state = {
  paused: false,
  ym: 0,
  musicDataPtr: 0,
  samplesDataPtr: 0
}

var onSongEnded = () => {}

function cleanup (state) {
  state.paused = false

  if (state.musicDataPtr > 0) {
    libym._free(state.musicDataPtr)
    state.musicDataPtr = 0
  }

  if (state.samplesDataPtr > 0) {
    libym._free(state.samplesDataPtr)
    state.samplesDataPtr = 0
  }

  if (state.ym > 0) {
    libym.ccall('ymMusicDestroy',
      'number',
      ['number'],
      [state.ym])

    state.ym = 0
  }

  scriptNode.onaudioprocess = (e) => {}
  try {
    scriptNode.disconnect(audioCtx.destination)
  } catch (e) {
  }
}

function getLibYmLastError (ym) {
  return libym.ccall('ymMusicGetLastError',
    'string',
    ['number'],
    [ym])
}

function playSong (song) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    scriptNode = audioCtx.createScriptProcessor(8192, 0, 1)
  }

  axios.get(song.path.replace(/#/, '%23'), {
    responseType: 'arraybuffer'
  })
  .then(response => {
    // Cleanup previous state. May happen if a new
    // song starts playing while a song is currently playing
    cleanup(state)

    state.ym = libym.ccall('ymMusicCreate', 'number')

    var musicData = new Uint8Array(response.data)
    state.musicDataPtr = libym._malloc(musicData.byteLength)

    libym.HEAPU8.set(musicData, state.musicDataPtr)

    if (libym.ccall('ymMusicLoadMemory',
      'number',
      ['number', 'number', 'number'],
      [state.ym, state.musicDataPtr, musicData.byteLength]) === 0) {

      console.error('Error loading music from memory', getLibYmLastError(state.ym))
      return

    }

    var samplesData = new Int16Array(scriptNode.bufferSize)
    state.samplesDataPtr = libym._malloc(samplesData.byteLength)

    scriptNode.onaudioprocess = (e) => {
      if (state.paused) {
        return
      }

      if (libym.ccall('ymMusicCompute',
        'number',
        ['number', 'number', 'number'],
        [state.ym, state.samplesDataPtr, samplesData.length]) === 0) {

        // Most likely the tune ended
        cleanup(state)

        onSongEnded()
        return
      }

      var result = new Int16Array(libym.HEAP16.buffer, state.samplesDataPtr, samplesData.length)
      var outputData = e.outputBuffer.getChannelData(0)

      for (var i = 0; i < samplesData.length; i++) {
        outputData[i] = result[i] / (result[i] >= 0 ? 32767 : 32768)
      }
    }

    scriptNode.connect(audioCtx.destination)

  })
}

function pause () {
  state.paused = true
  scriptNode.disconnect(audioCtx.destination)
}

function unpause () {
  state.paused = false
  scriptNode.connect(audioCtx.destination)
}

export default {
  playSong: playSong,
  pause: pause,
  unpause: unpause,
  setOnSongEnded (callback) {
    onSongEnded = callback
  }
}

// vim: set sts=2 sw=2 sts=2 :
