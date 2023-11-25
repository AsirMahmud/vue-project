<script setup>
import DataTable from "primevue/datatable";
import { FilterMatchMode } from "primevue/api";
import InputText from "primevue/inputtext";
import Column from "primevue/column";
import userData from "./assets/student_info.json";
import { onMounted, ref } from "vue";
import Button from "primevue/button";
import jsPDF from "jspdf";

const data = ref([]);
const dtf = ref(null);
const filters = ref({
  global: {
    value: "",
  },
});

onMounted(() => {
  userData.forEach((i) => {
    data.value.push(...i.students);
  });
});

const exportCSV = () => {
  if (dtf.value) {
    dtf.value.exportCSV();
  }
};

const exportPDF = () => {
  const doc = new jsPDF();
  const columns = [
    "Name",
    "Roll",
    "Student Id",
    "Father's Name",
    "Mother's Name",
    "Phone Number",
    "Grade",
  ];
  const dataToPrint = data.value.map((item) => ({
    Name: item.name,
    Roll: item.roll,
    "Student Id": item.student_id,
    "Father's Name": item.guardian_details.father_name,
    "Mother's Name": item.guardian_details.mother_name,
    "Phone Number": item.guardian_details.contact,
    Grade: item.academic_details.grade,
  }));

  // Apply dataToPrint to the body of autoTable
  doc.autoTable({
    columns: columns,
    body: [columns.map((column) => column)],
    styles: { fontSize: 10 },
    startY: 20,
  });

  // Add rows from dataToPrint to the body
  dataToPrint.forEach((item) => {
    const rowData = columns.map((column) => item[column]);
    doc.autoTable({
      body: [rowData],
      styles: { fontSize: 10 },
    });
  });

  doc.save("exported_data.pdf");
};
</script>

<template>
  <DataTable
    ref="dtf"
    :value="data"
    :global-filter-fields="[
      'name',
      'roll',
      'student_id',
      'guardian_details.father_name',
    ]"
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

    <template #empty>No customers found.</template>

    <template #loading>Loading customers data. Please wait.</template>

    <Column
      field="name"
      header="Name"
      :filter-match-mode="FilterMatchMode.CONTAINS"
    ></Column>

    <Column
      field="roll"
      header="Roll"
      :filter-match-mode="FilterMatchMode.CONTAINS"
    ></Column>

    <Column
      field="student_id"
      header="Student Id"
      :filter-match-mode="FilterMatchMode.CONTAINS"
    ></Column>

    <Column
      field="guardian_details.father_name"
      header="Father"
      :filter-match-mode="FilterMatchMode.CONTAINS"
    ></Column>

    <Column field="guardian_details.mother_name" header="Mother"></Column>

    <Column field="guardian_details.contact" header="Phone Number"></Column>

    <Column field="academic_details.grade" header="Grade"></Column>

    <template #footer>
      <div style="">
        <Button icon="pi pi-download" label="Export CSV" @click="exportCSV" />
        <Button
          style="margin-left: 5px"
          icon="pi pi-external-link"
          label="Export PDF"
          @click="exportPDF"
        />
      </div>
    </template>
  </DataTable>
</template>
