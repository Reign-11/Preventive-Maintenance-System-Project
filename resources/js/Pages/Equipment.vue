<script setup>
import { ref, computed, watch,defineProps, reactive,onMounted} from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';
import axios from "axios";

const props = defineProps({
  departments: { type: Array, default: () => [] },  
  YrId: { type: [String, Number], default: null }, 
  PlanId: { type: [String, Number], default: null },
  office: { type: Object, default: () => ({}) },
  deptId: { type: [String, Number], default: null },  
  categoryId: { type: [String, Number], default: null },
  pmYear: { type: Object,default: () => ({ Name: '', Description: '' })},
  pmYearList: {type: Array,default: () => []}

});

const employees = ref([]);
const isUpdateMode = ref(false);
const showNextButton = ref(true);
const currentMainId = ref(null);
const department = ref(props.departments); // ✅ recommended

const mainId = ref (0)
const departments = ref([...props.departments]);
const selectedDepartments = ref(null);
const pmYear = ref({}); // selected year object
const selectedYear = ref(pmYear); // Initially set to passed `pmYear` from props
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
watch(() => props.departments, (newVal) => {
  departments.value = [...newVal];
});
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
const closeModal = () => {
  // Reset data when closing
  resetForm();
  
  // Close the modals
  isStep1ModalOpen.value = false;
  isStep2ModalOpen.value = false;
  isUpdateMode.value = false;
  currentMainId.value = null;
};

const openStep1Modal = () => {

  resetForm();

  isUpdateMode.value = false;
  showNextButton.value = false; // Hide the Next button for Add Form mode
  isStep1ModalOpen.value = true;

  currentMainId.value = null; // Reset current ID since this is a new record

  // Prepopulate with department data if available
  if (props.departments && props.departments.length > 0) {
    const departmentData = props.departments[0];
    if (departmentData) {
      formData.officeUnit = departmentData.OfficeName || "";
      formData.department = departmentData.department_name || "";
    }
  }
};
onMounted(() => {
  fetchEmployees();
});

// For submitting new record (Step 1) and moving to Step 2
const submitStep1AndGoToStep2 = (mainIdParam) => {
  console.log("Submitting Step 1, mainId:", mainIdParam);
  
  // Validate that we have a mainId
  if (!mainIdParam) {
    console.error("No mainId provided to submitStep1AndGoToStep2");
    return;
  }
  
  // Set the currentMainId value to the passed parameter
  currentMainId.value = mainIdParam;

  // Then proceed to Step 2
  isStep1ModalOpen.value = false;
  isStep2ModalOpen.value = true;
  

};



