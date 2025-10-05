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
        <v-form ref="form" @submit.prevent="handleSubmit">
          <v-row>
            <v-col>
              <v-text-field v-model="url" label="URL" required :rules="[requiredRule]">
                <template #append>
                  <v-btn
                    icon="mdi-magnify"
                    color="primary"
                    variant="tonal"
                    :loading="recognizing"
                    @click="handleRecognize"
                  />
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="6" xs="6">
              <v-text-field v-model="name" label="Name" required :rules="[requiredRule]" />
            </v-col>
            <v-col cols="12" sm="6" xs="6">
              <v-autocomplete
                v-model:search="text"
                v-model:model-value="sourceId"
                label="Source"
                :items="items"
                item-title="name"
                item-value="id"
                hide-no-data
                required
                :rules="[requiredRule]"
              >
                <template #append>
                  <v-btn
                    icon="mdi-magnify"
                    color="primary"
                    variant="tonal"
                    :loading="recognizingSource"
                    @click="handleRecognizeSource"
                  />
                </template>
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
          <v-btn
            block
            color="primary"
            type="submit"
            text="Submit"
            :loading="loading"
            size="large"
          />
        </v-form>
      </template>
    </v-card>
    <CreateSourceForm ref="subForm" @save="handleSave" />
  </v-dialog>
</template>

<script lang="ts" setup>
import proxy from '~/services/proxy';
import resource from '~/services/resource';
import source from '~/services/source';

const dialog = ref(false);
const form = ref<{ reset: () => void }>();
const { title } = defineProps<{ title: string }>();
function handleClose() {
  dialog.value = false;
  form.value?.reset();
}

const url = ref('');
const name = ref('');
const description = ref('');

const text = ref('');
const {
  loading: loadingItems,
  data: items,
  error: itemsError,
  page,
  isLastPage,
  fetching,
  refresh
} = useSearchSource(text, 10);
const sourceId = ref<number>();

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

const recognizing = ref(false);
async function handleRecognize() {
  recognizing.value = true;
  let content: string | undefined;
  await (async () => {
    const record = await resource.parse(url.value);
    if (record instanceof Error) {
      content = record.message;
      return;
    }
    if (record.id !== 0) {
      content = 'Resource already exists';
      return;
    }
    const result = await proxy.parse(url.value);
    if (result instanceof Error) {
      content = result.message;
      return;
    }
    name.value = result.title;
    description.value = result.description;
  })();
  if (content !== undefined) {
    send({
      content,
      type: MessageType.Error
    });
  }
  recognizing.value = false;
}

const recognizingSource = ref(false);
const subForm = ref<{
  open: (name: string, url: string, logo: string, description: string) => void;
}>();
const sourceURL = computed(() => new URL(url.value).origin);
async function handleRecognizeSource() {
  recognizingSource.value = true;
  let content: string | undefined;
  await (async () => {
    const record = await source.parse(sourceURL.value);
    if (record instanceof Error) {
      content = record.message;
      return;
    }
    if (record.id !== 0) {
      sourceId.value = record.id;
      return;
    }
    const result = await proxy.parse(sourceURL.value);
    if (result instanceof Error) {
      content = result.message;
      return;
    }
    subForm.value?.open(result.title, sourceURL.value, result.logo.url, result.description);
  })();
  if (content !== undefined) {
    send({
      content,
      type: MessageType.Error
    });
  }
  recognizingSource.value = false;
}

async function handleSave(id: number) {
  await refresh();
  sourceId.value = id;
}

const loading = ref(false);
const { send } = useMessageStore();
const emit = defineEmits(['submit']);
async function handleSubmit() {
  loading.value = true;
  const result = await resource.create({
    url: url.value,
    name: name.value,
    sourceId: sourceId.value ?? 0,
    description: description.value,
    score: 0
  });
  loading.value = false;
  if (result instanceof Error) {
    send({
      content: result.message,
      type: MessageType.Error
    });
  } else {
    send({
      content: `Create Resource ${result.id} success`,
      type: MessageType.Success
    });
    handleClose();
    emit('submit');
  }
}
</script>

<style></style>
