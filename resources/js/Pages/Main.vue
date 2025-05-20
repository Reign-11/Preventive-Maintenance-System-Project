<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import MainLayout from '@/Layouts/MainLayout.vue';
import axios from "axios";
import { Link } from '@inertiajs/vue3';

// Reactive properties
const years = ref([]);
const selectedYear = ref(new Date().getFullYear());
const maintenancePlans = ref([]);
const selectedYearDescription = ref("");
const isFetchingData = ref(false);
const selectedYearName = ref("");
const offices = ref([]); // Store the list of offices for the dropdown
const selectedOffice = ref(null); // Holds selected value
const selectedParentOffice = ref(null); // Define this to avoid ReferenceError
const addedOffices = ref([]); // Fix: Declare addedOffices as a reactive array
const plan = ref([]);
const selectYear = ref(null);
const isLocked = ref(false);
const lockedYears = ref({});
const isPrinting = ref(false);

// External Scripts
const files = [
  '/script/jquery-3.5.1.min.js',  
  '/script/jquery.dataTables.min.js', 
  '/script/dataTables.bootstrap4.min.js', 
  '/script/bootstrap.bundle.min.js', 
  '/script/all.min.js', 
  '/script/feather.min.js',
  '/script/scripts.js',
  '/script/moment.min.js'
];

// Load external scripts dynamically
const loadScripts = (fileList) => {
  fileList.forEach(file => {
    if (!document.querySelector(`script[src="${file}"]`)) {
      let script = document.createElement("script");
      script.src = file;
      script.async = true;
      document.head.appendChild(script);
    }
  });
};

// Open Modal
const openModal = () => {
  const modalElement = document.getElementById("addCollegeModal");
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }
};

// Fetch offices for the dropdown
const fetchOffices = async () => {
  try {
    console.log("📡 Fetching offices...");
    const response = await axios.get("/api/offices");
    console.log(" Response:", response.data);
    offices.value = response.data; // Ensure this is reactive
  } catch (error) {
    console.error("❌ Error fetching offices:", error);
  }
};

// Fetch available years
const fetchYears = async () => {
  try {
    const response = await axios.get("/api/years");
    years.value = response.data;
  } catch (error) {
    console.error("Error fetching years:", error);
  }
};

const saveAllPlans = async () => {
  if (!selectedYear.value) {
    alert('Please select a year before saving.');
    return;
  }
  try {
    const response = await axios.post('/api/duplicate', {
      oldYrId: selectYear.value,
      oldCatId: 1,
      newYrId: selectedYear.value
    });

    alert('Plans duplicated successfully!');
  } catch (error) {
    console.error(error);
    alert('Failed to duplicate plans. Please try again.');
  }
};

// Fetch maintenance plans
const fetchData = async () => {
  if (!selectedYear.value) {
    maintenancePlans.value = [];
    return;
  }

  isFetchingData.value = true;

  try {
    const response = await axios.get(`/api/maintenance-plans?YrId=${selectedYear.value}&CatId=1`);

    console.log("📡 Fetching Data for YrId:", selectedYear.value);
    console.log("📦 Fetched Data:", response.data);

    if (!response.data || !Array.isArray(response.data)) {
      console.error("❌ Unexpected API response format:", response.data);
      maintenancePlans.value = [];
      return;
    }

    // Transform lowercase database values to uppercase for display
    maintenancePlans.value = response.data.map(plan => {
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      const transformedPlan = { ...plan };
      
      // Transform each month's value to uppercase for display
      months.forEach(month => {
        if (transformedPlan[month]) {
          transformedPlan[month] = transformedPlan[month].toUpperCase();
        }
        
        // Remove any readonly or temp flags that might cause issues
        delete transformedPlan[`${month}Readonly`];
        delete transformedPlan[`${month}Temp`];
      });
      
      // Initialize isSaving flag to false
      transformedPlan.isSaving = false;
      
      return transformedPlan;
    });
  } catch (error) {
    console.error("❌ Error fetching maintenance plans:", error);
    alert(error.response?.data?.message || "Failed to fetch data.");
  } finally {
    isFetchingData.value = false;
  }
};

