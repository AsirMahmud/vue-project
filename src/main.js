import { createApp } from "vue";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "./assets/styles.scss";
import jsPDF from "jspdf";
import "jspdf-autotable";

import App from "./App.vue";
const app = createApp(App);
createApp(App).mount("#app");
