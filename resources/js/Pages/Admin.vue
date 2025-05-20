<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Head } from '@inertiajs/vue3';

// Sample data structure - replace with your actual API call
const logs = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const filterType = ref('all');
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = ref(10);
const sortField = ref('timestamp');
const sortDirection = ref('desc');
const dateRange = ref({
    start: '',
    end: ''
});

// Log types for filtering
const logTypes = [
    { value: 'all', label: 'All Logs' },
    { value: 'info', label: 'Information' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'success', label: 'Success' }
];

// Function to fetch logs
const fetchLogs = async () => {
    loading.value = true;
    try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page: currentPage.value,
                itemsPerPage: itemsPerPage.value,
                search: searchQuery.value,
                type: filterType.value,
                sortField: sortField.value,
                sortDirection: sortDirection.value,
                dateRange: dateRange.value
            })
        });
        
        const data = await response.json();
        logs.value = data.logs;
        totalPages.value = data.totalPages;
    } catch (error) {
        console.error('Error fetching logs:', error);
    } finally {
        loading.value = false;
    }
};

// Sort function
const sortBy = (field) => {
    if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortField.value = field;
        sortDirection.value = 'asc';
    }
    fetchLogs();
};

// Filter by log type
const filterByType = (type) => {
    filterType.value = type;
    currentPage.value = 1;
    fetchLogs();
};

// Search logs
const handleSearch = () => {
    currentPage.value = 1;
    fetchLogs();
};

// Clear all filters
const clearFilters = () => {
    searchQuery.value = '';
    filterType.value = 'all';
    dateRange.value = { start: '', end: '' };
    currentPage.value = 1;
    fetchLogs();
};

// Date range filter
const applyDateFilter = () => {
    currentPage.value = 1;
    fetchLogs();
};

// Pagination
const changePage = (page) => {
    currentPage.value = page;
    fetchLogs();
};

// Get log type badge class
const getLogTypeBadge = (type) => {
    switch (type.toLowerCase()) {
        case 'info':
            return 'badge bg-info text-white';
        case 'warning':
            return 'badge bg-warning text-dark';
        case 'error':
            return 'badge bg-danger text-white';
        case 'success':
            return 'badge bg-success text-white';
        default:
            return 'badge bg-secondary text-white';
    }
};

// Format timestamp
const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
};

// Mock data for initial display
const initializeMockData = () => {
    logs.value = [
        { id: 1, user: 'admin@example.com', action: 'User login', type: 'info', timestamp: '2025-05-15T08:23:44', details: 'Successful login' },
        { id: 2, user: 'john@example.com', action: 'Add Year', type: 'success', timestamp: '2025-05-15T10:15:22', details: 'Added fiscal year 2025' },
        { id: 3, user: 'jane@example.com', action: 'Failed login attempt', type: 'warning', timestamp: '2025-05-14T16:45:30', details: 'Invalid credentials' },
        { id: 4, user: 'admin@example.com', action: 'System update', type: 'info', timestamp: '2025-05-14T12:30:00', details: 'System updated to version 2.3.0' },
        { id: 5, user: 'system', action: 'Database error', type: 'error', timestamp: '2025-05-13T22:18:05', details: 'Connection timeout during backup process' },
    ];
    totalPages.value = 3;
    loading.value = false;
};

onMounted(() => {
    // For development, use mock data
    // In production, uncomment fetchLogs() and comment initializeMockData()
    initializeMockData();
    // fetchLogs();
    
    // Initialize feather icons if needed
    if (typeof window.feather !== 'undefined') {
        window.feather.replace();
    }
});
</script>

