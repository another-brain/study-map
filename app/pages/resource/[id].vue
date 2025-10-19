<template>
  <v-skeleton-loader :loading="pending" type="card" class="h-full">
    <DetailBanner
      v-if="success"
      :name="data!.name"
      :link-text="data!.source.name"
      :link-target="`${PageRoutes.SourceManagement}/${data!.sourceId}`"
      :description="data!.description"
      object-type="Resource"
      :change="change"
      :remove="remove"
    >
      <template #logo>
        <LogoImage :url="data!.source.logo " :origin="data!.source.url " />
      </template>
      <template #edit>
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
            <v-textarea
              v-model="description"
              label="Description"
              required
              :rules="[requiredRule]"
            />
          </v-col>
        </v-row>
      </template>
    </DetailBanner>
    <ContentFrame v-if="success" :src="data!.url" />
    <PageError
      v-else
      err-type="Loading Error"
      message="Fetch data failed"
      :detail="`Get resource ${id} data failed`"
    />
  </v-skeleton-loader>
</template>

<script lang="ts" setup>
import { PageRoutes } from '~/consts/routes';
import resource from '~/services/resource';

const route = useRoute();
const id = Number(route.params.id);
const { data, status, error, pending, refresh } = useGetResource(id);
const success = computed(() => status.value === 'success');
useNoticeError(error);

const { send } = useMessageStore();
const router = useRouter();
async function remove() {
  const result = await resource.delete(id);
  if (result instanceof Error) {
    send({
      content: result.message,
      type: MessageType.Error
    });
    return false;
  } else {
    send({
      content: `Delete Resource ${id} success`,
      type: MessageType.Success
    });
    router.push('/resource');
    return true;
  }
}

const name = ref('');
const description = ref('');
const unwatch = watch([data], ([data]) => {
  if (data) {
    name.value = data.name;
    description.value = data.description;
    unwatch();
  }
});

async function change() {
  const result = await resource.update(id, {
    url: data.value!.url,
    name: name.value,
    sourceId: data.value!.sourceId,
    score: data.value!.score,
    description: description.value
  });
  if (result instanceof Error) {
    send({
      content: result.message,
      type: MessageType.Error
    });
    return false;
  } else {
    send({
      content: `Update Resource ${id} success`,
      type: MessageType.Success
    });
    refresh();
    return true;
  }
}
</script>

<style></style>
