<script setup>
import { ref, computed } from 'vue'
import SongList from './components/SongList.vue'
import SongPlaylist from './components/SongPlaylist.vue'
import PlayControls from './components/PlayControls.vue'
import AZIndex from './components/AZIndex.vue'

import songListData from '../data/songs.json'
import authorsData from '../data/authors.json'

import libymWrapper from './libymWrapper'

const songs = songListData
const authors = authorsData
const playlist = ref([])
const activeTab = ref('songlist')
const letter = ref('A')
var playlistIndex = ref(0)
var paused = ref(false)
var playing = ref(false)
var author = ref('')

libymWrapper.setOnSongEnded(() => {
  onSongEnded()
})

const filteredSongs = computed(() => {
  if (/[A-Z]/.test(letter.value)) {
    return songs.filter((song) => song.name.toUpperCase().startsWith(letter.value))
  } else if (letter.value === '0-9') {
    return songs.filter((song) => !/^[A-Z]/.test(song.name.toUpperCase()))
  } else {
    return songs.filter((song) => song.author === author.value)
  }
})

const song = computed(() => {
  return playlist.value[playlistIndex.value] || null
})

const hasPrevious = computed(() => {
  return playlistIndex.value > 0
})

const hasNext = computed(() => {
  return playlistIndex.value < playlist.value.length - 1
})

function onFilterSongList(l) {
  letter.value = l
  author.value = '*'
}

function onAddToPlaylist(song) {
  playlist.value.push(song)
}

function onSelectAuthor(a) {
  if (a === '*') {
    letter.value = 'A'
  } else {
    letter.value = null
    author.value = a
  }
}

function onPlaySong(song) {
  playlist.value.push(song)
  playlistIndex.value = playlist.value.length - 1

  playSong()
}

function onPlaySongFromPlaylist(song) {
  playlistIndex.value = playlist.value.indexOf(song)

  playSong()
}

function onRemoveFromPlaylist(song) {
  playlist.value.splice(playlist.value.indexOf(song), 1)
  if (playlistIndex.value >= playlist.value.length) {
    // Last song from playlist was removed
    playlistIndex.value = playlist.value.length - 1
    if (playlistIndex.value < 0) {
      playlistIndex.value = 0
    }
  }
}

function onPrevious() {
  if (hasPrevious.value) {
    playlistIndex.value--
    playSong()
  }
}
function onNext() {
  if (hasNext.value) {
    playlistIndex.value++
    playSong()
  }
}
function onPause() {
  paused.value = true
  playing.value = false
  libymWrapper.pause()
}

function onPlay() {
  if (paused.value) {
    playing.value = true
    paused.value = false
    libymWrapper.unpause()
  } else if (!playing.value) {
    // Case when no song was started yet (first play)
    playSong()
  }
}

function onSongEnded() {
  if (hasNext.value) {
    onNext()
    playSong()
  } else {
    // Last song
    playing.value = false
  }
}

function onClickEnqueueRandom() {
  for (var i = 0; i < 100; i++) {
    playlist.value.push(songs[Math.floor(Math.random() * songs.length - 1)])
  }
}
function onClickClearPlaylist() {
  playlist.value = []
  playlistIndex.value = 0
  if (playing.value) {
    libymWrapper.pause()
  }
  playing.value = false
}

function playSong() {
  paused.value = false
  playing.value = true

  document.title = song.value.name + ' - ' + song.value.author
  libymWrapper.playSong(song.value)
}
</script>

