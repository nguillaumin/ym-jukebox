<script setup>
import moment from 'moment'

defineProps({
  playlist: Array,
  playlistIndex: Number
})

function songDuration(durationMs) {
  return moment.utc(durationMs).format('mm:ss')
}

function songPath(path) {
  return path.substring('data'.length)
}
</script>
<template>
  <div class="playlist">
    <div v-if="playlist.length > 0">
      <div
        v-for="(song, index) in playlist"
        :key="index"
        class="song"
        :class="{ active: index === playlistIndex }"
      >
        <a href="#" title="Play" @click.prevent="$emit('play-song', song)"
          ><font-awesome-icon icon="fa-solid fa-play" size="3x"
        /></a>
        <div class="name">
          {{ song.name }} <small class="duration">{{ songDuration(song.durationMs) }}</small
          ><br />
          <small class="author">{{ song.author }}</small
          ><br />
          <small class="path">{{ songPath(song.path) }}</small>
        </div>
        <div class="actions">
          <a
            href="#"
            title="Remove from playlist"
            @click.prevent="$emit('remove-from-playlist', song)"
            ><font-awesome-icon icon="fa-solid fa-times" size="2x"
          /></a>
        </div>
      </div>
    </div>

    <div v-if="playlist.length <= 0" class="empty">
      <small>Add songs from the main song list</small>
    </div>
  </div>
</template>

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
