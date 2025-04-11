<script setup>
import { ref, onMounted } from 'vue';

import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
import NavLink from '@/Components/NavLink.vue';

// Sidebar state
// const sidebarOpen = ref(false);

// Toggle function for sidebar
// const toggleSidebar = () => {
//     sidebarOpen.value = !sidebarOpen.value;
// };

// Define sidebarOpen state
const sidebarOpen = ref(false);  // Initially false (collapsed)


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


                <!-- Logo Container -->
                <div class="sidebar-logo my-1 d-flex justify-content-center">
                    <img src="/assets/slogo.svg" alt="Logo">
                </div>

                <!-- Nav Items Wrapper (Push Down Set A) -->
                <ul class="navbar-nav d-flex flex-column align-items-center nav-items-wrapper">
                    <li class="nav-item nav-item-spacing">
                        <NavLink :href="route('main')" :active="route().current('main')" class="nav-link-custom">
                            <i data-feather="cpu" style="width: 25px; height: 25px; font-size: 8px; margin-right: 8px;"></i> Set A
                        </NavLink>
                    </li>
                    <li class="nav-item nav-item-spacing">
                        <NavLink :href="route('setb')" :active="route().current('setb')" class="nav-link-custom">
                            <i data-feather="database" style="width: 25px; height: 25px; font-size: 8px; margin-right: 8px;"></i> Set B
                        </NavLink>
                    </li>
                    <li class="nav-item nav-item-spacing">
                        <NavLink :href="route('setc')" :active="route().current('setc')" class="nav-link-custom">
                            <i data-feather="server" style="width: 25px; height: 25px; font-size: 8px; margin-right: 8px;"></i> Set C
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <nav class="topnav navbar navbar-expand shadow justify-content-between navbar-light bg-white">
                <!-- Sidebar Toggle Button -->
                <!-- <button class="btn btn-icon btn-transparent-dark order-1 order-lg-0" @click="toggleSidebar">
                    <i data-feather="menu"></i>
                </button> -->

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

.nav-items-wrapper {
    margin-top: 10px; /* Adjust as needed */
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
    background-color: #dad709; /* Blue background */
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
    width: 90px; /* Collapsed Sidebar */
}

/* Sidebar Collapsed State */
.sidebar-collapsed .nav-link-custom {
    justify-content: flex-start; /* Align text and icons properly */
    font-size: 18px; /* Keep text visible */
    padding-left: 8px; /* Add padding to balance layout */
}

/* Ensure icons are visible and aligned properly with the same size */
.sidebar-collapsed .nav-link-custom i {
    margin-right: 10px; /* Keep space between icon and text */
    font-size: 22px; /* Set icon size same as when expanded */
}

/* Keep text and icons visible even when the sidebar is collapsed */
.sidebar-collapsed .nav-item-spacing {
    width: 100%;
    margin-bottom: 15px;
    text-align: left; /* Align text to left */
}

/* Main Content */
.main-content {
    flex-grow: 1;
    margin-left: 250px; /* Sidebar width */
    transition: margin-left 0.3s ease-in-out;
    width: calc(100% - 250px); /* Full width minus the sidebar */
    background: linear-gradient(to bottom, #d4f8e8, #a4d4ae);
}

/* When sidebar is collapsed, adjust the width of the main content */
.sidebar-collapsed + .main-content {
    margin-left: 90px; /* Adjust for the collapsed sidebar */
    width: calc(100% - 90px); /* Full width minus the collapsed sidebar width */
}

/* Top navigation bar should span the full width */
.topnav {
    width: 100%;
}

/* Make sure the footer also spans the full width */
footer {
    width: 100%;
}

/* Adjust the sidebar when collapsed to make it more compact */
.sidebar-collapsed {
    width: 90px; /* Collapsed sidebar width */
}

/* Ensure the content doesn't overflow horizontally */
.layout-wrapper {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(to bottom, #d4f8e8, #a4d4ae); /* Gradient Background */
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