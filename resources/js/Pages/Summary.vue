<script setup>
import { ref, onMounted, watch, onUnmounted,onUpdated } from 'vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Head } from '@inertiajs/vue3';
import axios from 'axios';

// Data

const loading = ref(true);
const selectedYrId = ref(null);
const availableYears = ref([]); 
const summaryData = ref({});
const chartData = ref({
    pieChart: [],
    barChart: []
});

// Chart instances (for cleanup)
let pieChartInstance = null;
let barChartInstance = null;

// Single onMounted function
onMounted(async () => {
    try {
        loading.value = true;

        // 1. Get available years first
        console.log('Fetching available years...');
        const yearResponse = await axios.get('/api/getAvailableYears');
        availableYears.value = yearResponse.data || [];
        
        console.log('Available years:', availableYears.value);

        // 2. Set default selected year
        if (availableYears.value.length > 0) {
            // Assuming the API returns objects with YrId property
            selectedYrId.value = availableYears.value[0].YrId || availableYears.value[0];
            console.log('Selected year ID:', selectedYrId.value);

            // 3. Load Chart.js and then fetch data
            await loadChartLibrary();
            
            // 4. Fetch both chart data with the selected year
            if (selectedYrId.value) {
                await Promise.all([
                    fetchLicenseChartData(selectedYrId.value),
                    fetchEquipmentChartData(selectedYrId.value)
                ]);
            }
        } else {
            console.warn("No available years found.");
        }
    } catch (err) {
        console.error("Failed to initialize component:", err);
    } finally {
        loading.value = false;
    }
});

// Separate function to load Chart.js library
const loadChartLibrary = () => {
    return new Promise((resolve, reject) => {
        if (typeof Chart !== 'undefined') {
            console.log('Chart.js already loaded');
            resolve();
            return;
        }

        console.log('Loading Chart.js...');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js';
        script.onload = () => {
            console.log('Chart.js loaded successfully');
            resolve();
        };
        script.onerror = () => {
            console.error('Failed to load Chart.js');
            reject(new Error('Failed to load Chart.js'));
        };
        document.head.appendChild(script);
    });
};

