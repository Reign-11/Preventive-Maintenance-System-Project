<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineProps, reactive } from 'vue'; 
import MainLayout from '@/Layouts/MainLayout.vue';

const props = defineProps({
  employees: { type: Array, default: () => [] },
  officeId: { type: [String, Number], default: '' },
  YrId: { type: [String, Number], default: '' },
  employeeId: { type: [String, Number], default: '' },
  PlanId: { type: [String, Number], default: '' },
  departmentId: { type: [String, Number], default: '' },
  categoryId: { type: [String, Number], default: 1 },
  pmYear: { type: Object, default: ''}
});

const employees = ref(props.employees || []);

const isStep1ModalOpen = ref(false);
const openStep1Modal = (employeeId) => {
  isStep1ModalOpen.value = true;
  const employeeData = props.employees.find(emp => emp.employeeId === employeeId); // Fixed typo from props.employee to props.employees
  if (employeeData) {
    selectedEmployee.value = employeeData;
  }
};

// Form Data
const formData = reactive({
  ticketnumber: "",
  equipment: "",
  userOperator: "",
  officeUnit: "",
  department: "",
  dateAcquired: "",
  date: "",
  equipmentInstalled: [],
  windows10: "0",
  windows11: "0",
  license: null,
  other_os: "",
  softwareInstalled: [],
  other_sys: "",
  desktopSpecs: {
    Processor: "",
    Motherboard: "",
    Memory: "",
    GraphicCard: "",
    UPS: "",
    HardDisk: "",
    OpticalDrive: "",
    Monitor: "",
    Casing: "",
    Printer: "",
    PowerSupply: "",
    Keyboard: "",
    Mouse: "",
    AVR: "",
    NetWorkMacIp: ""
  },
});

// Options for checkboxes
const equipmentOptions = ['CPU', 'Keyboard', 'Monitor', 'Mouse', 'Printer', 'UPS', 'AVR', 'Other'];
const osOptions = ['Windows 10', 'Windows 11', 'Other'];
const softwareOptions = ['Enrollment System', 'Adobe Reader', 'Word Processor', 'Media Player', 'Anti-Virus', 'Browser', 'Microsoft', 'Other'];

