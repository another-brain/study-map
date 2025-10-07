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
            :icon="item.source.logo"
            :source="item.source.url"
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
const input = ref<{ text: string }>();
const keyword = computed(() => input.value?.text ?? '');
const { loading, data, error, isLastPage, page, refresh, fetching } = useListResource(keyword, 20);

type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error';
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
  data: items,
  error: itemsError,
  page: itemsPage,
  isLastPage: isLastPageOfItems,
  fetching: fetchingItems
} = useSearchResource(keyword, 10);

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
