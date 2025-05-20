<script setup>
import { ref, computed, watchEffect, onMounted, defineProps, reactive } from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';
import axios from "axios";
import { Link } from '@inertiajs/vue3';

const props = defineProps({
  departments: { type: Array, default: () => [] },  
  pmYear: { type: Object, default: () => ({}) },
  YrId: { type: [String, Number], default: null },
  PlanId: { type: [String, Number], default: null },
  office: { type: Object, default: () => ({}) },
  deptId: { type: [String, Number], default: null },
  categoryId: { type: [String, Number], default: null }
});

const selectedDepartments = ref(null);
const selectedPmYear = computed(() => props.pmYear ?? {});
const selectedOfficeId = ref(props.office?.OffId || '');
const selectedYear = ref(props.YrId || '');
const departments = ref(props.departments || []);
const selectedPlan = ref(props.PlanId || '');
const selectedDeptId = ref(props.deptId ?? null);
const selectedCategoryId = ref(props.categoryId ?? 2); 

const getPlanId = () => {
  return props.departments.length > 0 ? props.departments[0].PlanId : null;
};

const selectedMonth = ref('');
const months = ref([]);
const hasLoadedMonths = ref(false);
const deptId = ref('');

// Add user modal
const isModalOpen = ref(false);
const isLoading = ref(false);
const newUser = ref({ name: "", number: "" });

const openModal = () => {
  isModalOpen.value = true;
};

const iscloseModal = () => {
  isModalOpen.value = false;
};

const fetchMonths = async () => {
  const PlanId = getPlanId();
  // Make sure deptId is a simple value, not an object
  const departmentId = typeof deptId.value === 'object' ? deptId.value.id || '' : deptId.value;
  const OffId = selectedDepartments.value?.OffId || '';
  
  console.log("Debug values:", { PlanId, departmentId, OffId });
  
  if (!PlanId || !departmentId || !OffId) {
    console.warn("Missing required parameters for fetchMonths:", { PlanId, departmentId, OffId });
    return;
  }

  try {
    const response = await axios.get(`/api/getAvailableMonths/${PlanId}/${departmentId}/${OffId}`);
    months.value = response.data.map(item => item.MonthName);
    hasLoadedMonths.value = true;
  } catch (error) {
    console.error("Failed to fetch months:", error);
  }
};

watchEffect(() => {
  if (!selectedDeptId.value && props.departments?.length > 0) {
    selectedDeptId.value = props.departments[0].DeptId;
  }
  if (!selectedCategoryId.value && props.categories?.length > 0) {
    selectedCategoryId.value = 2;
  }
});

watchEffect(() => {
  selectedPlan.value = props.PlanId || '';
  console.log("Updated PlanId:", selectedPlan.value);
});

const isStep1ModalOpen = ref(false);
const editedItem = ref({});

const openStep1Modal = (item) => {
  console.log("Clicked deptId:", item);
  isStep1ModalOpen.value = true;
  disableBackgroundScroll();
  deptId.value = item;
};

const closeModal = () => {
  isStep1ModalOpen.value = false;
  enableBackgroundScroll();
};

const disableBackgroundScroll = () => {
  document.body.style.overflow = 'hidden';
};

const enableBackgroundScroll = () => {
  document.body.style.overflow = '';
};

// Checklist Data
const checklist = reactive({
  data_softsystem_checks1: "",
  data_softsystem_checks2: "",
  data_softsystem_checks3: "",
  data_softsystem_checks4: "",
  data_softsystem_checks5: "",
  data_softsystem_checks6: "",
  data_softsystem_checks7: "",
  data_softsystem_checks8: "",

  security_checks1: "",
  security_checks2: "",
  security_checks3: "",
  security_checks4: "",
  security_checks5: "",

  hardware_checks1: "",
  hardware_checks2: "",

  Summary: ""
});

watchEffect(() => {
  if (!selectedDepartments.value && departments.value.length > 0) {
    selectedDepartments.value = departments.value.find(dep => dep.OffId && dep.PlanId) || departments.value[0];
  }
});

