import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import "./assets/base.css";
import "./assets/main.css";

let app;

if (!app) {
  app = createApp(App);

  app.use(router);

  app.mount("#app");
}
