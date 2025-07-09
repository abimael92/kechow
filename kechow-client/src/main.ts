import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import './styles/global.css';

import en from './locales/en.json';
import es from './locales/es.json';

const i18n = createI18n({
	legacy: false,
	locale: 'en-US',
	fallbackLocale: 'en-US',
	messages: {
		'en-US': en,
		'es-ES': es,
	},
});

const pinia = createPinia();

createApp(App).use(router).use(i18n).use(pinia).mount('#app');
