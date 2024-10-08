<script setup>
const props = defineProps({
  song: {
    type: Object,
    default: null
  },
  playing: {
    type: Boolean,
    default: false
  },
  hasPrevious: {
    type: Boolean,
    default: false
  },
  hasNext: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['next', 'previous', 'play', 'pause'])

function onClickPlayPause() {
  if (props.playing === true) {
    emit('pause')
  } else if (props.song) {
    emit('play')
  }
}
</script>

<template>
  <div class="controls">
    <div>
      <ul class="buttons">
        <li>
          <a
            href="#"
            title="Previous"
            @click.prevent="$emit('previous')"
            :class="{ disabled: !hasPrevious }"
          >
            <font-awesome-icon icon="fa-solid fa-step-backward" size="2x" fixed-width />
          </a>
        </li>

        <li>
          <a
            href="#"
            title="Play / Pause"
            @click.prevent="onClickPlayPause"
            :class="{ disabled: !song }"
          >
            <font-awesome-icon
              :icon="playing ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
              size="4x"
              fixed-width
            />
          </a>
        </li>

        <li>
          <a href="#" title="Next" @click.prevent="$emit('next')" :class="{ disabled: !hasNext }">
            <font-awesome-icon icon="fa-solid fa-step-forward" size="2x" fixed-width />
          </a>
        </li>
      </ul>

      <div class="status">
        <div v-if="song">
          <h2>{{ song.name }}</h2>
          <small>{{ song.author }}</small>
        </div>
        <div v-else>
          <small>No song selected</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  text-align: center;
  background-color: black;
  width: 100%;
  border-top: solid 1px #59af21;
}

.controls > div {
  display: flex;
  align-items: center;
}

.controls .buttons {
  flex-shrink: 1;
}

.controls .status {
  flex-grow: 1;
  padding-bottom: 0.5rem;
}
.controls a svg {
  vertical-align: middle;
}

.status {
  text-align: center;
}

h2 {
  margin: 0.5rem;
}

img {
}

p {
  margin: 0;
  padding-left: 1rem;
  padding-right: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
  white-space: nowrap;
  margin: 0;
}

li {
  display: inline;
}

a.disabled {
  cursor: default;
}
</style>
