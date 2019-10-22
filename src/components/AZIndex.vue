<template>
  <ul class="az-index nav-secondary">
    <li v-for="(count, l) in azIndex"><a v-if="count" href="#" @click.prevent="onClickSelectLetter(l)" :class="{active: letter == l}">{{l}}</a><span v-else>{{l}}</span></li>
  </ul>
</template>

<script>
export default {
  name: 'AZIndex',
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      letter: 'A',
      azIndex: {
        '0-9': 0
      }
    }
  },
  created () {
    for (var idx = 'A'.charCodeAt(0), end = 'Z'.charCodeAt(0); idx <= end; ++idx) {
      this.azIndex[String.fromCharCode(idx)] = 0
    }
    this.songs.forEach((e) => {
      var firstLetter = e.name.substring(0, 1).toUpperCase()
      if (!/[A-Z]/.test(firstLetter)) {
        this.azIndex['0-9']++
      } else {
        this.azIndex[firstLetter]++
      }
    })
  },
  methods: {
    onClickSelectLetter (letter) {
      this.$emit('filter-list', letter)
      this.letter = letter
    }
  }

}
</script>

<style scoped>
ul {
  text-align: center;
  padding-left: 0;
  padding-right: 0;
}

ul li {
  display: inline;
}

a {
  padding: .25rem .5rem .25rem .5rem;
  display: inline-block;
}

a.active {
  background-color: #59af21;
  color: #091304;
}
</style>
