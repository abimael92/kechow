import { createApp } from 'vue';
import App from './App.vue';
import router from './app/router';
import { createPinia } from 'pinia';
import './assets/styles/global.css';

import { AppConfig, ThemeConfig, i18n } from './app/config';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

const toastOptions = {
	position: 'top-center',
	timeout: 3000,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	hideProgressBar: false,
	transition: 'Vue-Toastification__fade',
};

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(Toast as any, toastOptions);

ThemeConfig.applyTheme();

app.mount('#app');