<template>
  <v-app-bar color="primary">
    <v-app-bar-title>
      <nuxt-link :to="PageRoutes.HomePage">Study Map</nuxt-link>
    </v-app-bar-title>
    <v-btn v-if="!arrivedState.top && !pinned" icon="mdi-chevron-up" @click="backToTop" />
    <div v-if="arrivedState.bottom && y > 0">
      <v-btn v-if="pinned" icon="mdi-pin" @click="unpin" />
      <v-btn v-else icon="mdi-pin-outline" @click="pin" />
    </div>
    <v-btn v-for="(text, route) in btnTexts" :key="route" :to="route" text>{{ text }}</v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { PageRoutes } from '~/consts/routes';

const btnTexts = {
  [PageRoutes.ResourceManagement]: 'Resource'
};

const { y, arrivedState } = useWindowScroll({
  behavior: 'smooth'
});
function backToTop() {
  y.value = 0;
}
const pinned = useScrollLock(window, false);
function pin() {
  pinned.value = true;
}
function unpin() {
  pinned.value = false;
}
</script>

<style></style>