// Function to check if input is allowed
const isInputAllowed = (type, plan, month) => {
  // If it's the current value in this cell, always allow it (editing existing value)
  if (plan && month && plan[month] && plan[month].toUpperCase() === type) {
    return true;
  }
  
  if (!type) return true;
  // Convert to uppercase for consistency
  const upperType = typeof type === 'string' ? type.toUpperCase() : type;
  
  // Count totals excluding the current cell being edited
  let adjustedCount = 0;
  
  if (upperType === 'A') {
    // Count A values excluding the current cell if it's being edited
    adjustedCount = maintenancePlans.value.reduce((count, p) => {
      return count + Object.entries(p)
        .filter(([key, value]) => 
          ["January", "February", "March", "April", "May", "June", "July", 
           "August", "September", "October", "November", "December"].includes(key) &&
          typeof value === 'string' && 
          value.toUpperCase() === 'A' && 
          !(p === plan && key === month)
        )
        .length;
    }, 0);
    return adjustedCount < 1;
  }
  
  if (upperType === 'SA') {
    // Similar approach for SA
    adjustedCount = maintenancePlans.value.reduce((count, p) => {
      return count + Object.entries(p)
        .filter(([key, value]) => 
          ["January", "February", "March", "April", "May", "June", "July", 
           "August", "September", "October", "November", "December"].includes(key) &&
          typeof value === 'string' && 
          value.toUpperCase() === 'SA' && 
          !(p === plan && key === month)
        )
        .length;
    }, 0);
    return adjustedCount < 2;
  }
  
  if (upperType === 'QA') {
    // Similar approach for QA
    adjustedCount = maintenancePlans.value.reduce((count, p) => {
      return count + Object.entries(p)
        .filter(([key, value]) => 
          ["January", "February", "March", "April", "May", "June", "July", 
           "August", "September", "October", "November", "December"].includes(key) &&
          typeof value === 'string' && 
          value.toUpperCase() === 'QA' && 
          !(p === plan && key === month)
        )
        .length;
    }, 0);
    return adjustedCount < 4;
  }
  
  if (upperType === 'M') {
    // Similar approach for M
    adjustedCount = maintenancePlans.value.reduce((count, p) => {
      return count + Object.entries(p)
        .filter(([key, value]) => 
          ["January", "February", "March", "April", "May", "June", "July", 
           "August", "September", "October", "November", "December"].includes(key) &&
          typeof value === 'string' && 
          value.toUpperCase() === 'M' && 
          !(p === plan && key === month)
        )
        .length;
    }, 0);
    return adjustedCount < 12;
  }
  
  return true;
};

const saveOnEnter = async (plan, triggerMonth = null) => {
  try {
    console.log(`🔹 Saving Plan ID: ${plan?.PlanId} for ${selectedYear.value}`);
    // Set saving state
    plan.isSaving = true;

    await nextTick(); // Ensure the DOM is updated

    if (!plan || typeof plan !== "object") {
      console.error("❌ Error: Plan is undefined or not an object!", { plan });
      alert("❌ Error: Plan data is missing.");
      plan.isSaving = false;
      return;
    }

    // Define all months
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Prepare the payload
    let payload = {
      PlanId: plan.PlanId ?? null,
      YrId: Number(selectedYear.value),
      OffId: Number(plan.OffId),
      CatId: Number(plan.CatId ?? 1),
      PrevId: plan.PrevId ?? null,
    };

    // Transform all month values to lowercase for saving to database
    months.forEach((month) => {
      if (plan[month]) {
        payload[month] = plan[month].toLowerCase();
      } else {
        payload[month] = null;
      }
    });

    console.log("📩 Sending Data:", payload);

    const response = await axios.post("/api/save-maintenance-plan", payload);

    console.log("✅ Maintenance plan saved successfully", response.data);

    // Update the PlanId if it's newly created
    if (!plan.PlanId && response.data.PlanId) {
      plan.PlanId = response.data.PlanId;
      console.log("🔄 Plan ID updated:", plan.PlanId);
    }

    // Important: Make sure values are in uppercase for display
    months.forEach((month) => {
      if (plan[month]) {
        plan[month] = plan[month].toUpperCase();
      }
    });

    alert("Plan saved successfully!");
  } catch (error) {
    console.error("❌ Error in saveOnEnter:", error);
    alert(error.response?.data?.error || "Failed to save data.");
  } finally {
    // Always reset the saving state, even on error
    plan.isSaving = false;
  }
};

