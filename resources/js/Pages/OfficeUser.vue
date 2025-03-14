<script setup>
import { ref, computed, defineProps, watchEffect, onMounted } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';

const props = defineProps({
  departments: { type: Array, default: () => [] },  
  pmYear: { type: Object, default: () => ({}) },
  YrId: { type: [String, Number], default: '' },
  PlanId: { type: [String, Number], default: '' },
  office: { type: Object, default: () => ({}) },
  deptId: { type: [String, Number], default: '' } 
  
});

// Reactive variables
const isStep1ModalOpen = ref(false);
const isStep2ModalOpen = ref(false);
const selectedOption = ref("Office");
const isModalOpen = ref(false);
const editedItem = ref({});
const selectedPmYear = computed(() => props.pmYear ?? {});
const selectedOfficeId = ref(props.office?.OffId || '');
const selectedYear = ref(props.YrId || '');
const departments = ref(props.departments || []);
const officeData = ref([]); 
const selectedplan = ref(props.PlanId || '');

const selectedDeptId = ref('');

watchEffect(() => {
  if (props.departments?.length) {
    const firstDeptId = props.departments[0]?.deptId;

    // Convert to a number, fallback to 0 if invalid
    selectedDeptId.value = firstDeptId ? Number(firstDeptId) : 0;
  }
});


const logParams = (deptId) => {
  console.log("Clicked department ID:", deptId);  

  console.log("Navigating to UserTable with Params:", {
    officeId: Number(selectedOfficeId.value),
    YrId: Number(selectedYear.value),
    deptId: Number(deptId || selectedDeptId.value), 
  PlanId: selectedplan.value
});

router.get(route('usertable', {  
  departmentId,  
  officeId: selectedOfficeId.value, 
  YrId: selectedYear.value,
  PlanId: selectedplan.value
}), { preserveState: true });
};

onMounted(() => {
  console.log('Departments:', props.departments);
  console.log('First Department:', props.departments?.[0]);
  console.log('Selected Office ID:', selectedOfficeId.value);
  console.log('Selected Year:', selectedYear.value);
  console.log('Selected Plan:', selectedplan.value);
});


// Options
const equipmentOptions = ['CPU', 'Keyboard', 'Monitor', 'Mouse', 'Printer', 'UPS', 'AVR', 'Other'];
const osOptions = ['Windows 10', 'Windows 11', 'Other'];
const softwareOptions = ['Enrollment System', 'Adobe Reader', 'Word Processor', 'Media Player', 'Anti-Virus', 'Browser', 'Other'];



const userData = ref([
  { name: "PC-92", status: "Clear" },
  { name: "PC-12", status: "Clear" },
  { name: "PC-021", status: "Clear" },
  { name: "PC-001", status: "Unclear" },
  { name: "PC-023", status: "Clear" }
]);

const checklist = ref([
  { item: 1, task: 'System Boot', description: 'Monitor boot errors and speed.', status: '' },
  { item: 2, task: 'System Log-in', description: 'Monitor login script and errors.', status: '' },
  { item: 3, task: 'Network Settings', description: 'Check TCP/IP settings, domain security.', status: '' }
]);



// Computed properties
const displayedData = computed(() => selectedOption.value === "Office" ? officeData.value : userData.value);
const isUserSelected = computed(() => selectedOption.value === "Users");
const isOfficeSelected = computed(() => selectedOption.value === "Office");