const closeModal = () => {
  isStep1ModalOpen.value = false;
  isStep2ModalOpen.value = false;
  enableBackgroundScroll();
};

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
          <tr v-for="employees in employees" :key="employees.mainId">
  <td>{{employees.ticketnumber }}</td>

            <td class="text-center">
              <div class="d-flex justify-content-center">
              <button class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto" 
              @click="openStep1Modal(item)">
              <i class="fas fa-eye me-1"></i>View</button>
            </div>
            </td>
            <td :class="{ 'clear-status': 'Clear', 'unclear-status':'Unclear' }">
              
            </td>
          </tr>
        </tbody>
      </table>

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
                 @input="console.log('Ticket Number:', formData.ticketnumber)"

                 v-model="formData.ticketnumber"
                 placeholder="Number"
                style="width: 150px; height: 30px; font-size: 14px; padding: 5px;"
            >
              </div>

                <!-- Equipment Number Input -->
                <div class="d-flex flex-column">
                <label class="form-label mb-0" style="font-size: 14px;"></label>
                <input 
                 type="text" 
                 class="form-control form-control-sm" 
                 @input="console.log('Equipment Number:', formData.equipment)"

                 v-model="formData.equipment"
                 placeholder="Equipment Number"
                style="width: 150px; height: 30px; font-size: 14px; padding: 5px;"
            >
              </div>


        <!-- MODAL -->

        <!-- For Disposal Button -->
        <button class="btn btn-danger btn-sm">For Disposal</button>

      </div>

          <div class="modal-body modal-scrollable">
            <!-- User & Date Info -->
            <div class="row mb-3">
              <div class="col-md-2">
                <label class="form-label">User/Operator</label>
                <input type="text" class="form-control" v-model="formData.userOperator ">
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
                <input type="text" class="form-control" v-model="formData.dateAcquired">
              </div>

              <!-- <div class="col-md-2">
              <label class="form-label">Date Acquired</label>
              <input type="text" class="form-control" v-model="formData.dateAcquired" placeholder="YYYY-MM-DD">
            </div> -->

              <div class="col-md-2">
                <label class="form-label">Date</label>
                <input type="text" class="form-control" v-model="formData.date">
              </div>
              <div class="col-md-2">
                <label class="form-label">PC Name</label>
                <input type="text" class="form-control" v-model="formData.pcName">
              </div>
            </div>

        <!-- Equipment Installed -->
        <div class="card p-3 mt-3">
          <h6 class="fw-bold text-start">Equipment Installed:</h6>
          <div class="row">
            <div v-for="(option, index) in equipmentOptions" :key="index" class="col-md-3">
              <div class="form-check text-start">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  :value="option" 
                  v-model="formData.equipmentInstalled"
                  @change="updateEquipmentStatus(option)" 
                />
                <label class="form-check-label">{{ option }}</label>
              </div>

              <!-- Input Field for 'Other' Equipment -->
              <input 
                v-if="option === 'Other' && formData.equipmentInstalled.includes('Other')" 
                type="text" 
                class="form-control mt-1 ms-3" 
                v-model="formData.other_equip" 
                placeholder="Specify Other Equipment"
              />
            </div>
          </div>
        </div>

        <!-- Operating System Installed -->
        <div class="card p-3 mt-3">
          <h6 class="fw-bold text-start">Operating System Installed:</h6>
          <div v-for="(option, index) in osOptions" :key="index" class="form-check text-start">
            <input 
              type="radio" 
              class="form-check-input" 
              :value="option" 
              v-model="formData.osInstalled"
              @change="updateOsInstalled(option)" 
            />
            <label class="form-check-label">{{ option }}</label>
          </div>

          <!-- Input Field for 'Other' OS -->
          <div v-if="formData.osInstalled === 'Other'" class="ms-3">
            <input 
              type="text" 
              class="form-control mt-1" 
              v-model="formData.other_os" 
              placeholder="Specify Other OS"
            />
          </div>

          <!-- License selection (only for Windows 10 & 11) -->
          <div v-if="formData.windows10 === 1 || formData.windows11 === 1" class="mt-2 ms-4">
            <h6 class="fw-bold text-start">License:</h6>
            <div class="form-check text-start">
              <input 
                type="radio" 
                class="form-check-input" 
                :value="1" 
                v-model.number="formData.license"
              />
              <label class="form-check-label">Licensed</label>
            </div>
            <div class="form-check text-start">
              <input 
                type="radio" 
                class="form-check-input" 
                :value="0" 
                v-model.number="formData.license"
              />
              <label class="form-check-label">Not Licensed</label>
            </div>
          </div>
        </div>

        <!-- Software Installed -->
        <div class="card p-3 mt-3">
          <h6 class="fw-bold text-start">Software Application Installed:</h6>
          <div class="row">
            <div v-for="(option, index) in softwareOptions" :key="index" class="col-md-3">
              <div class="form-check text-start">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  :value="option" 
                  v-model="formData.softwareInstalled"
                  @change="updateSoftwareStatus(option)" 
                />
                <label class="form-check-label">{{ option }}</label>
              </div>

              <!-- Input Field for 'Other' Software -->
              <input 
                v-if="option === 'Other' && formData.softwareInstalled.includes('Other')" 
                type="text" 
                class="form-control mt-1 ms-3" 
                v-model="formData.other_sys" 
                placeholder="Specify Other Software"
              />
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
        <!-- Modal Footer -->
        <div class="modal-footer justify-content-end">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
          </div>
        </div>
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
  overflow-x: hidden; /* Prevent horizontal scrollbar */
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