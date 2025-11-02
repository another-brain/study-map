<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <LogoImage :url="data!.logo" :origin="data!.url" />
      </v-col>
      <v-col cols="12" sm="9">
        <v-text-field v-model="name" label="Name" required :rules="[requiredRule]" />
        <v-text-field :model-value="data!.url" label="URL" disabled />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea v-model="description" label="Description" required :rules="[requiredRule]" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const { id } = defineProps<{
  id: number;
}>();
const { data } = useGetSource(id);
const name = inject('name') as Ref<string>;
const description = inject('description') as Ref<string>;
</script>

<style></style>
