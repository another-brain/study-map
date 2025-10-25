<template>
  <v-skeleton-loader ref="loader" :loading="pending" type="card" class="h-full flex flex-col">
    <DetailBanner
      v-if="success"
      ref="banner"
      :name="data!.name"
      :link-target="data!.url"
      :description="data!.description"
      object-type="Source"
      :change="change"
      :remove="remove"
    >
      <template #logo>
        <LogoImage :url="data!.logo" :origin="data!.url" />
      </template>
      <template #edit>
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
    <RelationNetwork v-if="success" :height="graphHeight" :data="graphView" :load="loadMore" />
    <PageError
      v-else
      err-type="Loading Error"
      message="Fetch data failed"
      :detail="`Get source ${id} data failed`"
    />
  </v-skeleton-loader>
</template>

<script lang="ts" setup>
import source from '~/services/source';

const route = useRoute();
const id = Number(route.params.id);
const { data, status, error, pending, refresh } = useGetSource(id);
const success = computed(() => status.value === 'success');

const loader = ref<{ $el: { clientHeight: number } }>();
const banner = ref<{ $el: { clientHeight: number } }>();
const graphHeight = computed(() =>
  loader.value && banner.value ? loader.value.$el.clientHeight - banner.value.$el.clientHeight : 500
);

const nodeCount = 10;
const {
  loading,
  data: resourceData,
  error: resourceError,
  isLastPage,
  page,
  fetching
} = useListResourceOfSource(id, nodeCount);
const graphData = computed(() => {
  const nodes = new Array<{ id: string; name: string; neighbors: Set<string> }>();
  for (const item of resourceData.value) {
    const { id, name } = item;
    nodes.push({ id: id.toString(), name, neighbors: new Set<string>() });
  }
  return nodes;
});
const graphView = useBuildGraphData(graphData);
async function loadMore(count: number) {
  if (count < nodeCount / 2 && !isLastPage.value && !loading.value && !fetching.value) {
    page.value++;
    return true;
  }
  return false;
}
useNoticeError(error, resourceError);

const { send } = useMessageStore();
const router = useRouter();
async function remove() {
  const result = await source.delete(id);
  if (result instanceof Error) {
    send({
      content: result.message,
      type: MessageType.Error
    });
    return false;
  } else {
    send({
      content: `Delete Source ${id} success`,
      type: MessageType.Success
    });
    router.push('/source');
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
  const result = await source.update(id, {
    name: name.value,
    url: data.value!.url,
    logo: data.value!.logo,
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
      content: `Update Source ${id} success`,
      type: MessageType.Success
    });
    refresh();
    return true;
  }
}
</script>

<style></style>
