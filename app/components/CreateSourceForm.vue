<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <v-card title="Detected Source">
      <template #text>
        <v-row>
          <v-col cols="3">
            <LogoImage :url="logo" :origin="url" />
          </v-col>
          <v-col cols="12" sm="9">
            <v-text-field v-model="name" label="Name" required :rules="[requiredRule]" />
            <v-text-field :model-value="url" label="URL" disabled />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea v-model="description" label="Description" />
          </v-col>
        </v-row>
      </template>
      <template #actions>
        <v-btn variant="plain" text="Cancel" @click="handleCancel" />
        <v-btn color="primary" text="Save" :loading="loading" @click="handleSave" />
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import source from '~/services/source';

const dialog = ref(false);
const name = ref('');
const url = ref('');
const logo = ref('');
const description = ref('');

defineExpose({
  open: (
    defaultName: string,
    defaultURL: string,
    defaultLogo: string,
    defaultDescription: string
  ) => {
    name.value = defaultName;
    url.value = defaultURL;
    logo.value = defaultLogo;
    description.value = defaultDescription;
    dialog.value = true;
  }
});
function handleCancel() {
  dialog.value = false;
}

const loading = ref(false);
const { send } = useMessageStore();
const emit = defineEmits(['save']);
async function handleSave() {
  loading.value = true;
  const result = await source.create({
    name: name.value,
    url: url.value,
    logo: logo.value,
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
      content: `Save Source ${result.id} success`,
      type: MessageType.Success
    });
    emit('save', result.id);
    handleCancel();
  }
}
</script>

<style></style>
