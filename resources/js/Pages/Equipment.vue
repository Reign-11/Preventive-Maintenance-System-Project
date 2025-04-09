<script setup>
import { ref, computed, watch,defineProps, reactive,onMounted} from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';
import axios from "axios";

const props = defineProps({
  employee: { type: Array, default: () => [] },
  departmentId: { type: [String, Number], default: null },
  officeId: { type: [String, Number], default: null },
  YrId: { type: [String, Number], default: null },
  PlanId: { type: [String, Number], default: null },
  employeeId: { type: [String, Number], default: null },
  office: { type: Object, default: () => ({}) }, 
  pmYear: { type: Object, default: () => ({}) },
  categoryId: { type: [String, Number], default: null } 

});


const employee = ref(props.employee || []);

console.log('employee:', props.employee);
const selectedEmployee = ref(null);

const newUser = ref({ name: "", number: "" });

      // API FORM 

const employees = ref([]);

// Fetch employee data
const fetchChecklist = async () => {
  try {
    const response = await axios.get('/api/getEmployeeByEquipment');
    employees.value = response.data;
  } catch (error) {
    console.error('Error fetching checklist:', error);
  }
};

// Handle print details (you can expand this method)


// Fetch data when the component is mounted
onMounted(fetchChecklist);

      
const isStep1ModalOpen = ref(false);
const isStep2ModalOpen = ref(false);
const selectedOption = ref("Office");
const isModalOpen = ref(false);  
const isLoading = ref(false);


const openModal = () => {
  isModalOpen.value = true;
};

// Function to close the modal
const iscloseModal = () => {
  isModalOpen.value = false;
};


const openStep1Modal = () => {
  isStep1ModalOpen.value = true;
  const employeeData = props.employee[0]; // Access the first employee's data
  if (employeeData) {
    selectedEmployee.value = employeeData;
    formData.officeUnit = employeeData.OfficeName || "";
    formData.department = employeeData.department_name || "";
  }
};

