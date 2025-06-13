<script setup>
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Head } from '@inertiajs/vue3';
import axios from 'axios';


const form = reactive({
    name: '',
    email: '',
    password: '',
    role: '',
    password_confirmation: '',

});
let modalInstance = null;

const showuser = ref([]);

const selectedUser = ref({
  id: '',
  name: '',
  email: '',
  role: '',
  password: ''
});

const fetchUsers = async () => {
    try {
        const response = await axios.get('/api/getuser');
        showuser.value = response.data;
        console.log("Fetched users:", showuser.value);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

onMounted(fetchUsers);


const editUserModal = ref(false);
const showModal = ref(false);
const isSubmitting = ref(false);
const modalClass = computed(() => {
    return {
        'show-modal': showModal.value
    };
});

// Form validation errors

// Function to open the modal with animation
const openModal = () => {
    showModal.value = true;
    // Reset form and errors

};

const closeModal = () => {
    showModal.value = false;
    
};

const editModal = (id) => {
  const user = showuser.value.find(u => u.id === id);
  if (user) {
    selectedUser.value = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
    };
    const modalElement = document.getElementById('editUserModal');
    modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }
};

// Function to handle form submission
const submitForm = async () => {
    try {
        const response = await axios.post('/api/add-user', {
            name: form.name,
            email: form.email,
            password: form.password,
            password_confirmation: form.password_confirmation, 
            role: form.role,
        });

        alert(response.data.message || 'User added successfully!');
        closeModal();

        // Reset form fields
        form.name = '';
        form.email = '';
        form.password = '';
        form.role = '';

    } catch (error) {
        if (error.response && error.response.data) {
            alert(error.response.data.message || 'Failed to add user.');
        } else {
            alert('Something went wrong while submitting the form.');
        }
        console.error(error);
    }
};

// Notification system
const notification = ref({ show: false, message: '', type: 'success' });

const showNotification = (message, type = 'success') => {
    notification.value = { show: true, message, type };
    setTimeout(() => {
        notification.value.show = false;
    }, 3000);
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
            $('#usersTable').DataTable({
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


const updateUser = async () => {
  try {
    const payload = {
      name: selectedUser.value.name,
      email: selectedUser.value.email,
      role: selectedUser.value.role,
      password: selectedUser.value.password || ''
    };

    await axios.put(`/api/updateUser/${selectedUser.value.id}`, payload);

    // Update local user list
    const index = showuser.value.findIndex(u => u.id === selectedUser.value.id);
    if (index !== -1) {
      showuser.value[index] = { ...selectedUser.value };
    }

    // ✅ Close modal
    if (modalInstance) {
      modalInstance.hide();
    }

    // ✅ Show success indication
    alert("✅ User updated successfully!");

  } catch (error) {
    console.error("❌ Update failed:", error);
    if (error.response?.status === 422) {
      console.error("Validation error:", error.response.data.errors);
    }
  }
};

</script>

<template>
    <AdminLayout>
        <Head title="User Management" />

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

            <!-- Users Table -->
            <div class="card mb-4">
    <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <div>
            <h3 class="mt-2 mb-2 text-white">User Management</h3>
        </div>
        <button 
            class="btn btn-light btn-sm add-btn" 
            @click="openModal"
        >
            <i data-feather="user-plus" class="me-1"></i>
            Add New User
        </button>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table id="usersTable" class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="users in showuser" :key="users.id">
                        <td>{{ users.name }}</td>
                        <td>{{ users.email }}</td>
                        <td>{{ users.role }}</td>
                        <td>{{ users.updated_at  }}</td>
                        <td>
                            <button 
                                class="btn btn-sm btn-info  m me-1" 
                                @click="editModal(users.id)">
                                <i data-feather="edit-2"></i>
                            </button>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</div>


        <!-- Enhanced Add User Modal -->
        <div class="modal-wrapper" :class="{ 'active': showModal }">
  <div class="modal custom-modal" :class="modalClass" tabindex="-1" aria-labelledby="addUserModalLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-dialog-wide">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header bg-success text-white">
          <h5 class="modal-title" id="addUserModalLabel">
            <i data-feather="user-plus" class="me-2"></i> Add New User
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="closeModal" aria-label="Close"></button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="row">
              <!-- Name -->
              <div class="col-md-6 mb-3">
                <label for="name" class="form-label">Name <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="form.name"
                  placeholder="Enter name"
                  required
                >
              </div>

              <!-- Email -->
              <div class="col-md-6 mb-3">
                <label for="email" class="form-label">Email Address <span class="text-danger">*</span></label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="form.email"
                  placeholder="Enter email address"
                  required
                >
                <small class="form-text text-muted">This will be used for login</small>
              </div>
            </div>

            <div class="row">
              <!-- Password -->
              <div class="col-md-6 mb-3">
                <label for="password" class="form-label">Password <span class="text-danger">*</span></label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="form.password"
                  placeholder="Enter password"
                  minlength="8"
                  required
                >
                <small class="form-text text-muted">Minimum 8 characters required</small>
              </div>
              
                <div class="col-md-6 mb-3">
            <label for="password_confirmation" class="form-label">Confirm Password <span class="text-danger">*</span></label>
            <input
                type="password"
                class="form-control"
                id="password_confirmation"
                v-model="form.password_confirmation"
                placeholder="Confirm password"
                minlength="8"
                required>
            </div>

              

              <!-- User Role -->
              <div class="col-md-6 mb-3">
                <label for="role" class="form-label">User Role <span class="text-danger">*</span></label>
                <select
                  id="role"
                  class="form-select"
                  v-model="form.role"
                  required
                >
                  <option value="" disabled>Select role</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="closeModal">
            <i data-feather="x" class="me-1"></i> Cancel
          </button>
          <button type="button" class="btn btn-success" @click="submitForm">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Backdrop -->
  <div class="modal-backdrop" v-if="showModal"></div>
</div>




<!-- Edit User Modal -->
<div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header bg-warning text-white">
        <h5 class="modal-title" id="editUserModalLabel">Edit User</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
     <form>
          <div class="mb-3">
            <label for="editName" class="form-label">Name</label>
            <input type="text" id="editName" class="form-control" v-model="selectedUser.name" required>
        </div>
          <div class="mb-3">
            <label for="editEmail" class="form-label">Email</label>
            <input type="email" id="editEmail" class="form-control" v-model="selectedUser.email" required>
        </div>
          <div class="mb-3">
            <label for="editRole" class="form-label">Role</label>
            <select id="editRole" class="form-select" v-model="selectedUser.role" required>
                <option value="Admin">Admin</option>
              <option value="User">User</option>
              <!-- Add more roles if needed -->
            </select>
          </div>
          <div class="mb-3">
            <label for="editPassword" class="form-label">Password</label>
            <input type="password" id="editPassword" class="form-control" v-model="selectedUser.password">
            <small class="text-muted">Leave blank to keep current password</small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary"data-dismiss="modal" >Cancel</button>
            <button type="submit" class="btn btn-warning" @click.prevent="updateUser">Update</button>
        </div>
    </form>
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

.card-header i {
    margin-right: 5px;
}

.btn i {
    vertical-align: middle;
}

/* User avatar styling */
.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #198754;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
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
.form-control, .form-select {
    border-radius: 5px;
    border: 1px solid #ced4da;
    padding: 10px 12px;
    transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
    border-color: #198754;
    box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
}

.form-control.is-invalid, .form-select.is-invalid {
    border-color: #dc3545;
}

.form-control.is-invalid:focus, .form-select.is-invalid:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

.invalid-feedback {
    display: block;
    width: 100%;
    margin-top: 0.25rem;
    font-size: 0.875em;
    color: #dc3545;
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

/* Enhanced buttons */
.btn {
    padding: 0.5rem 1rem;
    border-radius: 5px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-success {
    background-color: #198754;
    border-color: #198754;
}

.btn-success:hover:not(:disabled) {
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
    font-size: 0.75em;
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

.modal-dialog-wide {
    max-width: 700px;
    width: 90%;
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
    .modal-dialog-wide {
        margin: 0.5rem;
        width: calc(100% - 1rem);
        max-width: none;
    }
    
    .modal-content {
        max-height: 85vh;
    }
    
    .btn-group {
        flex-direction: column;
    }
    
    .btn-group .btn {
        margin-bottom: 0.25rem;
    }
    
    .row .col-md-6 {
        margin-bottom: 1rem;
    }
}
</style>