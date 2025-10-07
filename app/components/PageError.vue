<template>
  <v-container class="h-full w-full">
    <v-empty-state
      class="h-full w-full"
      :headline="errType"
      :title="message"
      :text="detail"
      icon="mdi-emoticon-sad"
    />
  </v-container>
</template>

<script lang="ts" setup>
const { errType, message, detail } = defineProps<{
  errType: string;
  message: string;
  detail: string;
}>();
</script>

<style></style>
