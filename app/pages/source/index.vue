<template>
  <v-container ref="containerRef" fluid class="h-full flex flex-col">
    <SearchBar
      ref="input"
      :loading="loading"
      :loading-items="loadingItems"
      :items="items"
      @submit="refresh"
      @more="fetchNextPageItems"
    />
    <v-infinite-scroll class="h-full" direction="horizontal" :items="data" @load="fetchNextPage">
      <v-row class="h-fit">
        <template v-for="item in data" :key="item.id">
          <ItemCard
            :id="item.id"
            :title="item.name!"
            :text="item.description!"
            :icon="item.logo"
            :source="item.url"
          />
        </template>
      </v-row>
      <template #loading />
    </v-infinite-scroll>
    <v-row class="flex justify-end">
      <CreateResourceForm title="Create Resource" @submit="refresh" />
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { InfiniteScrollStatus } from '~/types';

const input = ref<{ text: string }>();
const keyword = computed(() => input.value?.text ?? '');
const { loading, data, error, isLastPage, page, refresh, fetching } = useListSource(keyword, 20);
function fetchNextPage({ done }: { done: (status: InfiniteScrollStatus) => void }) {
  if (error) {
    done('error');
  } else if (isLastPage.value) {
    done('empty');
  } else if (loading.value || fetching.value) {
    done('loading');
  } else {
    page.value++;
    const stop = watch(
      [loading, fetching],
      ([loading, fetching]) => {
        if (!loading && !fetching) {
          done(isLastPage.value ? 'empty' : 'ok');
          stop();
        }
      },
      { once: true }
    );
  }
}

const {
  loading: loadingItems,
  data: optionData,
  error: itemsError,
  page: itemsPage,
  isLastPage: isLastPageOfItems,
  fetching: fetchingItems
} = useSearchSource(keyword, 10);
const items = computed(() => optionData.value.map(item => item.name));

function fetchNextPageItems(isIntersecting: boolean) {
  if (
    isIntersecting &&
    !itemsError.value &&
    !isLastPageOfItems.value &&
    !loadingItems.value &&
    !fetchingItems.value
  ) {
    itemsPage.value++;
  }
}

useNoticeError(error, itemsError);
</script>

<style></style>
