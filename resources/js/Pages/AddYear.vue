<script setup>
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Head,  } from '@inertiajs/vue3';



// Form for adding a new year
const form = reactive({
    name: '',
    description: '',
   
});

const pmyear = ref([]);

const fetchYears = async () => {
  try {
    const response = await axios.get('/api/getYears');
    pmyear.value = response.data;
    console.log("Fetched:", pmyear.value);
  } catch (error) {
    console.error("Error fetching offices and departments:", error);
  }
};

onMounted(fetchYears);

// Modal animation and state management
const showModal = ref(false);
const isSubmitting = ref(false);
const modalClass = computed(() => {
    return {
        'show-modal': showModal.value
    };
})
// Form validation errors




// Function to open the modal with animation
const openModal = () => {
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

// Function to handle form submission
const submitForm = async () => {
  try {
    const response = await axios.post('/api/add-year', {
      Name: form.name,
      Description: form.description
    })

    alert(response.data.message)
    closeModal()

    // Optionally: emit event or reload data here
  } catch (error) {
    console.error("Error adding year:", error)
    alert(error.response?.data?.error || "Submission failed.")
  }
}

// Notification system
const notification = ref({ show: false, message: '', type: 'success' });

const showNotification = (message, type = 'success') => {
    notification.value = { show: true, message, type };
    setTimeout(() => {
        notification.value.show = false;
    }, 3000);
};

// Function to format date to display in table
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Keyboard event handlers for accessibility
const handleKeyDown = (e) => {
    if (e.key === 'Escape' && showModal.value) {
        closeModal();
    }
};

// Click outside modal to close
const handleClickOutside = (e) => {
    const modal = document.querySelector('.modal-content');
    if (showModal.value && modal && !modal.contains(e.target)) {
        closeModal();
    }
};

// When component mounts, initialize DataTable and event listeners
onMounted(() => {
    // Initialize DataTable after a slight delay to ensure the table is rendered
    setTimeout(() => {
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
            $('#yearsTable').DataTable({
                responsive: true,
                ordering: true,
                searching: true,
                paging: true,
            });
        }
        
        // Initialize feather icons if available
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, 500);
    
    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Add click outside modal to close
    window.addEventListener('mousedown', handleClickOutside);
});

// Clean up event listeners when component unmounts
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('mousedown', handleClickOutside);
});
</script>

<template>
    <AdminLayout>
        <Head title="" />

        <div class="container-fluid">

            <!-- Success Notification -->
            <div class="notification-container">
                <div class="toast-notification" :class="{ 'show': notification.show, [notification.type]: true }">
                    <div class="toast-content">
                        <i data-feather="check-circle" v-if="notification.type === 'success'"></i>
                        <i data-feather="alert-circle" v-else></i>
                        <span>{{ notification.message }}</span>
                    </div>
                </div>
            </div>

            <!-- Years Table -->
            <div class="card mb-4">
                <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                    <div>
                    <h3 class="mt-2 mb-2 text-white">Year Management</h3>
                    </div>
                    <button 
                        class="btn btn-light btn-sm add-btn" 
                        @click="openModal"
                    >
                        Add New Year
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table id="yearsTable" class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="year in pmyear" :key="year.YrId">
                                    <td>{{ year.Name }}</td>
                                    <td>{{ year.Description }}</td>
                                    <td>
                                        <div class="btn-group" role="group">
                                            <button type="button" class="btn btn-sm btn-info me-1">
                                                <i data-feather="edit" style="width: 16px; height: 16px;"></i>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-success me-1" v-if="!year.is_active">
                                                <i data-feather="check" style="width: 16px; height: 16px;"></i>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-danger">
                                                <i data-feather="trash-2" style="width: 16px; height: 16px;"></i>
                                            </button>
                                        </div>
                                    </td>
                                    
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Enhanced Add Year Modal -->
        <div class="modal-wrapper" :class="{ 'active': showModal }">
            <div class="modal custom-modal" :class="modalClass" tabindex="-1" 
                aria-labelledby="addYearModalLabel" aria-modal="true" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title" id="addYearModalLabel">
                                <i class="me-1"></i>
                                Add New Year
                            </h5>
                            <button type="button" class="btn-close btn-close-white" @click="closeModal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            
                                <div class="mb-3">
                                    <label for="year" class="form-label">Year Name <span class="text-danger">*</span></label>
                                    <input 
                                        type="text" 
                                        class="form-control" 

                                        id="year" 
                                        v-model="form.name" 
                                        placeholder="e.g. 2025"
                                        required
                                    >
                                   
                                    <small class="form-text text-muted">Enter a 4-digit year (e.g. 2025)</small>
                                </div>
                                <div class="mb-3">
                                    <label for="description" class="form-label">Description <span class="text-danger">*</span></label>
                                    <input 
                                        type="text" 
                                        class="form-control" 
                               
                                        id="description" 
                                        v-model="form.description" 
                                        placeholder="e.g. Fiscal Year 2025"
                                        required ></div>
                        
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-outline-secondary" @click="closeModal">
                                        <i data-feather="x" class="me-1"></i>
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        class="btn btn-success" @click="submitForm">Submit </button>
                                </div>
                      
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal Backdrop -->
            <div class="modal-backdrop" v-if="showModal"></div>
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

