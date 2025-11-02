<template>
  <v-skeleton-loader ref="loader" :loading="pending" type="card" class="h-full flex flex-col">
    <DetailBanner
      v-if="success"
      ref="banner"
      :name="data!.name"
      :link-target="data!.url"
      :description="data!.description"
    >
      <template #logo>
        <LogoImage :url="data!.logo" :origin="data!.url" />
      </template>
      <template #actions>
        <EditForm object-type="Source" :work="change">
          <template #form>
            <EditSourceFormContent :id="id" />
          </template>
        </EditForm>
        <DeleteDialog object-type="Source" :name="data!.name" :work="remove" />
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
import { buildGraphData, type GraphNode } from '~/components/RelationNetwork/utils';
import source from '~/services/source';
import EditSourceFormContent from './_components/EditSourceFormContent.vue';
import { PageRoutes } from '~/consts/routes';
const route = useRoute();
const id = Number(route.params.id);
const { data, status, error, pending, refresh } = useGetSource(id);
const success = computed(() => status.value === 'success');

const loader = ref<{ $el: { clientHeight: number } }>();
const banner = ref<{ $el: { clientHeight: number } }>();
const graphHeight = computed(() =>
  loader.value && banner.value ? loader.value.$el.clientHeight - banner.value.$el.clientHeight : 500
);

const nodeCount = 100;
const {
  loading,
  data: resourceData,
  error: resourceError,
  isLastPage,
  page,
  fetching
} = useListResourceOfSource(id, nodeCount);

const graphData = computed(() => {
  const nodes = new Array<GraphNode>();
  const urls = {} as Record<string, string>;
  for (const item of resourceData.value) {
    const { id, name, url } = item;
    const node = {
      id: id.toString(),
      name,
      url,
      neighbors: new Set<string>()
    };
    nodes.push(node);
    urls[node.id] = url;
  }
  const parents = new Map<GraphNode, GraphNode>();
  const skip = new Map<GraphNode, Set<GraphNode>>();
  for (const node of nodes) {
    skip.set(node, new Set<GraphNode>());
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) {
        continue;
      }
      const node1 = nodes[i]!;
      const node2 = nodes[j]!;
      if (skip.get(node1)!.has(node2)) {
        continue;
      }
      const url1 = urls[node1.id]!;
      const url2 = urls[node2.id]!;
      if (url1.length >= url2.length) {
        skip.get(node2)!.add(node1);
      }
      if (url1.length <= url2.length || !url1.startsWith(url2)) {
        continue;
      }
      if (!parents.has(node1)) {
        parents.set(node1, node2);
        continue;
      }
      const node3 = parents.get(node1)!;
      const url3 = urls[node3.id]!;
      if (url3.length >= url2.length) {
        skip.get(node2)!.add(node3);
      } else {
        skip.get(node3)!.add(node2);
        parents.set(node1, node2);
      }
    }
  }
  for (const [node, parent] of parents.entries()) {
    parent.neighbors.add(node.id);
  }
  return nodes;
});
const graphView = buildGraphData(graphData);
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
    router.push(PageRoutes.SourceManagement);
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
provide('description', description);
provide('name', name);
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
