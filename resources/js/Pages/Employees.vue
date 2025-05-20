<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineProps, reactive, watch } from 'vue'; 
import MainLayout from '@/Layouts/MainLayout.vue';
import PrintService from '../../css/PrintService.js'; 

const props = defineProps({
  employees: { type: Array, default: () => [] },
  officeId: { type: [String, Number], default: '' },
  YrId: { type: [String, Number], default: '' },
  employeeId: { type: [String, Number], default: '' },
  PlanId: { type: [String, Number], default: '' },
  departmentId: { type: [String, Number], default: '' },
  categoryId: { type: [String, Number], default: 1 },
  pmYear: { type: Object, default: ''},
  imageUrl: { type: String, default: '' } 
});

const imageUrl = ref(null);

const currentMainId = ref(null);
const enableBackgroundScroll = () => {
  document.body.style.overflow = "";
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const employees = ref(props.employees || []);
console.log('Initial employees:', employees.value);
const selectedEmployee = ref(null);
const isStep2ModalOpen = ref(false);
const isStep1ModalOpen = ref(false);

const openStep1Modal = (mainId) => {
  isStep1ModalOpen.value = true;
  currentMainId.value = mainId;
  console.log("MainId: " + currentMainId.value);

  const employeeData = props.employees.find(emp => String(emp.mainId) === String(mainId));

  if (employeeData) {
    selectedEmployee.value = employeeData;

    // ✅ Set the image URL
    if (employeeData.image) {
      imageUrl.value = `/storage/${employeeData.image}`;
    } else {
      imageUrl.value = null;
    }

  } else {
    console.error("Employee not found with mainId:", mainId);
  }
};


const openStep2Modal = (mainId = currentMainId.value) => {
  console.log("mainId passed to Step 2:", mainId);

  if (!mainId) {
    console.error("Step 2 called without a valid mainId");
    return;
  }

  const employeeData = props.employees.find(emp => String(emp.mainId) === String(mainId));
  if (employeeData) {
    selectedEmployee.value = employeeData;
    isStep1ModalOpen.value = false;
    isStep2ModalOpen.value = true;
  } else {
    console.error("Employee not found with mainId:", mainId);
  }
};

// Form Data
const formData = reactive({
  technician: "",
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
    NetWorkMacIp: "",
  },
  images:""
});