// Add College (POST Request to Laravel API)
const addOffice = async () => {
  if (!selectedOffice.value) {
    alert("Please select an office.");
    return;
  }

  if (!selectedYear.value) {
    alert("Please select a Year before saving.");
    return;
  }

  const selectedOfficeData = offices.value.find(office => office.OffId === selectedOffice.value);
  if (!selectedOfficeData) {
    alert("Invalid office selected.");
    return;
  }

  const requestData = {
    OfficeName: selectedOfficeData.OfficeName,
    ParentOffId: selectedParentOffice?.value || null,
    YrId: selectedYear.value,
    CatId: 1,
  };

  console.log("📡 Sending request:", requestData);

  try {
    const response = await axios.post("/api/add-colleges", requestData);
    console.log("✅ Response received:", response.data);

    alert("Office added successfully!");

    // Add office to prevent duplicates
    addedOffices.value.push(selectedOffice.value);
    
    // Remove added office from dropdown
    offices.value = offices.value.filter(office => office.OffId !== selectedOffice.value);

    // Reset selection
    selectedOffice.value = null;
    selectedParentOffice.value = null;
    selectedYear.value = null;
  } catch (error) {
    if (error.response?.status === 409) {
      alert("⚠️ Office already exists for the selected year!");
    } else {
      console.error("❌ Error adding office:", error);
      alert(error.response?.data?.message || "An unexpected error occurred.");
    }
  }
};

// Watcher for updates
watch(maintenancePlans, (newValue) => {
  if (isFetchingData.value || !selectedYear.value || !newValue.length) return;

  newValue.forEach(plan => {
    Object.keys(plan).forEach(month => {
      if (month.endsWith("Temp")) {
        plan[month] = plan[month.replace("Temp", "")] ?? "";
      }
    });
  });
}, { deep: true });

// Handle Year Selection Change
watch(selectedYear, async (newYearId) => {
  console.log("🟡 Selected Year Changed:", newYearId);

  if (!newYearId) {
    selectedYearName.value = "";
    selectedYearDescription.value = "";
    maintenancePlans.value = [];
    return;
  }

  const selected = years.value.find(year => year.YrId === Number(newYearId));
  
  selectedYearName.value = selected?.Name ?? "";
  selectedYearDescription.value = selected?.Description ?? "";

  console.log("📌 Updated Header:", selectedYearName.value, selectedYearDescription.value);

  // Fetch data for the selected year
  await fetchData();
});

// On component mount
onMounted(async () => {
  await fetchOffices();
  await fetchYears();
  if (years.value.length > 0) {
    selectedYear.value = years.value[0].YrId;
  }
  loadScripts(files);
});

const months = ref([
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]);

const printTable = () => {
  // Set printing mode to true - this will use all plans instead of paginated ones
  isPrinting.value = true;
  
  // Add a small delay to ensure the DOM updates before printing
  setTimeout(() => {
    // Trigger the print dialog
    window.print();
    
    // Reset printing mode after printing is done
    setTimeout(() => {
      isPrinting.value = false;
    }, 1000);
  }, 300);
};

// Add this function to properly close the modal
const closeModal = () => {
  const modalElement = document.getElementById("addCollegeModal");
  if (modalElement) {
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
};

// Reactive variables for pagination
const entriesPerPage = ref(5); // Default to 10 entries per page
const currentPage = ref(1); // Start at page 1

const paginatedPlans = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value;
  const end = start + entriesPerPage.value;
  return maintenancePlans.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(maintenancePlans.value.length / entriesPerPage.value);
});

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const openSaveModal = () => {
  const modalElement = document.getElementById("saveYearModal");
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }
};

