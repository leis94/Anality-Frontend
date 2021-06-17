import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import "./plugins/vuetify-money.js";

Vue.config.productionTip = false

Vue.filter('humanFormat', function (number) {
  let locale = "en-US";
  let precision = 2;
  if (isNaN(number)) {
    number = "";
  } else {
    number = Number(number).toLocaleString(locale, {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
    });
  }
  return number;
})

new Vue({
  delimiters: ['${', '}'],
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
