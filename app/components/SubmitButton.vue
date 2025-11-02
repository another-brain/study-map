<template>
  <v-btn
    block
    color="primary"
    type="submit"
    text="Submit"
    :loading="loading"
    size="large"
    :disabled="disabled"
  />
</template>

<script lang="ts" setup>
defineProps<{
  loading: boolean;
  disabled: boolean;
}>();
</script>

<style></style>