const detachPlan = async (PlanId) => {
  try {
    await axios.post(`/api/detach/${PlanId}`);
    alert('Plan detached successfully!');
    // Optionally remove from table
    plan.value = plan.value.filter(plan => plan.PlanId !== PlanId);
  } catch (error) {
    console.error(error);
    alert('Failed to detach the plan.');
  }
};

const toggleLock = () => {
  const year = selectedYear.value;
  lockedYears.value[year] = !lockedYears.value[year];
};

const isYearLocked = (plan) => {
  return !!lockedYears.value[plan.YrId]; // locked if true
};

function obfuscate(id) {
  return parseInt(id * 250 + 5675675).toString(33);
}
</script>

<template>
  <MainLayout>
    <main>
      <div class="container mt-4">
        <!-- Header Section -->
        <div class="text-center">
          <h2 class="fw-bold">
            {{ selectedYearName }} 
            <span v-if="selectedYearDescription" style="color: black;"> - {{ selectedYearDescription }}</span>
          </h2>

          <!-- Legend -->
          <div class="mt-2">
            <strong>Legend:</strong>
            <span class="badge bg-primary text-white">A</span> Annual
            <span class="badge bg-success text-white">SA</span> Semi-Annual
            <span class="badge bg-warning text-white">QA</span> Quarterly Annual
            <span class="badge bg-warning text-white">M</span> Monthly
          </div>

          <!-- Action Buttons -->
          <div class="d-flex justify-content-center gap-4 mt-3 no-print">
            <button class="btn btn-success rounded-pill shadow-sm px-4 py-2 no-print" @click="openSaveModal">
              <i class="fas fa-save"></i> Save
            </button>
            <button class="btn btn-warning rounded-pill shadow-sm px-4 py-2" style="font-size: 16px;" @click="toggleLock">
              <i class="fas fa-lock"></i> {{ lockedYears[selectedYear] ? 'Unlock' : 'Lock' }}
            </button>
            <button class="btn btn-info rounded-pill shadow-sm px-4 py-2" @click="printTable" style="font-size: 16px;">
              <i class="fas fa-print"></i> Print
            </button>
          </div>

          <!-- Save Year Modal -->
          <div class="modal fade" id="saveYearModal" tabindex="-1" aria-labelledby="saveYearModalLabel">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="saveYearModalLabel">Select Year</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="mb-3">
                    <label for="saveYearDropdown" class="form-label">Select Year:</label>
                    <select id="saveYearDropdown" v-model="selectYear" class="form-control">
                      <option v-for="year in years" :key="year.YrId" :value="year.YrId">{{ year.Name }}</option>
                    </select>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-primary" @click="saveAllPlans">Save</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Year Selection -->
          <div class="mt-2 no-print">
            <label for="year">Select Year:</label>
            <select v-model="selectedYear" class="form-select w-auto rounded"> 
              <option v-for="year in years" :key="year.YrId" :value="year.YrId">
                {{ year.Name }}
              </option>
            </select>
          </div>
        </div>

        <!-- "Set A" Title -->
        <div class="text-success fw-bold fs-3 text-center mt-2">Set A</div>
        
        <!-- Table Section -->
        <div class="card mt-2">
          <div class="card-body">
            <!-- Top Controls --> 
            <div class="d-flex justify-content-between align-items-center mb-3 no-print">
              <!-- Add College Button -->
              <button class="btn btn-success btn-lg fw-bold px-4 py-2 no-print" @click="openModal">
                <i class="fas fa-file-signature"></i> Add College/Office
              </button>

              <!-- Entries Dropdown -->
              <div class="d-flex align-items-center">
                <label for="entries" class="me-2">Show</label>
                <select id="entries" class="form-select w-auto rounded" v-model="entriesPerPage">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
                <label for="entries" class="ms-2">entries</label>
              </div>
            </div>

            <!-- Data Table -->
            <div class="datatable text-center table-responsive">
              <table class="table table-bordered table-hover sticky-table" width="100%" cellspacing="0">
                <thead>
                  <tr class="custom-header-bg">
                    <th class="py-3 text-center fw-bold fs-6 border-bottom border-2">Colleges</th>
                    <th v-for="month in months" :key="month" class="py-3 text-center fw-bold fs-6 border-bottom border-2">{{ month }}</th>
                    <th class="py-3 text-center fw-bold fs-6 border-bottom border-2 no-print">Actions</th> 
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="plan in isPrinting ? maintenancePlans : paginatedPlans" :key="plan.PlanId">
                    <td>{{ plan.OffName ?? 'N/A' }}</td>
                    <td v-for="month in months" :key="month">
                      <!-- Show input box only when not printing -->
                      <div class="position-relative">
                        <input 
                          v-if="!isPrinting"
                          v-model="plan[month]"
                          @input="e => { 
                            // Convert to uppercase immediately for display
                            if (e.target.value) {
                              plan[month] = e.target.value.toUpperCase();
                            }
                          }" 
                          @keyup.enter="saveOnEnter(plan, month)" 
                          :disabled="plan.isSaving || !isInputAllowed(plan[month], plan, month) || isYearLocked(plan)"
                          class="form-control form-control-sm text-center text-uppercase fw-bold"
                          :class="{
                            'border-primary bg-light-blue text-primary': plan[month]?.toUpperCase() === 'A',
                            'border-success bg-light-green text-success': plan[month]?.toUpperCase() === 'SA',
                            'border-warning bg-light-yellow text-dark': plan[month]?.toUpperCase() === 'QA' || plan[month]?.toUpperCase() === 'M',
                          }"
                          style="width: 50px; margin: 0 auto; font-size: 14px;"
                        />
                        <!-- When printing, show just the value (uppercase) -->
                        <span v-if="isPrinting">{{ plan[month]?.toUpperCase() }}</span>
                      </div>
                    </td>
                    <td class="no-print text-center">
                      <div class="d-flex justify-content-center gap-2">
                        <!-- View Button -->
                        <Link 
                          :href="route('officeuser', { 
                            officeId: plan?.OffId, 
                            YrId: selectedYear, 
                            PlanId: plan?.PlanId, 
                            CatId: plan?.CatId
                          })"
                          class="btn btn-sm btn-outline-primary d-flex align-items-center">
                          <i class="fas fa-eye me-1"></i> View
                        </Link>
                        <!-- Delete Button -->
                        <button 
                          class="btn btn-sm btn-outline-danger d-flex align-items-center" 
                          @click="detachPlan(plan.PlanId)">
                          <i class="fas fa-unlink me-1"></i> Detach
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Pagination -->
              <div class="d-flex justify-content-between align-items-center mt-3 no-print">
                <div class="dataTables_paginate paging_simple_numbers" id="dataTable_paginate">
                  <ul class="pagination justify-content-end">
                    <!-- Previous Button -->
                    <li class="paginate_button page-item previous" :class="{'disabled': currentPage === 1}">
                      <a href="#" @click.prevent="prevPage" class="page-link">Previous</a>
                    </li>

                    <!-- Page Numbers -->
                    <li class="paginate_button page-item" v-for="page in totalPages" :key="page">
                      <a 
                        href="#" 
                        @click.prevent="goToPage(page)" 
                        :class="{'active': currentPage === page}" 
                        class="page-link">
                        {{ page }}
                      </a>
                    </li>

                    <!-- Next Button -->
                    <li class="paginate_button page-item next" :class="{'disabled': currentPage === totalPages}">
                      <a href="#" @click.prevent="nextPage" class="page-link">Next</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add College Modal -->
      <div class="modal fade" id="addCollegeModal" aria-labelledby="exampleModalLabel" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add College</h5>
              <!-- Close button -->
              <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
              <!-- Year Dropdown -->
              <div class="mb-3">
                <label for="yearDropdown" class="form-label">Select Year:</label>
                <select id="yearDropdown" v-model="selectedYear" class="form-control">
                  <option v-for="year in years" :key="year.YrId" :value="year.YrId">{{ year.Name }}</option>
                </select>
              </div>

              <!-- Office Name Dropdown -->
              <div class="mb-3">
                <label for="officeDropdown" class="form-label">Select Office:</label>
                <select id="officeDropdown" v-model="selectedOffice" class="form-control">
                  <option v-for="office in offices" :key="office.OffId" :value="office.OffId">
                    {{ office.OfficeName }}
                  </option>
                </select>
              </div>
            </div>

            <div class="modal-footer">
              <!-- Close Button to dismiss modal -->
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-success" data-dismiss="modal" @click="addOffice">Save</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </MainLayout>
</template>

