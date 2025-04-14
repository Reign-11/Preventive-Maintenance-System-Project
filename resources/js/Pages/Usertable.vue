<script setup>
import { ref, computed, watch,defineProps, reactive,onMounted} from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';
import axios from "axios";
import { Link } from '@inertiajs/vue3';

const props = defineProps({
  employee: { type: Array, default: () => [] },
  departmentId: { type: [String, Number], default: null },
  officeId: { type: [String, Number], default: null },
  YrId: { type: [String, Number], default: null },
  PlanId: { type: [String, Number], default: null },
  employeeId: { type: [String, Number], default: null },
  office: { type: Object, default: () => ({}) }, 
  pmYear: { type: Object,default: () => ({ Name: '', Description: '' })},
  categoryId: { type: [String, Number], default: null },
  pmYearList: {type: Array,default: () => []}

});

const mainId = ref (0)
const employee = ref(props.employee || []);
const pmYear = ref({}); // selected year object
const selectedYear = ref(pmYear); // Initially set to passed `pmYear` from props

const isDropdownOpen = ref(false);
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const updateYear = async (year) => {
  pmYear.value = year;  // Set selected year
  isDropdownOpen.value = false;  // Close the dropdown

  try {
    // Fetch checklist data using the selected YrId
    const response = await axios.get(`/api/getChecklistByYrId/${year.YrId}`);
    
    console.log("API Response:", response.data);  // Log the API response to check its structure

    if (response.data.success) {
      const data = response.data.data[0];  // Access first item in the response

      // Check if the data object exists and has the required properties
      if (data) {
        checklist.System_Boot = data.System_Boot || "";
        checklist.System_Log = data.System_Log || "";

        checklist.Network_Settings1 = data.Network_Settings1 || "";
        checklist.Network_Settings2 = data.Network_Settings2 || "";
        checklist.Network_Settings3 = data.Network_Settings3 || "";
        checklist.Network_Settings4 = data.Network_Settings4 || "";
        checklist.Network_Settings5 = data.Network_Settings5 || "";
        checklist.Network_Settings6 = data.Network_Settings6 || "";

        checklist.Computer_Hardware_Settings1 = data.Computer_Hardware_Settings1 || "";
        checklist.Computer_Hardware_Settings2 = data.Computer_Hardware_Settings2 || "";
        checklist.Computer_Hardware_Settings3 = data.Computer_Hardware_Settings3 || "";
        checklist.Computer_Hardware_Settings4 = data.Computer_Hardware_Settings4 || "";
        checklist.Computer_Hardware_Settings5 = data.Computer_Hardware_Settings5 || "";
        checklist.Computer_Hardware_Settings6 = data.Computer_Hardware_Settings6 || "";

        checklist.Browser_Settings = data.Browser_Settings || "";
        checklist.Proper_Software_Loads = data.Proper_Software_Loads || "";

        checklist.Viruses_Malware1 = data.Viruses_Malware1 || "";
        checklist.Viruses_Malware2 = data.Viruses_Malware2 || "";

        checklist.Clearance1 = data.Clearance1 || "";
        checklist.Clearance2 = data.Clearance2 || "";
        checklist.Clearance3 = data.Clearance3 || "";
        checklist.Clearance4 = data.Clearance4 || "";

        checklist.Interiors_Cleaning1 = data.Interiors_Cleaning1 || "";
        checklist.Interiors_Cleaning2 = data.Interiors_Cleaning2 || "";
        checklist.Interiors_Cleaning3 = data.Interiors_Cleaning3 || "";
        checklist.Interiors_Cleaning4 = data.Interiors_Cleaning4 || "";
        checklist.Interiors_Cleaning5 = data.Interiors_Cleaning5 || "";

        checklist.Peripheral_Devices1 = data.Peripheral_Devices1 || "";
        checklist.Peripheral_Devices2 = data.Peripheral_Devices2 || "";
        checklist.Peripheral_Devices3 = data.Peripheral_Devices3 || "";
        checklist.Peripheral_Devices4 = data.Peripheral_Devices4 || "";
        checklist.Peripheral_Devices5 = data.Peripheral_Devices5 || "";
        checklist.Peripheral_Devices6 = data.Peripheral_Devices6 || "";
        checklist.Peripheral_Devices7 = data.Peripheral_Devices7 || "";

        checklist.Summary = data.Summary || "";
      }
    }
  } catch (error) {
    console.error("Error fetching checklist data:", error);
  }
};




