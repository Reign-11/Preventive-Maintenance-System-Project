<script setup>
import { Link } from '@inertiajs/vue3';
import { onMounted } from 'vue';
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';

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

// Function to dynamically load assets
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
    // Initialize Feather icons after a slight delay to ensure DOM is ready
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
        <div class="sidebar">
            <nav class="sidenav shadow-right sidenav-light">
                <div class="sidebar-logo my-1 d-flex justify-content-center">
                    <img src="/assets/slogo.svg" alt="Logo" style="width: auto; height: auto;">
                </div>

                <ul class="navbar-nav d-flex flex-column align-items-center nav-items-wrapper">
                    <li class="nav-item nav-item-spacing">
                        <Link href="admin" class="nav-link-custom" title="Logs">
                            <i data-feather="clipboard" style="width: 25px; height: 25px;"></i>
                        </Link>
                    </li>
                    <li class="nav-item nav-item-spacing">
                        <Link href="addoffice" class="nav-link-custom" title="Add Office">
                            <i data-feather="monitor" style="width: 25px; height: 25px;"></i>
                        </Link>
                    </li>
                    <li class="nav-item nav-item-spacing">
                        <Link href="addyear" class="nav-link-custom" title="Add Year">
                            <i data-feather="calendar" style="width: 25px; height: 25px;"></i>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <nav class="topnav navbar navbar-expand shadow justify-content-between navbar-light bg-white">
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
                <div class="container-fluid">
                    <div class="d-flex align-items-center justify-content-center small">
                        <div class="text-muted">Admin Dashboard © 2025</div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>

<style scoped>
.layout-wrapper {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(to bottom, #d4f8e8, #a4d4ae);
}

.sidebar {
    width: 90px;
    background: linear-gradient(to bottom, #d4f8e8, #a4d4ae) !important;
    position: fixed;
    height: 100vh;
    top: 0;
    left: 0;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: width 0.3s ease, transform 0.3s ease;
}

::v-deep(.sidebar),
::v-deep(.sidenav-light) {
    background: linear-gradient(to bottom, #d4f8e8, #a4d4ae) !important;
}

.nav-items-wrapper {
    margin-top: 10px;
    width: 100%;
}

.nav-item-spacing {
    width: 90%;
    margin-bottom: 15px;
    text-align: center;
}

.nav-link-custom {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px 5px;
    font-size: 0;
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
    margin-right: 0;
}

.nav-link-custom:hover {
    background-color: #09dada;
    color: white;
}

.nav-link-custom.active {
    background-color: #e0e0e0;
    font-weight: bold;
    border-radius: 5px;
}

.nav-link-custom[aria-current="page"] {
    background-color: #0056b3;
    color: white;
    font-weight: bold;
    border-left: 5px solid #004085;
}

.main-content {
    flex-grow: 1;
    margin-left: 90px;
    width: calc(100% - 90px);
    display: flex;
    flex-direction: column;
}

.topnav {
    width: 100%;
    padding: 10px 20px;
}

.content-area {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
    max-height: calc(100vh - 60px);
}

.topnav, footer {
    background: transparent !important;
    box-shadow: none;
}

@media print {
    .sidebar, .topnav, footer { 
        display: none !important;
    }
    
    .main-content {
        margin-left: 0 !important;
        width: 100% !important;     
        overflow: hidden !important;
    }
}

@media (max-width: 768px) {
    .sidebar {
        width: 90px;
    }
    
    .main-content {
        margin-left: 90px;
        width: calc(100% - 90px);
    }
}
</style>