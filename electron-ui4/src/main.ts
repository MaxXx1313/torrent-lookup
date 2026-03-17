import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)


// Add global afterEach guard
router.afterEach((to, from) => {
    console.log('routeInfo', to.fullPath);

    return window.electronAPI.setCurrentPage(to.fullPath);
});

// restore previous route
window.electronAPI.getCurrentPage().then(lastRoute => {
    if (lastRoute) {
        router.replace(lastRoute);
    }
});

app.mount('#app')
