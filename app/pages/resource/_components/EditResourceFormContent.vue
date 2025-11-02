<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field :model-value="data?.url" label="URL" disabled />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" sm="6" xs="6">
        <v-text-field v-model="name" label="Name" required :rules="[requiredRule]" />
      </v-col>
      <v-col cols="12" sm="6" xs="6">
        <v-autocomplete
          :model-value="data?.sourceId"
          label="Source"
          disabled
          :items="[extractObj(data?.source ?? {}, ['id', 'name'])]"
          item-title="name"
          item-value="id"
        />
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
const { data } = useGetResource(id);
const name = inject('name') as Ref<string>;
const description = inject('description') as Ref<string>;
</script>

<style></style>
