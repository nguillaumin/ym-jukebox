<template>
  <div class="playlist">

    <div v-if="playlist.length > 0">
      <div v-for="(song, index) in playlist" class="song" :class="{active: index === playlistIndex}">
        <a href="#" title="Play" @click.prevent="onClickPlaySong(song)"><i class="fa fa-play fa-2x" aria-hidden="true"></i></a>
        <div class="name">
          {{ song.name }} <small class="duration">{{ song.durationMs | duration }}</small><br>
          <small class="author">{{ song.author }}</small><br>
          <small class="path">{{ song.path | songPath }}</small>
        </div>
        <div class="actions">
          <a href="#" title="Remove from playlist" @click.prevent="onClickRemoveFromPlaylist(song)"><i class="fa fa-times fa-2x" aria-hidden="true"></i></a>
        </div>
      </div>
    </div>

    <div v-if="playlist.length <= 0" class="empty">
      <small>Add songs from the main song list</small>
    </div>

  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Playlist',
  props: {
    playlist: {
      type: Array,
      default: []
    },
    playlistIndex: {
      type: Number,
      default: 0
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
    onClickRemoveFromPlaylist (song) {
      this.$emit('remove-from-playlist', song)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.empty {
  background-color: #101f06;
  height: 9rem;
  text-align: center;
  padding-top: 6rem;
}

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
