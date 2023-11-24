<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import DataTable from "primevue/datatable";
import { FilterMatchMode } from "primevue/api";
import InputText from "primevue/inputtext";
import Column from "primevue/column";
import Button from "primevue/button";

// Fetching data
const data = ref([]);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});
const pageData = ref(0);
const pageDataIncreaser = () => {
  pageData.value += 10;
  fetchData();
};
const pageDataDecreaser = () => {
  pageData.value -= 10;
  fetchData();
};

const fetchData = async () => {
  try {
    const response = await axios.get(
      `https://dummyjson.com/products?limit=10&skip=${
        pageData.value
      }&select=title,price,rating,category,brand&search?q=${""}`
    );

    data.value = response.data.products;
    console.log(data.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(fetchData);

// Watch for changes to filters and refetch when they change
watch(filters, () => {
  fetchData();
});
</script>

<template>
  <DataTable
    scrollable
    paginator-template="FirstPage"
    :value="data"
    :global-filter-fields="['id', 'title', 'price', 'rating', 'category']"
    :filters="filters"
  >
    <template #header>
      <div class="flex justify-content-end">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="filters['global'].value"
            placeholder="Keyword Search"
          />
        </span>
      </div>
    </template>
    <Column field="id" header="ID" style="min-width: 12rem">
      <template #body="{ data }">
        {{ data.id }}
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          type="text"
          @input="filterCallback()"
          class="p-column-filter"
          placeholder="Search by id"
        />
      </template>
    </Column>
    <Column
      field="title"
      header="Title"
      :filter-match-mode="FilterMatchMode.CONTAINS"
    ></Column>
    <Column
      field="rating"
      header="Rating"
      :filter-match-mode="FilterMatchMode.CONTAINS"
    ></Column>
    <Column
      field="category"
      header="category"
      :filter-match-mode="FilterMatchMode.CONTAINS"
    ></Column>
    <Column
      field="price"
      header="Price"
      :filter-match-mode="FilterMatchMode.CONTAINS"
    ></Column>

    <template #footer>
      <Button :unstyled="disable" @click="pageDataDecreaser()">Prev</Button>
      <Button :unstyled="disable" @click="pageDataIncreaser()">Next</Button>
    </template>
  </DataTable>
</template>
