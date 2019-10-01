<template>
  <div class="song-list">

    <div v-for="song in songs" class="song" :class="{active: song === currentSong}">
      <a href="#" title="Play" @click.prevent="onClickPlaySong(song)"><i class="fa fa-play fa-2x" aria-hidden="true"></i></a>
      <div class="name">
        {{ song.name }} <small class="duration">{{ song.durationMs | duration }}</small><br>
        <small class="author">{{ song.author }}</small><br>
        <small class="path">{{ song.path | songPath }}</small>
      </div>
      <div class="actions">
        <a href="#" title="Add to playlist" @click.prevent="onClickAddToPlaylist(song)"><i class="fa fa-plus fa-2x" aria-hidden="true"></i></a>
      </div>
    </div>

  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default: []
    },
    currentSong: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      letter: 'A'
    }
  },
  filters: {
    duration (value) {
      return moment.utc(value).format('mm:ss')
    },
    songPath (value) {
      return value.substring('data'.length)
    }
  },
  methods: {
    onClickPlaySong (song) {
      this.$emit('play-song', song)
    },
    onClickAddToPlaylist (song) {
      this.$emit('add-to-playlist', song)
    },
    onClickSelectLetter (letter) {
      this.letter = letter
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.song {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: .5rem;
  border: solid 1px #202f16;
}

.song>* {
  margin: .5rem;
}

.song>a {
  flex-shrink: 1;
}

.song>div.name {
  flex-grow: 1;
}

.song>div.actions {
  flex-shrink: 1;
}

small.duration {
  padding-left: 1rem;
}

small.path { color: #777; }
</style>