// Fetch license data for pie chart
const fetchLicenseChartData = async (yearId) => {
    if (!yearId) {
        console.error('Year ID is required for fetching license chart data');
        return;
    }

    try {
        console.log(`Fetching license data for year ID: ${yearId}`);
        
        const response = await axios.get(`http://127.0.0.1:8000/api/getLicenseCount`, {
            params: { YrId: yearId }
        });
        
        console.log('License data response:', response.data);
        
        const pieData = response.data.pieChart;
        chartData.value.pieChart = pieData;
        
        // Small delay to ensure DOM is ready
        setTimeout(() => createPieChart(), 100);
    } catch (error) {
        console.error('Error fetching license chart data:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
};

// Fetch equipment data for bar chart
const fetchEquipmentChartData = async (yearId) => {
    if (!yearId) {
        console.error('Year ID is required for fetching equipment chart data');
        return;
    }

    try {
        console.log(`Fetching equipment data for year ID: ${yearId}`);
        
        const response = await axios.get(`http://127.0.0.1:8000/api/getEquipmentCount`, {
            params: { YrId: yearId }
        });
        
        console.log('Equipment data response:', response.data);
        
        const barData = response.data.barChart;
        chartData.value.barChart = barData;
        
        // Small delay to ensure DOM is ready
        setTimeout(() => createBarChart(), 100);
    } catch (error) {
        console.error('Error fetching equipment chart data:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
};

// Create Pie Chart using Chart.js
const createPieChart = () => {
    const ctx = document.getElementById('pieChart');
    if (!ctx) {
        console.error('Pie chart canvas element not found');
        return;
    }
    
    if (!chartData.value.pieChart.length) {
        console.warn('No pie chart data available');
        return;
    }
    
    // Destroy existing chart
    if (pieChartInstance) {
        pieChartInstance.destroy();
        pieChartInstance = null;
    }
    
    console.log('Creating pie chart with data:', chartData.value.pieChart);
    
    pieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartData.value.pieChart.map(item => item.label),
            datasets: [{
                data: chartData.value.pieChart.map(item => item.value),
                backgroundColor: chartData.value.pieChart.map(item => item.color || '#007bff'),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
};

// Create Bar Chart using Chart.js
const createBarChart = () => {
    const ctx = document.getElementById('barChart');
    if (!ctx) {
        console.error('Bar chart canvas element not found');
        return;
    }
    
    if (!chartData.value.barChart.length) {
        console.warn('No bar chart data available');
        return;
    }
    
    // Destroy existing chart
    if (barChartInstance) {
        barChartInstance.destroy();
        barChartInstance = null;
    }
    
    console.log('Creating bar chart with data:', chartData.value.barChart);
    
    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.value.barChart.map(item => item.label),
            datasets: [{
                label: `Computer Data for Year ${selectedYrId.value}`,
                data: chartData.value.barChart.map(item => item.value),
                backgroundColor: chartData.value.barChart.map(item => item.color || 'rgba(9, 218, 218, 0.6)'),
                borderColor: chartData.value.barChart.map(item => item.color || '#09dada'),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#09dada',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#666',
                        precision: 0 // Show whole numbers only
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#666'
                    }
                }
            }
        }
    });
};

// Watch for year changes
watch(selectedYrId, (newYearId) => {
    if (newYearId) {
        console.log('Year changed to:', newYearId);
        // Fetch both chart data when year changes
        Promise.all([
            fetchLicenseChartData(newYearId),
            fetchEquipmentChartData(newYearId)
        ]);
    }
});

// Cleanup on unmount
const cleanup = () => {
    console.log('Cleaning up chart instances');
    if (pieChartInstance) {
        pieChartInstance.destroy();
        pieChartInstance = null;
    }
    if (barChartInstance) {
        barChartInstance.destroy();
        barChartInstance = null;
    }
};

onUnmounted(cleanup);
</script>

<template>
    <Head title="Dashboard Summary" />

    <AdminLayout>
        <div class="summary-container">
           
            <!-- Charts Row -->
            <div class="row">
                <!-- Bar Chart Card (Left Side) -->
                <div class="col-lg-8 mb-4">
                    <div class="card chart-card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-0">Monthly Statistics</h5>
                            <div class="dropdown-container">
                                <select 
                                v-model="selectedYrId" 
                                class="form-select form-select-sm"
                                style="width: auto;"
                                >
                                <option 
                                    v-for="year in availableYears" 
                                    :key="year" 
                                    :value="year.YrId"
                                >
                                    {{ year.Name }}
                                </option>
                                </select>
                            </div>
                        </div>
                            
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="barChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pie Chart Card (Right Side) -->
                <div class="col-lg-4 mb-4">
                    <div class="card chart-card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Status Distribution</h5>
                        </div>
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="pieChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<style scoped>
.summary-container {
    padding: 0;
}

.summary-card {
    border-radius: 10px;
    border: none;
    transition: transform 0.2s, box-shadow 0.2s;
}

.summary-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.summary-icon {
    opacity: 0.8;
}

.feather-lg {
    width: 32px;
    height: 32px;
}

.chart-card {
    border-radius: 10px;
    border: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
}

.card-header {
    background-color: transparent;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
}

.card-title {
    font-weight: 600;
    color: #2c3e50;
}

.chart-container {
    position: relative;
    height: 300px;
    width: 100%;
}

.form-select {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fff;
    color: #495057;
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
    min-width: 100px;
}

.form-select:focus {
    border-color: #09dada;
    box-shadow: 0 0 0 0.2rem rgba(9, 218, 218, 0.25);
}

.dropdown-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.spinner-border {
    width: 2rem;
    height: 2rem;
}

.table th {
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
}

.badge {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
    border-radius: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .chart-container {
        height: 250px;
    }
    
    .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .dropdown-container {
        width: 100%;
        justify-content: flex-start;
    }
    
    .form-select {
        min-width: 120px;
    }
}

@media (max-width: 576px) {
    .summary-card {
        margin-bottom: 1rem;
    }
    
    .chart-container {
        height: 200px;
    }
}

/* Animation for cards */
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

.card {
    animation: fadeInUp 0.5s ease-out;
}

/* Custom scrollbar for tables */
.table-responsive::-webkit-scrollbar {
    height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.table-responsive::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
}
</style>