<style scoped>
.table-container {
  max-width: 80%;
  margin: auto;
  overflow-x: auto;
}

input {
  width: 100%;
  border: 1px solid #ccc;
  padding: 5px;
}

button {
  cursor: pointer;
}

.no-print {
  display: block;
}

/* Print-specific styles */
@media print {
  /* Hide elements that shouldn't be printed */
  .no-print {
    display: none !important;
  }
  
  /* Ensure the table takes full width and breaks across pages properly */
  .table {
    width: 100% !important;
    page-break-inside: auto;
  }
  
  /* Allow rows to break across pages */
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  
  /* Style table to remove input boxes appearance */
  td {
    border: 1px solid #ddd !important;
    padding: 8px !important;
  }
  
  /* Remove background colors that might not print well */
  .table-success {
    background-color: #f2f2f2 !important;
    color: black !important;
  }
  
  /* Ensure text is black for better printing */
  body {
    color: black !important;
  }
  
  /* Remove any shadows or decorative elements */
  .shadow-sm, .card {
    box-shadow: none !important;
  }
  
  /* Make sure the Set A title is visible */
  .text-success.fw-bold.fs-3 {
    color: black !important;
    font-weight: bold !important;
  }
  
  /* Remove card styling but keep content */
  .card {
    border: none !important;
  }
  
  .card-body {
    padding: 0 !important;
  }
  
  /* Ensure the table is readable */
  .table-responsive {
    overflow-x: visible !important;
    white-space: normal !important;
  }

  .custom-header-bg {
    background-color: #f2f2f2 !important;
    color: black !important;
  }

  .sticky-table th:first-child,
  .sticky-table td:first-child {
    position: static;
    background-color: transparent !important;
    box-shadow: none;
  }
}

