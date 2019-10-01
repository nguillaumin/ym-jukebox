<template>
  <div class="controls">

    <div>
      <ul class="buttons">
        <li>
          <a href="#"
            title="Previous"
            @click.prevent="onClickPrevious"
            :class="{disabled: !hasPrevious}">
            <i class="fa fa-fw fa-2x fa-step-backward" aria-hidden="true"></i>
          </a>
        </li>

        <li>
          <a href="#"
            title="Play / Pause"
            @click.prevent="onClickPlayPause"
            :class="{disabled: !song}">
            <i class="fa fa-fw fa-4x" :class="{'fa-play': !playing, 'fa-pause': playing}" aria-hidden="true"></i>
          </a>
        </li>

        <li>
          <a href="#"
            title="Next"
            @click.prevent="onClickNext"
            :class="{disabled: !hasNext}">
            <i class="fa fa-fw fa-2x fa-step-forward" aria-hidden="true"></i>
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

<script>
export default {
  name: 'Controls',
  props: {
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
  },
  methods: {
    onClickPrevious () {
      this.$emit('previous')
    },
    onClickNext () {
      this.$emit('next')
    },
    onClickPlayPause () {
      if (this.playing === true) {
        this.$emit('pause')
      } else {
        this.$emit('play')
      }
    }
  }
}
</script>

<style scoped>
.controls {
  text-align: center;
  background-color: black;
  width: 100%;
  border-top: solid 1px #59af21;
}

.controls>div {
  display: flex;
  align-items: center;
}

.controls .buttons {
  flex-shrink: 1;
}

.controls .status {
  flex-grow: 1;
  padding-bottom: .5rem;
}
.controls a i {
  vertical-align: middle;
}

.status {
  text-align: center;
}

h2 {
  margin: .5rem;
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