const openStepModal = (mainId) => {
  console.log("Opening edit modal for mainId:", mainId);
  
  if (!mainId) {
    console.error("Cannot open edit modal without mainId");
    return;
  }
  
  isUpdateMode.value = true;
  currentMainId.value = mainId;
  isStep1ModalOpen.value = true;
  
  // Find the record to edit
  const recordData = departments.value.find(dep => String(dep.mainId) === String(mainId));
  
  if (recordData) {
    selectedDepartments.value = recordData;
    
  
    formData.employeeId = recordData.employeeId;
    formData.deptId = recordData.deptId;
    formData.OffId = recordData.OffId;
    formData.YrId = recordData.YrId;
    
    // Other fields
    formData.officeUnit = recordData.OfficeName || "";
    formData.department = recordData.department_name || "";
    formData.pcName = recordData.pcname || "";
    formData.dateAcquired = recordData.date_acquired || null;
    
    // Hardware status
    formData.cpu_status = recordData.cpu || 0;
    formData.keyboard_status = recordData.keyboard_status || 0;
    formData.printer_status = recordData.printer_status || 0;
    formData.monitor_status = recordData.monitor_status || 0;
    formData.mouse_status = recordData.mouse_status || 0;
    formData.ups_status = recordData.ups_status || 0;
    formData.avr_status = recordData.avr_status || 0;
    
    // Software
    formData.windows10 = recordData.windows10 || 0;
    formData.windows11 = recordData.windows11 || 0;
    formData.license = recordData.license || 0;
    formData.enrollment = recordData.enrollment || 0;
    formData.microsoft = recordData.microsoft || 0;
    formData.browser = recordData.browser || 0;
    formData.anti_virus = recordData.anti_virus || 0;
    formData.media_player = recordData.media_player || 0;
    formData.adobe_reader = recordData.adobe_reader || 0;
    formData.word_processor = recordData.word_processor || 0;
    
    // Other fields
    formData.other_equip = recordData.other_equip || "";
    formData.other_os = recordData.other_os || "";
    formData.other_sys = recordData.other_sys || "";
    
    // Component details
    formData.processor_details = recordData.processor_details || "";
    formData.motherboard_details = recordData.motherboard_details || "";
    formData.memory_details = recordData.memory_details || "";
    formData.graphics_card_details = recordData.graphics_card_details || "";
    formData.hard_disk_details = recordData.hard_disk_details || "";
    formData.monitor_details = recordData.monitor_details || "";
    formData.casing_details = recordData.casing_details || "";
    formData.power_supply_details = recordData.power_supply_details || "";
    formData.keyboard_details = recordData.keyboard_details || "";
    formData.mouse_details = recordData.mouse_details || "";
    formData.avr_details = recordData.avr_details || "";
    formData.ups_details = recordData.ups_details || "";
    formData.printer_details = recordData.printer_details || "";
    formData.network_mac_ip_details = recordData.network_mac_ip_details || "";
    
    console.log("Form data populated:", formData);
  } else {
    console.error("Record not found with mainId:", mainId);
  }
  
};


// For moving to Step 2 when editing
const openStep2Modal = (mainId) => {
  console.log("Opening Step 2 modal for mainId:", mainId);

  if (!mainId) {
    console.error("Step 2 called without a valid mainId:", mainId);
    return;
  }

  const recordData = departments.value.find(dep => String(dep.mainId) === String(mainId));
  console.log("Record data found:", recordData);

  if (recordData) {
    selectedDepartments.value = recordData;

    // Set any additional fields needed for Step 2
    isStep1ModalOpen.value = false;
    isStep2ModalOpen.value = true;
    

  } else {
    console.error("Record not found with mainId:", mainId);
  }
};

const fetchEmployees = async () => {
  try {
    const response = await axios.get('/api/employees');
    employees.value = response.data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    employees.value = [];
  }
};

// Call this function when the component mounts or when the modal opens



const updateRecord = async () => {
  try {
    console.log("Updating Form Data:", formData);

    const payload = {
      mainId: currentMainId.value,
      employeeId: formData.employeeId,
      deptId: formData.deptId,
      OffId: formData.OffId,
      YrId: formData.YrId,
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
      media_player: formData.media_player,
      adobe_reader: formData.adobe_reader,
      word_processor: formData.word_processor,
      other_equip: formData.other_equip,
      other_os: formData.other_os,
      other_sys: formData.other_sys,
      processor_details: formData.processor_details,
      motherboard_details: formData.motherboard_details,
      memory_details: formData.memory_details,
      graphics_card_details: formData.graphics_card_details,
      hard_disk_details: formData.hard_disk_details,
      monitor_details: formData.monitor_details,
      casing_details: formData.casing_details,
      power_supply_details: formData.power_supply_details,
      keyboard_details: formData.keyboard_details,
      mouse_details: formData.mouse_details,
      avr_details: formData.avr_details,
      ups_details: formData.ups_details,
      printer_details: formData.printer_details,
      network_mac_ip_details: formData.network_mac_ip_details,
    };

    const response = await axios.put(`/api/preventive-maintenance/${currentMainId.value}`, payload);

    if (response.data && response.data.message) {
      // Find and update local entry
      const index = departments.value.findIndex(dep => String(dep.mainId) === String(currentMainId.value));
      if (index !== -1) {
        departments.value[index] = { ...departments.value[index], ...payload };
      }

      closeModal();
      // Optional: toast/success message
      console.log("Update successful:", response.data.message);
    }

  } catch (error) {
    console.error("Error updating record:", error.response?.data || error.message);
    // Optional: display error to user
  }
};


