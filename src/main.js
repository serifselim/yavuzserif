import './index.css';
import 'animate.css';
import { createApp } from 'vue'
import { TroisJSVuePlugin } from 'troisjs'
import App from './App.vue'

const app = createApp(App)

app.use(TroisJSVuePlugin)
app.mount('#app')
