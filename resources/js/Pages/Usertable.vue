<script setup>
import { ref, computed, watch,defineProps } from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';

const props = defineProps({
  employees: { type: Array, default: () => [] },
  deptId: { type: [String, Number], default: null },
  YrId: { type: [String, Number], default: null },
  PlanId: { type: [String, Number], default: null },
  office: { type: Object, default: () => ({}) },
  employeeId: { type: [String, Number], default: null } 
  
});

const employees = ref([]);

watchEffect(() => {
  employees.value = props.employees;
});





const isStep1ModalOpen = ref(false);
const isStep2ModalOpen = ref(false);
const selectedOption = ref("Office");
const isModalOpen = ref(false);
// const editedItem = ref({}); // Store selected user data

const openStep1Modal = () => {
  isStep1ModalOpen.value = true;
  disableBackgroundScroll();
};

const openStep2Modal = () => {
  isStep1ModalOpen.value = false;
  isStep2ModalOpen.value = true;
};

const closeModal = () => {
  isStep1ModalOpen.value = false;
  isStep2ModalOpen.value = false;
  enableBackgroundScroll();
};

// Disable background scrolling when modal is open
const disableBackgroundScroll = () => {
  document.body.style.overflow = 'hidden';
};

// Enable background scrolling when modal is closed
const enableBackgroundScroll = () => {
  document.body.style.overflow = '';
};

// Form Data
const formData = ref({
  number: '',
  userOperator: '',
  officeUnit: '',
  dateAcquired: '',
  equipmentInstalled: [],
  osInstalled: '',
  osLicense: '',
  softwareInstalled: [],
  desktopSpecs: {
    Processor: '',
    Motherboard: '',
    Memory: '',
    GraphicCard: '',
    UPS: '',
    HardDisk: '',
    OpticalDrive: '',
    Monitor: '',
    Casing: '',
    Printer: '',
    PowerSupply: '',
    Keyboard: '',
    Mouse: '',
    AVR: '',
    NetWorkMacIp: ''
  }
});

// Options for checkboxes
const equipmentOptions = ['CPU', 'Keyboard', 'Monitor', 'Mouse', 'Printer', 'UPS', 'AVR', 'Other'];
const osOptions = ['Windows 10', 'Windows 11', 'Other'];
const softwareOptions = ['Enrollment System', 'Adobe Reader', 'Word Processor', 'Media Player', 'Anti-Virus', 'Browser', 'Other'];

// Sample Data
const officeData = ref([
  { name: "PC1", status: "Clear" },
  { name: "PC2", status: "Clear" },
  { name: "PC3", status: "Clear" },
  { name: "PC4", status: "Clear" },
  { name: "PC5", status: "Clear" },
]);


// Checklist Data
const checklist = ref([
  { item: 1, task: 'System Boot', description: 'Boot system from a cold start.Monitor for errors and speed of entire boot process.', status: '' },
  { item: 2, task: 'System Log-in', description: 'Monitor for Errors. Monitor login script.', status: '' },
  { item: 3, task: 'Network Settings', description: 'Monitor login script.\nTCP/IP and IPX settings are correct.\nDomain Name\nSecurity Settings\nClient Configurations\nComputer Name', status: '' },
  { item: 4, task: 'Computer Hardware Settings', description: 'Verify Device Manager settings\nBIOS up-to-date\nHard Disk\nDVD/CD-RW firmware up-to-date\nMemory is O.K.\nFor Laptop battery run-time is norm', status: '' },
  { item: 5, task: 'Browser/Proxy Settings', description: 'Verify proper settings and operation.', status: '' },
  { item: 6, task: 'Proper Software Loads', description: 'Required software is installed and operating.', status: '' },
  { item: 7, task: 'Viruses and Malware', description: 'Anti-virus installed\nVirus scan done', status: '' },
  { item: 8, task: 'Clearance', description: 'Unused software removed\nTemporary files removed\nRecycle bin and caches emptied\nPeripheral devices clean', status: '' },
  { item: 9, task: 'Interiors and Cleaning', description: 'Dust removed\nNo loose parts\nAirflow is O.K.\nCables unplugged and re-plugged\nFans are operating', status: '' },
  { item: 10, task: 'Peripheral Devices', description: 'Mouse\nKeyboard\nMonitor\nUPS\nPrinter\nTelephone extension\nFax', status: '' },
]);


const displayedData = computed(() => {
  return selectedOption.value === "Office" ? officeData.value : userData.value;
});

const submitForm = () => {
  console.log("Form Submitted", formData.value);
  closeModal();
};

