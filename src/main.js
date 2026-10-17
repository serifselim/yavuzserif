import './index.css';
import 'animate.css';
import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import theme from './theme'

const app = createApp(App)

app.use(theme)
app.use(i18n)
app.mount('#app')
