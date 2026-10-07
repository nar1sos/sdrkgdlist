// js/main.js

import List from './pages/List.js';
import Leaderboard from './pages/Leaderboard.js';
import Login from './pages/login.js';
import Achievements from './pages/Achievements.js';

const routes = [
    { path: '/', redirect: '/list' },
    { path: '/list', component: List },
    { path: '/leaderboard', component: Leaderboard },
    { path: '/login', component: Login },
    { path: '/achievements', component: Achievements }
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
