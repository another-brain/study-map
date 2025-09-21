<template>
  <v-col cols="12" sm="6" md="4" lg="3" xl="2">
    <v-card
      color="primary"
      hover
      class="mx-auto"
      :title="title"
      :text="text"
      :prepend-avatar="icon"
      @click="handleClick"
    />
  </v-col>
</template>

<script lang="ts" setup>
const { id, title, text, icon } = defineProps<{
  id: number;
  title: string;
  text: string;
  icon: string;
}>();

const router = useRouter();
const route = useRoute();
function handleClick() {
  router.push({ path: `${route.path}/${id}` });
}
</script>

<style></style>