const modal1 = () => {

  isStep1ModalOpen.value = false;
  isStep2ModalOpen.value = true;

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
const formData = reactive({
  ticketnumber: "",
  equipment:"",
  officeUnit: "",
  department: "",
  dateAcquired: "",
  date: "",
  equipmentInstalled: [],
  windows10: "0",
  windows11: "0",
  license : null,
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

watch(selectedEmployee  , (newVal) => {
  console.log("selectedEmployee Changed:", newVal); // check data in console
  if (newVal) {
    formData.officeUnit = newVal.OfficeName || ""; 
    formData.department = newVal.department_name || ""; 
  }
});


// Options for checkboxes
const equipmentOptions = ['CPU', 'Keyboard', 'Monitor', 'Mouse', 'Printer', 'UPS', 'AVR', 'Other'];
const osOptions = ['Windows 10', 'Windows 11', 'Other'];
const softwareOptions = ['Enrollment System', 'Adobe Reader', 'Word Processor', 'Media Player', 'Anti-Virus', 'Browser', 'Microsoft', 'Other'];

const updateOsInstalled = (option) => {
  // Reset values to 0
  formData.windows10 = 0;
  formData.windows11 = 0;
  formData.other_os = "";
  formData.license = null; // Reset license when switching OS

  // Assign value when Windows 10 or 11 is selected
  if (option === "Windows 10") {
    formData.windows10 = 1;
  } else if (option === "Windows 11") {
    formData.windows11 = 1;
  }
};


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

const checklist = reactive({
  items: [
    { task: "System Boot", details: "Boot system from a cold start", status: [3] },  
    { task: "System Log-in", details: "Monitor for errors and speed of entire boot process", status: [3] },
    { task: "Network Settings", details: "Monitor login script.\nTCP/IP and IPX settings are correct.\nDomain Name\nSecurity Settings\nClient Configurations\nComputer Name", status: Array(6).fill(3) },
    { task: "Computer Hardware Settings", details: "Verify Device Manager settings\nBIOS up-to-date\nHard Disk\nDVD/CD-RW firmware up-to-date\nMemory is O.K.\nFor Laptop battery run-time is norm", status: Array(6).fill(3) },
    { task: "Browser/Proxy Settings", details: "Verify proper settings and operation.", status: [3] },
    { task: "Proper Software Loads", details: "Required software is installed and operating.", status: [3] },
    { task: "Viruses and Malware", details: "Anti-virus installed\nVirus scan done", status: Array(2).fill(3) },
    { task: "Clearance", details: "Unused software removed\nTemporary files removed\nRecycle bin and caches emptied\nPeripheral devices clean", status: Array(4).fill(3) },
    { task: "Interiors and Cleaning", details: "Dust removed\nNo loose parts\nAirflow is O.K.\nCables unplugged and re-plugged\nFans are operating", status: Array(5).fill(3) },
    { task: "Peripheral Devices", details: "Mouse\nKeyboard\nMonitor\nUPS\nPrinter\nTelephone extension\nFax", status: Array(7).fill(3) }
  ],
  Summary: ""
});

const transformChecklist = () => {
  const result = [];

  checklist.items.forEach(item => {
    const lines = item.details.split('\n');
    lines.forEach((line, idx) => {
      result.push({
        task: item.task,
        details: [line], // wrap single detail in array
        status: [item.status[idx]] // match with corresponding status
      });
    });
  });

  return result;
};


const updateStatus = (index, i, value) => {
  if (!checklist.items[index].status[i]) {
    checklist.items[index].status[i] = 3; // Default to N/A
  }
  checklist.items[index].status[i] = value;
};


const submitForm = async () => {
  try {
    if (!props.employee || props.employee.length === 0) {
      console.error("Employee data is missing");
      return;
    }

    // Assuming you're selecting the employee dynamically, ensure 'selectedEmployeeId' is defined
    const employeeId = selectedEmployee.value.employeeId; // Use the employeeId of the selected employee

    if (!employeeId) {
      console.error("Employee ID is not selected");
      return;
    }

    console.log("Submitting Form Data:", formData, checklist);

    // Construct request payload
    const payload = {
      employeeId,
      ticketnumber: formData.ticketnumber, 
      equipment : formData.equipment, 
      dateAcquired: formData.dateAcquired,
      cpu_status: formData.cpu_status,
      keyboard_status: formData.keyboard_status,
      printer_status: formData.printer_status,
      monitor_status: formData.monitor_status,
      mouse_status: formData.mouse_status,
      ups_status: formData.ups_status,
      avr_status: formData.avr_status,
      windows10: formData.windows10,
      windows11: formData.windows11,
      license: formData.license,
      enrollment: formData.enrollment,
      microsoft: formData.microsoft,
      browser: formData.browser,
      anti_virus: formData.anti_virus,
      other_equip: formData.other_equip,
      other_os: formData.other_os,
      other_sys: formData.other_sys,
      processor_details: formData.desktopSpecs.Processor,
      motherboard_details: formData.desktopSpecs.Motherboard,
      memory_details: formData.desktopSpecs.Memory,
      graphics_card_details: formData.desktopSpecs.GraphicCard,
      monitor_details: formData.desktopSpecs.Monitor,
      hard_disk_details: formData.desktopSpecs.HardDisk,
      casing_details: formData.desktopSpecs.Casing,
      power_supply_details: formData.desktopSpecs.PowerSupply,
      keyboard_details: formData.desktopSpecs.Keyboard,
      mouse_details: formData.desktopSpecs.Mouse,
      avr_details: formData.desktopSpecs.AVR,
      ups_details: formData.desktopSpecs.UPS,
      printer_details: formData.desktopSpecs.Printer,
      network_mac_ip_details: formData.desktopSpecs.NetWorkMacIp, 
    };

    // Send the data to the Laravel backend
    const response = await axios.post(`/api/employeeChecklist/${employeeId}`, payload);

    console.log("Response:", response.data);

    // Close the modal after successful submission
    closeModal();
  } catch (error) {
    console.error("Error submitting form:", error.response?.data || error.message);
  }
};

const submitdata = async () => {
  try {
    const payload = {
      mainId: props.employee.employeeId,
      YrId: props.pmYear.yearId,
      summary: checklist.Summary,
      checklist: transformChecklist()
    };

    const response = await axios.post('http://127.0.0.1:8000/api/submit-checklist', payload);
    console.log('Checklist submitted:', response.data);
  } catch (error) {
    console.error('Error submitting checklist:', error);
  }
};





  // BUTTON PRINT 
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

const addUser = async () => {
  if (!newUser.value.name.trim() || !newUser.value.number.trim()) {
    alert("Please fill in all fields.");
    return;
  }

  const firstEmployee = employee.value.length > 0 ? employee.value[0] : null;
  const officeId = firstEmployee ? firstEmployee.OffId : null;
  const departmentId = firstEmployee ? firstEmployee.DeptId : null;

  try {
    const response = await axios.post("/api/add-employee", {
      emp_name: newUser.value.name,
      employee_number: newUser.value.number,
      offId: officeId ?? 0,
      deptId: departmentId ?? 0
    });

    alert("Employee added successfully!");

    // Add the new employee to the reactive array
    employee.value.push(response.data);

    // Reset the form
    newUser.value = { name: "", number: "" };
    isModalOpen.value = false;
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    alert("An error occurred while adding the employee.");
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
    
        <button class="btn btn-success" @click="openStep1Modal">
      <i class="fas fa-user-plus"></i> Add Form
      </button>

        
        </div>
        <table class="data-table">
      <thead>
        <tr>
            <th>Equipment Number</th>
            <th>Year Name</th>
            <th class="text-center">Actions</th>
            <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in employees" :key="employee.mainId">
            <!-- Display equipment number -->
            <td>{{ employee.equipmentId }}</td>
            
            <!-- Display year name -->
            <td>{{ employee.year_name }}</td>

            <!-- Action button (e.g., print details) -->
            <td class="text-center">
              <button 
                class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto" 
                @click="printDetails(employee)">
                <i class="fas fa-eye me-1"></i>Print
              </button>
            </td>

            <td :class="{ 'clear-status': employee.status === 'Clear', 'unclear-status': employee.status === 'Unclear' }">
              {{ employee.status }}
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
           
              <div class="col-md-3">
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
                <input type="text" class="form-control" v-model="formData.date">
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
                  placeholder="Specify Other Equipment">
              </div>
            </div>
          </div>

        <!-- Operating System Installed -->
        <div class="card p-3 mt-3">
        <h6 class="fw-bold">Operating System Installed:</h6>

        <div v-for="(option, index) in osOptions" :key="index" class="form-check">
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
          <h6 class="fw-bold">License:</h6>
          <div class="form-check">
            <input 
              type="radio" 
              class="form-check-input" 
              :value="1" 
              v-model.number="formData.license"
            />
            <label class="form-check-label">Licensed</label>
          </div>
          <div class="form-check">
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
    <h6 class="fw-bold">Software Application Installed:</h6>
    <div class="row">
      <div v-for="(option, index) in softwareOptions" :key="index" class="col-md-3">
        <div class="form-check">
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
          placeholder="Specify Other Software">
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
            <button type="button" class="btn btn-primary" @click="submitForm">Save</button>
            <button type="button" class="btn btn-secondary" @click="openStep2Modal">Next  </button>
          </div>
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

            <!-- SAVE BUTTON ON WHAT YR TO BE SAVED IF NEEDED -->
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

        <!-- HERE IS THE CHECKLIST -->
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
            <template v-for="(check, index) in checklist.items" :key="check.item">
              <tr v-for="(desc, i) in check.details.split('\n')" :key="`${check.item}-${i}`">
                <td v-if="i === 0" :rowspan="check.details.split('\n').length">{{ check.item }}</td>
                <td v-if="i === 0" :rowspan="check.details.split('\n').length">{{ check.task }}</td>
                <td>{{ desc }}</td>
                
                <!-- OK -->
                <td class="text-center">
                  <input type="radio" :name="'status-' + check.item + '-' + i" 
                        :value="1" v-model="checklist.items[index].status[i]"
                        @change="updateStatus(index, i, 1)">
                </td>

                <!-- Repair -->
                <td class="text-center">
                  <input type="radio" :name="'status-' + check.item + '-' + i" 
                        :value="2" v-model="checklist.items[index].status[i]"
                        @change="updateStatus(index, i, 2)">
                </td>

                <!-- N/A -->
                <td class="text-center">
                  <input type="radio" :name="'status-' + check.item + '-' + i" 
                        :value="3" v-model="checklist.items[index].status[i]"
                        @change="updateStatus(index, i, 3)">
                </td>
              </tr>
            </template>
          </tbody>
        </table>

      <!-- Comments Section -->
      <div class="mt-3">
        <label for="comments" class="fw-bold">Summary/Recommendation</label>
        <textarea id="comments" v-model="checklist.Summary" class="form-control" rows="3"
                  placeholder="Enter any additional comments..."></textarea>
      </div>
    </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        <button type="button" class="btn btn-primary" @click="submitForm">Submit</button>
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
</style>