// Modal functions
const openStep1Modal = () => {
  isStep1ModalOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const openStep2Modal = () => {
  isStep1ModalOpen.value = false;
  isStep2ModalOpen.value = true;
};

const closeModal = () => {
  isStep1ModalOpen.value = false;
  isStep2ModalOpen.value = false;
  document.body.style.overflow = '';
};

// Form Data
const formData = ref({
  userOperator: '',
  officeUnit: '',
  dateAcquired: '',
  equipmentInstalled: [],
  osInstalled: '',
  osLicense: '',
  softwareInstalled: [],
  desktopSpecs: {
    Processor: '', Motherboard: '', Memory: '', GraphicCard: '', UPS: '',
    HardDisk: '', OpticalDrive: '', Monitor: '', Casing: '', Printer: '',
    PowerSupply: '', Keyboard: '', Mouse: '', AVR: '', NetWorkMacIp: ''
  }
});

// Edit and save functions
const editItem = (item) => {
  editedItem.value = { ...item };
  formData.value.userOperator = item.name;
  formData.value.officeUnit = selectedOption.value;
  formData.value.status = item.status;
  isModalOpen.value = true;
};

const saveItem = () => {
  const dataList = selectedOption.value === "Office" ? officeData.value : userData.value;
  const index = dataList.findIndex((item) => item.name === editedItem.value.name);

  if (index !== -1) {
    dataList[index] = { ...editedItem.value };
  }

  isModalOpen.value = false;
};

// Form submission
const submitForm = () => {
  console.log("Form Submitted", formData.value);
  closeModal();
};

// Print modal content
const printDetails = (item) => {
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
        <p><strong>Name:</strong> ${item.name}</p>
        <p><strong>Status:</strong> ${item.status}</p>
        <p><strong>Equipment Installed:</strong> ${item.equipmentInstalled?.join(', ') || 'N/A'}</p>
        <p><strong>Operating System:</strong> ${item.osInstalled || 'N/A'}</p>
        <p><strong>Software Installed:</strong> ${item.softwareInstalled?.join(', ') || 'N/A'}</p>
        <p><strong>PC Specifications:</strong> ${JSON.stringify(item.desktopSpecs)}</p>
      </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(modalHtml);
  printWindow.document.close();
  printWindow.print();
};


</script>




<template>
  <MainLayout>
    <div class="container">
      <div>
    
    <h1> {{ selectedPmYear.Description }} {{ selectedPmYear.Name }}</h1>

  </div>

      <div class="d-flex align-items-center justify-content-center gap-2">
        <label for="office-users" class="mb-0">Office/Users:</label>
        <select v-model="selectedOption" id="office-users" class="form-select w-auto">
          <option value="Office">Office</option>
          <option value="Users">Users</option>
        </select>
        <button class="btn btn-info d-flex align-items-center" v-if="!isUserSelected" @click="printTable">
          <i class="fas fa-print me-1"></i> Print
        </button>
      </div>


      <table class="data-table">
      <thead>
        <tr>
          <th>User/Office</th>
          <th v-if="isUserSelected || isOfficeSelected">Actions</th>
          <th>Status</th>
          <th v-if="isUserSelected">Print Details</th> <!-- Show only for Users -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="department in departments" :key="department.deptId">
          <td>{{ department.department_name }}</td>
          <td v-if="isUserSelected || isOfficeSelected">
            <button 
              class="edit-btn" 
              v-if="isUserSelected" 
              @click="openStep1Modal(department)"
            >
              View
            </button>
            <Link 
  v-else
  :href="route('usertable', { 
    deptId: Number(selectedDeptId.value),  // Convert to number
    officeId: Number(selectedOfficeId), 
    YrId: Number(selectedYear) 
  })"
  class="btn btn-primary" 
  @click="logParams(department.deptId)"
>
  <i class="fas fa-eye me-1"></i> View
</Link>
          </td>
          <td class="status-column">N/A</td> 
          <td v-if="isUserSelected">
            <button class="edit-btn" @click="printDetails(department)">Print</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="isStep1ModalOpen" class="modal fade show d-block">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
            <div class="modal-header d-flex justify-content-between align-items-center">
                <h5 class="modal-title">Preventive Maintenance Form</h5>
                <div class="d-flex align-items-center ms-auto">
                <button class="btn btn-danger me-2" @click="markForDisposal">For Disposal</button>
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
    </div>
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

.print-btn {
  background-color: #4CAF50; /* Green or any color you prefer */
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}
.print-btn:hover {
  background-color: #45a049; /* Darker shade on hover */
}

@media print {
    body { font-family: Arial, sans-serif; padding: 20px; }
    h2 { text-align: center; }
    .modal { display: none !important; } /* Hide modals during print */
}

/* Left-align the headings inside the cards */
.card h6 {
  text-align: left;
}

/* Left-align the labels inside the form groups */
.card .form-check-label {
  text-align: left;
}

/* Additional styling to ensure that the checkboxes and radio buttons align left */
.card .form-check {
  text-align: left;
}

/* Ensure the input fields also align left */
.card .form-control {
  text-align: left;
}

</style>


