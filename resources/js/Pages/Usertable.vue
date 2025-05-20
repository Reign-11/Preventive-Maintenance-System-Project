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

const technicians = ref([])

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
const isDisposalModalOpen = ref(false);

const openDisposalModal = () => {
  isDisposalModalOpen.value = true;
};
const closeDisposalModal = () => {
  isDisposalModalOpen.value = false;
};

const confirmDisposal = () => {
  setForDisposal();
  // Close the modal
  closeDisposalModal();
};
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

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    formData.image = file;
  }
}
// Form Data
const formData = reactive({
  technician: "", 
  disposal: "", 
  pcName:"",
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
  license : "0",
  other_os: null,
  softwareInstalled: [],
  enrollment: "0",
  adobe_reader: "0",
  word_processor: "0",
  media_player: "0",
  anti_virus: "0",
  browser: "0",
  microsoft: "0",
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
  image: "",
});

watch(selectedEmployee, (newVal) => {
  if (newVal) {
    formData.userOperator = newVal.emp_name || "";
    formData.officeUnit = newVal.OfficeName || "";
    formData.department = newVal.department_name || "";
  }
});

onMounted(async () => {
  try {
    const response = await axios.get('/api/technicians')
    console.log("Fetched Technicians:", response.data);
    technicians.value = response.data
  } catch (error) {
    console.error('❌ Failed to fetch technicians:', error)
  }
})


const isLocked = ref(false);

const setForDisposal = () => {

  formData.disposal = "1";

  formData.equipmentInstalled = [];
  formData.cpu_status = "0";
  formData.keyboard_status = "0";
  formData.monitor_status = "0";
  formData.mouse_status = "0";
  formData.printer_status = "0";
  formData.ups_status = "0";
  formData.avr_status = "0";
  formData.other_equip = "";

  // Lock OS
  formData.windows10 = "0";
  formData.windows11 = "0";
  formData.other_os = null;
  formData.license = null;

  // Lock software
  formData.softwareInstalled = [];
  formData.enrollment = "0";
  formData.adobe_reader = "0";
  formData.word_processor = "0";
  formData.media_player = "0";
  formData.anti_virus = "0";
  formData.browser = "0";
  formData.microsoft = "0";
  formData.other_sys = "";

  isLocked.value = true; // Set UI to readonly/disabled
};

// Options for checkboxes
const equipmentOptions = ['CPU', 'Keyboard', 'Monitor', 'Mouse', 'Printer', 'UPS', 'AVR', 'Other'];
const osOptions = ['Windows 10', 'Windows 11', 'Other'];
const softwareOptions = ['Enrollment System', 'Adobe Reader', 'Word Processor', 'Media Player', 'Anti-Virus', 'Browser', 'Microsoft', 'Other'];

const updateOsInstalled = (option) => {
  // Reset values to 0
  formData.windows10 = 0;
  formData.windows11 = 0;
  formData.other_os = "";
  formData.license = 0; // Reset license when switching OS

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
    if (option === "Enrollment System") formData.enrollment = "1";
    if (option === "Adobe Reader") formData.adobe_reader = "1";
    if (option === "Word Processor") formData.word_processor = "1";
    if (option === "Media Player") formData.media_player = "1";
    if (option === "Anti-Virus") formData.anti_virus = "1";
    if (option === "Browser") formData.browser = "1";
    if (option === "Microsoft") formData.microsoft = "1";
    if (option === "Other") formData.other_sys = ""; // Keep user input empty
  } else {
    // If unchecked, mark status as "1"
    if (option === "Enrollment System") formData.enrollment = "0";
    if (option === "Adobe Reader") formData.adobe_reader = "0";
    if (option === "Word Processor") formData.word_processor = "0";
    if (option === "Media Player") formData.media_player = "0";
    if (option === "Anti-Virus") formData.anti_virus = "0";
    if (option === "Browser") formData.browser = "0";
    if (option === "Microsoft") formData.microsoft = "0";
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
      disposal: formData.disposal,
      employeeId,
      YrId: selectedEmployee.value.YrId,
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
      technician: formData.technician, 
    };
    const formPayload = new FormData();

