<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import DataTable from "primevue/datatable";
import { FilterMatchMode } from "primevue/api";
import InputText from "primevue/inputtext";
import Column from "primevue/column";
import Button from "primevue/button";

// Fetching data
const data1 = ref([]);
const dtf = ref();
const exportCSV = () => {
  dtf.value.exportCSV();
};
console.log(dtf);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  rating: { value: null, matchMode: FilterMatchMode.CONTAINS },
  price: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

    data1.value = response.data.products;
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
    ref="dtf"
    scrollable
    paginator-template="FirstPage"
    :value="data1"
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
    <Column
      field="id"
      header="ID"
      :filter-match-mode="FilterMatchMode.STARTS_WITH"
    >
      <template #body="{ data }">
        {{ data.id }}
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
      field="price"
      header="Price"
      :filter-match-mode="FilterMatchMode.CONTAINS"
    ></Column>

    <template #footer>
      <div style="text-align: center">
        <Button @click="pageDataDecreaser()">Prev</Button>
        <Button @click="pageDataIncreaser()">Next</Button>
      </div>
      <div style="text-align: end">
        <Button
          icon="pi pi-external-link"
          label="Export"
          @click="exportCSV($event)"
        />
      </div>
    </template>
  </DataTable>
</template>
