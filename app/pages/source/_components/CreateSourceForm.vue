<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template #activator="{ props: activatorProps }">
      <v-btn icon="mdi-plus" color="primary" class="m-5" v-bind="activatorProps" size="large" />
    </template>
    <v-card>
      <template #title>
        <v-chip color="primary" label size="x-large">Create Source</v-chip>
      </template>
      <template #append>
        <CloseButton @click="handleClose" />
      </template>
      <template #text>
        <v-form ref="form" @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="3">
              <LogoImage ref="logoRef" :url="logo" :origin="url" />
            </v-col>
            <v-col cols="12" sm="9">
              <v-text-field v-model="name" label="Name" required :rules="[requiredRule]" />
              <v-text-field v-model="url" label="URL" required :rules="[requiredRule]">
                <template #append>
                  <v-tooltip
                    text="Recognize and auto load name and description"
                    loaction="bottom end"
                  >
                    <template #activator="{ props }">
                      <v-btn
                        icon="mdi-magnify"
                        color="primary"
                        variant="tonal"
                        v-bind="props"
                        :disabled="recognizeDisabled"
                        :loading="recognizing"
                        @click="handleRecognize"
                      />
                    </template>
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="description"
                label="Description"
                required
                :rules="[requiredRule]"
              />
            </v-col>
          </v-row>
          <SubmitButton :loading="loading" :disabled="recognizing" />
        </v-form>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import proxy from '~/services/proxy';
import source from '~/services/source';
import { fields } from '~~/server/models/api/utils';

const dialog = ref(false);
const form = ref<{ reset: () => void }>();
function handleClose() {
  dialog.value = false;
  form.value?.reset();
}

const url = ref('');
const name = ref('');
const description = ref('');
const logo = ref('');

const recognizing = ref(false);
const recognizeDisabled = computed(() => fields.url.safeParse(url.value).error !== undefined);
const { send } = useMessageStore();
async function handleRecognize() {
  recognizing.value = true;
  let content: string | undefined;
  await (async () => {
    const record = await source.parse(url.value);
    if (record instanceof Error) {
      content = record.message;
      return;
    }
    if (record.id !== 0) {
      content = 'Source already exists';
      return;
    }
    const result = await proxy.parse(url.value);
    if (result instanceof Error) {
      content = result.message;
      return;
    }
    name.value = result.title;
    description.value = result.description;
    logo.value = result.logo.url;
  })();
  if (content !== undefined) {
    send({
      content,
      type: MessageType.Error
    });
  }
  recognizing.value = false;
}

const loading = ref(false);
const logoRef = ref<{ getSrc: () => string }>();
const emit = defineEmits(['submit']);
async function handleSubmit() {
  loading.value = true;
  const result = await source.create({
    url: url.value,
    name: name.value,
    logo: logoRef.value?.getSrc() || logo.value,
    description: description.value
  });
  loading.value = false;
  if (result instanceof Error) {
    send({
      content: result.message,
      type: MessageType.Error
    });
  } else {
    send({
      content: `Create Source ${result.id} success`,
      type: MessageType.Success
    });
    handleClose();
    emit('submit');
  }
}
</script>

<style></style>
