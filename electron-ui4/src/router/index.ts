import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    // history: createWebHistory(import.meta.env.BASE_URL), // < not working with electron
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: '/target',
        },
        {
            path: '/target',
            name: 'target',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/ScanTarget.vue'),
        },
        {
            path: '/progress',
            name: 'progress',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/ScanProgress.vue'),
        },
        {
            path: '/results',
            name: 'results',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/ScanResults.vue'),
        },
        {
            path: '/export',
            name: 'export',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/ScanExport.vue'),
        },
        {
            path: '/exportprogress',
            name: 'exportprogress',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/ScanExportProgress.vue'),
        },
    ],
})

export default router
