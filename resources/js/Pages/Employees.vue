<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineProps, reactive, watch} from 'vue'; 
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

const enableBackgroundScroll = () => {
  document.body.style.overflow = "";
};


const employees = ref(props.employees || []);
const selectedEmployee = ref(null);
const isStep2ModalOpen = ref(false)

const isStep1ModalOpen = ref(false);

const openStep1Modal = (mainId) => {
  isStep1ModalOpen.value = true;
  console.log("Main ID:", mainId);
  console.log("Employees:", props.employees);

  const employeeData = props.employees.find(emp => String(emp.mainId) === String(mainId));

  if (employeeData) {
    console.log("Employee Data:", employeeData);  
    selectedEmployee.value = employeeData;
  } else {
    console.error("Employee not found with mainId:", mainId);
  }
};

// Form Data
const formData = reactive({
  ticketnumber: "",
  equipment: "",
  pcName: "",
  userOperator: "",
  officeUnit: "",
  department: "",
  dateAcquired: "",
  date: "",
  equipmentInstalled: [],
  windows10: "",
  windows11: "",
  license: "",
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
    Monitor: "",
    Casing: "",
    Printer: "", 
    Keyboard: "",
    Mouse: "",
    AVR: "",
    NetWorkMacIp: ""
  },
});

watch(selectedEmployee, (newVal) => {
  if (newVal) {
    console.log(newVal); // Check the new value of selectedEmployee

    // Basic Info
    formData.userOperator = newVal.emp_name || "";
    formData.officeUnit = newVal.OfficeName || "";
    formData.pcName = newVal.pcName || "";
    formData.department = newVal.department_name || "";
    formData.ticketnumber = newVal.ticketnumber || "";
    formData.equipment = newVal.equipmentId || "";
    formData.dateAcquired = newVal.date_acquired || "";
    formData.date = newVal.date || "";

    // Equipment Installed
    formData.equipmentInstalled = [];
    if (newVal.cpu === 1) formData.equipmentInstalled.push("CPU");
    if (newVal.monitor_status === 1) formData.equipmentInstalled.push("Monitor");
    if (newVal.mouse_status === 1) formData.equipmentInstalled.push("Mouse");
    if (newVal.keyboard_status === 1) formData.equipmentInstalled.push("Keyboard");
    if (newVal.printer_status === 1) formData.equipmentInstalled.push("Printer");
    if (newVal.ups_status === 1) formData.equipmentInstalled.push("UPS");
    if (newVal.avr_status === 1) formData.equipmentInstalled.push("AVR");
    if (newVal.other_equip) formData.equipmentInstalled.push("Other");
    formData.other_equip = newVal.other_equip || "";

    // Operating System
    if (newVal.windows10 === 1) {
      formData.osInstalled = "Windows 10";
    } else if (newVal.windows11 === 1) {
      formData.osInstalled = "Windows 11";
    } else {
      formData.osInstalled = "Other";
    }
    formData.license = newVal.license || "";
    formData.other_os = newVal.other_os || "";

    // Software Installed
    formData.softwareInstalled = [];
    if (newVal.enrollment === 1) formData.softwareInstalled.push("Enrollment System");
    if (newVal.anti_virus === 1) formData.softwareInstalled.push("Anti-Virus");
    if (newVal.browser === 1) formData.softwareInstalled.push("Browser");
    if (newVal.microsoft === 1) formData.softwareInstalled.push("Microsoft");
    if (newVal.adobe_reader === 1) formData.softwareInstalled.push("Adobe Reader");
    if (newVal.word_processor === 1) formData.softwareInstalled.push("Word Processor");
    if (newVal.media_player === 1) formData.softwareInstalled.push("Media Player");

    if (newVal.other_sys) formData.softwareInstalled.push("Other");

    formData.other_sys = newVal.other_sys || "";

    // Desktop Specs
    formData.desktopSpecs.Processor = newVal.processor_details || "";
    formData.desktopSpecs.Motherboard = newVal.motherboard_details || "";
    formData.desktopSpecs.Memory = newVal.memory_details || "";
    formData.desktopSpecs.GraphicCard = newVal.graphics_card_details || "";
    formData.desktopSpecs.Monitor = newVal.monitor_details || "";
    formData.desktopSpecs.HardDisk = newVal.hard_disk_details || "";
    formData.desktopSpecs.Casing = newVal.casing_details || "";
    formData.desktopSpecs.PowerSupply = newVal.power_supply_details || "";
    formData.desktopSpecs.Keyboard = newVal.keyboard_details || "";
    formData.desktopSpecs.Mouse = newVal.mouse_details || "";
    formData.desktopSpecs.AVR = newVal.avr_details || "";
    formData.desktopSpecs.UPS = newVal.ups_details || "";
    formData.desktopSpecs.Printer = newVal.printer_details || "";
    formData.desktopSpecs.NetWorkMacIp = newVal.network_mac_ip_details || "";
  }
});

const updateEquipmentStatus = (option) => {
  if (formData.equipmentInstalled.includes(option)) {
  if (option === "CPU") formData.cpu_status = "1";
  if (option === "Keyboard") formData.keyboard_status = "1";
  if (option === "Monitor") formData.monitor_status = "1";
  if (option === "Mouse") formData.mouse_status = "1";
  if (option === "Printer") formData.printer_status = "1";
  if (option === "UPS") formData.ups_status = "1";
  if (option === "AVR") formData.avr_status = "1";
  if (option === "Other") formData.other_equip = ""; // Allow user input

} else {

  // Set the selected option to "1"
  if (option === "CPU") formData.cpu_status = "1";
  if (option === "Keyboard") formData.keyboard_status = "1";
  if (option === "Monitor") formData.monitor_status = "1";
  if (option === "Mouse") formData.mouse_status = "1";
  if (option === "Printer") formData.printer_status = "1";
  if (option === "UPS") formData.ups_status = "1";
  if (option === "AVR") formData.avr_status = "1";
  if (option === "Other") formData.other_equip = ""; // Allow user input
}
};