<template>
  <div class="ym-player">
    <nav>
      <ul>
        <li :class="{ active: activeTab === 'songlist' }">
          <a href="#" @click.prevent="activeTab = 'songlist'">Song list</a>
          &nbsp;
          <small>{{ songs.length.toLocaleString() }}</small>
        </li>
        <li :class="{ active: activeTab === 'playlist' }">
          <a href="#" @click.prevent="activeTab = 'playlist'">Playlist</a>
          &nbsp;
          <small>{{ playlist.length.toLocaleString() }}</small>
        </li>
        <li :class="{ active: activeTab === 'about' }">
          <a href="#" @click.prevent="activeTab = 'about'">About</a>
        </li>
      </ul>
    </nav>

    <AZIndex
      v-show="activeTab === 'songlist'"
      :songs="songs"
      :letter="letter"
      @filter-list="onFilterSongList"
    />

    <div v-if="activeTab === 'songlist'" class="authors">
      <div>Author:&nbsp;</div>
      <select @change="onSelectAuthor($event.target.options[$event.target.selectedIndex].value)">
        <option value="*" :selected="author === '*'">-- All --</option>
        <option v-for="(count, author) in authors" :key="author" :value="author">
          {{ author }} ({{ count }})
        </option>
      </select>
    </div>

    <SongList
      v-show="activeTab === 'songlist'"
      :songs="filteredSongs"
      :authors="authors"
      :author="author"
      :currentSong="song"
      @add-to-playlist="onAddToPlaylist"
      @play-song="onPlaySong"
    />

    <ul class="actions nav-secondary" v-show="activeTab === 'playlist'">
      <li>
        <a href="#" @click.prevent="onClickEnqueueRandom"
          ><font-awesome-icon icon="fa-solid fa-plus-circle" /> Enqueue 100 random songs</a
        >
      </li>
      <li>
        <a href="#" @click.prevent="onClickClearPlaylist"
          ><font-awesome-icon icon="fa-solid fa-times" /> Clear</a
        >
      </li>
    </ul>

    <SongPlaylist
      v-show="activeTab === 'playlist'"
      :playlist="playlist"
      :playlistIndex="playlistIndex"
      @remove-from-playlist="onRemoveFromPlaylist"
      @play-song="onPlaySongFromPlaylist"
    />

    <div v-show="activeTab === 'about'" class="about">
      <p>
        <img src="@/assets/ym2149f-2x.png" alt="YM2149F" />
      </p>

      <p>
        This is an <a href="https://emscripten.org/">Emscripten</a> port of the
        <a href="http://leonard.oxg.free.fr/">ST-Sound library by Leonard</a>. Music is from the
        defunct <a href="http://www.brainbug.ch/stsound/">BrainBug ST-Sound archive</a> and
        <a href="http://modland.com/">Modland</a>. Sources and music files on
        <font-awesome-icon icon="fa-brands fa-github" />&nbsp;
        <a href="https://github.com/nguillaumin/ym-jukebox">GitHub</a>.
      </p>
    </div>

    <PlayControls
      :song="song"
      :playing="playing"
      :hasPrevious="hasPrevious"
      :hasNext="hasNext"
      @previous="onPrevious"
      @next="onNext"
      @pause="onPause"
      @play="onPlay"
    />
  </div>
</template>

<style>
body,
html {
  height: 100%;
}

.ym-player {
  font-family: 'Exo 2', sans-serif;
  display: flex;
  flex-direction: column;
  height: 100dvh;
}

@media (min-width: 1000px) {
  .ym-player {
    max-width: 50rem;
    margin: auto;
  }
}

.az-index,
.actions {
  flex-grow: 0;
}

.song-list,
.playlist {
  overflow: auto;
  flex-grow: 1;
}

nav ul {
  display: flex;
  list-style: none;
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
}

nav ul li {
  flex-grow: 1;
  text-align: center;
}

nav ul li.active {
  background-color: #59af21;
}

nav ul li.active a {
  color: #080d11;
}

nav li {
  padding: 0.5rem 1rem;
}

.authors {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  text-wrap: nowrap;
  margin-left: auto;
  margin-right: auto;
}

select {
  width: 100%;
  border: solid 1px #59af21;
  background-color: #101f06;
  color: #c8c8c8;
  height: 2rem;
}

.about {
  flex-grow: 1;
  align-self: center;
}

.about p {
  text-align: center;
  padding-top: 2rem;
  padding-bottom: 1rem;
  margin: 0 0.5rem;
}

ul.nav-secondary {
  background-color: #101f06;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.actions {
  text-align: center;
  list-style-type: none;
  padding: 0;
  margin-top: 0;
  margin-left: 0;
  margin-right: 0;
}

.actions li {
  display: inline;
  margin-left: 1rem;
  margin-right: 1rem;
}

.actions li a {
  display: inline-block;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
</style>
