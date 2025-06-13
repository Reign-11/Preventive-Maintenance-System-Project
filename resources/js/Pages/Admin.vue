<script setup>
import { ref, onMounted, onUnmounted, onUpdated, nextTick } from 'vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Head } from '@inertiajs/vue3';
import axios from 'axios';
import feather from "feather-icons";

const loading = ref(true);
const pmlogs = ref([]);

// Function to fetch logs (simple - no filters, DataTables will handle filtering)
const fetchLogs = async () => {
    loading.value = true;
    try {
        const response = await axios.get('/api/getLogs');
        pmlogs.value = response.data;
        console.log("Fetched logs:", pmlogs.value);
        
        // Initialize DataTable after data is loaded
        nextTick(() => {
            initializeDataTable();
        });
    } catch (error) {
        console.error("Error fetching logs:", error);
        pmlogs.value = [];
    } finally {
        loading.value = false;
    }
};

// Initialize DataTable with search and filtering
const initializeDataTable = () => {
    // Destroy existing DataTable if it exists
    if ($.fn.DataTable.isDataTable('#logsTable')) {
        $('#logsTable').DataTable().destroy();
    }
    
    // Initialize new DataTable
    setTimeout(() => {
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
            $('#logsTable').DataTable({
                responsive: true,
                ordering: true,
                searching: true, // This enables the search box
                paging: true,
                pageLength: 10,
                lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
                order: [[2, 'desc']], // Order by date column (index 2) descending
                columnDefs: [
                    {
                        targets: 2, // Date column
                        type: 'date'
                    }
                ],
                language: {
                    search: "Search logs:",
                    searchPlaceholder: "Search by name, action, or date...",
                    emptyTable: "No logs found",
                    info: "Showing _START_ to _END_ of _TOTAL_ logs",
                    infoEmpty: "Showing 0 to 0 of 0 logs",
                    infoFiltered: "(filtered from _MAX_ total logs)"
                }
            });
            
            // Initialize feather icons
            feather.replace();
        }
    }, 100);
};

// Format date for display
const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        return dateString;
    }
};

// Refresh logs
const refreshLogs = () => {
    fetchLogs();
};

onMounted(() => {
    fetchLogs();
});

onUpdated(() => {
    feather.replace();
});

onUnmounted(() => {
    // Clean up DataTable when component unmounts
    if ($.fn.DataTable.isDataTable('#logsTable')) {
        $('#logsTable').DataTable().destroy();
    }
});
</script>

<template>
    <Head title="System Logs" />

    <AdminLayout>
        <div class="container-fluid">
            <div class="card mb-4">
                <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                    <div>
                        <h3 class="mt-2 mb-2 text-white">System Logs</h3>
                    </div>
                    <button 
                        class="btn btn-light btn-sm" 
                        @click="refreshLogs"
                        :disabled="loading"
                        title="Refresh logs"
                    >
                        <i data-feather="refresh-cw" class="feather-sm" :class="{ 'spin': loading }"></i>
                        Refresh
                    </button>
                </div>
                
                <div class="card-body">
                    <!-- Loading indicator -->
                    <div v-if="loading" class="text-center py-4">
                        <div class="spinner-border text-success" role="status">
                            <span class="sr-only">Loading logs...</span>
                        </div>
                        <p class="text-muted mt-2">Loading system logs...</p>
                    </div>
                    
                    <!-- Logs Table -->
                    <div v-else class="table-responsive">
                        <table id="logsTable" class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Action</th>
                                    <th>Date & Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="log in pmlogs" :key="log.logId || log.id">
                                    <td>{{ log.Name || '-' }}</td>
                                    <td>{{ log.Actions || '-' }}</td>
                                    <td>{{ formatDate(log.Date) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<style scoped>
.card {
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.card-header {
    font-weight: 600;
    display: flex;
    align-items: center;
}

.spinner-border {
    width: 2.5rem;
    height: 2.5rem;
}

.feather-sm {
    width: 16px;
    height: 16px;
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.btn {
    padding: 0.5rem 1rem;
    border-radius: 5px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn:active {
    transform: translateY(0);
}

/* DataTable custom styling */
::v-deep(.dataTables_wrapper) {
    padding: 10px 0;
}

::v-deep(.dataTables_filter) {
    margin-bottom: 1rem;
}

::v-deep(.dataTables_filter input) {
    border-radius: 5px;
    border: 1px solid #ced4da;
    padding: 8px 12px;
    margin-left: 0.5rem;
}

::v-deep(.dataTables_filter input:focus) {
    border-color: #198754;
    box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
    outline: none;
}

::v-deep(.dataTables_length select) {
    border-radius: 5px;
    border: 1px solid #ced4da;
    padding: 4px 8px;
    margin: 0 0.5rem;
}

::v-deep(.dataTables_info) {
    color: #6c757d;
    font-size: 0.9em;
}

/* Reset all pagination button styling and apply clean borders */
::v-deep(.dataTables_paginate) {
    margin-top: 1rem;
}

::v-deep(.dataTables_paginate .paginate_button) {
    padding: 0.375rem 0.75rem !important;
    margin: 0 2px !important;
    border-radius: 4px !important;
    border: 1px solid #dee2e6 !important;
    color: #495057 !important;
    background-color: #fff !important;
    background-image: none !important;
    text-decoration: none !important;
    box-shadow: none !important;
    outline: none !important;
}

::v-deep(.dataTables_paginate .paginate_button:hover) {
    background-color: #e9ecef !important;
    background-image: none !important;
    color: #495057 !important;
    border: 1px solid #adb5bd !important;
    box-shadow: none !important;
}

::v-deep(.dataTables_paginate .paginate_button.current) {
    background-color: #007bff !important;
    background-image: none !important;
    color: white !important;
    border: 1px solid #007bff !important;
    box-shadow: none !important;
}

::v-deep(.dataTables_paginate .paginate_button.disabled) {
    color: #6c757d !important;
    background-color: #fff !important;
    background-image: none !important;
    border: 1px solid #dee2e6 !important;
    cursor: not-allowed !important;
    box-shadow: none !important;
}

::v-deep(.dataTables_paginate .paginate_button.disabled:hover) {
    background-color: #fff !important;
    background-image: none !important;
    color: #6c757d !important;
    border: 1px solid #dee2e6 !important;
    box-shadow: none !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .card-header {
        flex-direction: column;
        align-items: flex-start !important;
    }
    
    .card-header button {
        margin-top: 10px;
        align-self: flex-end;
    }
}
</style>