const updateSoftwareStatus = (option) => {
  if (formData.softwareInstalled.includes(option)) {
    if (option === "Enrollment System") formData.enrollment = "1";
    if (option === "Adobe Reader") formData.adobe_reader = "1";
    if (option === "Word Processor") formData.word_processor = "1";
    if (option === "Media Player") formData.media_player = "1";
    if (option === "Anti-Virus") formData.anti_virus = "1";
    if (option === "Browser") formData.browser = "1";
    if (option === "Microsoft") formData.microsoft = "1";
    if (option === "Other") formData.other_sys = ""; // Allow user input

  } else {
    if (option === "Enrollment System") formData.enrollment = "0";
    if (option === "Adobe Reader") formData.adobe_reader = "0";
    if (option === "Word Processor") formData.word_processor = "0";
    if (option === "Media Player") formData.media_player = "0";
    if (option === "Anti-Virus") formData.anti_virus = "0";
    if (option === "Browser") formData.browser = "0";
    if (option === "Microsoft") formData.microsoft = "0";
    if (option === "Other") formData.other_sys = ""; // Allow user input

  }
};
const updateOsInstalled = (option) => {
  // Reset values to 0
  formData.windows10 = 0;
  formData.windows11 = 0;
  formData.other_os = "";
  formData.license = ""; // Reset license when switching OS

  // Assign value when Windows 10 or 11 is selected
  if (option === "Windows 10") {
    formData.windows10 = 1;
  } else if (option === "Windows 11") {
    formData.windows11 = 1;
  }
};


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
      <h3 class="text-center my-2" v-if="employees.length > 0">
  {{ employees[0].department_name }}
</h3>



      <table class="data-table">
        <thead>
          <tr>
            <th>Employee Name </th>
            <th>PC Name </th>
            <th>Equipment Number  </th>
            <th>Actions</th>
            <th>Status</th>
    
          </tr>
        </thead>
        <tbody>
          <tr v-for="employees in employees" :key="employees.employeeId">
          <td>{{employees.emp_name }}</td>
          <td>{{employees.pcName }}</td>
          <td>{{employees.equipmentId }}</td>



            <td class="text-center">
              <div class="d-flex justify-content-center">
              <button class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto" 
              @click="openStep1Modal(employees.mainId)">
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
                 @input="console.log('Ticket Number:', formData.ticketnumber)"disabled

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
                 @input="console.log('Equipment Number:', formData.equipment)"disabled

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
                <input type="text" class="form-control" v-model="formData.userOperator "disabled>
              </div>
              <div class="col-md-2">
                <label class="form-label">Office/College/Unit</label>
                <input type="text" class="form-control" v-model="formData.officeUnit"disabled>
              </div>
              <div class="col-md-2">
                <label class="form-label">Department</label>
                <input type="text" class="form-control" v-model="formData.department"disabled>
              </div>
              <div class="col-md-2">
                <label class="form-label">Date Acquired</label>
                <input type="text" class="form-control" v-model="formData.dateAcquired"disabled>
              </div>

              <!-- <div class="col-md-2">
              <label class="form-label">Date Acquired</label>
              <input type="text" class="form-control" v-model="formData.dateAcquired" placeholder="YYYY-MM-DD">
            </div> -->

              <div class="col-md-2">
                <label class="form-label">Date</label>
                <input type="text" class="form-control" v-model="formData.date" disabled>
              </div>
              <div class="col-md-2">
                <label class="form-label">PC Name</label>
                <input type="text" class="form-control" v-model="formData.pcName"disabled>
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
                  @change="updateEquipmentStatus(option) " disabled
                />
                <label class="form-check-label">{{ option }} </label>
              </div>

              <!-- Input Field for 'Other' Equipment -->
              <input 
                v-if="option === 'Other' && formData.equipmentInstalled.includes('Other')" 
                type="text" 
                class="form-control mt-1 ms-3" 
                v-model="formData.other_equip" 
                placeholder="Specify Other Equipment"
                disabled/>
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
              @change="updateOsInstalled(option) " disabled
            />
            <label class="form-check-label">{{ option }}</label>
          </div>

          <!-- Input Field for 'Other' OS -->
          <div v-if="formData.osInstalled === 'Other'" class="ms-3">
            <input 
              type="text" 
              class="form-control mt-1" 
              v-model="formData.other_os" 
              placeholder="Specify Other OS"disabled
            />
          </div>

          <!-- License selection (only for Windows 10 & 11) -->
          <div  class="mt-2 ms-4">
            <h6 class="fw-bold text-start">License:</h6>
            <div class="form-check text-start">
              <input 
                type="radio" 
                class="form-check-input" 
                :value="1" 
                v-model.number="formData.license"disabled
              />
              <label class="form-check-label">Licensed</label>
            </div>
            <div class="form-check text-start">
              <input 
                type="radio" 
                class="form-check-input" 
                :value="0" 
                v-model.number="formData.license"disabled
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
                  @change="updateSoftwareStatus(option)" disabled
                />
                <label class="form-check-label">{{ option }}</label>
              </div>

              <!-- Input Field for 'Other' Software -->
              <input 
                v-if="option === 'Other' && formData.softwareInstalled.includes('Other')" 
                type="text" 
                class="form-control mt-1 ms-3" 
                v-model="formData.other_sys" 
                placeholder="Specify Other Software"disabled
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
                  <input type="text" class="form-control" v-model="formData.desktopSpecs[key]"disabled>
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