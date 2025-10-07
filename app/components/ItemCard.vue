<template>
  <v-col cols="12" sm="6" md="4" lg="3" xl="2">
    <v-card color="primary" hover class="mx-auto" :title="title" rounded="xl" @click="handleClick">
      <template #prepend>
        <LogoImage :url="icon" :origin="source" />
      </template>
      <template #text>
        <v-responsive :aspect-ratio="3">
          <div class="line-clamp-4">
            {{ text }}
          </div>
        </v-responsive>
      </template>
    </v-card>
  </v-col>
</template>

<script lang="ts" setup>
const { id, title, text, icon, source } = defineProps<{
  id: number;
  title: string;
  text: string;
  icon: string;
  source: string;
}>();

const router = useRouter();
const route = useRoute();
function handleClick() {
  router.push({ path: `${route.path}/${id}` });
}
</script>

<style></style>