// Add User functionality
const addUser = async () => {
  if (!newUser.value.name.trim() || !newUser.value.number.trim()) {
    alert("Please fill in all fields.");
    return;
  }

  const firstDepartment = departments.value.length > 0 ? departments.value[0] : null;
  const officeId = firstDepartment ? firstDepartment.OffId : null;
  const departmentId = firstDepartment ? firstDepartment.DeptId : null;

  try {
    const response = await axios.post("/api/add-department", {
      department_name: newUser.value.name,
      department_number: newUser.value.number,
      offId: officeId ?? 0,
      deptId: departmentId ?? 0
    });

    alert("Department added successfully!");

    // Add the new department to the reactive array
    departments.value.push(response.data);

    // Reset the form
    newUser.value = { name: "", number: "" };
    isModalOpen.value = false;
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    alert("An error occurred while adding the department.");
  }
};

const submitChecklist = async () => {
  try {
    const payload = {
      YrId: props.YrId,
      OffId: selectedDepartments.value?.OffId || '',
      PlanId: selectedDepartments.value?.PlanId || '',
      deptId: deptId.value,
      Months: selectedMonth.value,

      data_softsystem_checks1: checklist.data_softsystem_checks1,
      data_softsystem_checks2: checklist.data_softsystem_checks2,
      data_softsystem_checks3: checklist.data_softsystem_checks3,
      data_softsystem_checks4: checklist.data_softsystem_checks4,
      data_softsystem_checks5: checklist.data_softsystem_checks5,
      data_softsystem_checks6: checklist.data_softsystem_checks6,
      data_softsystem_checks7: checklist.data_softsystem_checks7,
      data_softsystem_checks8: checklist.data_softsystem_checks8,

      security_checks1: checklist.security_checks1,
      security_checks2: checklist.security_checks2,
      security_checks3: checklist.security_checks3,
      security_checks4: checklist.security_checks4,
      security_checks5: checklist.security_checks5,

      hardware_checks1: checklist.hardware_checks1,
      hardware_checks2: checklist.hardware_checks2,

      Summary: checklist.Summary,
    };

    const response = await axios.post('/api/addDatacenter', payload);

    console.log("Checklist submitted:", response.data);
    alert("Checklist submitted successfully!");
    
    // Reset form data
    resetForm();
    
    // Reset selected month
    const submittedMonth = selectedMonth.value;
    selectedMonth.value = '';
    
    // Remove the submitted month from the dropdown
    months.value = months.value.filter(month => month !== submittedMonth);
    
    // Alternatively, completely refresh the months list
    hasLoadedMonths.value = false;
    fetchMonths();
    closeModal();
  } catch (error) {
    console.error("Submission error:", error.response?.data || error.message);
    alert("Something went wrong during submission.");
  }
};

// Reset form function
const resetForm = () => {
  // Reset all checklist values
  Object.keys(checklist).forEach(key => {
    if (typeof checklist[key] === 'number') {
      checklist[key] = 0;
    } else if (typeof checklist[key] === 'string') {
      checklist[key] = '';
    }
  });
};

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
        <h2>Department Details</h2>
        <div class="details">
          <p><strong>Name:</strong> ${item.name}</p>
          <p><strong>Status:</strong> ${item.status}</p>
        </div>
        <div class="modal-body">
          <p><strong>Monthly Reports:</strong> ${item.reports ? item.reports.join(', ') : 'N/A'}</p>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(modalHtml);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 10);
};

const options = [
  { value: '1' },
  { value: '2' },
  { value: '3' }
];

// Status dropdown functionality
const isStatusDropdownOpen = ref(false);
const searchStatus = ref("");
const statusOptions = ref(["Clear", "Unclear", "Pending", "Completed"]);

const filteredStatusOptions = computed(() => {
  return statusOptions.value.filter(status =>
    status.toLowerCase().includes(searchStatus.value.toLowerCase())
  );
});

