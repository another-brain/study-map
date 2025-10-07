<template>
  <v-skeleton-loader :loading="pending" type="card">
    <DetailBanner
      v-if="status === 'success'"
      :name="data!.name"
      :link-text="data!.source.name"
      :link-target="`${PageRoutes.SourceManagement}/${data!.sourceId}`"
      :description="data!.description"
    >
      <template #logo>
        <LogoImage :url="data!.source.logo " :origin="data!.source.url " />
      </template>
    </DetailBanner>
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

const route = useRoute();
const id = Number(route.params.id);
const { data, status, error, pending } = useGetResource(id);
useNoticeError(error);
</script>

<style></style>
