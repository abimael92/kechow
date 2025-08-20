import { createApp } from 'vue';
import App from './App.vue';
import router from './app/router';
import { createPinia } from 'pinia';
import './assets/styles/global.css';

import { AppConfig, ThemeConfig, i18n } from './app/config';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
ThemeConfig.applyTheme();

app.mount('#app');