const selectStatus = (status) => {
  newUser.value.status = status;
  searchStatus.value = status;
  isStatusDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".status-dropdown")) {
    isStatusDropdownOpen.value = false;
  }
};

watchEffect(() => {
  if (isStatusDropdownOpen.value) {
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
        <h1 class="title">{{ selectedPmYear.Description }} {{ selectedPmYear.Name }}</h1>
      </div>

      <div class="controls-container">
    
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Action</th>
              <th>Status</th>
              <th>Show ticket</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="department in departments" :key="department.DeptId" class="table-row">
              <td class="dept-name">{{ department.department_name }}</td>
              <td>
                <button class="btn primary-btn" @click="openStep1Modal(department.DeptId)">
                  <i class="fas fa-edit"></i> Fillup Form
                </button>
              </td>
              <td>
                <div :class="['status-badge', { 
                  'status-clear': department.status === 'Clear', 
                  'status-unclear': department.status === 'Unclear',
                  'status-pending': department.status === 'Pending',
                  'status-completed': department.status === 'Completed'
                }]">
                  {{ department.status || 'Pending' }}
                </div>
              </td>
              <td>
                <Link 
                  v-if="department.DeptId"
                  :href="route('viewdata', { 
                    departmentId: department.DeptId, 
                    officeId: selectedOfficeId, 
                    YrId: selectedYear,
                    PlanId: selectedPlan
                  })"
                  class="btn secondary-btn">
                  <i class="fas fa-eye"></i> View
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Add Department Modal -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h2 class="modal-title">Add New Department</h2>
          <button class="close-btn-icon" @click="iscloseModal">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Department Name</label>
            <input type="text" class="form-control" v-model="newUser.name" />
          </div>
          <div class="form-group">
            <label class="form-label">Department Number</label>
            <input type="text" class="form-control" v-model="newUser.number" />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn cancel-btn" @click="iscloseModal">
            <i class="fas fa-times"></i> Close
          </button>
          <button type="button" class="btn save-btn" :disabled="isLoading" @click="addUser">
            <i class="fas fa-save"></i> {{ isLoading ? 'Adding...' : 'Add Department' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Component for Form Submission -->
    <div v-if="isStep1ModalOpen" class="modal-overlay">
      <div class="modal-content modal-xl">
        <div class="modal-header">
          <div class="header-title-container">
            <h2 class="modal-title">PREVENTIVE MAINTENANCE CHECKLIST FOR SERVERS/DATACENTER</h2>
            <div class="header-month-selection">
              <label for="month-select" class="month-label">For the Month:</label>
              <select
                id="month-select"
                v-model="selectedMonth"
                class="month-select"
                @click="fetchMonths(selectedPlan.PlanId)"
              >
                <option value="" disabled>Select Month</option>
                <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
              </select>
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
                  <th>Category</th>
                  <th>Specification</th>
                  <th class="text-center">Good</th>
                  <th class="text-center">Near Maintenance</th>
                  <th class="text-center">N/A</th>
                </tr>
              </thead>
              <tbody>
                <!-- Data, Software and System Checks Section -->
                <tr>
                  <td class="category-cell" rowspan="8">Data, Software and System Checks</td>
                  <td class="spec-cell">Check backups are working</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'backup_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks1" />
                      <label class="radio-label" :for="'backup_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Check and update OS</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Os_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks2" />
                      <label class="radio-label" :for="'Os_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Update your control panel</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Panel_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks3" />
                      <label class="radio-label" :for="'Panel_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Check and update applications</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Applications_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks4" />
                      <label class="radio-label" :for="'Applications_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Check Remote Management Tools</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Tools_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks5" />
                      <label class="radio-label" :for="'Tools_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Check Server Usage</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Usage_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks6" />
                      <label class="radio-label" :for="'Usage_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Review user accounts</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Account_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks7" />
                      <label class="radio-label" :for="'Account_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Free up server storage space</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Space_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks8" />
                      <label class="radio-label" :for="'Space_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                
                <!-- Security Checks Section -->
                <tr>
                  <td class="category-cell" rowspan="5">Security Checks</td>
                  <td class="spec-cell">Change server passwords</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Checks_' + opt.value" :value="opt.value" v-model="checklist.security_checks1" />
                      <label class="radio-label" :for="'Checks_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Firewall installed</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Firewall_' + opt.value" :value="opt.value" v-model="checklist.security_checks2" />
                      <label class="radio-label" :for="'Firewall_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Perform a server malware scan</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Malware_' + opt.value" :value="opt.value" v-model="checklist.security_checks3" />
                      <label class="radio-label" :for="'Malware_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Check fans and power supplies</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Power_' + opt.value" :value="opt.value" v-model="checklist.security_checks4" />
                      <label class="radio-label" :for="'Power_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Check RAID fault tolerance</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Fault_' + opt.value" :value="opt.value" v-model="checklist.security_checks5" />
                      <label class="radio-label" :for="'Fault_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                
                <!-- Hardware Checks Section -->
                <tr>
                  <td class="category-cell" rowspan="2">Hardware Checks</td>
                  <td class="spec-cell">Check Cable Integrity</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Hardware_' + opt.value" :value="opt.value" v-model="checklist.hardware_checks1" />
                      <label class="radio-label" :for="'Hardware_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Check A/C unit at the facility</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Facility_' + opt.value" :value="opt.value" v-model="checklist.hardware_checks2" />
                      <label class="radio-label" :for="'Facility_' + opt.value"></label>
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

        <!-- Modal Footer with Action Buttons -->
        <div class="modal-footer">
          <button type="button" class="btn cancel-btn" @click="closeModal">
            <i class="fas fa-times"></i> Cancel
          </button>
          <button type="button" class="btn save-btn" @click="submitChecklist">
            <i class="fas fa-save"></i> Save
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

/* Form Styles */
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

/* Month Selection Styles - Now moved to header */
.month-select:focus {
  border-color: #3498db;
  background-color: rgba(255, 255, 255, 0.2);
}

.month-select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

/* Checklist Title */
.checklist-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.75rem;
}

/* Table Responsive Container */
.table-responsive {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

/* Checklist Table Styles */
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
  text-align: center;
}

.category-cell {
  background-color: #f2f2f2;
  font-weight: 600;
  color: #2c3e50;
  vertical-align: middle;
  text-align: center;
  width: 15%;
}

.spec-cell {
  color: #333;
  font-weight: 500;
  width: 55%;
}

.option-cell {
  text-align: center;
  width: 10%;
  background-color: #fcfcfc;
}

/* Custom Radio Button Styles */
.radio-container {
  display: flex;
  justify-content: center;
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

.radio-input:hover {
  border-color: #2980b9;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

/* Summary Section Styles */
.summary-container {
  margin-top: 1.5rem;
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
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  background-color: white;
}

.summary-textarea::placeholder {
  color: #aaa;
}

/* Action Buttons */
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
  
  .modal-title {
    font-size: 1rem;
  }
  
  .month-label {
    font-size: 0.8rem;
  }
  
  .month-select {
    min-width: 100px;
    font-size: 0.8rem;
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
  
  .data-table th,
  .data-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
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

.save-btn:active {
  animation: pulse 0.3s ease-in-out;
}

/* Firefox specific fixes for radio buttons */
@-moz-document url-prefix() {
  .radio-input {
    border-width: 1px;
  }
  
  .radio-input:checked::after {
    width: 12px;
    height: 12px;
  }
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

.dept-name {
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
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-month-selection {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.month-label {
  font-weight: 600;
  color: white;
  margin: 0;
  white-space: nowrap;
  font-size: 0.9rem;
}

.month-select {
  padding: 0.4rem 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  min-width: 120px;
  max-width: 150px;
  font-size: 0.85rem;
  color: white;
  outline: none;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
  padding-right: 20px;
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
</style>