@media print {
  /* These styles ONLY apply during printing */
  .badge {
    background-color: transparent !important;
    color: black !important;
    padding: 0 !important;
    margin: 0 3px !important;
    border: none !important;
    box-shadow: none !important;
    font-weight: bold !important;
  }
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}

.badge-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  font-size: 1.1rem;
}

.badge {
  padding: 5px 15px;
  font-size: 1rem;
  border-radius: 25px;
}

.btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

input.text-uppercase {
  text-transform: uppercase;
}

/* Style to show that a field is being saved */
tr:has(span.saving-indicator) {
  background-color: rgba(0, 123, 255, 0.1);
}

/* Table fillable styles */
.bg-light-green {
  background-color: rgba(25, 135, 84, 0.1) !important;
}

.bg-light-blue {
  background-color: rgba(13, 110, 253, 0.1) !important;
}

.bg-light-yellow {
  background-color: rgba(255, 193, 7, 0.1) !important;
}

.custom-header-bg {
  background: linear-gradient(135deg, #198754, #146c43);
  color: white;
}

/* Make the first column sticky */
.sticky-table {
  position: relative;
}

.sticky-table th:first-child,
.sticky-table td:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
  background-color: white; /* Match your table background */
  box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.1); /* Optional: adds shadow for visual separation */
}

.sticky-table th:first-child {
  z-index: 3;
  background-color: #198754; /* Match your header gradient */
  color: white;
}
</style scoped>