import List from './pages/List.js';
import Leaderboard from './pages/Leaderboard.js';
import Login from './pages/login.js';

const routes = [
    { path: '/list', component: List },        // Страница списка уровней доступна по "/list"
    { path: '/leaderboard', component: Leaderboard },
    { path: '/login', component: Login }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

const app = Vue.createApp({
    data() {
        return {
            store: Vue.reactive({
                dark: localStorage.getItem('dark') === 'true',
                toggleDark() {
                    this.dark = !this.dark;
                    localStorage.setItem('dark', this.dark);
                }
            })
        };
    }
});

app.use(router);
app.mount('#app');
