<template>
  <v-app class="h-screen">
    <NavBar />
    <v-main class="h-full">
      <slot />
    </v-main>
    <v-snackbar-queue :model-value="messages.queue" @update:model-value="messages.set" />
  </v-app>
</template>
<script setup lang="ts">
import NavBar from './_components/NavBar.vue';

const messages = useMessageStore();
</script>
