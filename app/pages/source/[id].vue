<template>
  <v-skeleton-loader :loading="pending" type="card">
    <DetailBanner
      v-if="status === 'success'"
      :name="data!.name"
      :link-target="data!.url"
      :description="data!.description"
    >
      <template #logo>
        <LogoImage :url="data!.logo" :origin="data!.url" />
      </template>
    </DetailBanner>
    <PageError
      v-else
      err-type="Loading Error"
      message="Fetch data failed"
      :detail="`Get source ${id} data failed`"
    />
  </v-skeleton-loader>
</template>

<script lang="ts" setup>
const route = useRoute();
const id = Number(route.params.id);
const { data, status, error, pending } = useGetSource(id);
useNoticeError(error);
</script>

<style></style>
