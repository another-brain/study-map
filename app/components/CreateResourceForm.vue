<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template #activator="{ props: activatorProps }">
      <v-btn icon="mdi-plus" color="primary" class="m-5" v-bind="activatorProps" size="large" />
    </template>
    <v-card>
      <template #title>
        <v-chip color="primary" label size="x-large">
          {{ title }}
        </v-chip>
      </template>
      <template #append>
        <v-btn icon="mdi-close" variant="text" @click="handleClose" />
      </template>
      <template #text>
        <v-form>
          <v-row>
            <v-col>
              <v-text-field v-model="url" label="URL" required :rules="[requiredRule]">
                <template #append>
                  <v-btn icon="mdi-magnify" color="primary" variant="tonal" />
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="7" xs="6">
              <v-text-field v-model="name" label="Name" required :rules="[requiredRule]" />
            </v-col>
            <v-col cols="12" sm="5" xs="6">
              <v-autocomplete
                v-model:search="text"
                v-model:model-value="source"
                label="Source"
                :items="items"
                item-title="name"
                item-value="id"
                hide-no-data
                hide-selected
                required
                :rules="[requiredRule]"
              >
                <template #append-item>
                  <div v-intersect="fetchNextPageItems">
                    <v-progress-linear v-show="loadingItems" indeterminate color="primary" />
                  </div>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea v-model="description" label="Description" />
            </v-col>
          </v-row>
        </v-form>
      </template>
      <v-btn
        block
        color="primary"
        text="Submit"
        :loading="loading"
        size="large"
        @click="handleSubmit"
      />
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import resource from '~/services/resource';

const dialog = ref(false);
const { title } = defineProps<{ title: string }>();
const requiredRule = (value: string | number | undefined) =>
  value ? true : 'This field cannot be empty!';
function handleClose() {
  dialog.value = false;
}

const url = ref('');
const name = ref('');
const description = ref('');

const text = ref('');
const {
  loading: loadingItems,
  data,
  error: itemsError,
  page,
  isLastPage,
  fetching
} = useSearchSource(text, 10);
const items = data.value.concat({ id: 0, name: '' });
const source = ref(0);

function fetchNextPageItems(isIntersecting: boolean) {
  if (
    isIntersecting &&
    !itemsError.value &&
    !isLastPage.value &&
    !loadingItems.value &&
    !fetching.value
  ) {
    page.value++;
  }
}

const req = computed(() => ({
  url: url.value,
  name: name.value,
  sourceId: source.value,
  description: description.value,
  score: 0
}));

const loading = ref(false);
const { send } = useMessageStore();
async function handleSubmit() {
  loading.value = true;
  const result = await resource.create(req.value);
  loading.value = false;
  if (result instanceof Error) {
    send({
      content: result.message,
      type: MessageType.Error
    });
  } else {
    send({
      content: `Create Resource ${result.id} success`,
      type: MessageType.Info
    });
    handleClose();
  }
}
</script>

<style></style>
