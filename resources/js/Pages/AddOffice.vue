<script setup>
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import axios from 'axios'


const showModal = ref(false);
const addDepartment = () => {
    form.department.push('');
};

const removeDepartment = (index) => {
    form.department.splice(index, 1);
};
const modalClass = computed(() => {
    return {
        'show-modal': showModal.value
    };
})
const officesWithDepartments = ref([]);

const fetchOffices = async () => {
  try {
    const response = await axios.get('/api/offices-with-departments');
    officesWithDepartments.value = response.data;
    console.log("Fetched:", officesWithDepartments.value);
  } catch (error) {
    console.error("Error fetching offices and departments:", error);
  }
};

onMounted(fetchOffices);


// Form for adding a new office with validation
const form = reactive({
    office: '',
    department: ['']    ,
    code: '',
});

// Form validation errors


// Modal animation and state management
const isSubmitting = ref(false);

const openModal = () => {
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const submitForm = async () => {
    try {
        await axios.post('/api/AddOffice', {
            OfficeName: form.office,
            Code: form.code,
            Departments: form.department, // this must be an array
        });

        alert("Office and departments saved!");
        closeModal();
    } catch (error) {
        console.error("Submit failed:", error.response?.data?.errors || error.response?.data || error.message);
    }
};


// Notification system
const notification = ref({ show: false, message: '', type: 'success' });


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

// Add event listener when component mounts
onMounted(() => {
    // Initialize DataTable after a slight delay to ensure the table is rendered
    setTimeout(() => {
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
            $('#officesTable').DataTable({
                responsive: true,
                ordering: true,
                searching: true,
                paging: true,
            });
        }
    }, 500);
    
    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Add click outside modal to close
    window.addEventListener('mousedown', handleClickOutside);
});

// Clean up event listeners when component unmounts (moved outside of onMounted)
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('mousedown', handleClickOutside);
});
</script>

<template>
    <AdminLayout>
        <Head title="Office Management"/>

        <div class="container-fluid">
            <h1 class="mt-4 mb-4">Office Management</h1>

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

            <!-- Offices Table -->
            <div class="card mb-4">
                <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                    <div>
                        Offices List
                    </div>
                    <button 
                        class="btn btn-light btn-sm add-btn" 
                        @click="openModal"
                    >
                        <i data-feather="plus-circle" class="me-1"></i>
                        Add New Office
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table id="officesTable" class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Office/College</th>
                                    <th>Department</th>
                                    <th>Code</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in officesWithDepartments" :key="item.deptId">
                                    <td class="px-4 py-2 border">{{ item.OfficeName }}</td>
                                    <td class="px-4 py-2 border">{{ item.department_name }}</td>
                                    <td class="px-4 py-2 border">{{ item.code }}</td>
                                    <td>
                                    <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-sm btn-info me-1">
                                  <i data-feather="edit" style="width: 16px; height: 16px;"></i>
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

        <!-- Enhanced Add Office Modal -->
        <div class="modal-wrapper" :class="{ 'active': showModal }">
            <div class="modal custom-modal" :class="modalClass" tabindex="-1" 
                aria-labelledby="addOfficeModalLabel" aria-modal="true" role="dialog">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title" id="addOfficeModalLabel">
                                Add New Office
                            </h5>
                            <button type="button" class="btn-close btn-close-white" @click="closeModal" aria-label="Close"></button>
                        </div>

                        <div class="modal-body">
                         
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="office" class="form-label">Office/College <span class="text-danger">*</span></label>
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                             
                                                id="office" 
                                                v-model="form.office" 
                                                placeholder="Enter office name"
                                                required
                                            >
                                         
                                        </div>
                                    </div>

                                        <div class="col-md-4" v-for="(dept, index) in form.department" :key="index">
                                        <div class="form-group">
                                            <label :for="'department' + index" class="form-label">
                                                Department {{ index + 1 }} <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group">
                                                <input 
                                                    type="text"
                                                    class="form-control"
                                                    :id="'department' + index"
                                                    v-model="form.department[index]"
                                                    placeholder="Enter department name"
                                                    required
                                                />
                                                <button 
                                                    type="button" 
                                                    class="btn btn-danger" 
                                                    @click="removeDepartment(index)" 
                                                    v-if="form.department.length > 1"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Add New Department Button -->
                                    <div class="col-md-12 mt-2">
                                        <button type="button" class="btn btn-sm btn-outline-primary" @click="addDepartment">
                                            + Add Department
                                        </button>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="code" class="form-label">Code <span class="text-danger">*</span></label>
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                          
                                                id="code" 
                                                v-model="form.code"
                                                placeholder="Format: XXX-000" 
                                                required
                                            >
                                       
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-outline-secondary" @click="closeModal">
                                        <i data-feather="x" class="me-1"></i>
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"  class="btn btn-success"  @click="submitForm">Submit</button>
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
    .row.mb-3 {
        margin-bottom: 0 !important;
    }
    
    .col-md-4 {
        margin-bottom: 1rem;
    }
    
    .modal-dialog {
        margin: 0.5rem;
    }
    
    .modal-content {
        max-height: 85vh;
    }
}
</style>