const nextToStep2 = () => {
  // This should only be used when you're not submitting data
  if (currentMainId.value) {
    openStep2Modal(currentMainId.value);
  } else {
    console.error("Cannot proceed to Step 2 without a mainId");
    // Maybe you want to show an error message to the user
  }
};


// Disable background scrolling when modal is open
const disableBackgroundScroll = () => {
  document.body.style.overflow = 'hidden';
};

// Enable background scrolling when modal is closed
const enableBackgroundScroll = () => {
  document.body.style.overflow = '';
};

const resetForm = () => {

  formData.date = '';
  formData.ticketnumber = '';
  formData.equipment = '';
  formData.officeUnit = '';
  formData.department = '';
  formData.dateAcquired = '';
  formData.pcName = '';
  
  // Reset equipment installed checkboxes
  formData.cpu_status = 0;
  formData.keyboard_status = 0;
  formData.printer_status = 0;
  formData.monitor_status = 0;
  formData.mouse_status = 0;
  formData.ups_status = 0;
  formData.avr_status = 0;
  formData.other_equip = '';
  
  // Reset OS radio buttons
  formData.windows10 = 0;
  formData.windows11 = 0;
  formData.other_os = '';
  formData.license = 0;
  
  // Reset software checkboxes
  formData.enrollment = 0;
  formData.microsoft = 0;
  formData.browser = 0;
  formData.anti_virus = 0;
  formData.word_processor = 0;
  formData.adobe_reader = 0;
  formData.media_player = 0;
  formData.other_sys = '';
  
  // Reset desktop specifications
  if (formData.desktopSpecs) {
    Object.keys(formData.desktopSpecs).forEach(key => {
      formData.desktopSpecs[key] = '';
    });
  }
  
  // If you're using arrays for checkboxes, reset those too
  if (formData.equipmentInstalled) {
    formData.equipmentInstalled = [];
  }
  
  if (formData.softwareInstalled) {
    formData.softwareInstalled = [];
  }
  
  // Reset the OS selection if it's a string
  if (typeof formData.osInstalled === 'string') {
    formData.osInstalled = '';
  }
 
  checklist.System_Boot = null;
  checklist.System_Log = null;
  
  checklist.Network_Settings1 = null;
  checklist.Network_Settings2 = null;
  checklist.Network_Settings3 = null;
  checklist.Network_Settings4 = null;
  checklist.Network_Settings5 = null;
  checklist.Network_Settings6 = null;
  
  checklist.Computer_Hardware_Settings1 = null;
  checklist.Computer_Hardware_Settings2 = null;
  checklist.Computer_Hardware_Settings3 = null;
  checklist.Computer_Hardware_Settings4 = null;
  checklist.Computer_Hardware_Settings5 = null;
  checklist.Computer_Hardware_Settings6 = null;
  
  checklist.Browser_Settings = null;
  checklist.Proper_Software_Loads = null;
  
  checklist.Viruses_Malware1 = null;
  checklist.Viruses_Malware2 = null;
  
  checklist.Clearance1 = null;
  checklist.Clearance2 = null;
  checklist.Clearance3 = null;
  checklist.Clearance4 = null;
  
  checklist.Interiors_Cleaning1 = null;
  checklist.Interiors_Cleaning2 = null;
  checklist.Interiors_Cleaning3 = null;
  checklist.Interiors_Cleaning4 = null;
  checklist.Interiors_Cleaning5 = null;
  
  checklist.Peripheral_Devices1 = null;
  checklist.Peripheral_Devices2 = null;
  checklist.Peripheral_Devices3 = null;
  checklist.Peripheral_Devices4 = null;
  checklist.Peripheral_Devices5 = null;
  checklist.Peripheral_Devices6 = null;
  checklist.Peripheral_Devices7 = null;
  
  checklist.Summary = '';
};


