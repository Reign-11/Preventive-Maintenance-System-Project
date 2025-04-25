<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineProps, reactive, watch,inject} from 'vue'; 
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
const isStep2ModalOpen = ref(false)


const isStep1ModalOpen = ref(false);

const openStep1Modal = (mainId) => {
  isStep1ModalOpen.value = true;
  currentMainId.value = mainId;
  console.log("MainId: " + currentMainId.value);

  const employeeData = props.employees.find(emp => String(emp.mainId) === String(mainId));
  if (employeeData) {
    selectedEmployee.value = employeeData;
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

const options = [
  {  value: '1' },
  {  value: '2' },
  {  value: '3' }
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

// This should replace your existing watch function for selectedEmployee
watch(selectedEmployee, (newVal) => {
  if (newVal) {
    console.log("Selected employee changed:", newVal);
    
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
    
    // Update checklist data specifically
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
    
    // Log the updated data
    console.log("Checklist data updated successfully");
  }
}, { immediate: true, deep: true }); // Important: immediate ensures it runs once immediately, deep ensures nested properties are watched

// In your Vue component
import PrintService from '../../css/PrintService.js'; 
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
      <h2 class="text-center my-3">Preventive Maintenance Offices</h2>
      <h3 class="text-center my-2" v-if="employees.length > 0">
  {{ employees[0].department_name }}
</h3>

      <table class="data-table">
        <thead>
          <tr>
            <th>Employee Name </th>
            <th>PC Name </th>
            <th>Equipment Number</th>
            <th>Actions</th>
            <th>Status</th>
            <th>Date</th>
     
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in employees" :key="emp.employeeId">
            <td>{{ emp.emp_name }}</td>
            <td>{{ emp.pcName }}</td>
            <td>{{ emp.equipmentId }}</td>

            <td class="text-center">
              <div class="d-flex justify-content-center">
                <button class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto mx-2" 
                        @click="openStep1Modal(emp.mainId)">
                  <i class="fas fa-eye me-1"></i> View
                </button>
                <button 
                class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto" 
                @click="printDetails(emp)">
                <i class="fas fa-print me-1"></i> Print
              </button>
              </div>
            </td>
            <td>{{ emp.disposal === 1 ? 'For Disposal' : (emp.disposal == null ? 'None' : emp.disposal) }}</td>

            <td>{{ formatDate(emp.date) }}</td>
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
              <h6 class="fw-bold text-start">Desktop Specifications:</h6>
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
          <button type="button" class="btn btn-secondary" @click="openStep2Modal(currentMainId.value)">Next  </button>
        </div>
          </div>
        </div>
      </div>
    </div>
</div>

    </div>
    <div v-if="isStep2ModalOpen" class="modal fade show d-block">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-between align-items-center">
            <h4 class="modal-title fw-bold">ITEM CHECKLIST</h4>
         
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

        <!-- HERE IS THE CHECKLIST -->
          <div class="modal-body">
            <table class="table-auto w-full border">
    <thead>
      <tr>
        <th class="border px-4 py-2">Item #</th>
        <th class="border px-4 py-2">Task</th>
        <th class="border px-4 py-2">Description</th>
        <th class="border px-4 py-2 text-center">OK</th>
        <th class="border px-4 py-2 text-center">Repair</th>
        <th class="border px-4 py-2 text-center">N/A</th>
      </tr>
    </thead>
    <tbody>
      <!-- Item 1 -->
      <tr>
        <td class="border px-4 py-2 ">1</td>
        <td class="border px-4 py-2">System Boot</td>
        <td class="border px-4 py-2">Boot system from a cold start</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Boot_' + opt.value" :value="opt.value" v-model="checklist.System_Boot" />
      <label class="form-check-label" :for="'Boot_' + opt.value"> </label> </div>
    </td>
      </tr>

      <!-- Item 2 -->
      <tr>
        <td class="border px-4 py-2">2</td>
        <td class="border px-4 py-2">System Log-in</td>
        <td class="border px-4 py-2">Monitor for errors and speed of entire boot process</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Log_' + opt.value" :value="opt.value" v-model="checklist.System_Log" />
      <label class="form-check-label" :for="'Log_' + opt.value"> </label> </div>
    </td>
      </tr>

      <!-- Item 3 - Network Settings -->
      <tr>
        <td class="border px-4 py-2" rowspan="6">3</td>
        <td class="border px-4 py-2" rowspan="6">Network Settings</td>
        <td class="border px-4 py-2">Monitor login script</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Network1_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings1" />
      <label class="form-check-label" :for="'Network1_' + opt.value"> </label> </div>
    </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">TCP/IP and IPX settings are correct</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Network2_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings2" />
      <label class="form-check-label" :for="'Network2_' + opt.value"> </label> </div>
    </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">Domain Name</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Network3_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings3" />
      <label class="form-check-label" :for="'Network3_' + opt.value"> </label> </div>
    </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">Security Settings</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Network4_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings4" />
      <label class="form-check-label" :for="'Network4_' + opt.value"> </label> </div>
    </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">Client Configurations</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Network5_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings5" />
      <label class="form-check-label" :for="'Network5_' + opt.value"> </label> </div>
    </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">Computer Name</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Network6_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings6" />
      <label class="form-check-label" :for="'Network6_' + opt.value"> </label> </div>
    </td>
      </tr>

      <tr>
        <td class="border px-4 py-2" rowspan="6">4</td>
        <td class="border px-4 py-2" rowspan="6">Computer Hardware Settings </td>
        <td class="border px-4 py-2">Verify Device Manager settings </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Hardware1_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings1" />
      <label class="form-check-label" :for="'Hardware1_' + opt.value"> </label> </div>
  </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">BIOS up-to-date</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Hardware2_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings2" />
      <label class="form-check-label" :for="'Hardware2_' + opt.value"> </label> </div>
    </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">Hard Disk  </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Hardware3_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings3" />
      <label class="form-check-label" :for="'Hardware3_' + opt.value"> </label> </div>
    </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">DVD/CD-RW firmware up-to-date  </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Hardware4_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings4" />
      <label class="form-check-label" :for="'Hardware4_' + opt.value"> </label> </div>
    </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">Memory is O.K. </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Hardware5_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings5" />
      <label class="form-check-label" :for="'Hardware5_' + opt.value"> </label> </div>
    </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">For Laptop battery run-time is norm  </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Hardware6_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings6" />
      <label class="form-check-label" :for="'Hardware6_' + opt.value"> </label> </div>
    </td>
      </tr>

      <tr>
        <td class="border px-4 py-2">5  </td>
        <td class="border px-4 py-2">Browser/Proxy Settings </td>
        <td class="border px-4 py-2">Verify proper settings and operation.  </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Browser' + opt.value" :value="opt.value" v-model="checklist.Browser_Settings" />
      <label class="form-check-label" :for="'Browser_' + opt.value"> </label> </div>
  </td>
      </tr>

      <tr>
        <td class="border px-4 py-2">6 </td>
        <td class="border px-4 py-2">Proper Software Loads    </td>
        <td class="border px-4 py-2">Required software is installed and operating.    </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Sofware_' + opt.value" :value="opt.value" v-model="checklist.Proper_Software_Loads" />
      <label class="form-check-label" :for="'Sofware_' + opt.value"> </label> </div>
  </td>
      </tr>
      <tr>
  <td class="border px-4 py-2" rowspan="2">7</td>
  <td class="border px-4 py-2" rowspan="2">Viruses and Malware</td>
  <td class="border px-4 py-2">Anti-virus installed</td>

  <!-- Loop through radio options -->
  <td v-for="opt in options" :key="opt.value" class="border text-center">
  <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" :id="'virus1_' + opt.value":value="opt.value"  
  v-model="checklist.Viruses_Malware1" /><label class="form-check-label" :for="'virus1_' + opt.value" >{{ opt.label }}</label>
  </div>
  </td>
  </tr>
  
  <td class="border px-4 py-2">  Virus scan done</td>
  <!-- Loop through radio options -->
  <td v-for="opt in options" :key="opt.value" class="border text-center">
  <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" :id="'virus2_' + opt.value":value="opt.value"  
  v-model="checklist.Viruses_Malware2" /><label class="form-check-label" :for="'virus2_' + opt.value" >{{ opt.label }}</label>
  </div>
  </td>
 
  <!-- Clearance Section -->
<tr>
  <td class="border px-4 py-2" rowspan="4">8</td>
  <td class="border px-4 py-2" rowspan="4">Clearance</td>
  <td class="border px-4 py-2">Unuse Software Removed</td>
  <!-- Clearance1 -->
  <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'clearance1_' + opt.value" :value="opt.value" v-model="checklist.Clearance1" />
      <label class="form-check-label" :for="'clearance1_' + opt.value"> </label> </div>
  </td>
  </tr>

  <tr>
  <td class="border px-4 py-2">Temporary files removed</td>
  <!-- Clearance2 -->
  <td v-for="opt in options" :key="opt.value" class="border text-center"> 
    <div class="form-check form-check-inline"><input  class="form-check-input"  type="radio" :id="'clearance2_' + opt.value" :value="opt.value" v-model="checklist.Clearance2" />
    <label class="form-check-label" :for="'clearance2_' + opt.value"></label></div>
  </td>
  </tr>

  <tr>
  <td class="border px-4 py-2">Cache Cleared</td>

  <!-- Clearance3 -->
  <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'clearance3_' + opt.value" :value="opt.value" v-model="checklist.Clearance3"  />
      <label class="form-check-label" :for="'clearance3_' + opt.value" ></label></div>
   </td>
  </tr>

<tr>
  <td class="border px-4 py-2">Recycle Bin Emptied</td>

  <!-- Clearance4 -->
  <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline">
<input class="form-check-input" type="radio" :id="'clearance4_' + opt.value" :value="opt.value" v-model="checklist.Clearance4" />
<label class="form-check-label" :for="'clearance4_' + opt.value"></label></div>
  </td>
</tr>

       
      <tr>
        <td class="border px-4 py-2" rowspan="5">9</td>
        <td class="border px-4 py-2" rowspan="5">Interiors and Cleaning     </td>
        <td class="border px-4 py-2">Dust removed     </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Interior1_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning1" />
      <label class="form-check-label" :for="'Interior1_' + opt.value"> </label> </div>
  </td>
  </tr>

      <tr>
        <td class="border px-4 py-2">No loose parts     </td>
           <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Interior2_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning2" />
      <label class="form-check-label" :for="'Interior2_' + opt.value"> </label> </div>
  </td>
  </tr>
      <tr>
        <td class="border px-4 py-2">Airflow is O.K.        </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Interior3_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning3" />
      <label class="form-check-label" :for="'Interior3_' + opt.value"> </label> </div>
  </td>
  </tr>
      <tr>
        <td class="border px-4 py-2">Cables unplugged and re-plugged        </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Interior4_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning4" />
      <label class="form-check-label" :for="'Interior4_' + opt.value"> </label> </div>
  </td>
  </tr>
      <tr>
        <td class="border px-4 py-2">Fans are operating         </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Interior5_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning5" />
      <label class="form-check-label" :for="'Interior5_' + opt.value"> </label> </div>
  </td>
  </tr>

      <tr>
        <td class="border px-4 py-2" rowspan="7">10</td>
        <td class="border px-4 py-2" rowspan="7">Peripheral Devices </td>
        <td class="border px-4 py-2">Mouse      </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Device1_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices1" />
      <label class="form-check-label" :for="'Device1_' + opt.value"> </label> </div>
  </td>
  
  </tr>
      <tr>
        <td class="border px-4 py-2">Keyboard       </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Device2_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices2" />
      <label class="form-check-label" :for="'Device2_' + opt.value"> </label> </div>
  </td>
</tr>
        <td class="border px-4 py-2">Monitor</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Device3_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices3" />
      <label class="form-check-label" :for="'Device3_' + opt.value"> </label> </div>
  </td>

      <tr>
        <td class="border px-4 py-2">UPS  </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Device4_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices4" />
      <label class="form-check-label" :for="'Device4_' + opt.value"> </label> </div>
  </td>
      </tr>
      
      <tr>
        <td class="border px-4 py-2">Printer  </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Device5_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices5" />
      <label class="form-check-label" :for="'Device5_' + opt.value"> </label> </div>
  </td>
      </tr>

      <tr>
        <td class="border px-4 py-2">Telephone extension  </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Device6_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices6" />
      <label class="form-check-label" :for="'Device6_' + opt.value"> </label> </div>
  </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">Fax  </td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Device7_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices7" />
      <label class="form-check-label" :for="'Device7_' + opt.value"> </label> </div>
  </td>
      </tr>

    </tbody>
  </table>

  <!-- Summary -->
  <div class="mt-3">
    <label for="comments" class="fw-bold">Summary/Recommendation</label>
    <textarea id="comments" v-model="checklist.Summary" class="form-control" rows="3"
              placeholder="Enter any additional comments..."></textarea>
  </div>
</div>
<div class="modal-footer">
  <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
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