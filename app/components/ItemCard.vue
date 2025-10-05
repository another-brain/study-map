<template>
  <v-col cols="12" sm="6" md="4" lg="3" xl="2" class="flex">
    <v-card color="primary" hover class="mx-auto" :title="title" @click="handleClick">
      <template #prepend>
        <v-avatar :image="iconDisplay" rounded="0" />
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
const { id, title, text, icon } = defineProps<{
  id: number;
  title: string;
  text: string;
  icon: string;
}>();
const iconDisplay = useImage(icon);

const router = useRouter();
const route = useRoute();
function handleClick() {
  router.push({ path: `${route.path}/${id}` });
}
</script>

<style></style>