// Append key-value pairs from the payload
    for (const key in payload) {
  formPayload.append(key, payload[key]);
    }

// Append image file
    if (formData.image) {
  formPayload.append('image', formData.image);
  }
    console.log("Payload:", payload);

    // Send the data to the Laravel backend
    const response = await axios.post(`/api/employeeChecklist/${employeeId}`, formPayload, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
   
    selectedEmployee.value.mainId = response.data.data.mainId;
    console.log("Response:", response.data);
    console.log (response.data.mainId)
   
    openStep2Modal();

  } catch (error) {
    console.error("Error submitting form:", error.response?.data || error.message);
  }
};



const submitChecklist = async () => {
  
  const payload = {
    mainId: selectedEmployee.value.mainId,   
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
    <div class="container">
      <div class="page-header">
        <h1 class="title">Preventive Maintenance 2025</h1>
      </div>

      <div class="controls-container">
        <button class="btn primary-btn" @click="openModal">
          <i class="fas fa-user-plus"></i> Add User
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Show ticket</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employee" :key="employee.employeeId" class="table-row">
              <td class="user-name">{{ employee.emp_name }}</td>
              <td>
                <button class="btn primary-btn" @click="openStep1Modal(employee.employeeId)">
                  <i class="fas fa-edit"></i> Add Form
                </button>
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
                  class="btn secondary-btn">
                  <i class="fas fa-eye"></i> View User
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
   
    <!-- Add User Modal -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h2 class="modal-title">Add New User</h2>
          <button class="close-btn-icon" @click="iscloseModal">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Employee Name</label>
            <input type="text" class="form-control" v-model="newUser.name" />
          </div>
          <div class="form-group">
            <label class="form-label">Employee Number</label>
            <input type="text" class="form-control" v-model="newUser.number" />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn cancel-btn" @click="iscloseModal">
            <i class="fas fa-times"></i> Close
          </button>
          <button type="button" class="btn save-btn" :disabled="isLoading" @click="addUser">
            <i class="fas fa-save"></i> {{ isLoading ? 'Adding...' : 'Add User' }}
          </button>
        </div>
      </div>
    </div>

   <!-- Step 1 Modal: Equipment Details -->
    <div v-if="isStep1ModalOpen" class="modal-overlay">
      <div class="modal-content modal-xl" style="background-color: white;">
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 class="modal-title">Preventive Maintenance Form</h2>
          <button class="close-btn-icon" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">

  <!-- Ticket & Equipment Info Card (Placed Above User Info) -->
    <div class="card mb-2">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-3">
            <label class="form-label">Ticket Number</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.ticketnumber"
              placeholder="Enter Ticket #"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label">Equipment Number</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.equipment"
              placeholder="Enter Equipment #"
            >
          </div>
         
          <!-- Upload File (smaller) -->
          <div class="col-md-4">
            <label class="form-label">Upload File</label>
            <input
              type="file"
              class="form-control"
              @change="handleImageUpload"
            >
          </div>

          <!-- For Disposal button (smaller) -->
          <div class="col-md-2">
            <label class="form-label invisible">For Disposal</label> <!-- Keeps alignment -->
            <button class="btn btn-danger w-100" @click="setForDisposal">
              <i class="fas fa-trash-alt"></i> Disposal
            </button>
          </div>

        </div>
      </div>
    </div>


      <!-- User & Date Info Card -->
      <div class="card mb-4">
        <div class="card-header">
          <h3 class="card-title">User Information</h3>
        </div>
        <div class="card-body">
        <div class="form-row">
          <div class="form-group col-md-4">
              <label class="form-label">User/Operator</label>
              <input type="text" class="form-control" v-model="formData.userOperator">
          </div>
          <div class="form-group col-md-4">
              <label class="form-label">Office/College/Unit</label>
              <input type="text" class="form-control" v-model="formData.officeUnit">
          </div>
          <div class="form-group col-md-4">
              <label class="form-label">Department</label>
              <input type="text" class="form-control" v-model="formData.department">
          </div>
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Technician</label>
            <select class="form-control" v-model="formData.technician">
              <option value="">Select Technician</option>
              <option v-for="tech in technicians" :key="tech.techId" :value="tech.Name">
                {{ tech.Name }}
              </option>
            </select>
          </div>
           <div class="col-md-3">
            <label class="form-label">Date Acquired</label>
            <input type="date" class="form-control" v-model="formData.dateAcquired">
          </div>
          <div class="form-group col-md-2">
              <label class="form-label">Date</label>
              <input type="text" class="form-control" v-model="formData.date">
          </div>
          <div class="form-group col-md-3">
              <label class="form-label">PC Name</label>
              <input type="text" class="form-control" v-model="formData.pcName">
          </div>
        </div>
      </div>
    </div>
    </div>


          <!-- Equipment Installed -->
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Equipment Installed</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div v-for="(option, index) in equipmentOptions" :key="index" class="col-md-3 mb-3">
                  <div class="checkbox-container">
                    <input
                      class="checkbox-input"
                      type="checkbox"
                      :id="'equipment_' + index"
                      :value="option"
                      v-model="formData.equipmentInstalled"
                      :disabled="isLocked"
                      @change="updateEquipmentStatus(option)"
                    />
                    <label class="checkbox-label" :for="'equipment_' + index">{{ option }}</label>
                  </div>

                  <!-- Input Field for 'Other' Equipment -->
                  <input
                    v-if="option === 'Other' && formData.equipmentInstalled.includes('Other')"
                    type="text"
                    class="form-control mt-2"
                    v-model="formData.other_equip"
                    :disabled="isLocked"
                    placeholder="Specify Other Equipment">
                </div>
              </div>
            </div>
          </div>

          <!-- Operating System Installed -->
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Operating System Installed</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <div v-for="(option, index) in osOptions" :key="index" class="mb-2">
                    <div class="radio-container">
                      <input
                        type="radio"
                        class="radio-input"
                        :id="'os_' + index"
                        :value="option"
                        v-model="formData.osInstalled"
                        :disabled="isLocked"
                        @change="updateOsInstalled(option)"
                      />
                      <label class="radio-label" :for="'os_' + index">{{ option }}</label>
                    </div>

                    <!-- Input Field for 'Other' OS -->
                    <div v-if="option === 'Other' && formData.osInstalled === 'Other'" class="ms-4 mt-2">
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.other_os"
                        :disabled="isLocked"
                        placeholder="Specify Other OS"
                      />
                    </div>
                  </div>

                  <!-- License selection (only for Windows 10 & 11) -->
                  <div v-if="formData.windows10 === 1 || formData.windows11 === 1" class="license-section mt-4">
                    <h4 class="section-subtitle">License Status</h4>
                    <div class="license-options">
                      <div class="radio-container">
                        <input
                          type="radio"
                          class="radio-input"
                          id="license_yes"
                          :value="1"
                          v-model.number="formData.license"
                          :disabled="isLocked"
                        />
                        <label class="radio-label" for="license_yes">Licensed</label>
                      </div>
                      <div class="radio-container">
                        <input
                          type="radio"
                          class="radio-input"
                          id="license_no"
                          :value="0"
                          v-model.number="formData.license"
                          :disabled="isLocked"
                        />
                        <label class="radio-label" for="license_no">Not Licensed</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Software Installed -->
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Software Application Installed</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div v-for="(option, index) in softwareOptions" :key="index" class="col-md-3 mb-3">
                  <div class="checkbox-container">
                    <input
                      class="checkbox-input"
                      type="checkbox"
                      :id="'software_' + index"
                      :value="option"
                      v-model="formData.softwareInstalled"
                      :disabled="isLocked"
                      @change="updateSoftwareStatus(option)"
                    />
                    <label class="checkbox-label" :for="'software_' + index">{{ option }}</label>
                  </div>

                  <!-- Input Field for 'Other' Software -->
                  <input
                    v-if="option === 'Other' && formData.softwareInstalled.includes('Other')"
                    type="text"
                    class="form-control mt-2"
                    v-model="formData.other_sys"
                    :disabled="isLocked"
                    placeholder="Specify Other Software">
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Specifications -->
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Desktop Specifications</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div v-for="(value, key) in formData.desktopSpecs" :key="key" class="col-md-3 mb-3">
                  <div class="form-group">
                    <label class="form-label">{{ key.replace(/([A-Z])/g, ' $1').trim() }}</label>
                    <input type="text" class="form-control" v-model="formData.desktopSpecs[key]" :disabled="isLocked">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn cancel-btn" @click="closeModal">
            <i class="fas fa-times"></i> Close
          </button>
          <button type="button" class="btn save-btn" @click="submitForm">
            <i class="fas fa-arrow-right"></i> Next
          </button>
   
        </div>
      </div>
    </div>

    <!-- Step 2 Modal: Maintenance Checklist -->
    <div v-if="isStep2ModalOpen" class="modal-overlay">
    <div class="modal-content modal-xl">
    <div class="modal-header">
    <!-- Header with title and year selection -->
    <div class="header-title-container">
      <h3 class="checklist-title desktop-title">PREVENTIVE MAINTENANCE CHECKLIST FOR SERVERS/DATACENTER</h3>
   
      <!-- Abbreviated title for mobile only -->
      <h3 class="checklist-title mobile-title">PREVENTIVE MAINTENANCE</h3>

          <!-- Year Selection Dropdown  -->
        <div class="year-selection">
          <div class="dropdown position-relative">
            <button class="btn dropdown-btn" type="button" @click="toggleDropdown">
              {{ selectedYear.Name || 'Select Year' }} <i class="fas fa-chevron-down"></i>
            </button>
            <ul class="dropdown-menu" :class="{ show: isDropdownOpen }">
              <li v-for="year in pmYearList" :key="year.YrId">
                <a class="dropdown-item" href="#" @click.prevent="updateYear(year)">
                  {{ year.Name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
     
      <button class="close-btn-icon" @click="closeModal">&times;</button>
    </div>
   
        <div class="modal-body">
          <!-- Checklist Table -->
          <div class="table-responsive">
            <table class="checklist-table">
              <thead>
                <tr>
                  <th class="item-col">Item #</th>
                  <th class="task-col">Task</th>
                  <th class="description-col">Description</th>
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
                      <input class="radio-input" type="radio" :id="'Boot_' + opt.value" :value="opt.value" v-model="checklist.System_Boot" />
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
                      <input class="radio-input" type="radio" :id="'Log_' + opt.value" :value="opt.value" v-model="checklist.System_Log" />
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
                      <input class="radio-input" type="radio" :id="'Network1_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings1" />
                      <label class="radio-label" :for="'Network1_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">TCP/IP and IPX settings are correct</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Network2_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings2" />
                      <label class="radio-label" :for="'Network2_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Domain Name</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Network3_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings3" />
                      <label class="radio-label" :for="'Network3_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Security Settings</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Network4_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings4" />
                      <label class="radio-label" :for="'Network4_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Client Configurations</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Network5_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings5" />
                      <label class="radio-label" :for="'Network5_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Computer Name</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Network6_' + opt.value" :value="opt.value" v-model="checklist.Network_Settings6" />
                      <label class="radio-label" :for="'Network6_' + opt.value"></label>
                    </div>
                  </td>
                </tr>

                <!-- Hardware Settings -->
                <tr>
                  <td class="item-cell hardware-row" rowspan="6">4</td>
                  <td class="task-cell hardware-row" rowspan="6">Computer Hardware Settings</td>
                  <td class="desc-cell">Verify Device Manager settings</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Hardware1_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings1" />
                      <label class="radio-label" :for="'Hardware1_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">BIOS up-to-date</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Hardware2_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings2" />
                      <label class="radio-label" :for="'Hardware2_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Hard Disk</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Hardware3_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings3" />
                      <label class="radio-label" :for="'Hardware3_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">DVD/CD-RW firmware up-to-date</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Hardware4_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings4" />
                      <label class="radio-label" :for="'Hardware4_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Memory is O.K.</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Hardware5_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings5" />
                      <label class="radio-label" :for="'Hardware5_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">For Laptop battery run-time is norm</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Hardware6_' + opt.value" :value="opt.value" v-model="checklist.Computer_Hardware_Settings6" />
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
                      <input class="radio-input" type="radio" :id="'Browser_' + opt.value" :value="opt.value" v-model="checklist.Browser_Settings" />
                      <label class="radio-label" :for="'Browser_' + opt.value"></label>
                    </div>
                  </td>
                </tr>

                <!-- Software Loads -->
                <tr>
                  <td class="item-cell">6</td>
                  <td class="task-cell">Proper Software Loads</td>
                  <td class="desc-cell">Required software is installed and operating.</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Software_' + opt.value" :value="opt.value" v-model="checklist.Proper_Software_Loads" />
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
                      <input class="radio-input" type="radio" :id="'virus1_' + opt.value" :value="opt.value" v-model="checklist.Viruses_Malware1" />
                      <label class="radio-label" :for="'virus1_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Virus scan done</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'virus2_' + opt.value" :value="opt.value" v-model="checklist.Viruses_Malware2" />
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
                      <input class="radio-input" type="radio" :id="'clearance1_' + opt.value" :value="opt.value" v-model="checklist.Clearance1" />
                      <label class="radio-label" :for="'clearance1_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Temporary files removed</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'clearance2_' + opt.value" :value="opt.value" v-model="checklist.Clearance2" />
                      <label class="radio-label" :for="'clearance2_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Cache Cleared</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'clearance3_' + opt.value" :value="opt.value" v-model="checklist.Clearance3" />
                      <label class="radio-label" :for="'clearance3_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Recycle Bin Emptied</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'clearance4_' + opt.value" :value="opt.value" v-model="checklist.Clearance4" />
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
                      <input class="radio-input" type="radio" :id="'Interior1_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning1" />
                      <label class="radio-label" :for="'Interior1_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">No loose parts</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Interior2_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning2" />
                      <label class="radio-label" :for="'Interior2_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Airflow is O.K.</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Interior3_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning3" />
                      <label class="radio-label" :for="'Interior3_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Cables unplugged and re-plugged</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Interior4_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning4" />
                      <label class="radio-label" :for="'Interior4_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Fans are operating</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Interior5_' + opt.value" :value="opt.value" v-model="checklist.Interiors_Cleaning5" />
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
                      <input class="radio-input" type="radio" :id="'Device1_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices1" />
                      <label class="radio-label" :for="'Device1_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Keyboard</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Device2_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices2" />
                      <label class="radio-label" :for="'Device2_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Monitor</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Device3_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices3" />
                      <label class="radio-label" :for="'Device3_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">UPS</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Device4_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices4" />
                      <label class="radio-label" :for="'Device4_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Printer</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Device5_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices5" />
                      <label class="radio-label" :for="'Device5_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Telephone extension</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Device6_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices6" />
                      <label class="radio-label" :for="'Device6_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="desc-cell">Fax</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Device7_' + opt.value" :value="opt.value" v-model="checklist.Peripheral_Devices7" />
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
              placeholder="Enter any additional comments or recommendations...">
            </textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn cancel-btn" @click="closeModal">
            <i class="fas fa-times"></i> Close
          </button>
          <button type="button" class="btn save-btn" @click="submitChecklist">
            <i class="fas fa-save"></i> Submit
          </button>
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

.controls-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: white;
  margin-bottom: 2rem;
}

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

.user-name {
  font-weight: 500;
  color: #34495e;
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

.primary-btn {
  background-color: #3498db;
  color: white;
}

.primary-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.secondary-btn {
  background-color: #2ecc71;
  color: white;
}

.secondary-btn:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-btn {
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  white-space: nowrap;
}

.dropdown-btn:hover {
  background-color: #2980b9;
}

/* Status Badge Styles */
.status-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-clear {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.status-unclear {
  background-color: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.status-pending {
  background-color: rgba(241, 196, 15, 0.15);
  color: #f39c12;
  border: 1px solid rgba(241, 196, 15, 0.3);
}

.status-completed {
  background-color: rgba(52, 152, 219, 0.15);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
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

.modal-sm {
  max-width: 500px;
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


.modal-header .modal-body {
  flex-basis: 100%;
  padding: 0 !important;
  margin-top: 0.5rem;
  overflow: visible !important;
  max-height: none !important;
}

.modal-title {
  color: white !important;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.header-title-container {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: calc(100% - 50px);
}

.checklist-title {
  color: white !important;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  flex-basis: 100%;
  text-align: center;
  width: 100%;
  order: -1;
  margin-bottom: 0.5rem;
}

.desktop-title {
  display: block;
}

.mobile-title {
  display: none;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
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

/* Form Styles */
.card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  background-color: white;
  overflow: hidden;
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

.form-group {
  margin-bottom: 1rem;
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
}

.form-control:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  outline: none;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.section-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

/* Radio & Checkbox Styles */
.checkbox-container,
.radio-container {
  display: inline-flex;
  align-items: center;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.checkbox-input,
.radio-input {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #3498db;
  outline: none;
  position: relative;
  cursor: pointer;
  margin: 0;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
}

.checkbox-input {
  border-radius: 4px;
}

.radio-input {
  border-radius: 50%;
}

.checkbox-input:checked,
.radio-input:checked {
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

.checkbox-input:hover,
.radio-input:hover {
  border-color: #2980b9;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.checkbox-label,
.radio-label {
  font-size: 1rem;
  color: #333;
  cursor: pointer;
}

/* Checklist Table Styles */
.table-responsive {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

.checklist-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

.checklist-table th,
.checklist-table td {
  border: 1px solid #e0e0e0;
  padding: 0.75rem;
  text-align: left;
}

.checklist-table th {
  background-color: #2c3e50;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
}

.item-col {
  width: 5%;
  text-align: center;
}

.task-col {
  width: 15%;
}

.description-col {
  width: 40%;
}

.option-col {
  width: 10%;
  text-align: center;
}

.item-cell,
.task-cell {
  background-color: #f2f2f2;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
}

.desc-cell {
  color: #333;
}

.option-cell {
  text-align: center;
  background-color: #fcfcfc;
}

/* Section Row Styling */
.network-row,
.hardware-row,
.virus-row,
.clearance-row,
.cleaning-row,
.peripheral-row {
  background-color: #e8f4fc;
}

/* Summary Section */
.summary-container {
  margin-top: 2rem;
}

.summary-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.summary-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fcfcfc;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
  min-height: 100px;
  transition: all 0.3s ease;
}

.summary-textarea:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  background-color: white;
  outline: none;
}

.summary-textarea::placeholder {
  color: #aaa;
}

/* Year Selection */
.year-selection {
  margin-left: auto;
  margin-right: 1rem;
}

@media (max-width: 992px) {
  /* Switch to short title on smaller screens */
  .desktop-title {
    display: none;
  }
 
  .mobile-title {
    display: block;
  }
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.25rem;
  display: none;
  background-color: white;
  min-width: 180px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dropdown-menu.show {
  display: block;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
  color: #2980b9;
}

/* Button Styles */
.save-btn, .cancel-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.save-btn {
  background-color: #2ecc71;
  color: white;
}

.save-btn:hover {
  background-color: #27ae60;
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

/* Responsive Adjustments */
@media (max-width: 768px) {
  .header-title-container {
    flex-direction: column;
    align-items: flex-start;
  }
 
  .title {
    font-size: 1.5rem;
  }
 
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }
 
  .btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
 
  .modal-footer {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
 
  .save-btn, .cancel-btn {
    width: 100%;
  }
 
  .card-header {
    padding: 0.75rem 1rem;
  }
 
  .card-body {
    padding: 1rem;
  }
 
  .input-group {
    flex-direction: column;
    gap: 0.5rem;
  }
}
.modal-content-white {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>