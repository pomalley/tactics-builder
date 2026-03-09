import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { importFromShareLink } from './store';

// Handle army sharing links
const urlParams = new URLSearchParams(window.location.search);
const sharedArmy = urlParams.get('army');

if (sharedArmy) {
  importFromShareLink(sharedArmy).then((success) => {
    if (success) {
      // Clear URL parameter without reloading
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  });
}

createApp(App).mount('#app');