watch(selectedEmployee, (newVal) => {
  if (newVal) {
    console.log(newVal); // Check the new value of selectedEmployee

    // Basic Info
    formData.technician = newVal.technician || "";

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

const options = [
  { value: '1' },
  { value: '2' },
  { value: '3' }
];

const checklist = reactive({
  System_Boot: "",
  System_Log: "",

  Network_Settings1: "",
  Network_Settings2: "",
  Network_Settings3: "",
  Network_Settings4: "",
  Network_Settings5: "",
  Network_Settings6: "",

  Computer_Hardware_Settings1: "",
  Computer_Hardware_Settings2: "",
  Computer_Hardware_Settings3: "",
  Computer_Hardware_Settings4: "",
  Computer_Hardware_Settings5: "",
  Computer_Hardware_Settings6: "",

  Browser_Settings: "",
  Proper_Software_Loads: "",

  Viruses_Malware1: "",
  Viruses_Malware2: "",

  Clearance1: "",
  Clearance2: "",
  Clearance3: "",
  Clearance4: "",

  Interiors_Cleaning1: "",
  Interiors_Cleaning2: "",
  Interiors_Cleaning3: "",
  Interiors_Cleaning4: "",
  Interiors_Cleaning5: "",

  Peripheral_Devices1: "",
  Peripheral_Devices2: "",
  Peripheral_Devices3: "",
  Peripheral_Devices4: "",
  Peripheral_Devices5: "",
  Peripheral_Devices6: "",
  Peripheral_Devices7: "",

  Summary: ""
});

watch(selectedEmployee, (newVal) => {
  console.log("Selected Employee Data:", newVal); // Check the data structure
  if (newVal) {
    for (const key in checklist) {
      checklist[key] = newVal[key] || ""; // Update checklist for all matching keys
    }

    // If the keys don't match exactly, you can manually map the specific keys as needed
    checklist.System_Boot = newVal.System_Boot || "";
    checklist.System_Log = newVal.System_Log || "";

    checklist.Network_Settings1 = newVal.Network_Settings1 || "";
    checklist.Network_Settings2 = newVal.Network_Settings2 || "";
    checklist.Network_Settings3 = newVal.Network_Settings3 || "";
    checklist.Network_Settings4 = newVal.Network_Settings4 || "";
    checklist.Network_Settings5 = newVal.Network_Settings5 || "";
    checklist.Network_Settings6 = newVal.Network_Settings6 || "";

    checklist.Computer_Hardware_Settings1 = newVal.Computer_Hardware_Settings1 || "";
    checklist.Computer_Hardware_Settings2 = newVal.Computer_Hardware_Settings2 || "";
    checklist.Computer_Hardware_Settings3 = newVal.Computer_Hardware_Settings3 || "";
    checklist.Computer_Hardware_Settings4 = newVal.Computer_Hardware_Settings4 || "";
    checklist.Computer_Hardware_Settings5 = newVal.Computer_Hardware_Settings5 || "";
    checklist.Computer_Hardware_Settings6 = newVal.Computer_Hardware_Settings6 || "";

    checklist.Browser_Settings = newVal.Browser_Settings || "";
    checklist.Proper_Software_Loads = newVal.Proper_Software_Loads || "";

    checklist.Viruses_Malware1 = newVal.Viruses_Malware1 || "";
    checklist.Viruses_Malware2 = newVal.Viruses_Malware2 || "";

    checklist.Clearance1 = newVal.Clearance1 || "";
    checklist.Clearance2 = newVal.Clearance2 || "";
    checklist.Clearance3 = newVal.Clearance3 || "";
    checklist.Clearance4 = newVal.Clearance4 || "";

    checklist.Interiors_Cleaning1 = newVal.Interiors_Cleaning1 || "";
    checklist.Interiors_Cleaning2 = newVal.Interiors_Cleaning2 || "";
    checklist.Interiors_Cleaning3 = newVal.Interiors_Cleaning3 || "";
    checklist.Interiors_Cleaning4 = newVal.Interiors_Cleaning4 || "";
    checklist.Interiors_Cleaning5 = newVal.Interiors_Cleaning5 || "";

    checklist.Peripheral_Devices1 = newVal.Peripheral_Devices1 || "";
    checklist.Peripheral_Devices2 = newVal.Peripheral_Devices2 || "";
    checklist.Peripheral_Devices3 = newVal.Peripheral_Devices3 || "";
    checklist.Peripheral_Devices4 = newVal.Peripheral_Devices4 || "";
    checklist.Peripheral_Devices5 = newVal.Peripheral_Devices5 || "";
    checklist.Peripheral_Devices6 = newVal.Peripheral_Devices6 || "";
    checklist.Peripheral_Devices7 = newVal.Peripheral_Devices7 || "";

    checklist.Summary = newVal.Summary || "";
  }
});

const printDetails = async (emp) => {
  // Get employee data
  const employeeData = props.employees.find(e => String(e.mainId) === String(emp.mainId));
  if (!employeeData) {
    console.error("Employee not found for printing with mainId:", emp.mainId);
    return;
  }
  
  // Set the selected employee to populate form data
  selectedEmployee.value = employeeData;
  
  // Wait a moment for the reactive data to update
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Ensure all checklist values are strings
  const printReadyChecklist = {};
  for (const key in checklist) {
    printReadyChecklist[key] = checklist[key] ? String(checklist[key]) : '';
  }
  
  // Debug what's being printed
  console.log("Printing with data:", {
    employeeData, 
    formData: {...formData},
    checklist: printReadyChecklist
  });
  
  // Use the print service with properly formatted checklist
  PrintService.printPreventiveMaintenance(employeeData, formData, printReadyChecklist);
};
</script>

<template>
  <MainLayout>
    <div class="container">
      <div class="page-header">
        <h1 class="title">Preventive Maintenance Offices</h1>
        <h2 class="subtitle" v-if="employees.length > 0">{{ employees[0].department_name }}</h2>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>PC Name</th>
              <th>Equipment Number</th>
              <th>Actions</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in employees" :key="emp.employeeId" class="table-row">
              <td>{{ emp.emp_name }}</td>
              <td>{{ emp.pcName }}</td>
              <td>{{ emp.equipmentId }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn view-btn" @click="openStep1Modal(emp.mainId)">
                    <i class="fas fa-eye"></i> View
                  </button>
                  <button class="btn print-btn" @click="printDetails(emp)">
                    <i class="fas fa-print"></i> Print
                  </button>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="{ 'disposal-status': emp.disposal === '1' }">
                  {{ emp.disposal === '1' ? 'For Disposal' : (emp.disposal == null ? 'None' : emp.disposal) }}
                </span>
              </td>
              <td>{{ formatDate(emp.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Modal Step 1: Equipment Details -->
      <div v-if="isStep1ModalOpen" class="modal-overlay">
        <div class="modal-content modal-xl">
          <div class="modal-header">
            <div class="header-title-container">
              <h2 class="modal-title">PREVENTIVE MAINTENANCE FORM</h2>
              <div class="header-input-group">
                <div class="input-field">
                  <label for="ticket-number" class="input-label">Ticket:</label>
                  <input 
                    id="ticket-number"
                    type="text"
                    class="header-input"
                    v-model="formData.ticketnumber"
                    placeholder="Number"
                    disabled
                  />
                </div>
                <div class="input-field">
                  <label for="equipment-number" class="input-label">Equipment:</label>
                  <input 
                    id="equipment-number"
                    type="text"
                    class="header-input"
                    v-model="formData.equipment"
                    placeholder="Equipment #"
                    disabled
                  />
                </div>
              </div>
            </div>
            <button class="close-btn-icon" @click="closeModal">&times;</button>
          </div>

          <div class="modal-body">
            <!-- User & Date Info Card -->
            <div class="card mb-4">
              <div class="card-header">
                <h3 class="card-title">User Information</h3>
              </div>
              <div class="card-body">
                <div class="form-row">
                  <div class="form-group col-md-2">
                    <label class="form-label">User/Operator</label>
                    <input type="text" class="form-control" v-model="formData.userOperator" disabled>
                  </div>
                  <div class="form-group col-md-2">
                    <label class="form-label">Office/College/Unit</label>
                    <input type="text" class="form-control" v-model="formData.officeUnit" disabled>
                  </div>
                  <div class="form-group col-md-2">
                    <label class="form-label">Department</label>
                    <input type="text" class="form-control" v-model="formData.department" disabled>
                  </div>
                  <div class="form-group col-md-2">
                    <label class="form-label">Date Acquired</label>
                    <input type="text" class="form-control" v-model="formData.dateAcquired" disabled>
                  </div>
                  <div class="form-group col-md-2">
                    <label class="form-label">Date</label>
                    <input type="text" class="form-control" v-model="formData.date" disabled>
                  </div>
                  <div class="form-group col-md-2">
                    <label class="form-label">PC Name</label>
                    <input type="text" class="form-control" v-model="formData.pcName" disabled>
                  </div>
                </div>
              </div>
            </div>

            <!-- Equipment Installed Card -->
            <div class="card mb-4">
              <div class="card-header">
                <h3 class="card-title">Equipment Installed</h3>
              </div>
              <div class="card-body">
                <div class="checkbox-grid">
                  <div v-for="(option, index) in equipmentOptions" :key="index" class="checkbox-item">
                    <div class="checkbox-container">
                      <input 
                        class="checkbox-input" 
                        type="checkbox" 
                        :id="'equipment_' + index"
                        :value="option" 
                        v-model="formData.equipmentInstalled"
                        @change="updateEquipmentStatus(option)"
                        disabled
                      />
                      <label class="checkbox-label" :for="'equipment_' + index">{{ option }}</label>
                    </div>

                    <!-- Input Field for 'Other' Equipment -->
                    <div v-if="option === 'Other' && formData.equipmentInstalled.includes('Other')" class="other-input">
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="formData.other_equip"
                        placeholder="Other Equipment"
                        disabled
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Operating System Card -->
            <div class="card mb-4">
              <div class="card-header">
                <h3 class="card-title">Operating System Installed</h3>
              </div>
              <div class="card-body">
                <div class="os-options">
                  <div v-for="(option, index) in osOptions" :key="index" class="radio-container">
                    <input 
                      type="radio" 
                      class="radio-input" 
                      :id="'os_' + index"
                      :value="option" 
                      v-model="formData.osInstalled"
                      @change="updateOsInstalled(option)"
                      disabled
                    />
                    <label class="radio-label" :for="'os_' + index">{{ option }}</label>
                  </div>
                </div>

                <!-- Input Field for 'Other' OS -->
                <div v-if="formData.osInstalled === 'Other'" class="other-input">
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="formData.other_os"
                    placeholder="Specify Other OS"
                    disabled
                  />
                </div>

                <!-- License selection (only for Windows 10 & 11) -->
                <div v-if="formData.osInstalled === 'Windows 10' || formData.osInstalled === 'Windows 11'" class="license-options">
                  <h4 class="subheading">License Status:</h4>
                  <div class="radio-container">
                    <input 
                      type="radio" 
                      class="radio-input" 
                      id="license_1"
                      :value="1" 
                      v-model.number="formData.license"
                      disabled
                    />
                    <label class="radio-label" for="license_1">Licensed</label>
                  </div>
                  <div class="radio-container">
                    <input 
                      type="radio" 
                      class="radio-input" 
                      id="license_0"
                      :value="0" 
                      v-model.number="formData.license"
                      disabled
                    />
                    <label class="radio-label" for="license_0">Not Licensed</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Software Installed Card -->
            <div class="card mb-4">
              <div class="card-header">
                <h3 class="card-title">Software Application Installed</h3>
              </div>
              <div class="card-body">
                <div class="checkbox-grid">
                  <div v-for="(option, index) in softwareOptions" :key="index" class="checkbox-item">
                    <div class="checkbox-container">
                      <input 
                        class="checkbox-input" 
                        type="checkbox" 
                        :id="'software_' + index"
                        :value="option" 
                        v-model="formData.softwareInstalled"
                        @change="updateSoftwareStatus(option)"
                        disabled
                      />
                      <label class="checkbox-label" :for="'software_' + index">{{ option }}</label>
                    </div>

                    <!-- Input Field for 'Other' Software -->
                    <div v-if="option === 'Other' && formData.softwareInstalled.includes('Other')" class="other-input">
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="formData.other_sys"
                        placeholder="Other Software"
                        disabled
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Desktop Specifications Card -->
            <div class="specs-and-image-container">
              <!-- Desktop Specifications Card -->
              <div class="card mb-4 specs-card">
                <div class="card-header">
                  <h3 class="card-title">Desktop Specifications</h3>
                </div>
                <div class="card-body">
                  <div class="specs-grid">
                    <div v-for="(value, key) in formData.desktopSpecs" :key="key" class="spec-item">
                      <label class="form-label">{{ key.replace(/([A-Z])/g, ' $1').trim() }}</label>
                      <input type="text" class="form-control" v-model="formData.desktopSpecs[key]" disabled>
                    </div>
                  </div>
                </div>
              </div>
              </div>

              <!-- Image Card -->
              <div class="card mb-4 image-card">
                <div class="card-header">
                  <h3 class="card-title">Equipment Image</h3>
                </div>
                <div class="card-body image-container">
                  <img
                    v-if="imageUrl"
                    :src="imageUrl"
                    alt="Equipment Image"
                    class="equipment-image"
                  />
                  <p v-else class="no-image-text">No image available</p>
                </div>
              </div>
            </div>


          <div class="modal-footer">
            <button type="button" class="btn cancel-btn" @click="closeModal">
              <i class="fas fa-times"></i> Close
            </button>
            <button type="button" class="btn next-btn" @click="openStep2Modal(currentMainId)">
              <i class="fas fa-arrow-right"></i> Next
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Step 2: Checklist -->
      <div v-if="isStep2ModalOpen" class="modal-overlay">
        <div class="modal-content modal-xl">
          <div class="modal-header">
            <h2 class="modal-title">PREVENTIVE MAINTENANCE CHECKLIST</h2>
            <button class="close-btn-icon" @click="closeModal">&times;</button>
          </div>

          <div class="modal-body">
            <div class="checklist-table-container">
              <table class="checklist-table">
                <thead>
                  <tr>
                    <th class="item-col">Item #</th>
                    <th class="task-col">Task</th>
                    <th class="desc-col">Description</th>
                    <th class="option-col">OK</th>
                    <th class="option-col">Repair</th>
                    <th class="option-col">N/A</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- System Boot -->
                  <tr>
                    <td class="item-cell">1</td>
                    <td class="task-cell">System Boot</td>
                    <td class="desc-cell">Boot system from a cold start</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Boot_' + opt.value" :value="opt.value" v-model="checklist.System_Boot" disabled />
                        <label class="radio-label" :for="'Boot_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>

                  <!-- System Log-in -->
                  <tr>
                    <td class="item-cell">2</td>
                    <td class="task-cell">System Log-in</td>
                    <td class="desc-cell">Monitor for errors and speed of entire boot process</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Log_' + opt.value" :value="opt.value" v-model="checklist.System_Log" disabled />
                        <label class="radio-label" :for="'Log_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>

                  <!-- Network Settings -->
                  <tr>
                    <td class="item-cell network-row" rowspan="6">3</td>
                    <td class="task-cell network-row" rowspan="6">Network Settings</td>
                    <td class="desc-cell">Monitor login script</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Network1_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings1" disabled />
                        <label class="radio-label" :for="'Network1_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">TCP/IP and IPX settings are correct</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Network2_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings2" disabled />
                        <label class="radio-label" :for="'Network2_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Domain Name</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Network3_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings3" disabled />
                        <label class="radio-label" :for="'Network3_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Security Settings</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Network4_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings4" disabled />
                        <label class="radio-label" :for="'Network4_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Client Configurations</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Network5_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings5" disabled />
                        <label class="radio-label" :for="'Network5_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Computer Name</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Network6_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings6" disabled />
                        <label class="radio-label" :for="'Network6_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>

                  <!-- Computer Hardware Settings -->
                  <tr>
                    <td class="item-cell hardware-row" rowspan="6">4</td>
                    <td class="task-cell hardware-row" rowspan="6">Computer Hardware Settings</td>
                    <td class="desc-cell">Verify Device Manager settings</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Hardware1_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings1" disabled />
                        <label class="radio-label" :for="'Hardware1_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">BIOS up-to-date</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Hardware2_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings2" disabled />
                        <label class="radio-label" :for="'Hardware2_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Hard Disk</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Hardware3_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings3" disabled />
                        <label class="radio-label" :for="'Hardware3_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">DVD/CD-RW firmware up-to-date</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Hardware4_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings4" disabled />
                        <label class="radio-label" :for="'Hardware4_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Memory is O.K.</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Hardware5_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings5" disabled />
                        <label class="radio-label" :for="'Hardware5_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">For Laptop battery run-time is norm</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Hardware6_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings6" disabled />
                        <label class="radio-label" :for="'Hardware6_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>

                  <!-- Browser Settings -->
                  <tr>
                    <td class="item-cell">5</td>
                    <td class="task-cell">Browser/Proxy Settings</td>
                    <td class="desc-cell">Verify proper settings and operation.</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Browser_' + opt.value" :value="opt.value" v-model="checklist.Browser_Settings" disabled />
                        <label class="radio-label" :for="'Browser_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>

                  <!-- Proper Software Loads -->
                  <tr>
                    <td class="item-cell">6</td>
                    <td class="task-cell">Proper Software Loads</td>
                    <td class="desc-cell">Required software is installed and operating.</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Software_' + opt.value" :value="opt.value" v-model="checklist.Proper_Software_Loads" disabled />
                        <label class="radio-label" :for="'Software_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>

                  <!-- Viruses and Malware -->
                  <tr>
                    <td class="item-cell virus-row" rowspan="2">7</td>
                    <td class="task-cell virus-row" rowspan="2">Viruses and Malware</td>
                    <td class="desc-cell">Anti-virus installed</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'virus1_' + opt.value" :value="opt.value" v-model="checklist.Viruses_Malware1" disabled />
                        <label class="radio-label" :for="'virus1_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Virus scan done</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'virus2_' + opt.value" :value="opt.value" v-model="checklist.Viruses_Malware2" disabled />
                        <label class="radio-label" :for="'virus2_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>

                  <!-- Clearance -->
                  <tr>
                    <td class="item-cell clearance-row" rowspan="4">8</td>
                    <td class="task-cell clearance-row" rowspan="4">Clearance</td>
                    <td class="desc-cell">Unused Software Removed</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'clearance1_' + opt.value" :value="opt.value" v-model="checklist.Clearance1" disabled />
                        <label class="radio-label" :for="'clearance1_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Temporary files removed</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'clearance2_' + opt.value" :value="opt.value" v-model="checklist.Clearance2" disabled />
                        <label class="radio-label" :for="'clearance2_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Cache Cleared</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'clearance3_' + opt.value" :value="opt.value" v-model="checklist.Clearance3" disabled />
                        <label class="radio-label" :for="'clearance3_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Recycle Bin Emptied</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'clearance4_' + opt.value" :value="opt.value" v-model="checklist.Clearance4" disabled />
                        <label class="radio-label" :for="'clearance4_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>

                  <!-- Interiors and Cleaning -->
                  <tr>
                    <td class="item-cell cleaning-row" rowspan="5">9</td>
                    <td class="task-cell cleaning-row" rowspan="5">Interiors and Cleaning</td>
                    <td class="desc-cell">Dust removed</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Interior1_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning1" disabled />
                        <label class="radio-label" :for="'Interior1_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">No loose parts</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Interior2_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning2" disabled />
                        <label class="radio-label" :for="'Interior2_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Airflow is O.K.</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Interior3_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning3" disabled />
                        <label class="radio-label" :for="'Interior3_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Cables unplugged and re-plugged</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Interior4_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning4" disabled />
                        <label class="radio-label" :for="'Interior4_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Fans are operating</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Interior5_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning5" disabled />
                        <label class="radio-label" :for="'Interior5_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>

                  <!-- Peripheral Devices -->
                  <tr>
                    <td class="item-cell peripheral-row" rowspan="7">10</td>
                    <td class="task-cell peripheral-row" rowspan="7">Peripheral Devices</td>
                    <td class="desc-cell">Mouse</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Device1_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices1" disabled />
                        <label class="radio-label" :for="'Device1_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Keyboard</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Device2_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices2" disabled />
                        <label class="radio-label" :for="'Device2_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Monitor</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Device3_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices3" disabled />
                        <label class="radio-label" :for="'Device3_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">UPS</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Device4_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices4" disabled />
                        <label class="radio-label" :for="'Device4_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Printer</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Device5_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices5" disabled />
                        <label class="radio-label" :for="'Device5_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Telephone extension</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Device6_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices6" disabled />
                        <label class="radio-label" :for="'Device6_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="desc-cell">Fax</td>
                    <td v-for="opt in options" :key="opt.value" class="option-cell">
                      <div class="radio-container">
                        <input class="radio-input" type="radio" :id="'Device7_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices7" disabled />
                        <label class="radio-label" :for="'Device7_' + opt.value"></label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Summary/Recommendation Section -->
            <div class="summary-container">
              <label for="comments" class="summary-label">Summary/Recommendation</label>
              <textarea 
                id="comments" 
                v-model="checklist.Summary" 
                class="summary-textarea" 
                rows="3" 
                placeholder="Enter any additional comments..."
                disabled>
              </textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn cancel-btn" @click="closeModal">
              <i class="fas fa-times"></i> Close
            </button>
            <!-- <button type="button" class="btn print-btn" @click="printDetails(selectedEmployee)">
              <i class="fas fa-print"></i> Print
            </button> -->
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
/* Main Container Styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  color: #2c3e50;
  font-weight: 700;
  margin: 0;
  border-bottom: 3px solid #3498db;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.3rem;
  color: #34495e;
  margin-top: 0.5rem;
}

.table-container {
  overflow-x: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: white;
  margin-bottom: 2rem;
}

/* Table Styles */
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  border: 1px solid #e0e0e0;
  padding: 1rem;
  text-align: center;
  vertical-align: middle;
}

.data-table th {
  background-color: #2c3e50;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
  padding: 1.2rem 1rem;
}

.table-row {
  transition: all 0.3s ease;
}

.table-row:nth-child(even) {
  background-color: #f8f9fa;
}

.table-row:hover {
  background-color: #e8f4fc;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Status Badge Styles */
.status-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
  background-color: rgba(241, 196, 15, 0.15);
  color: #f39c12;
  border: 1px solid rgba(241, 196, 15, 0.3);
}

.disposal-status {
  background-color: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.view-btn {
  background-color: #3498db;
  color: white;
}

.view-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.print-btn {
  background-color: #9b59b6;
  color: white;
}

.print-btn:hover {
  background-color: #8e44ad;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.next-btn {
  background-color: #3498db;
  color: white;
}

.next-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
}

.cancel-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modalFadeIn 0.3s ease-out;
}

.modal-xl {
  max-width: 1200px;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  background-color: #2c3e50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
}

.header-title-container {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  margin-right: 1rem;
}

.modal-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.input-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-label {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0;
}

.header-input {
  padding: 0.4rem 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  width: 120px;
  font-size: 0.85rem;
  color: white;
  outline: none;
}

.close-btn-icon {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.75rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: all 0.2s ease;
}

.close-btn-icon:hover {
  color: #e74c3c;
  transform: scale(1.1);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 130px);
}

.modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

/* Card Styles */
.card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  background-color: white;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.card-header {
  background-color: #f2f2f2;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.card-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-body {
  padding: 1.5rem;
}

/* Form Elements */
.form-row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -0.75rem;
  margin-left: -0.75rem;
}

.form-group {
  margin-bottom: 1rem;
  padding-right: 0.75rem;
  padding-left: 0.75rem;
}

.col-md-2 {
  flex: 0 0 16.666667%;
  max-width: 16.666667%;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.form-control:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Checkbox & Grid Styles */
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.checkbox-item {
  display: flex;
  flex-direction: column;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.checkbox-input {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #3498db;
  border-radius: 4px;
  outline: none;
  position: relative;
  cursor: pointer;
  margin: 0;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
}

.checkbox-input:checked {
  background-color: white;
  border-color: #2980b9;
}

.checkbox-input:checked::after {
  content: '\2713';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #3498db;
  font-size: 14px;
  font-weight: bold;
}

.checkbox-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.checkbox-label {
  font-size: 1rem;
  color: #333;
}

/* Radio Styles for OS Options */
.os-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.radio-container {
  display: flex;
  align-items: center;
}

.radio-input {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #3498db;
  border-radius: 50%;
  outline: none;
  position: relative;
  cursor: pointer;
  margin: 0;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
}

.radio-input:checked {
  background-color: white;
  border-color: #2980b9;
}

.radio-input:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #3498db;
}

.radio-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.radio-label {
  font-size: 1rem;
  color: #333;
}

.license-options {
  margin-top: 1rem;
  margin-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.subheading {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0.5rem 0;
}

.other-input {
  margin-left: 1.5rem;
  margin-top: 0.3rem;
}

/* Specs Grid */
.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.spec-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

/* Checklist Table Styles */
.checklist-table-container {
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.checklist-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.checklist-table th,
.checklist-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.checklist-table th {
  background-color: #f2f2f2;
  font-weight: 600;
  color: #2c3e50;
}

.item-col {
  width: 60px;
}

.task-col {
  width: 180px;
}

.desc-col {
  width: auto;
}

.option-col {
  width: 80px;
  text-align: center;
}

.item-cell, 
.task-cell {
  text-align: center;
  font-weight: 500;
}

.desc-cell {
  padding-left: 1rem;
}

.option-cell {
  text-align: center;
}

/* Special row colors for better readability */
.network-row, 
.hardware-row, 
.virus-row, 
.clearance-row, 
.cleaning-row, 
.peripheral-row {
  background-color: rgba(52, 152, 219, 0.05);
}

/* Summary Section */
.summary-container {
  margin-top: 2rem;
}

.summary-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.summary-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  background-color: #f8f9fa;
}

.summary-textarea:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .checkbox-grid, 
  .specs-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .os-options {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group.col-md-2 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }
  
  .header-title-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .modal-title {
    font-size: 1rem;
    max-width: 100%;
  }
  
  .header-input-group {
    width: 100%;
    gap: 0.5rem;
  }
  
  .input-field {
    flex: 1;
  }
  
  .header-input {
    width: 100%;
  }
  
  .btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group.col-md-2 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  
  .checkbox-grid, 
  .specs-grid {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
  
  .modal-footer {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
  
  .modal-footer .btn {
    width: 100%;
  }
  
  .checklist-table-container {
    margin: 0 -1rem;
  }
  
  .checklist-table {
    min-width: 800px;
  }
}

@media (max-width: 576px) {
  .data-table th,
  .data-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .form-group.col-md-2 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .modal-header, 
  .modal-footer {
    padding: 1rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .card-header {
    padding: 0.75rem 1rem;
  }
  
  .card-body {
    padding: 1rem;
  }
}

/* Fix for the modal body scrolling on mobile */
@media (max-width: 768px) {
  .modal-body {
    -webkit-overflow-scrolling: touch;
  }
  
  .checklist-table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  /* Ensure header sticks to the top during scroll */
  .checklist-table thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #f2f2f2;
  }
}

/* Animation Effects */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.print-btn:active, 
.cancel-btn:active,
.next-btn:active {
  animation: pulse 0.3s ease-in-out;
}
.specs-and-image-container {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.specs-card {
  flex: 2;
  margin-bottom: 0;
}

.image-card {
  flex: 1;
  margin-bottom: 0;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.equipment-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
  object-fit: contain;
}

.no-image-text {
  color: #7f8c8d;
  font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .specs-and-image-container {
    flex-direction: column;
  }
  
  .image-card {
    width: 100%;
  }
}
</style>