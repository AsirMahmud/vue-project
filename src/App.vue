<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import DataTable from "primevue/datatable";
import { FilterMatchMode } from "primevue/api";
import InputText from "primevue/inputtext";
import Column from "primevue/column";
import Button from "primevue/button";
import jsPDF from "jspdf";

import Paginator from "primevue/paginator";
// Fetching data
const data1 = ref([]);
const dtf = ref([]);
const searchData = ref("");
const isLoading = ref(false);
const exportCSV = () => {
  dtf.value.exportCSV();
};
console.log(dtf);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  rating: { value: null, matchMode: FilterMatchMode.CONTAINS },
  category: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
  isLoading.value = true;
  try {
    const response = await axios
      .get(
        `https://dummyjson.com/products?limit=10&skip=${pageData.value}&select=title,price,rating,category,brand&search?q=${searchData.value}`
      )
      .finally(() => {
        isLoading.value = false;
      });

    data1.value = response.data.products;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
console.log(searchData.value);
onMounted(fetchData);

// Watch for changes to filters and refetch when they change

watch(searchData, () => {
  fetchData();
});
const exportPDF = () => {
  const doc = new jsPDF();
  const columns = ["Id", "Title", "Rating", "Price"];
  const dataToPrint = data1.value.map((item) => ({
    Id: item.id,
    Title: item.title,
    Rating: item.rating,
    Price: item.price,
  }));

  // Apply dataToPrint to the body of autoTable
  doc.autoTable({
    styles: { fontSize: 10 },
  });

  // Add rows from dataToPrint to the body

  doc.autoTable({
    columns: columns,
    body: dataToPrint.map((i) => columns.map((j) => i[j])),
    styles: { fontSize: 10 },
  });

  doc.save("exported_data.pdf");
};

console.log(data1.value);
</script>

<template>
  <DataTable
    ref="dtf"
    v-model:filters="filters"
    filter-display="row"
    data-key="id"
    :loading="isLoading"
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
            on-change=""
            placeholder="Just table data  Search"
          />
        </span>
      </div>
    </template>
    <Column field="id" header="ID"></Column>
    <Column
      field="title"
      filter-field="title"
      header="Product Name"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        {{ data.title }}
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          type="text"
          @input="filterCallback()"
          class="p-column-filter"
          placeholder="Search by name"
        />
      </template>
    </Column>
    <Column
      field="category"
      filter-field="category"
      header="Product Name"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        {{ data.category }}
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          type="text"
          @input="filterCallback()"
          class="p-column-filter"
          placeholder="Search by category"
        />
      </template>
    </Column>
    <Column field="rating" header="rating"></Column>
    <Column field="price" header="Price"></Column>

    <template #footer>
      <div style="text-align: center">
        <Button style="margin-right: 12px" @click="pageDataDecreaser()"
          >Prev</Button
        >
        <Button @click="pageDataIncreaser()">Next</Button>
      </div>
      <div style="margin: 10px">
        <Button
          style="margin-left: 12px"
          icon="pi pi-arrow-down"
          label="Export PDF"
          @click="exportPDF"
        />
        <Button
          style="margin-left: 12px"
          icon="pi pi-arrow-down"
          label="Export Csv"
          @click="exportCSV($event)"
        />
      </div>
    </template>
  </DataTable>
</template>