<template>
    <Head title="System Logs" />

    <AdminLayout>
        <div class="logs-container">
            <div class="card shadow-sm">
                <div class="card-header green-header d-flex justify-content-between align-items-center">
                    <h1 class="h3 mb-0 text-white">System Logs</h1>
                    <button @click="fetchLogs" class="btn btn-sm btn-light">
                        <i data-feather="refresh-cw" class="feather-sm"></i> Refresh
                    </button>
                </div>
                
                <div class="card-body">
                    <!-- Filters -->
                    <div class="row mb-3">
                        <div class="col-md-4 mb-2">
                            <div class="input-group">
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="searchQuery" 
                                    placeholder="Search logs..." 
                                    @keyup.enter="handleSearch"
                                >
                                <div class="input-group-append">
                                    <button class="btn btn-primary" type="button" @click="handleSearch">
                                        <i data-feather="search" class="feather-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-3 mb-2">
                            <select class="form-control" v-model="filterType" @change="filterByType(filterType)">
                                <option v-for="type in logTypes" :key="type.value" :value="type.value">
                                    {{ type.label }}
                                </option>
                            </select>
                        </div>
                        
                        <div class="col-md-4 mb-2">
                            <div class="d-flex">
                                <input 
                                    type="date" 
                                    class="form-control mr-1" 
                                    v-model="dateRange.start" 
                                    placeholder="Start Date"
                                >
                                <input 
                                    type="date" 
                                    class="form-control" 
                                    v-model="dateRange.end" 
                                    placeholder="End Date"
                                >
                            </div>
                        </div>
                        
                        <div class="col-md-1 mb-2 d-flex">
                            <button class="btn btn-primary btn-sm mr-1" @click="applyDateFilter">
                                <i data-feather="calendar" class="feather-sm"></i>
                            </button>
                            <button class="btn btn-outline-secondary btn-sm" @click="clearFilters">
                                <i data-feather="x" class="feather-sm"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Logs Table -->
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th @click="sortBy('id')" class="sortable">
                                        ID
                                        <i v-if="sortField === 'id'" 
                                           :class="sortDirection === 'asc' ? 'feather-chevron-up' : 'feather-chevron-down'" 
                                           data-feather="chevron-down"></i>
                                    </th>
                                    <th @click="sortBy('timestamp')" class="sortable">
                                        Timestamp
                                        <i v-if="sortField === 'timestamp'" 
                                           :class="sortDirection === 'asc' ? 'feather-chevron-up' : 'feather-chevron-down'" 
                                           data-feather="chevron-down"></i>
                                    </th>
                                    <th @click="sortBy('user')" class="sortable">
                                        User
                                        <i v-if="sortField === 'user'" 
                                           :class="sortDirection === 'asc' ? 'feather-chevron-up' : 'feather-chevron-down'" 
                                           data-feather="chevron-down"></i>
                                    </th>
                                    <th @click="sortBy('action')" class="sortable">
                                        Action
                                        <i v-if="sortField === 'action'" 
                                           :class="sortDirection === 'asc' ? 'feather-chevron-up' : 'feather-chevron-down'" 
                                           data-feather="chevron-down"></i>
                                    </th>
                                    <th @click="sortBy('type')" class="sortable">
                                        Type
                                        <i v-if="sortField === 'type'" 
                                           :class="sortDirection === 'asc' ? 'feather-chevron-up' : 'feather-chevron-down'" 
                                           data-feather="chevron-down"></i>
                                    </th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="loading">
                                    <td colspan="6" class="text-center py-4">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else-if="logs.length === 0">
                                    <td colspan="6" class="text-center py-4">
                                        No logs found
                                    </td>
                                </tr>
                                <tr v-for="log in logs" :key="log.id">
                                    <td>{{ log.id }}</td>
                                    <td>{{ formatDate(log.timestamp) }}</td>
                                    <td>{{ log.user }}</td>
                                    <td>{{ log.action }}</td>
                                    <td>
                                        <span :class="getLogTypeBadge(log.type)">
                                            {{ log.type }}
                                        </span>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-info" @click="$refs['details-' + log.id].toggle()">
                                            <i data-feather="info" class="feather-sm"></i>
                                        </button>
                                        <!-- We would implement a modal or popover for details -->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Pagination -->
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            <span>Showing {{ logs.length }} of total logs</span>
                        </div>
                        <nav>
                            <ul class="pagination pagination-sm mb-0">
                                <li :class="['page-item', { disabled: currentPage === 1 }]">
                                    <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
                                </li>
                                <li v-for="page in totalPages" :key="page" :class="['page-item', { active: currentPage === page }]">
                                    <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                                </li>
                                <li :class="['page-item', { disabled: currentPage === totalPages }]">
                                    <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<style scoped>
.logs-container {
    transition: all 0.3s;
    max-width: 100%;
}

.card {
    border-radius: 10px;
    border: none;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
}

.card-header.green-header {
    background-color: #00a65a;
    border-bottom: none;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 15px 20px;
}

.card-header {
    background-color: transparent;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.table-responsive {
    border-radius: 8px;
    overflow: hidden;
}

.table th {
    background-color: #f8f9fa;
    cursor: pointer;
    user-select: none;
    position: relative;
}

.sortable:hover {
    background-color: #e9ecef;
}

.feather-sm {
    width: 16px;
    height: 16px;
}

.table td {
    vertical-align: middle;
}

/* Custom badge colors to match your theme */
.badge {
    padding: 5px 10px;
    border-radius: 12px;
    font-weight: 500;
}

.bg-info {
    background-color: #17a2b8 !important;
}

.bg-warning {
    background-color: #ffc107 !important;
}

.bg-danger {
    background-color: #dc3545 !important;
}

.bg-success {
    background-color: #28a745 !important;
}

/* Smooth transitions */
.form-control, .btn {
    transition: all 0.3s;
}

.form-control:focus {
    border-color: #09dada;
    box-shadow: 0 0 0 0.2rem rgba(9, 218, 218, 0.25);
}

.btn-primary {
    background-color: #09dada;
    border-color: #09dada;
}

.btn-primary:hover {
    background-color: #07b9b9;
    border-color: #07b9b9;
}

.page-link {
    color: #09dada;
}

.page-item.active .page-link {
    background-color: #09dada;
    border-color: #09dada;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .card-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .card-header button {
        margin-top: 10px;
    }
}
</style>