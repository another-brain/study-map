<template>
  <v-app-bar color="primary">
    <v-app-bar-title>
      <nuxt-link :to="PageRoutes.HomePage">Study Map</nuxt-link>
    </v-app-bar-title>
    <v-btn v-for="text, route in btnTexts" :key="route" :to="route" text>{{ text }}</v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { PageRoutes } from '~/consts/routes';

const btnTexts = {
  [PageRoutes.ResourceManagement]: 'Resource'
}
</script>

<style></style>