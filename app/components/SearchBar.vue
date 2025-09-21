<template>
  <v-container fluid>
    <v-row>
      <v-col cols="auto" class="px-3">
        <v-switch v-model="modeSwitch" color="primary">
          <template #label>
            <v-icon>{{ icon }}</v-icon>
          </template>
        </v-switch>
      </v-col>
      <keep-alive>
        <v-col>
          <v-autocomplete
            v-show="mode === Mode.BasicSearch"
            v-model:search="text"
            :label="modeLabels[Mode.BasicSearch]"
            :items="items"
            hide-no-data
            hide-selected
            @update:model-value="submit"
          >
            <template #loader>
              <v-progress-linear color="primary" :indeterminate="loading" />
            </template>
            <template #append-item>
              <div v-intersect="more">
                <v-progress-linear v-show="loadingItems" indeterminate color="primary" />
              </div>
            </template>
          </v-autocomplete>
          <v-text-field
            v-show="mode === Mode.SmartSearch"
            v-model="text"
            :label="modeLabels[Mode.SmartSearch]"
            @keydown.enter="submit"
          >
            <template #append-inner>
              <v-icon
                icon="mdi-send"
                class="hover:cursor-pointer hover:text-blue-500"
                @click="submit"
              />
            </template>
            <template #loader>
              <v-progress-linear color="primary" :indeterminate="loading" />
            </template>
          </v-text-field>
        </v-col>
      </keep-alive>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
enum Mode {
  BasicSearch,
  SmartSearch
}
const modeLabels = Object.values(Mode).map(String);

const mode = ref(Mode.SmartSearch);
const modeSwitch = computed({
  get: () => Boolean(mode.value),
  set: (newValue: boolean) => {
    mode.value = Number(newValue) as Mode;
  }
});

const modeIcons = ['mdi-magnify', 'mdi-lightbulb-on'];
const icon = computed(() => modeIcons[mode.value]);

const text = ref('');
defineExpose({ text: readonly(text) });
const { loading, items, loadingItems } = defineProps<{
  loading: boolean;
  loadingItems: boolean;
  items: string[];
}>();
const emit = defineEmits(['submit', 'more']);
const submit = () => emit('submit');
const more = () => emit('more');
</script>

<style></style>
