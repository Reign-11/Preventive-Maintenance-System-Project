<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';

const isStep1ModalOpen = ref(false);
const editedItem = ref({}); 

const openStep1Modal = (item) => {
  editedItem.value = { ...item };
  isStep1ModalOpen.value = true;
  disableBackgroundScroll();
};

const closeModal = () => {
  isStep1ModalOpen.value = false;
  enableBackgroundScroll();
};

const disableBackgroundScroll = () => {
  document.body.style.overflow = 'hidden';
};

const enableBackgroundScroll = () => {
  document.body.style.overflow = '';
};

const isStatusDropdownOpen = ref(false);
const searchStatus = ref("");
const statusOptions = ref(["Clear", "Unclear", "Pending", "Completed"]); // Example statuses

// Filter statuses based on search input
const filteredStatusOptions = computed(() => {
  return statusOptions.value.filter(status =>
    status.toLowerCase().includes(searchStatus.value.toLowerCase())
  );
});

// Function to set selected status
const selectStatus = (status) => {
  newUser.value.status = status; // Set selected status to form data
  searchStatus.value = status; // Update input field
  isStatusDropdownOpen.value = false; // Close dropdown
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest(".status-dropdown")) {
    isStatusDropdownOpen.value = false;
  }
};

// Add event listener when component is mounted
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

// Remove event listener when component is destroyed
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Define newUser as a reactive reference (if it's supposed to hold the form data)
const newUser = ref({
  name: '',
  status: 'Clear'
});

const officeData = ref([
  { name: "College of Information Sciences and Computing", status: "Clear" },
  { name: "College of Arts and Sciences", status: "Clear" },
  { name: "Registrar Office", status: "Clear" },
  { name: "Research Office", status: "Clear" },
  { name: "Library", status: "Clear" },
]);

const displayedData = computed(() => officeData.value);

const formData = ref({
  userOperator: '',
  officeUnit: '',
  department: '',
  dateAcquired: '',
  pcName: '',
  equipmentInstalled: [],
  otherEquipment: '',
  osInstalled: '',
  otherOS: '',
  osLicense: '',
  softwareInstalled: [],
  otherSoftware: '',
  desktopSpecs: {
    Router: '',
    Switch: '',
    Access_point: '',
    Modem: '',
    Firewall: '',
    Speed: '',
    Ports_router: '',
    Ports_switch: '',
    Wifi_freq: '',
    IP: '',
    Mac: '',
    Subnet: '',
    Gateway: '',
    DNS: '',
    DHCP: ''
  }
});

// Options
const equipmentOptions = ['Router', 'Switch', 'Access Point', 'Mouse', 'Modem', 'Network Cable', 'Patch Panel', 'Other'];
const softwareOptions = ['Network Monitoring Tool', 'Firewall Software', 'VPN Client', 'Network Configuration Tool', 'Other'];
</script>

<template>
  <MainLayout>
    <div class="container">
      <h2 class="text-center my-3">Preventive Maintenance Offices</h2> 

      <table class="data-table">
        <thead>
          <tr>
            <th>Office</th>
            <th>Actions</th>
            <th>Status</th>
            <!-- <th>Print Details</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in displayedData" :key="index">
            <td>{{ item.name }}</td>
            <td class="text-center">
              <div class="d-flex justify-content-center">
              <button class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto" 
              @click="openStep1Modal(item)">
              <i class="fas fa-eye me-1"></i>View</button>
            </div>
            </td>
            <td :class="{ 'clear-status': item.status === 'Clear', 'unclear-status': item.status === 'Unclear' }">
              {{ item.status }}
            </td>
          </tr>
        </tbody>
      </table>

    </div>

   <!-- Modal -->
   <div v-if="isStep1ModalOpen" class="modal fade show d-block">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
            <div class="modal-header d-flex align-items-center justify-content-between w-100 flex-wrap gap-3">
                <h5 class="modal-title">Preventive Maintenance Form</h5>
            <!-- Inputs Group -->
            <div class="d-flex align-items-center gap-4 flex-wrap">
              
              <!-- Number Input -->
              <div class="d-flex flex-column ms-auto">
                <label class="form-label mb-0" style="font-size: 14px;"></label>
                <input 
                 type="text" 
                 class="form-control form-control-sm" 
                 @input="console.log('Ticket Number:', formData.ticketnumber)"

                 v-model="formData.ticketnumber"
                 placeholder="Number"
                style="width: 150px; height: 30px; font-size: 14px; padding: 5px;"
                  >
                    </div>

                <!-- Status Dropdown -->
                <div class="dropdown status-dropdown position-relative">
                  <i class="fas fa-search position-absolute" style="right: 10px; top: 50%; transform: translateY(-50%); color: #aaa;"></i>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="searchStatus"
                    placeholder="Equipment Number"
                    style="width: 200px; height: 30px; font-size: 14px; padding: 5px 10px;"
                    @focus="isStatusDropdownOpen = true"
                  />
                  <ul v-if="isStatusDropdownOpen" class="dropdown-menu show" style="max-height: 150px; overflow-y: auto;">
                    <li 
                      v-for="status in filteredStatusOptions" 
                      :key="status" 
                      @click="selectStatus(status)"
                      class="dropdown-item"
                      style="font-size: 14px; padding: 5px 10px;"
                    >
                      {{ status }}
                    </li>
                  </ul>
                </div>
              </div>
                <div class="d-flex align-items-center ms-auto">
                <!-- <button class="btn btn-danger me-2" @click="markForDisposal">For Disposal</button> -->
                <button type="button" class="btn-close" @click="isModalOpen = false"></button>
                </div>
            </div>

            

          <div class="modal-body modal-scrollable">
            <!-- User & Date Info -->
            <div class="row mb-3">
              <div class="col-md-2">
                <label class="form-label">User/Operator</label>
                <input type="text" class="form-control" v-model="formData.userOperator">
              </div>
              <div class="col-md-3">
                <label class="form-label">Office/College/Unit</label>
                <input type="text" class="form-control" v-model="formData.officeUnit">
              </div>
              <div class="col-md-3">
                <label class="form-label">Department</label>
                <input type="text" class="form-control" v-model="formData.department">
              </div>
              <div class="col-md-2">
                <label class="form-label">Date Acquired</label>
                <input type="date" class="form-control" v-model="formData.dateAcquired">
              </div>
              <div class="col-md-2">
                <label class="form-label">PC Name</label>
                <input type="text" class="form-control" v-model="formData.pcName">
              </div>
            </div>

            <!-- Equipment Installed -->
            <div class="card p-3 mt-3">
              <h6 class="fw-bold">Equipment Installed:</h6>
              <div class="row">
                <div v-for="(option, index) in equipmentOptions" :key="index" class="col-md-3">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" :value="option" v-model="formData.equipmentInstalled">
                    <label class="form-check-label">{{ option }}</label>
                  </div>
                  <input 
                  v-if="option === 'Other' && formData.equipmentInstalled.includes('Other')" 
                  type="text" 
                  class="form-control mt-1 ms-3" 
                  v-model="formData.otherEquipment" 
                  placeholder="Specify Other Equipment">
                </div>
              </div>
            </div>

            <!-- Software Installed -->
            <div class="card p-3 mt-3">
              <h6 class="fw-bold">Software Application Installed:</h6>
              <div class="row">
                <div v-for="(option, index) in softwareOptions" :key="index" class="col-md-3">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" :value="option" v-model="formData.softwareInstalled">
                    <label class="form-check-label">{{ option }}</label>
                  </div>
                  <input v-if="option === 'Other' && formData.softwareInstalled.includes('Other')" type="text" class="form-control mt-1 ms-3" v-model="formData.otherSoftware" placeholder="Specify Other Software">
                </div>
              </div>
            </div>

            <!-- Desktop Specifications -->
            <div class="card p-3 mt-3">
              <h6 class="fw-bold">Desktop Specifications:</h6>
              <div class="row">
                <div v-for="(value, key) in formData.desktopSpecs" :key="key" class="col-md-2">
                  <label class="form-label">{{ key.replace(/([A-Z])/g, ' $1') }}</label>
                  <input type="text" class="form-control" v-model="formData.desktopSpecs[key]">
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <!-- <button type="button" class="btn btn-success" @click="openStep2Modal">
              <i class="fas fa-arrow-right"></i> Next
            </button> -->
          </div>
        </div>
      </div>
    </div>

  </MainLayout>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 30px;
  min-height: 100vh;
}

