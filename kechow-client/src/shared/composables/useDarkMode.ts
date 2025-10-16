import { ref, watchEffect, onMounted } from 'vue';

const isDark = ref(false);

export function useDarkMode() {
	const html = document.documentElement;

	const updateClass = () => {
		if (isDark.value) html.classList.add('dark');
		else html.classList.remove('dark');
		localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
	};

	onMounted(() => {
		const saved = localStorage.getItem('theme');
		isDark.value = saved === 'dark';
		updateClass();
	});

	watchEffect(updateClass);

	const toggleDarkMode = () => {
		isDark.value = !isDark.value;
	};

	return { isDark, toggleDarkMode };
}
