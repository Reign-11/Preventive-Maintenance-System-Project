<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { onMounted, ref } from 'vue';
import axios from 'axios';

// Sample data for analytics - added completed tasks per category
const maintenanceStats = ref({
    categoryTasks: {
        computing: 0,
        data: 0,
        network: 0
    }
});

const monthlyIssues = ref([]);
const lastUpdated = ref('');
const isLoaded = ref(false);
const chartLoaded = ref(false);

onMounted(async () => {
    loadAssets(files);
    
    try {
        // Fetch category task counts
        const computing = await axios.get('/api/maintenance-category-count', { params: { CatId: 1 } });
        maintenanceStats.value.categoryTasks.computing = computing.data.count;

        const dataCenter = await axios.get('/api/maintenance-category-count', { params: { CatId: 2 } });
        maintenanceStats.value.categoryTasks.dataCenter = dataCenter.data.count;

        const network = await axios.get('/api/maintenance-category-count', { params: { CatId: 3 } });
        maintenanceStats.value.categoryTasks.network = network.data.count;

        // Fetch monthly issues
        const { data } = await axios.get('/api/monthly-counts');
        monthlyIssues.value = data;

        // Update timestamp
        const now = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' };
        lastUpdated.value = `Updated on ${now.toLocaleDateString(undefined, options)}`;

        // Wait for assets like Chart.js to load
        setTimeout(() => {
            if (typeof window.feather !== 'undefined') {
                window.feather.replace();
            }
            initCharts(); // Safe to call now
            isLoaded.value = true; // Trigger animations
            
            // Delay chart animation for better sequence
            setTimeout(() => {
                chartLoaded.value = true;
            }, 600);
        }, 500);

    } catch (error) {
        console.error('Initialization failed:', error);
        isLoaded.value = true; // Still show the UI even if data load fails
    }
});

// Existing files to load
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
    '/script/moment.min.js',
    '/script/chart.min.js' // Added Chart.js for analytics
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

// Initialize charts - enhanced for better visual appeal and animation
function initCharts() {
    if (typeof Chart === 'undefined') return;
    
    // Monthly Issues Chart - Enhanced with better styling and animations
    const issuesCtx = document.getElementById('monthlyIssuesChart');
    if (issuesCtx) {
        new Chart(issuesCtx, {
            type: 'bar',
            data: {
                labels: monthlyIssues.value.map(data => data.month),
                datasets: [
                    {
                        label: 'Set A',
                        data: monthlyIssues.value.map(data => data.SetA),
                        backgroundColor: 'rgba(0, 172, 105, 0.8)',
                        borderWidth: 0,
                        borderRadius: 4,
                        barPercentage: 0.7,
                        categoryPercentage: 0.8
                    },
                    {
                        label: 'Set B',
                        data: monthlyIssues.value.map(data => data.SetB),
                        backgroundColor: 'rgba(0, 172, 105, 0.5)',
                        borderWidth: 0,
                        borderRadius: 4,
                        barPercentage: 0.7,
                        categoryPercentage: 0.8
                    },
                    {
                        label: 'Set C',
                        data: monthlyIssues.value.map(data => data.SetC),
                        backgroundColor: 'rgba(0, 172, 105, 0.3)',
                        borderWidth: 0,
                        borderRadius: 4,
                        barPercentage: 0.7,
                        categoryPercentage: 0.8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 172, 105, 0.1)',
                            drawBorder: false
                        },
                        border: {
                            dash: [4, 4]
                        },
                        ticks: {
                            stepSize: 2,
                            font: {
                                weight: 'bold'
                            },
                            callback: function(value) {
                                return value + ' issues';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Number of Issues',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            color: '#495057'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            usePointStyle: true,
                            pointStyle: 'rectRounded',
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Monthly Maintenance Issues by Category',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#00ac69',
                        padding: {
                            bottom: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#495057',
                        bodyColor: '#495057',
                        borderColor: '#00ac69',
                        borderWidth: 1,
                        caretSize: 8,
                        cornerRadius: 6,
                        boxPadding: 6,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw + ' issues';
                            }
                        }
                    }
                }
            }
        });
    }
}
</script>

