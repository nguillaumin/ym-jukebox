<script setup>
import moment from 'moment'

defineProps(['songs', 'currentSong'])

function songDuration(durationMs) {
  return moment.utc(durationMs).format('mm:ss')
}

function songPath(path) {
  return path.substring('data'.length)
}
</script>

<template>
  <div class="song-list">
    <div
      v-for="song in songs"
      :key="song.path"
      class="song"
      :class="{ active: song?.path === currentSong?.path }"
    >
      <a href="#" title="Play" @click.prevent="$emit('play-song', song)"
        ><i class="fa-solid fa-play fa-2x" aria-hidden="true"></i
      ></a>
      <div class="name">
        {{ song.name }} <small class="duration">{{ songDuration(song.durationMs) }}</small
        ><br />
        <small class="author">{{ song.author }}</small
        ><br />
        <small class="path">{{ songPath(song.path) }}</small>
      </div>
      <div class="actions">
        <a href="#" title="Add to playlist" @click.prevent="$emit('add-to-playlist', song)"
          ><i class="fa fa-plus fa-2x" aria-hidden="true"></i
        ></a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.song {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0.5rem;
  border: solid 1px #202f16;
}

.song.active {
  background-color: #101f06;
}

.song > * {
  margin: 0.5rem;
}

.song > a {
  flex-shrink: 1;
}

.song > div.name {
  flex-grow: 1;
}

.song > div.actions {
  flex-shrink: 1;
}

small.duration {
  padding-left: 1rem;
}

small.path {
  color: #777;
}
</style>
