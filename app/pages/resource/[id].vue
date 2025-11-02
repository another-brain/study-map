<template>
  <v-skeleton-loader :loading="pending" type="card" class="h-full">
    <DetailBanner
      v-if="success"
      :name="data!.name"
      :link-text="data!.source.name"
      :link-target="`${PageRoutes.SourceManagement}/${data!.sourceId}`"
      :description="data!.description"
    >
      <template #logo>
        <LogoImage :url="data!.source.logo " :origin="data!.source.url " />
      </template>
      <template #actions>
        <EditForm object-type="Resource" :work="change">
          <template #form>
            <EditResourceFormContent :id="id" ref="form" />
          </template>
        </EditForm>
        <DeleteDialog object-type="Resource" :name="data!.name" :work="remove" />
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
import EditResourceFormContent from './_components/EditResourceFormContent.vue';

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
    router.push(PageRoutes.ResourceManagement);
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
provide('name', name);
provide('description', description);
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