console.log('employee:', props.employee);
const selectedEmployee = ref(null);

const newUser = ref({ name: "", number: "" });

      // API FORM 



      
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


const openStep1Modal = (employeeId) => {
  isStep1ModalOpen.value = true;
  const employeeData = props.employee.find(emp => emp.employeeId === employeeId);
  if (employeeData) {
    selectedEmployee.value = employeeData;
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
  userOperator: "",
  officeUnit: "",
  department: "",
  dateAcquired: "",
  date: "",
  equipmentInstalled: [],
  cpu_status: "0",
  keyboard_status: "0",
  monitor_status: "0",
  mouse_status: "0",
  printer_status: "0",
  ups_status: "0",
  avr_status: "0",
  other_equip: "",
  windows10: "0",
  windows11: "0",
  license : null,
  other_os: null,
  softwareInstalled: [],
  enrollment: "1",
  adobe_reader: "1",
  word_processor: "1",
  media_player: "1",
  anti_virus: "1",
  browser: "1",
  microsoft: "1",
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

watch(selectedEmployee, (newVal) => {
  if (newVal) {
    formData.userOperator = newVal.emp_name || "";
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
  // If option is CHECKED, set to 1
  if (formData.equipmentInstalled.includes(option)) {
    if (option === "CPU") formData.cpu_status = "1";
    if (option === "Keyboard") formData.keyboard_status = "1";
    if (option === "Monitor") formData.monitor_status = "1";
    if (option === "Mouse") formData.mouse_status = "1";
    if (option === "Printer") formData.printer_status = "1";
    if (option === "UPS") formData.ups_status = "1";
    if (option === "AVR") formData.avr_status = "1";
    if (option === "Other") formData.other_equip = ""; // Keep for input
  } else {
    // If UNCHECKED, set to 0
    if (option === "CPU") formData.cpu_status = "0";
    if (option === "Keyboard") formData.keyboard_status = "0";
    if (option === "Monitor") formData.monitor_status = "0";
    if (option === "Mouse") formData.mouse_status = "0";
    if (option === "Printer") formData.printer_status = "0";
    if (option === "UPS") formData.ups_status = "0";
    if (option === "AVR") formData.avr_status = "0";
    if (option === "Other") formData.other_equip = ""; // Optional: clear
  }
};



const updateSoftwareStatus = (option) => {
  if (formData.softwareInstalled.includes(option)) {
    // If checked, mark status as "0"
    if (option === "Enrollment System") formData.enrollment = "0";
    if (option === "Adobe Reader") formData.adobe_reader = "0";
    if (option === "Word Processor") formData.word_processor = "0";
    if (option === "Media Player") formData.media_player = "0";
    if (option === "Anti-Virus") formData.anti_virus = "0";
    if (option === "Browser") formData.browser = "0";
    if (option === "Microsoft") formData.microsoft = "0";
    if (option === "Other") formData.other_sys = ""; // Keep user input empty
  } else {
    // If unchecked, mark status as "1"
    if (option === "Enrollment System") formData.enrollment = "1";
    if (option === "Adobe Reader") formData.adobe_reader = "1";
    if (option === "Word Processor") formData.word_processor = "1";
    if (option === "Media Player") formData.media_player = "1";
    if (option === "Anti-Virus") formData.anti_virus = "1";
    if (option === "Browser") formData.browser = "1";
    if (option === "Microsoft") formData.microsoft = "1";
    if (option === "Other") formData.other_sys = ""; // Still allow input
  }
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
      pcName: formData.pcName,
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
      word_processor:formData.word_processor,
      adobe_reader:formData.adobe_reader,
      media_player:formData.media_player,
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
    mainId.value = response.data.data.mainId
    console.log("Response:", response.data);
    console.log (response.data.mainId)
    
    openStep2Modal();

  } catch (error) {
    console.error("Error submitting form:", error.response?.data || error.message);
  }
};


const submitChecklist = async () => {
  
  const payload = {
    mainId: mainId.value,       
    YrId: selectedEmployee.value.YrId,

    System_Boot: checklist.System_Boot,
    System_Log: checklist.System_Log,

    Network_Settings1: checklist.Network_Settings1,
    Network_Settings2: checklist.Network_Settings2,
    Network_Settings3: checklist.Network_Settings3,
    Network_Settings4: checklist.Network_Settings4,
    Network_Settings5: checklist.Network_Settings5,
    Network_Settings6: checklist.Network_Settings6,

    Computer_Hardware_Settings1: checklist.Computer_Hardware_Settings1,
    Computer_Hardware_Settings2: checklist.Computer_Hardware_Settings2,
    Computer_Hardware_Settings3: checklist.Computer_Hardware_Settings3,
    Computer_Hardware_Settings4: checklist.Computer_Hardware_Settings4,
    Computer_Hardware_Settings5: checklist.Computer_Hardware_Settings5,
    Computer_Hardware_Settings6: checklist.Computer_Hardware_Settings6,

    Browser_Settings: checklist.Browser_Settings,
    Proper_Software_Loads: checklist.Proper_Software_Loads,

    Viruses_Malware1: checklist.Viruses_Malware1,
    Viruses_Malware2: checklist.Viruses_Malware2,

    Clearance1: checklist.Clearance1,
    Clearance2: checklist.Clearance2,
    Clearance3: checklist.Clearance3,
    Clearance4: checklist.Clearance4,

    Interiors_Cleaning1: checklist.Interiors_Cleaning1,
    Interiors_Cleaning2: checklist.Interiors_Cleaning2,
    Interiors_Cleaning3: checklist.Interiors_Cleaning3,
    Interiors_Cleaning4: checklist.Interiors_Cleaning4,
    Interiors_Cleaning5: checklist.Interiors_Cleaning5,

    Peripheral_Devices1: checklist.Peripheral_Devices1,
    Peripheral_Devices2: checklist.Peripheral_Devices2,
    Peripheral_Devices3: checklist.Peripheral_Devices3,
    Peripheral_Devices4: checklist.Peripheral_Devices4,
    Peripheral_Devices5: checklist.Peripheral_Devices5,
    Peripheral_Devices6: checklist.Peripheral_Devices6,
    Peripheral_Devices7: checklist.Peripheral_Devices7,

    Summary: checklist.Summary
  };
    window.location.reload();

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/insertChecklist', payload);
    console.log('Checklist submitted:', response.data);
    // You can show a success message or reset the form here
  } catch (error) {
    console.error('Submission failed:', error.response?.data || error.message);
    // Show error to the user
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
  <button class="btn btn-success" @click="openModal">
    <i class="fas fa-user-plus"></i> Add User
  </button>

    </div>
      <table class="data-table">
    <thead>
      <tr>
        <th>User</th>
        <th>Action</th>
        <th>Status</th>
        <th>Show ticket</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="employee in employee" :key="employee.employeeId">
  <td>{{ employee.emp_name }}</td>

  <td class="text-center">
    <div class="d-flex justify-content-center">
      <button 
        class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto mx-2"
        @click="openStep1Modal(employee.employeeId)">
        <i class="fas fa-eye me-1"></i> Add Form
      </button>

      <button 
        class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto" 
        @click="printDetails(employee)">
        <i class="fas fa-eye me-1"></i> Print
      </button>
    </div>
  </td>

  <td :class="{ 'clear-status': employee.status === 'Clear', 'unclear-status': employee.status === 'Unclear' }">
    {{ employee.status }}
  </td>

  <td>
    <Link 
  v-if="employee.employeeId"
  :href="route('employees', {
    employeeId: employee.employeeId, 
    YrId: employee.YrId,
    PlanId: employee.PlanId,
    officeId: employee.OffId,
    DeptId: employee.DeptId,
    CatId: employee.CatId
  })"
  class="btn btn-sm btn-outline-primary w-auto align-items-center"
>
  <i class="fas fa-eye me-1"></i> View User
</Link>


  </td>
</tr>

  </tbody>
</table>

      <!-- Add User Modal -->
      <div v-if="isModalOpen" class="modal fade show d-block" id="addUserModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add New User</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3 d-flex">
            <label class="form-label me-3" style="width: 150px;">Employee Name</label>
            <input type="text" class="form-control" v-model="newUser.name" />
          </div>
          <div class="mb-4 d-flex">
            <label class="form-label me-3" style="width: 150px;">Employee Number</label>
            <input type="text" class="form-control" v-model="newUser.number" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="iscloseModal">Close</button>
          <button class="btn btn-primary" :disabled="isLoading" @click="addUser">
            {{ isLoading ? 'Adding...' : 'Add User' }}
          </button>
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
                     <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="button" class="btn btn-primary" @click="submitForm">Save</button>
            <button type="button" class="btn btn-secondary" @click="openStep2Modal()">Next  </button>
          </div>
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
    {{ selectedYear.Name || 'Select Year' }}
  </button>
  <ul class="dropdown-menu me-2" :class="{ show: isDropdownOpen }">
    <li v-for="year in pmYearList" :key="year.YrId">
      <a class="dropdown-item" href="#" @click.prevent="updateYear(year)">
        {{ year.Name }}
      </a>
    </li>
  </ul>
</div>

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
        <td class="border px-4 py-2" rowspan="6">Computer Hardware Settings	</td>
        <td class="border px-4 py-2">Verify Device Manager settings	</td>
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
        <td class="border px-4 py-2">Hard Disk	</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Hardware3_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings3" />
      <label class="form-check-label" :for="'Hardware3_' + opt.value"> </label> </div>
    </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">DVD/CD-RW firmware up-to-date	</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Hardware4_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings4" />
      <label class="form-check-label" :for="'Hardware4_' + opt.value"> </label> </div>
    </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">Memory is O.K.	</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Hardware5_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings5" />
      <label class="form-check-label" :for="'Hardware5_' + opt.value"> </label> </div>
    </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">For Laptop battery run-time is norm	</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Hardware6_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings6" />
      <label class="form-check-label" :for="'Hardware6_' + opt.value"> </label> </div>
    </td>
      </tr>

      <tr>
        <td class="border px-4 py-2">5  </td>
        <td class="border px-4 py-2">Browser/Proxy Settings	</td>
        <td class="border px-4 py-2">Verify proper settings and operation.	</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Browser' + opt.value" :value="opt.value" v-model="checklist.Browser_Settings" />
      <label class="form-check-label" :for="'Browser_' + opt.value"> </label> </div>
  </td>
      </tr>

      <tr>
        <td class="border px-4 py-2">6 </td>
        <td class="border px-4 py-2">Proper Software Loads		</td>
        <td class="border px-4 py-2">Required software is installed and operating.		</td>
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
        <td class="border px-4 py-2" rowspan="5">Interiors and Cleaning			</td>
        <td class="border px-4 py-2">Dust removed			</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Interior1_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning1" />
      <label class="form-check-label" :for="'Interior1_' + opt.value"> </label> </div>
  </td>
  </tr>

      <tr>
        <td class="border px-4 py-2">No loose parts			</td>
           <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Interior2_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning2" />
      <label class="form-check-label" :for="'Interior2_' + opt.value"> </label> </div>
  </td>
  </tr>
      <tr>
        <td class="border px-4 py-2">Airflow is O.K.				</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Interior3_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning3" />
      <label class="form-check-label" :for="'Interior3_' + opt.value"> </label> </div>
  </td>
  </tr>
      <tr>
        <td class="border px-4 py-2">Cables unplugged and re-plugged				</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Interior4_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning4" />
      <label class="form-check-label" :for="'Interior4_' + opt.value"> </label> </div>
  </td>
  </tr>
      <tr>
        <td class="border px-4 py-2">Fans are operating					</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Interior5_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning5" />
      <label class="form-check-label" :for="'Interior5_' + opt.value"> </label> </div>
  </td>
  </tr>

      <tr>
        <td class="border px-4 py-2" rowspan="7">10</td>
        <td class="border px-4 py-2" rowspan="7">Peripheral Devices	</td>
        <td class="border px-4 py-2">Mouse			</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Device1_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices1" />
      <label class="form-check-label" :for="'Device1_' + opt.value"> </label> </div>
  </td>
  
  </tr>
      <tr>
        <td class="border px-4 py-2">Keyboard				</td>
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
        <td class="border px-4 py-2">UPS	</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Device4_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices4" />
      <label class="form-check-label" :for="'Device4_' + opt.value"> </label> </div>
  </td>
      </tr>
      
      <tr>
        <td class="border px-4 py-2">Printer	</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Device5_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices5" />
      <label class="form-check-label" :for="'Device5_' + opt.value"> </label> </div>
  </td>
      </tr>

      <tr>
        <td class="border px-4 py-2">Telephone extension	</td>
        <td v-for="opt in options" :key="opt.value" class="border text-center">
    <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Device6_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices6" />
      <label class="form-check-label" :for="'Device6_' + opt.value"> </label> </div>
  </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">Fax	</td>
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
  <button type="button" class="btn btn-primary" @click="submitChecklist">Submit</button>
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
  overflow-x: hidden; /* Prevent horizontal scrollbar */
  
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