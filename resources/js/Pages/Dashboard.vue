<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { onMounted } from 'vue';
import feather from 'feather-icons';

onMounted(() => {
    feather.replace();
});



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
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <main>
            <header class="page-header page-header-dark pb-10" 
                style="background: linear-gradient(to bottom, #cbf1dd, #a4d4ae); position: relative;">
                <!-- Left side logo -->
                <div style="position: absolute; left: 5%; top: 50%; transform: translateY(-50%);">
                    <img src="assets/cmu.png" alt="Company Logo Left" style="height: 120px;" />
                </div>
                
                <!-- Right side logo -->
                <div style="position: absolute; right: 5%; top: 50%; transform: translateY(-50%);">
                    <img src="assets/cmu.png" alt="Company Logo Right" style="height: 120px;" />
                </div>
                
                <div class="container">
                    <div class="page-header-content pt-4">
                        <div class="row align-items-center  justify-content-center align-items-center">
                            <div class="col-auto mt-4">
                                <h1 class="page-header-title" style="color: black;">
                                    <div class="page-header-icon"><i data-feather="activity"></i></div>
                                    Welcome to the Preventive Maintenance Dashboard
                                </h1>
                                <div class="page-header-subtitle" style="color: black;">
                                    Use the tools below to monitor upcoming tasks, review maintenance history, and keep your equipment running at its best.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main page content-->
           <!-- Main content area with improved shadows and spacing -->
           <div class="container mt-n10">
                <!-- Equipment Category Cards -->
                <div class="row">
                    <!-- Computing Units Card - Fixed missing icon -->
                    <div class="col-xl-4 mb-4">
                        <a class="card lift h-100 border-left-lg border-left-success" href="/main">
                            <div class="card-body d-flex justify-content-center flex-column">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="me-3">
                                        <i class="feather-xl text-success mb-3" data-feather="cpu"></i>
                                        <h5>Computing Units</h5>
                                        <div class="text-muted small">Manage servers, workstations, and computing equipment</div>
                                    </div>
                                    <img src="assets/A.svg" alt="Computing Units" style="width: 8rem" />
                                </div>
                                <!-- <div class="mt-3">
                                    <span class="badge bg-primary-soft text-primary rounded-pill">12 Devices</span>
                                    <span class="badge bg-warning-soft text-warning rounded-pill ms-2">2 Pending Tasks</span>
                                </div> -->
                            </div>
                        </a>
                    </div>

                    <!-- Data Center Card - Improved consistency -->
                    <div class="col-xl-4 mb-4">
                        <a class="card lift h-100 border-left-lg border-left-success" href="/setb">
                            <div class="card-body d-flex justify-content-center flex-column">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="me-3">
                                        <i class="feather-xl text-success mb-3" data-feather="database"></i>
                                        <h5>Data Center</h5>
                                        <div class="text-muted small">Monitor cooling systems, power units, and storage infrastructure</div>
                                    </div>
                                    <img src="assets/B.svg" alt="Data Center" style="width: 8rem" />
                                </div>
                                <!-- <div class="mt-3">
                                    <span class="badge bg-secondary-soft text-secondary rounded-pill">8 Systems</span>
                                    <span class="badge bg-success-soft text-success rounded-pill ms-2">All Tasks Complete</span>
                                </div> -->
                            </div>
                        </a>
                    </div>

                    <!-- Network Card - Updated with relevant content -->
                    <div class="col-xl-4 mb-4">
                        <a class="card lift h-100 border-left-lg border-left-success" href="/setc">
                            <div class="card-body d-flex justify-content-center flex-column">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="me-3">
                                        <i class="feather-xl text-success mb-3" data-feather="server"></i>
                                        <h5>Network</h5>
                                        <div class="text-muted small">Maintain routers, switches, and connectivity equipment</div>
                                    </div>
                                    <img src="assets/C.svg" alt="Network" style="width: 8rem" />
                                </div>
                                <!-- <div class="mt-3">
                                    <span class="badge bg-success-soft text-success rounded-pill">16 Devices</span>
                                    <span class="badge bg-danger-soft text-danger rounded-pill ms-2">1 Critical Task</span>
                                </div> -->
                            </div>
                        </a>
                    </div>
                </div>
             </div>
            <!-- Illustration dashboard card example-->
            <div class="card card-waves mb-4 mt-5" style="max-width: 1400px; margin-left: auto; margin-right: auto;">
                <div class="card-body p-5">
                    <div class="row align-items-center justify-content-between">
                        <div class="col">
                            <h2>Welcome back to Digital Transformation Office!</h2>
                            <p class="text-gray-700">Great job, your Preventive Maintenance Dashboard is now ready! You can use the tools below to monitor upcoming tasks, review equipment maintenance history, and keep your systems running smoothly.</p>
                            <a class="btn btn-primary p-3" href="main">
                                Get Started
                                <i class="ml-1" data-feather="arrow-right"></i>
                            </a>
                        </div>
                        <div class="col d-none d-lg-block mt-xxl-n4">
                            <img class="img-fluid px-xl-4 mt-xxl-n5" src="assets/abc.svg" />
                        </div>
                    </div>
                </div>
            </div>

        </main>
    </AuthenticatedLayout>
</template>