// Form Data
const formData = reactive({
  employeeId: "",
  disposal: "", 
  ticketnumber: "",
  pcName: "",
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
watch(selectedDepartments, (newVal) => {
  if (newVal) {
    console.log(newVal); // Check the new value of selectedEmployee

    // Basic Info
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

const isLocked = ref(false);

const setForDisposal = () => {
  formData.disposal = 1;

  // Lock equipment statuses
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





const submitForm = async () => {
  try {
    console.log("Submitting Form Data:", formData);
    
    // Make sure selectedDepartments is defined and has the right structure
    const deptId = selectedDepartments.value?.deptId || 
                  (props.departments && props.departments.length > 0 ? 
                   props.departments[0].deptId : null);
    
    // Safely access desktop specs with optional chaining
    const desktopSpecs = formData.desktopSpecs || {};
    
    // Construct request payload
    const payload = {
      disposal: formData.disposal,
      employeeId: null,
      deptId,
      YrId: selectedDepartments.value?.YrId || props.YrId,
      pcName: formData.pcName || '',
      ticketnumber: formData.ticketnumber || '',
      equipment: formData.equipment || '',
      dateAcquired: formData.dateAcquired || '',
      cpu_status: formData.cpu_status || 0,
      keyboard_status: formData.keyboard_status || 0,
      printer_status: formData.printer_status || 0,
      monitor_status: formData.monitor_status || 0,
      mouse_status: formData.mouse_status || 0,
      ups_status: formData.ups_status || 0,
      avr_status: formData.avr_status || 0,
      windows10: formData.windows10 || 0,
      windows11: formData.windows11 || 0,
      license: formData.license || 0,
      enrollment: formData.enrollment || 0,
      microsoft: formData.microsoft || 0,
      browser: formData.browser || 0,
      anti_virus: formData.anti_virus || 0,
      word_processor: formData.word_processor || 0,
      adobe_reader: formData.adobe_reader || 0,
      media_player: formData.media_player || 0,
      other_equip: formData.other_equip || '',
      other_os: formData.other_os || '',
      other_sys: formData.other_sys || '',
      processor_details: desktopSpecs.Processor || '',
      motherboard_details: desktopSpecs.Motherboard || '',
      memory_details: desktopSpecs.Memory || '',
      graphics_card_details: desktopSpecs.GraphicCard || '',
      monitor_details: desktopSpecs.Monitor || '',
      hard_disk_details: desktopSpecs.HardDisk || '',
      casing_details: desktopSpecs.Casing || '',
      power_supply_details: desktopSpecs.PowerSupply || '',
      keyboard_details: desktopSpecs.Keyboard || '',
      mouse_details: desktopSpecs.Mouse || '',
      avr_details: desktopSpecs.AVR || '',
      ups_details: desktopSpecs.UPS || '',
      printer_details: desktopSpecs.Printer || '',
      network_mac_ip_details: desktopSpecs.NetWorkMacIp || '',
    };

    console.log("Payload:", payload);

    const response = await axios.post(`/api/departmentChecklist`, payload);
    const newDepartmentData = response.data.data;
    
    console.log("API response data:", newDepartmentData);
    
    if (!newDepartmentData || !newDepartmentData.mainId) {
      console.error("API response missing mainId:", newDepartmentData);
      return; // Exit if no mainId
    }

    // Make sure departments is defined
    if (departments && departments.value) {
      // Optional: check if it's already in the list
      const exists = departments.value.find(dep => dep.mainId === newDepartmentData.mainId);

      if (!exists) {
        departments.value.push(newDepartmentData); // Add to local departments
      }
    }

    // Set both mainId and currentMainId values
    mainId.value = newDepartmentData.mainId;
    currentMainId.value = newDepartmentData.mainId;
    
    console.log("mainId set to:", mainId.value);
    console.log("currentMainId set to:", currentMainId.value);

    // Pass the mainId to the function
    submitStep1AndGoToStep2(newDepartmentData.mainId);

  } catch (error) {
    console.error("Error submitting form:", error.response?.data || error.message);
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

watch(selectedDepartments, (newVal) => {
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


const submitChecklist = async () => {
  
  const payload = {
    mainId: mainId.value,   
    YrId: selectedDepartments.value?.YrId || props.YrId,

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

const isDropdownOpen = ref(false);

// Add User Modal Control
const isAddUserModalOpen = ref(false);

// New User Data



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
            <th class="text-center">Actions</th>
            <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in department" :key="employee.mainId">
            <!-- Display equipment number -->
            <td>{{ employee.equipmentId }}</td>
            
            <td class="text-center">
            <div class="d-flex justify-content-center">
              <button class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto mx-2" 
                      @click="openStepModal(employee.mainId)">
                <i class="fas fa-eye me-1"></i> Edit 
              </button>
              <button 
                class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto" 
                @click="printDetails(employee)">
                <i class="fas fa-eye me-1"></i> Print
              </button>
            </div>
          </td>       

          <td>{{ employee.disposal === '1' ? 'For Disposal' : (employee.disposal == null ? 'None' : employee.disposal) }}</td>
              
           
            
        
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

</div>
        <!-- For Disposal Button -->
        <button class="btn btn-danger btn-sm" @click="setForDisposal">For Disposal</button>


          <div class="modal-body modal-scrollable">
          
            <div class="row mb-3">
              <div class="col-md-2 user-dropdown-container" v-if="isUpdateMode">
                <label class="form-label">User</label>
                <select class="form-select fixed-width-dropdown" v-model="formData.employeeId">
                  <option v-for="employee in employees" :key="employee.employeeId" :value="employee.employeeId">
                    {{ employee.emp_name }}
                  </option>
                </select>
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
                <input type="text" class="form-control" v-model="formData.pcName" :disabled="isLocked">
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
                    v-model="formData.equipmentInstalled":disabled="isLocked"
                    @change="updateEquipmentStatus(option)" 
                  />
                  <label class="form-check-label">{{ option }}</label>
                </div>

                <!-- Input Field for 'Other' Equipment -->
                <input 
                  v-if="option === 'Other' && formData.equipmentInstalled.includes('Other')" 
                  type="text" 
                  class="form-control mt-1 ms-3" 
                  v-model="formData.other_equip":disabled="isLocked"
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
            @change="updateOsInstalled(option)" :disabled="isLocked"
          />
          <label class="form-check-label">{{ option }}</label>
        </div>

        <!-- Input Field for 'Other' OS -->
        <div v-if="formData.osInstalled === 'Other'" class="ms-3">
          <input 
            type="text" 
            class="form-control mt-1" 
            v-model="formData.other_os" :disabled="isLocked"
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
              v-model.number="formData.license" :disabled="isLocked"
            />
            <label class="form-check-label">Licensed</label>
          </div>
          <div class="form-check">
            <input 
              type="radio" 
              class="form-check-input" 
              :value="0" 
              v-model.number="formData.license":disabled="isLocked"
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
            v-model="formData.softwareInstalled" :disabled="isLocked"
            @change="updateSoftwareStatus(option)" 
          />
          <label class="form-check-label">{{ option }}</label>
        </div>

        <!-- Input Field for 'Other' Software -->
        <input 
          v-if="option === 'Other' && formData.softwareInstalled.includes('Other')" 
          type="text" 
          class="form-control mt-1 ms-3" 
          v-model="formData.other_sys" :disabled="isLocked"
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
            <!-- Always show Close button -->
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            
            <!-- Show Save button only in Add Form mode (not in Edit mode) -->
            <button v-if="!isUpdateMode" type="button" class="btn btn-primary" @click="submitForm">Save</button>
            
            <!-- Show Update button only in Edit mode -->
            <button v-if="isUpdateMode" type="button" class="btn btn-primary" @click="updateRecord">Update</button>
            
            <!-- Always show Next button, regardless of mode -->
            <button type="button" class="btn btn-secondary" @click="nextToStep2">Next</button>
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

.user-dropdown-container {
    position: relative;
  }
  
  .fixed-width-dropdown {
    width: 100%;  /* Make the select element stick to its container width */
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Force dropdown menu to match select width and handle text overflow */
  .fixed-width-dropdown option {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>