.card-header i {
    margin-right: 5px;
}

.btn i {
    vertical-align: middle;
}

/* Enhanced button animations */
.add-btn {
    transition: all 0.2s ease;
    border: none;
    font-weight: 500;
}

.add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add-btn:active {
    transform: translateY(0);
}

/* Additional styles for the DataTable */
::v-deep(.dataTables_wrapper) {
    padding: 10px 0;
}

/* Enhanced form elements */
.form-control {
    border-radius: 5px;
    border: 1px solid #ced4da;
    padding: 10px 12px;
    transition: all 0.3s ease;
}

.form-control:focus {
    border-color: #198754;
    box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
}

.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.form-text {
    color: #6c757d;
    font-size: 0.875rem;
    margin-top: 4px;
}

/* Checkbox styling */
.form-check-input {
    width: 1.1em;
    height: 1.1em;
    margin-top: 0.2em;
    cursor: pointer;
}

.form-check-input:checked {
    background-color: #198754;
    border-color: #198754;
}

.form-check-label {
    cursor: pointer;
}

/* Enhanced buttons */
.btn {
    padding: 0.5rem 1rem;
    border-radius: 5px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-success {
    background-color: #198754;
    border-color: #198754;
}

.btn-success:hover {
    background-color: #157347;
    border-color: #146c43;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-success:active {
    transform: translateY(0);
}

.btn-outline-secondary {
    color: #6c757d;
    border-color: #6c757d;
}

.btn-outline-secondary:hover {
    background-color: #6c757d;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-outline-secondary:active {
    transform: translateY(0);
}

/* Badge styling */
.badge {
    font-weight: 500;
    padding: 0.5em 0.75em;
    border-radius: 6px;
}

/* Enhanced Modal styles with animations */
.modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1050;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.modal-wrapper.active {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
}

.custom-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1050;
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.custom-modal.show-modal {
    opacity: 1;
    transform: scale(1);
}

.modal-content {
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border: none;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    padding: 1rem 1.5rem;
}

.modal-body {
    padding: 1.5rem;
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(0,0,0,0.1);
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1040;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    opacity: 0.5;
}

/* Toast notification styles */
.notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1060;
}

.toast-notification {
    background-color: white;
    color: #333;
    padding: 15px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    transform: translateX(120%);
    transition: transform 0.3s ease;
    max-width: 350px;
}

.toast-notification.show {
    transform: translateX(0);
}

.toast-notification.success {
    border-left: 4px solid #198754;
}

.toast-notification.error {
    border-left: 4px solid #dc3545;
}

.toast-content {
    display: flex;
    align-items: center;
}

.toast-content i {
    margin-right: 10px;
}

.toast-content i[data-feather="check-circle"] {
    color: #198754;
}

.toast-content i[data-feather="alert-circle"] {
    color: #dc3545;
}

/* Responsive adjustments for small screens */
@media (max-width: 768px) {
    .modal-dialog {
        margin: 0.5rem;
    }
    
    .modal-content {
        max-height: 85vh;
    }
}
</style>