const printDetails = (item) => {
  // Dynamically create modal content for the specific item
  const modalHtml = `
    <html>
      <head>
        <title>Print Modal</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .modal-content { font-size: 16px; }
        </style>
      </head>
      <body>
        <h2>${selectedOption.value === 'Office' ? 'Office' : 'User'} Details</h2>
        <div class="details">
          <p><strong>Name:</strong> ${item.name}</p>
          <p><strong>Status:</strong> ${item.status}</p>
        </div>
        <div class="modal-body">
          <p><strong>Equipment Installed:</strong> ${item.equipmentInstalled ? item.equipmentInstalled.join(', ') : 'N/A'}</p>
          <p><strong>Operating System:</strong> ${item.osInstalled || 'N/A'}</p>
          <p><strong>Software Installed:</strong> ${item.softwareInstalled ? item.softwareInstalled.join(', ') : 'N/A'}</p>
          <p><strong>PC Specifications:</strong> ${JSON.stringify(item.desktopSpecs)}</p>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(modalHtml);
  printWindow.document.close();
  printWindow.print();
};

const isDropdownOpen = ref(false);
const selectedYear = ref(new Date().getFullYear());
const years = ref([2023, 2024, 2025, 2026, 2027]);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const updateYear = (year) => {
  selectedYear.value = year;
  isDropdownOpen.value = false; // Close dropdown after selection
};
// Add User Modal Control
const isAddUserModalOpen = ref(false);

// New User Data
const newUser = ref({
  name: '',
  status: 'Clear'
});

// Function to Add User
const addUser = () => {
  if (newUser.value.name.trim() !== '') {
    officeData.value.push({ name: newUser.value.name, status: newUser.value.status });
    newUser.value = { name: '', status: 'Clear' }; // Reset input fields
    isAddUserModalOpen.value = false; // Close modal
  }
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

// Attach event listener when dropdown opens
watch(isStatusDropdownOpen, (newVal) => {
  if (newVal) {
    document.addEventListener("click", handleClickOutside);
  } else {
    document.removeEventListener("click", handleClickOutside);
  }
});
</script>

<template>
  <MainLayout>
    <h2 class="d-flex justify-content-center my-3">Preventive Maintenance 2025</h2> 
    <div class="d-flex justify-content-center mb-3">
    <button class="btn btn-success" @click="isAddUserModalOpen = true">
      <i class="fas fa-user-plus"></i> Add User
    </button>
    
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Actions</th>
          <th>Status</th>
          <th>Print Details</th> 
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in employees" :key="employee.employeeId">
          <td>{{ employee.emp_name }}</td>
            <td>
              <button class="edit-btn" @click="openStep1Modal(item)">View</button>
            </td>
            <td :class="{ 'clear-status': item.status === 'Clear', 'unclear-status': item.status === 'Unclear' }">
              {{ item.status }}
            </td>
            <td>
              <button class="edit-btn" @click="printDetails(item)">Print</button> <!-- Fixed reference -->
            </td>
          </tr>
        </tbody>
      </table>

        <!-- Add User Modal -->
      <div v-if="isAddUserModalOpen" class="modal fade show d-block">
        <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">Add New User</h5>
              <button type="button" class="btn-close" @click="isAddUserModalOpen = false"></button>


            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">User Name</label>
                <input type="text" class="form-control" v-model="newUser.name" />
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select class="form-control" v-model="newUser.status">
                  <option value="Clear">Clear</option>
                  <option value="Unclear">Unclear</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-danger" @click="isAddUserModalOpen = false">Cancel</button>
              <button class="btn btn-primary" @click="addUser">Add User</button>
            </div>
          </div>
        </div>
      </div>

    <!-- Modal -->
    <div v-if="isStep1ModalOpen" class="modal fade show d-block">
      <div class="modal-dialog modal-xl" role="document">
        <!-- Preventive Maintenance Form Modal -->
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header d-flex align-items-center justify-content-between w-100 flex-wrap gap-3">

            <!-- Title -->
            <h5 class="modal-title mb-0">Preventive Maintenance Form</h5>

            <!-- Inputs Group -->
            <div class="d-flex align-items-center gap-3 flex-wrap">
              
              <!-- Number Input -->
              <div class="d-flex flex-column">
                <label class="form-label mb-0" style="font-size: 14px;"></label>
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  v-model="formData.number"
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

        <!-- For Disposal Button -->
        <button class="btn btn-danger btn-sm">For Disposal</button>

      </div>

          <div class="modal-body modal-scrollable">
            <!-- User & Date Info -->
            <div class="row mb-3">
              <div class="col-md-2">
                <label class="form-label">User/Operator</label>
                <input type="text" class="form-control" v-model="formData.userOperator">
              </div>
              <div class="col-md-2">
                <label class="form-label">Office/College/Unit</label>
                <input type="text" class="form-control" v-model="formData.officeUnit">
              </div>
              <div class="col-md-2">
                <label class="form-label">Department</label>
                <input type="text" class="form-control" v-model="formData.department">
              </div>
              <div class="col-md-2">
                <label class="form-label">Date Acquired</label>
                <input type="date" class="form-control" v-model="formData.dateAcquired">
              </div>
              <div class="col-md-2">
                <label class="form-label">Date</label>
                <input type="text" class="form-control" v-model="formData.pcName">
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

             <!-- Operating System Installed -->
             <div class="card p-3 mt-3">
              <h6 class="fw-bold">Operating System Installed:</h6>
              <div v-for="(option, index) in osOptions" :key="index" class="mb-2">
                <div class="form-check">
                  <input type="radio" class="form-check-input" :value="option" v-model="formData.osInstalled">
                  <label class="form-check-label">{{ option }}</label>
                </div>
                <div v-if="formData.osInstalled === 'Other' && option === 'Other'" class="ms-3">
                  <input type="text" class="form-control mt-1" v-model="formData.otherOS" placeholder="Specify Other OS">
                </div>
                <div v-if="formData.osInstalled === option && (option === 'Windows 10' || option === 'Windows 11')" class="ms-4">
                  <div class="form-check">
                    <input type="radio" class="form-check-input" value="Licensed" v-model="formData.osLicense">
                    <label class="form-check-label">Licensed</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" value="Not Licensed" v-model="formData.osLicense">
                    <label class="form-check-label">Not Licensed</label>
                  </div>
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
            <button type="button" class="btn btn-success" @click="openStep2Modal">
              <i class="fas fa-arrow-right"></i> Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2: Preventive Maintenance Checklist Modal -->
    <div v-if="isStep2ModalOpen" class="modal fade show d-block">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-between align-items-center">
            <h4 class="modal-title fw-bold">ITEM CHECKLIST</h4>

            <div class="dropdown position-relative ms-auto">
              <button class="btn btn-primary dropdown-toggle ms-auto" type="button" @click="toggleDropdown">
                Save
              </button>
              <ul class="dropdown-menu me-2" :class="{ show: isDropdownOpen }">
                <li v-for="year in years" :key="year">
                  <a class="dropdown-item" href="#" @click.prevent="updateYear(year)">
                    {{ year }}
                  </a>
                </li>
              </ul>
            </div>


            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Item #</th>
                  <th>Task</th>
                  <th>Description</th>
                  <th class="text-center">OK</th>
                  <th class="text-center">Repair</th>
                  <th class="text-center">N/A</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(check, index) in checklist" :key="index">
                  <tr v-for="(desc, i) in check.description.split('\n')" :key="index + '-' + i">
                    <td v-if="i === 0" :rowspan="check.description.split('\n').length">{{ check.item }}</td>
                    <td v-if="i === 0" :rowspan="check.description.split('\n').length">{{ check.task }}</td>
                    <td>{{ desc }}</td>
                    <td class="text-center">
                      <input type="radio" :name="'status-' + index + '-' + i" value="OK" v-model="check.status[i]">
                    </td>
                    <td class="text-center">
                      <input type="radio" :name="'status-' + index + '-' + i" value="Repair" v-model="check.status[i]">
                    </td>
                    <td class="text-center">
                      <input type="radio" :name="'status-' + index + '-' + i" value="N/A" v-model="check.status[i]">
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>

            <!-- Comments Section -->
            <div class="mt-3">
              <label for="comments" class="fw-bold">Summary/Recommendation</label>
              <textarea id="comments" v-model="comments" class="form-control" rows="3" placeholder="Enter any additional comments..."></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="button" class="btn btn-primary" @click="submitForm">Submit</button>
          </div>
        </div>
        </div>
      </div>
    <!-- </div> -->
  </MainLayout>
  </template>

<style scoped>
/* Background & Container */
.container {
  text-align: center;
  padding: 30px;
  min-height: 100vh;
}

/* Controls */
.controls {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

/* Dropdown */
select {
  padding: 10px;
  font-size: 16px;
  border-radius: 6px;
  border: 2px solid #2c3e50;
  background-color: #ffffff;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  min-width: 150px;
  font-weight: bold;
}

/* Table */
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

/* Status Colors */
.clear-status {
  color: #27ae60;
  font-weight: bold;
}

.unclear-status {
  color: #e74c3c;
  font-weight: bold;
}

/* Edit Button */
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

/* Hover Effect on Table Rows */
.data-table tr:hover {
  background-color: rgba(44, 62, 80, 0.1);
  transition: background-color 0.3s ease-in-out;
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
  max-width: 1400px; /* Increase max width */
  max-height: 90vh; /* Prevent it from going beyond the viewport */
  display: flex;
  flex-direction: column;
}

/* Increase the height and make it scrollable */
.modal-body {
  max-height: 70vh; /* Adjust height for better visibility */
  overflow-y: auto; /* Enable scrolling */
  padding-right: 10px;
}

/* Ensure modal stays centered */
.modal-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Centering fix */
}


.input-field {
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border: 2px solid #2c3e50;
  border-radius: 5px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.save-btn {
  background-color: #27ae60;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>