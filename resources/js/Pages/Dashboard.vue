<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { onMounted, ref } from 'vue';
import axios from 'axios';


// Sample data for analytics - added completed tasks per category
const maintenanceStats = ref({
    categoryTasks: {
        computing: 0,
        data: 0 ,
        network:0
    }
});


const monthlyIssues = ref([]);
    const lastUpdated = ref('');

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
        }, 500);

    } catch (error) {
        console.error('Initialization failed:', error);
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

// Initialize charts - enhanced for better visual appeal
function initCharts() {
    if (typeof Chart === 'undefined') return;
    
    // Monthly Issues Chart - Enhanced with better styling
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

onMounted(() => {
    loadAssets(files);
    setTimeout(() => {
        if (typeof window.feather !== 'undefined') {
            window.feather.replace();
        }
        initCharts();
    }, 500);
});
</script>

<template>
    <Head title="Maintenance Analytics Dashboard" />
    <main>
        <header class="page-header page-header-dark pb-10" 
            style="background: linear-gradient(to bottom, #cbf1dd, #a4d4ae); position: relative;">
            <!-- Left side logo -->
            <div style="position: absolute; left: 5%; top: 50%; transform: translateY(-50%);">
                <img src="assets/cmu.png" alt="Company Logo Left" style="height: 120px;" />
            </div>
            
            <!-- Right side logo -->
            <div style="position: absolute; right: 5%; top: 50%; transform: translateY(-50%);">
                <img src="assets/slogo.svg" alt="Company Logo Right" style="height: 120px;" />
            </div>
            
            <div class="container">
                <div class="page-header-content pt-4">
                    <div class="row align-items-center justify-content-center">
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
        <div class="container mt-n10">
            <!-- Equipment Category Cards - First position -->
            <div class="row">
                <!-- Computing Units Card - Updated with success color -->
                <div class="col-xl-4 mb-4">
                    <Link class="card lift h-100 border-left-lg border-left-success" href="/main">
                        <div class="card-body d-flex justify-content-center flex-column">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="me-3">
                                    <i class="feather-xl text-success mb-3" data-feather="cpu"></i>
                                    <h5>Computing Units</h5>
                                    <div class="text-muted small">Manage servers, workstations, and computing equipment</div>
                                </div>
                                <img src="assets/A.svg" alt="Computing Units" style="width: 8rem" />
                            </div>
                            <div class="mt-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="badge bg-success-soft text-success rounded-pill">{{ maintenanceStats.categoryTasks.computing }} Offices/College  Involved</span>
                                </div>
                                <div class="progress rounded-pill" style="height: 0.5rem">
                                    <div class="progress-bar bg-success" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                <!-- Data Center Card - Updated with success color -->
                <div class="col-xl-4 mb-4">
                    <Link class="card lift h-100 border-left-lg border-left-success" href="/setb">
                        <div class="card-body d-flex justify-content-center flex-column">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="me-3">
                                    <i class="feather-xl text-success mb-3" data-feather="database"></i>
                                    <h5>Data Center</h5>
                                    <div class="text-muted small">Monitor cooling systems, power units, and storage infrastructure</div>
                                </div>
                                <img src="assets/B.svg" alt="Data Center" style="width: 8rem" />
                            </div>
                            <div class="mt-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                   
                                    <span class="badge bg-success-soft text-success rounded-pill">{{ maintenanceStats.categoryTasks.dataCenter }} Offices/College  Involved</span>
                                </div>
                                <div class="progress rounded-pill" style="height: 0.5rem">
                                    <div class="progress-bar bg-success" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                <!-- Network Card -->
                <div class="col-xl-4 mb-4">
                    <Link class="card lift h-100 border-left-lg border-left-success" href="/setc">
                        <div class="card-body d-flex justify-content-center flex-column">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="me-3">
                                    <i class="feather-xl text-success mb-3" data-feather="server"></i>
                                    <h5>Network</h5>
                                    <div class="text-muted small">Maintain routers, switches, and connectivity equipment</div>
                                </div>
                                <img src="assets/C.svg" alt="Network" style="width: 8rem" />
                            </div>
                            <div class="mt-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    
                                    <span class="badge bg-success-soft text-success rounded-pill">{{ maintenanceStats.categoryTasks.network }} Offices/College  Involved</span>
                                </div>
                                <div class="progress rounded-pill" style="height: 0.5rem">
                                    <div class="progress-bar bg-success" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            
            <!-- Monthly Issues Chart - Enhanced card styling -->
            <div class="row mb-4">
                <div class="col-xl-12">
                    <div class="card h-100 shadow-lg">
                        <div class="card-header d-flex justify-content-between align-items-center" style="background-color: rgba(0, 172, 105, 0.1); border-bottom: 2px solid #00ac69;">
                            <div class="d-flex align-items-center">
                                <i class="feather-lg text-success me-2" data-feather="bar-chart-2"></i>
                                <h5 class="my-0 text-success">Preventive Maintenence Task Completed</h5>
                            </div>
                            <div class="dropdown no-caret">
                                <button class="btn btn-transparent-dark btn-icon dropdown-toggle" id="areaChartDropdownExample" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i data-feather="more-vertical"></i>
                                </button>
                             
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="chart-container" style="position: relative; height: 350px;">
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

        <!-- Call to action card-->
        <div class="card card-waves mb-4 mt-5" style="max-width: 1400px; margin-left: auto; margin-right: auto;">
            <div class="card-body p-5">
                <div class="row align-items-center justify-content-between">
                    <div class="col">
                        <h2>Digital Transformation Office</h2>
                        <p class="text-gray-700">Great job, your Preventive Maintenance Dashboard is now ready! You can use the tools below to monitor upcoming tasks, review equipment maintenance history, and keep your systems running smoothly.</p>
                        <a class="btn btn-success p-3" href="/main">
                            Get Started
                            <i class="ms-1" data-feather="bar-chart-2"></i>
                        </a>
                    </div>
                    <div class="col d-none d-lg-block mt-xxl-n4">
                        <img class="img-fluid px-xl-4 mt-xxl-n5" src="assets/abc.svg" />
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>