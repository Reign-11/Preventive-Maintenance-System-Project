<script setup>
import { ref, onMounted } from 'vue';

import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
import NavLink from '@/Components/NavLink.vue';

// Sidebar state
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
        if (typeof window.feather !== 'undefined') {
            window.feather.replace(); 
        }
    }, 500);
});

</script>

<template>
    <div class="layout-wrapper">
        <!-- Sidebar -->
        <div class="sidebar" :class="{ 'sidebar-collapsed': !sidebarOpen }">
            <nav class="sidenav shadow-right sidenav-light">
                <!-- Nav Items Wrapper (Push Down Set A) -->
                <ul class="navbar-nav d-flex flex-column align-items-center nav-items-wrapper">
                    <li class="nav-item nav-item-spacing">
                        <NavLink :href="route('main')" :active="route().current('main')" class="nav-link-custom">
                            <i data-feather="grid" style="margin-right: 8px;"></i> Set A
                        </NavLink>
                    </li>
                    <li class="nav-item nav-item-spacing">
                        <NavLink :href="route('setb')" :active="route().current('setb')" class="nav-link-custom">
                            <i data-feather="layers" style="margin-right: 8px;"></i> Set B
                        </NavLink>
                    </li>
                    <li class="nav-item nav-item-spacing">
                        <NavLink :href="route('setc')" :active="route().current('setc')" class="nav-link-custom">
                            <i data-feather="folder" style="margin-right: 8px;"></i> Set C
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <nav class="topnav navbar navbar-expand shadow justify-content-between navbar-light bg-white">
                <!-- Sidebar Toggle Button -->
                <button class="btn btn-icon btn-transparent-dark order-1 order-lg-0" @click="toggleSidebar">
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
            <main class="content-area">
                <slot></slot>
            </main>

            <!-- Footer -->
            <footer class="py-4 bg-light mt-auto">
                <div class="container-fluid"></div>
            </footer>
        </div>
    </div>
</template>


<style scoped>
::v-deep(.sidebar),
::v-deep(.sidenav-light) {
    background: linear-gradient(to bottom, #d4f8e8, #a4d4ae) !important;
}

/* Adjust margin above Set A */
.nav-items-wrapper {
    margin-top: 100px; /* Increase this value to lower the items */
    width: 100%;
}

/* Sidebar Navigation Items */
.nav-item-spacing {
    width: 90%;
    margin-bottom: 15px;
    text-align: center;
}

/* Navigation Link Styling */
.nav-link-custom {
    display: flex;
    align-items: center;
    justify-content: flex-start; /* Align text properly */
    width: 100%;
    padding: 12px;
    font-size: 18px;
    font-weight: 600;
    color: #333; 
    background-color: #f8f9fa;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
    text-decoration: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.nav-link-custom i {
    margin-right: 10px; /* Space between icon and text */
}

/* Hover Effect */
.nav-link-custom:hover {
    background-color: #007bff; /* Blue background */
    color: white;
}

/* Active State */
.nav-link-custom[aria-current="page"] {
    background-color: #0056b3; /* Darker blue for active */
    color: white;
    font-weight: bold;
    border-left: 5px solid #004085; /* Left border for emphasis */
}

/* Overall Layout */
.layout-wrapper {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(to bottom, #d4f8e8, #a4d4ae); /* Gradient Background */
}

.sidebar {
    width: 250px;
    background: linear-gradient(to bottom, #d4f8e8, #a4d4ae) !important;
    transition: width 0.3s ease-in-out;
    position: fixed;
    height: 100vh;
    top: 0;
    left: 0;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.sidebar-collapsed {
    width: 60px; /* Collapsed Sidebar */
}

.sidebar-collapsed .nav-link-custom {
    justify-content: center;
    font-size: 0; /* Hide text */
}

.sidebar-collapsed .nav-link-custom i {
    margin-right: 0; /* Remove spacing when collapsed */
}

/* Main Content */
.main-content {
    flex-grow: 1;
    margin-left: 250px;
    transition: margin-left 0.3s ease-in-out;
    width: calc(100% - 250px);
    background: linear-gradient(to bottom, #d4f8e8, #a4d4ae);
}

.sidebar-collapsed + .main-content {
    margin-left: 60px;
    width: calc(100% - 60px);
}

.content-area {
    flex-grow: 1;
    overflow-y: auto; /* Enables scrolling */
    padding: 20px;
    max-height: calc(100vh - 60px); /* Adjust height to fit viewport */
    
}

.topnav, footer {
    background: transparent !important;
    box-shadow: none;
}

@media print {
    .sidebar, .topnav, footer { 
        display: none !important; /* Hide sidebar, navbar, and footer */
    }
    
    .main-content {
        margin-left: 0 !important; /* Expand content to full width */
        width: 100% !important;
        overflow: hidden !important; /* Prevent scrollbars */
    }
    
    body {
        overflow: hidden !important;
    }

    /* Hide horizontal scrollbar */
    ::-webkit-scrollbar {
        display: none;
    }
}
</style>