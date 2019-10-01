<template>
  <div class="ym-player">

    <nav>
      <ul>
        <li :class="{active: activeTab === 'songlist'}">
          <a href="#" @click.prevent="onClickSongList()" >Song list</a> <small>{{songs.length | localeString}}</small>
        </li>
        <li :class="{active: activeTab === 'playlist'}">
          <a href="#" @click.prevent="onClickPlaylist()">Playlist</a> <small>{{playlist.length | localeString}}</small>
        </li>
        <li :class="{active: activeTab === 'about'}">
          <a href="#" @click.prevent="onClickAbout()">About</a>
        </li>
      </ul>
    </nav>

    <AZIndex
      v-show="activeTab === 'songlist'"
      :songs="songs"
      @filter-list="onFilterSongList" />

    <SongList
      v-show="activeTab === 'songlist'"
      :songs="filteredSongs"
      :currentSong="song"
      @add-to-playlist="onAddToPlaylist"
      @play-song="onPlaySong" />

    <Playlist
       v-show="activeTab === 'playlist'"
       :playlist="playlist"
       :playlistIndex="playlistIndex"
       @remove-from-playlist="onRemoveFromPlaylist"
       @play-song="onPlaySongFromPlaylist" />

    <div
      v-show="activeTab === 'about'"
      class="about">
      <p>
        <img src="../static/ym2149f-2x.png" alt="YM2149F">
      </p>

      <p>
        This is an <a href="https://emscripten.org/">Emscripten</a> port of the <a href="http://leonard.oxg.free.fr/">ST-Sound library by Leonard</a>.
        Music is from the defunct <a href="http://www.brainbug.ch/stsound/">BrainBug ST-Sound archive</a> and <a href="http://modland.com/">Modland</a>. Sources and music files on <i class="fa fa-github" aria-hidden="true"></i> <a href="https://github.com/nguillaumin/ym-jukebox">GitHub</a>.
      </p>
    </div>

    <Controls
      :song="song"
      :playing="playing"
      :hasPrevious="hasPrevious"
      :hasNext="hasNext"
      @previous="onPrevious"
      @next="onNext"
      @pause="onPause"
      @play="onPlay" />

  </div>
</template>

<script>
import SongList from './components/SongList'
import Playlist from './components/Playlist'
import Controls from './components/Controls'
import AZIndex from './components/AZIndex'
import songListData from '../data/songs.json'

import libymWrapper from './libymWrapper'

export default {
  name: 'YmPlayer',
  data () {
    return {
      songs: songListData,
      playlist: [],
      playlistIndex: 0,
      playing: false,
      paused: false,
      activeTab: 'songlist',
      letter: 'A'
    }
  },
  created () {
    libymWrapper.setOnSongEnded(() => {
      this.onSongEnded()
    })
  },
  computed: {
    filteredSongs () {
      if (/[A-Z]/.test(this.letter)) {
        return this.songs.filter(song => song.name.toUpperCase().startsWith(this.letter))
      } else {
        return this.songs.filter(song => !/^[A-Z]/.test(song.name.toUpperCase()))
      }
    },
    song () {
      return this.playlist[this.playlistIndex] || null
    },
    hasPrevious () {
      return this.playlistIndex > 0
    },
    hasNext () {
      return this.playlistIndex < this.playlist.length - 1
    }
  },
  components: {
    Controls,
    SongList,
    Playlist,
    AZIndex
  },
  filters: {
    localeString (value) {
      return value.toLocaleString()
    }
  },
  methods: {
    onFilterSongList (letter) {
      this.letter = letter
    },
    playSong () {
      this.paused = false
      this.playing = true

      document.title = this.song.name + ' - ' + this.song.author
      libymWrapper.playSong(this.playlist[this.playlistIndex])
    },
    onAddToPlaylist (song) {
      this.playlist.push(song)
    },
    onPlaySong (song) {
      this.playlist.push(song)
      this.playlistIndex = this.playlist.length - 1

      this.playSong()
    },
    onPlaySongFromPlaylist (song) {
      this.playlistIndex = this.playlist.indexOf(song)

      this.playSong()
    },
    onRemoveFromPlaylist (song) {
      this.playlist.splice(this.playlist.indexOf(song), 1)
      if (this.playlistIndex >= this.playlist.length) {
        // Last song from playlist was removed
        this.playlistIndex = this.playlist.length - 1
        if (this.playlistIndex < 0) {
          this.playlistIndex = 0
        }
      }
    },
    onPrevious () {
      if (this.hasPrevious) {
        this.playlistIndex--
        this.playSong()
      }
    },
    onNext () {
      if (this.hasNext) {
        this.playlistIndex++
        this.playSong()
      }
    },
    onPause () {
      this.paused = true
      this.playing = false
      libymWrapper.pause()
    },
    onPlay () {
      this.playing = true
      if (this.paused) {
        this.paused = false
        libymWrapper.unpause()
      }
    },
    onSongEnded () {
      if (this.hasNext) {
        this.onNext()
        this.playSong()
      } else {
        // Last song
        this.playing = false
      }
    },
    onClickSongList () {
      this.activeTab = 'songlist'
    },
    onClickPlaylist () {
      this.activeTab = 'playlist'
    },
    onClickAbout () {
      this.activeTab = 'about'
    }
  }
}
</script>

<style>

body, html { height: 100%; }

.ym-player {
  font-family: 'Exo 2', sans-serif;
  display: flex;
  flex-direction: column;
  height: 100%;
}

@media (min-width: 1000px) {
  .ym-player {
    max-width: 50rem;
    margin: auto;
  }
}

.az-index {
  flex-grow: 0;
}

.song-list, .playlist {
  overflow: auto;
  flex-grow: 1;
}

nav ul {
  display: flex;
  list-style: none;
  padding-left: 0;
  margin-top: 0;
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
  padding: .5rem 1rem;
}

.about {
  flex-grow: 1;
  align-self: center;
}

.about p {
  text-align: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

</style>
