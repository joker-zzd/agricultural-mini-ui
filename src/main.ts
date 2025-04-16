import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/idnex";
import { Button, Toast } from "vant";
import "vant/lib/index.css";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "vant/es/toast/style";

import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.use(router);
app.use(Button);
app.use(Toast);

app.mount("#app");
