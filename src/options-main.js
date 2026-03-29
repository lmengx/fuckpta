import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './style.css'
import Options from './Options.vue'

const app = createApp(Options)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.mount('#app')