.data-table {
  width: 70%;
  margin: auto;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.1);
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

.data-table th {
  background-color: #2c3e50;
  color: white;
  font-weight: bold;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.clear-status {
  color: #27ae60;
  font-weight: bold;
}

.unclear-status {
  color: #e74c3c;
  font-weight: bold;
}

.edit-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.edit-btn:hover {
  background-color: #2980b9;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex !important;
  align-items: center;
  justify-content: center;
}

/* Make modal larger */
.modal-content {
  width: 300%;
  max-width: 1200px; /* Increase max width */
  max-height: 95vh; /* Prevent it from going beyond the viewport */
  display: flex;
  flex-direction: column;
}

/* Increase the height and make it scrollable */
.modal-body {
  max-height: 70vh; /* Adjust height for better visibility */
  overflow-y: auto; /* Enable scrolling */
  padding-right: 10px;
}

.dropdown-container {
  margin-bottom: 15px; /* Adds space below the dropdown */
  margin-top: 15px; /* Adds space above the dropdown */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px; /* Adds spacing between label and dropdown */
}

#month-select {
  padding: 8px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: auto;
  padding-right: 30px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 15px; /* Adds space between the buttons */
  margin-top: 15px;
}

.save-btn, .close-btn {
  background-color: #2ecc71; /* Save button color */
  color: white;
  padding: 12px 20px; /* Ensuring uniform padding */
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px; /* Slightly larger text */
  width: 120px; /* Ensure both buttons have the same width */
  text-align: center;
  transition: background 0.3s ease-in-out;
}

.close-btn {
  background-color: #e74c3c; /* Close button color */
}

.save-btn:hover {
  background-color: #27ae60;
}

.close-btn:hover {
  background-color: #c0392b;
}
</style>