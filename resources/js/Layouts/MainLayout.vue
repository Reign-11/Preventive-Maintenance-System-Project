<script setup>
import { ref, onMounted } from 'vue';


import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
import NavLink from '@/Components/NavLink.vue';

// Reactive variable for sidebar state
const sidebarOpen = ref(false);

// Toggle function for sidebar
const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};

const files = [
    '/script/jquery-3.5.1.min.js', 
    '/script/jquery.dataTables.min.js', 
    '/script/dataTables.bootstrap4.min.js', 
    '/script/bootstrap.bundle.min.js', 
    '/script/all.min.js', 
    '/script/feather.min.js',
    '/script/scripts.js',
    '/script/dataTables.bootstrap4.min.css',
    '/script/styles.css',
    '/script/moment.min.js'
];

function loadAssets(fileArray) {
    fileArray.forEach(file => {
        if (file.endsWith('.js')) {
            if (!document.querySelector(`script[src="${file}"]`)) {
                const script = document.createElement('script');
                script.src = file;
                script.async = false;
                document.body.appendChild(script);
            }
        } else if (file.endsWith('.css')) {
            if (!document.querySelector(`link[href="${file}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = file;
                document.head.appendChild(link);
            }
        }
    });
}

onMounted(() => {
    loadAssets(files);
    setTimeout(() => {
        if (window.feather) {
            window.feather.replace(); 
        }
    }, 500);
});
</script>

<template>
    <div class="nav-fixed">
        <div id="layoutSidenav">
            <!-- Sidebar -->
            <div id="layoutSidenav_nav" :class="{'d-none': !sidebarOpen}">
                <nav class="sidenav shadow-right sidenav-light">
                    <ul class="navbar-nav d-flex flex-column align-items-center">
    <li class="nav-item nav-item-spacing">
        <NavLink :href="route('main')" :active="route().current('main')" class="nav-link-custom">
            Set A
        </NavLink>
    </li>
    <li class="nav-item nav-item-spacing">
        <NavLink :href="route('setb')" :active="route().current('setb')" class="nav-link-custom">
            Set B
        </NavLink>
    </li>
</ul>
        </nav>


            </div>

            <div id="layoutSidenav_content">
                <nav class="topnav navbar navbar-expand shadow justify-content-between navbar-light bg-white">
                    <a class="navbar-brand">Preventive Maintenance</a>

                    <!-- Sidebar Toggle Button -->
                    <button class="btn btn-icon btn-transparent-dark order-1 order-lg-0 mr-lg-2" @click="toggleSidebar">
                        <i data-feather="menu"></i>
                    </button>

                    <!-- User Dropdown -->
                    <ul class="navbar-nav align-items-center ml-auto">
                        <li class="nav-item dropdown no-caret mr-3 mr-lg-0 dropdown-user">
                            <Dropdown align="right" width="48">
                                <template #trigger>
                                    <button class="btn btn-transparent-dark">
                                        {{ $page.props.auth.user.email }}
                                    </button>
                                </template>
                                <template #content>
                                    <DropdownLink :href="route('profile.edit')">Profile</DropdownLink>
                                    <DropdownLink :href="route('logout')" method="post" as="button">Log Out</DropdownLink>
                                </template>
                            </Dropdown>
                        </li>
                    </ul>
                </nav>

                <!-- Page Content -->
                <main class="container-fluid">
                    <slot></slot>
                </main>

                <!-- Footer -->
                <footer class="py-4 bg-light mt-auto">
                    <div class="container-fluid">
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>
<style scoped>
.nav-item-spacing {
    margin-bottom: 60px;
}

.nav-link-custom {
    font-size: 30px; 
    font-weight: bold; 
    color: black;
}


</style>