<template>
    <Head title="Maintenance Analytics Dashboard" />
    <main>
        <!-- Animated header with fade-in effect for logos -->
        <header class="page-header page-header-dark pb-10" 
            style="background: linear-gradient(to bottom, #cbf1dd, #a4d4ae); position: relative;">
            <!-- Left side logo with animation -->
            <div :class="{'logo-animation-left': isLoaded}" style="position: absolute; left: 5%; top: 50%; transform: translateY(-50%); opacity: 0;">
                <img src="assets/cmu.png" alt="Company Logo Left" style="height: 120px;" />
            </div>
            
            <!-- Right side logo with animation -->
            <div :class="{'logo-animation-right': isLoaded}" style="position: absolute; right: 5%; top: 50%; transform: translateY(-50%); opacity: 0;">
                <img src="assets/dto.png" alt="Company Logo Right" style="height: 120px;" />
            </div>
            
            <div class="container">
                <div class="page-header-content pt-4">
                    <div class="row align-items-center justify-content-center">
                        <div class="col-auto mt-4">
                            <!-- Animated title with typewriter effect -->
                            <h1 :class="{'title-animation': isLoaded}" class="page-header-title" style="color: black; opacity: 0;">
                                <div class="page-header-icon"><i data-feather="activity"></i></div>
                                Welcome to the Preventive Maintenance Dashboard
                            </h1>
                            <!-- Animated subtitle with fade-in effect -->
                            <div :class="{'subtitle-animation': isLoaded}" class="page-header-subtitle" style="color: black; opacity: 0;">
                                Use the tools below to monitor upcoming tasks, review maintenance history, and keep your equipment running at its best.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main page content-->
        <div class="container mt-n10">
            <!-- Equipment Category Cards with staggered animation -->
            <div class="row">
                <!-- Computing Units Card - With slide-in and fade animation -->
                <div class="col-xl-4 mb-4">
                    <Link :class="{'card-animation': isLoaded, 'animation-delay-1': true}" 
                          class="card lift h-100 border-left-lg border-left-success" 
                          href="/main"
                          style="opacity: 0; transform: translateY(20px);">
                        <div class="card-body d-flex justify-content-center flex-column">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="me-3">
                                    <i class="feather-xl text-success mb-3 icon-pulse" data-feather="cpu"></i>
                                    <h5>Computing Units</h5>
                                    <div class="text-muted small">Manage servers, workstations, and computing equipment</div>
                                </div>
                                <img src="assets/A.svg" alt="Computing Units" style="width: 8rem" class="icon-float" />
                            </div>
                            <div class="mt-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge bg-success-soft text-success rounded-pill">{{ maintenanceStats.categoryTasks.computing }} Offices/College Involved</span>
                                </div>
                                <div class="progress rounded-pill" style="height: 0.5rem">
                                    <div class="progress-bar bg-success progress-animate" role="progressbar" style="width: 0%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                <!-- Data Center Card - With slide-in and fade animation -->
                <div class="col-xl-4 mb-4">
                    <Link :class="{'card-animation': isLoaded, 'animation-delay-2': true}" 
                          class="card lift h-100 border-left-lg border-left-success" 
                          href="/setb"
                          style="opacity: 0; transform: translateY(20px);">
                        <div class="card-body d-flex justify-content-center flex-column">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="me-3">
                                    <i class="feather-xl text-success mb-3 icon-pulse" data-feather="database"></i>
                                    <h5>Data Center</h5>
                                    <div class="text-muted small">Monitor cooling systems, power units, and storage infrastructure</div>
                                </div>
                                <img src="assets/B.svg" alt="Data Center" style="width: 8rem" class="icon-float" />
                            </div>
                            <div class="mt-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge bg-success-soft text-success rounded-pill">{{ maintenanceStats.categoryTasks.dataCenter }} Offices/College Involved</span>
                                </div>
                                <div class="progress rounded-pill" style="height: 0.5rem">
                                    <div class="progress-bar bg-success progress-animate" role="progressbar" style="width: 0%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                <!-- Network Card - With slide-in and fade animation -->
                <div class="col-xl-4 mb-4">
                    <Link :class="{'card-animation': isLoaded, 'animation-delay-3': true}" 
                          class="card lift h-100 border-left-lg border-left-success" 
                          href="/setc"
                          style="opacity: 0; transform: translateY(20px);">
                        <div class="card-body d-flex justify-content-center flex-column">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="me-3">
                                    <i class="feather-xl text-success mb-3 icon-pulse" data-feather="server"></i>
                                    <h5>Network</h5>
                                    <div class="text-muted small">Maintain routers, switches, and connectivity equipment</div>
                                </div>
                                <img src="assets/C.svg" alt="Network" style="width: 8rem" class="icon-float" />
                            </div>
                            <div class="mt-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge bg-success-soft text-success rounded-pill">{{ maintenanceStats.categoryTasks.network }} Offices/College Involved</span>
                                </div>
                                <div class="progress rounded-pill" style="height: 0.5rem">
                                    <div class="progress-bar bg-success progress-animate" role="progressbar" style="width: 0%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            
            <!-- Monthly Issues Chart - With scale-in animation -->
            <div class="row mb-4">
                <div class="col-xl-12">
                    <div :class="{'chart-animation': isLoaded}" class="card h-100 shadow-lg" style="opacity: 0; transform: scale(0.95);">
                        <div class="card-header d-flex justify-content-between align-items-center" style="background-color: rgba(0, 172, 105, 0.1); border-bottom: 2px solid #00ac69;">
                            <div class="d-flex align-items-center">
                                <i class="feather-lg text-success me-2 icon-pulse" data-feather="bar-chart-2"></i>
                                <h5 class="my-0 text-success">Preventive Maintenence Task Completed</h5>
                            </div>
                            <div class="dropdown no-caret">
                                <button class="btn btn-transparent-dark btn-icon dropdown-toggle" id="areaChartDropdownExample" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i data-feather="more-vertical"></i>
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div :class="{'chart-container-animation': chartLoaded}" class="chart-container" style="position: relative; height: 350px; opacity: 0;">
                                <canvas id="monthlyIssuesChart"></canvas>
                            </div>
                        </div>
                        <div class="card-footer small text-muted d-flex justify-content-between align-items-center">
                            <div>{{ lastUpdated }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Call to action card with slide-up animation -->
        <div :class="{'cta-animation': isLoaded}" class="card card-waves mb-4 mt-5" style="max-width: 1400px; margin-left: auto; margin-right: auto; opacity: 0; transform: translateY(30px);">
            <div class="card-body p-5">
                <div class="row align-items-center justify-content-between">
                    <div class="col">
                        <h2>Digital Transformation Office</h2>
                        <p class="text-gray-700">Great job, your Preventive Maintenance Dashboard is now ready! You can use the tools below to monitor upcoming tasks, review equipment maintenance history, and keep your systems running smoothly.</p>
                        <a class="btn btn-success p-3 btn-pulse" href="/main">
                            Get Started
                            <i class="ms-1" data-feather="bar-chart-2"></i>
                        </a>
                    </div>
                    <div class="col d-none d-lg-block mt-xxl-n4">
                        <img class="img-fluid px-xl-4 mt-xxl-n5 icon-float-slow" src="assets/abc.svg" />
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style>
/* Animation keyframes */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInLeft {
    from {
        opacity: 0;
        transform: translate(-20px, -50%);
    }
    to {
        opacity: 1;
        transform: translate(0, -50%);
    }
}

@keyframes fadeInRight {
    from {
        opacity: 0;
        transform: translate(20px, -50%);
    }
    to {
        opacity: 1;
        transform: translate(0, -50%);
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes fadeInScale {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
    100% {
        transform: translateY(0px);
    }
}

@keyframes floatSlow {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-15px);
    }
    100% {
        transform: translateY(0px);
    }
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes progressAnimation {
    from {
        width: 0%;
    }
    to {
        width: 100%;
    }
}

@keyframes typing {
    from {
        width: 0;
    }
    to {
        width: 100%;
    }
}

/* Animation classes */
.logo-animation-left {
    animation: fadeInLeft 1s ease-out forwards;
}

.logo-animation-right {
    animation: fadeInRight 1s ease-out forwards;
}

.title-animation {
    animation: fadeInUp 1s ease-out forwards;
    animation-delay: 0.2s;
}

.subtitle-animation {
    animation: fadeInUp 1s ease-out forwards;
    animation-delay: 0.4s;
}

.card-animation {
    animation: fadeInUp 0.8s ease-out forwards;
}

.animation-delay-1 {
    animation-delay: 0.3s !important;
}

.animation-delay-2 {
    animation-delay: 0.5s !important;
}

.animation-delay-3 {
    animation-delay: 0.7s !important;
}

.chart-animation {
    animation: scaleIn 0.8s ease-out forwards;
    animation-delay: 0.9s;
}

.chart-container-animation {
    animation: fadeInScale 1s ease-out forwards;
}

.cta-animation {
    animation: fadeInUp 0.8s ease-out forwards;
    animation-delay: 1.1s;
}

.progress-animate {
    animation: progressAnimation 1.5s ease-out forwards;
    animation-delay: 1.5s;
}

.icon-float {
    animation: float 4s ease-in-out infinite;
}

.icon-float-slow {
    animation: floatSlow 6s ease-in-out infinite;
}

.icon-pulse {
    animation: pulse 2s ease-in-out infinite;
}

.btn-pulse:hover {
    animation: pulse 1.5s ease-in-out infinite;
}

/* Hover effects for cards */
.card.lift:hover,
a.card.lift:hover {
    transform: translateY(-10px) !important;
    box-shadow: 0 1rem 3rem rgba(0, 172, 105, 0.15) !important;

}
</style>