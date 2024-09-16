<script setup>
import { ref } from 'vue'
const props = defineProps({
  songs: Array,
  default: []
})

const emit = defineEmits(['filter-list'])

var letter = ref('A')
const azIndex = {
  '0-9': 0
}
for (var idx = 'A'.charCodeAt(0), end = 'Z'.charCodeAt(0); idx <= end; ++idx) {
  azIndex[String.fromCharCode(idx)] = 0
}

props.songs.forEach((e) => {
  var firstLetter = e.name.substring(0, 1).toUpperCase()
  if (!/[A-Z]/.test(firstLetter)) {
    azIndex['0-9']++
  } else {
    azIndex[firstLetter]++
  }
})

function onClickSelectLetter(l) {
  emit('filter-list', l)
  letter.value = l
}
</script>

<template>
  <ul class="az-index nav-secondary">
    <li v-for="(count, l) in azIndex" :key="l">
      <a
        v-if="count"
        href="#"
        @click.prevent="onClickSelectLetter(l)"
        :class="{ active: letter == l }"
        >{{ l }}</a
      ><span v-else>{{ l }}</span>
    </li>
  </ul>
</template>

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
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  display: inline-block;
}

a.active {
  background-color: #59af21;
  color: #091304;
}
</style>
