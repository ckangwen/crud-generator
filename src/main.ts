import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueCompositionApi from "@vue/composition-api";
import ElementUI from "element-ui";

import "@/assets/styles/flex.css";
import "@/assets/styles/theme/index.css";

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
