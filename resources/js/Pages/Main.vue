<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import MainLayout from '@/Layouts/MainLayout.vue';
import axios from "axios";

//  Reactive properties
const years = ref([]);
const selectedYear = ref(new Date().getFullYear());
const maintenancePlans = ref([]);
const selectedYearDescription = ref("");
const isFetchingData = ref(false);
const selectedYearName = ref("");
const offices = ref([]); // Store the list of offices for the dropdown
const selectedOffice= ref(null); //  Holds selected value
const selectedParentOffice = ref(null); // Define this to avoid ReferenceError
const addedOffices = ref([]); //  Fix: Declare addedOffices as a reactive array

//  External Scripts
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

//  Load external scripts dynamically
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

//  Open Modal
const openModal = () => {
  const modalElement = document.getElementById("addCollegeModal");
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }
};

//  Fetch offices for the dropdown
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

//  Fetch available years
const fetchYears = async () => {
  try {
    const response = await axios.get("/api/years");
    years.value = response.data;
  } catch (error) {
    console.error("Error fetching years:", error);
  }
};

//  Fetch maintenance plans
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

    maintenancePlans.value = response.data.map(plan => ({
      ...plan,
      JanuaryTemp: plan.January ?? "",
      FebruaryTemp: plan.February ?? "",
      MarchTemp: plan.March ?? "",
      AprilTemp: plan.April ?? "",
      MayTemp: plan.May ?? "",
      JuneTemp: plan.June ?? "",
      JulyTemp: plan.July ?? "",
      AugustTemp: plan.August ?? "",
      SeptemberTemp: plan.September ?? "",
      OctoberTemp: plan.October ?? "",
      NovemberTemp: plan.November ?? "",
      DecemberTemp: plan.December ?? "",
    }));
  } catch (error) {
    console.error("❌ Error fetching maintenance plans:", error);
    alert(error.response?.data?.message || "Failed to fetch data.");
  }

  isFetchingData.value = false;
};

const countOccurrences = (type) => {
  return maintenancePlans.value.reduce((count, plan) => {
    return count + Object.values(plan).filter(value => value === type).length;
  }, 0);
};


//  Computed properties to track limits
const countA = computed(() => countOccurrences('A'));
const countSA = computed(() => countOccurrences('SA'));
const countQA = computed(() => countOccurrences('QA'));
const countM = computed(() => countOccurrences('M'));

// Function to check if input is allowed
const isInputAllowed = (type) => {
  if (type === 'A') return countA.value < 1;
  if (type === 'SA') return countSA.value < 2;
  if (type === 'QA') return countQA.value < 4;
  if (type === 'M') return countM.value < 12;
  return true;
};

// Function to ensure input restrictions
const handleInput = (plan, month) => {
  if (plan[month] !== null && plan[month] !== "") {
    plan[`${month}Temp`] = plan[month];
  }
};

const saveOnEnter = async (plan) => {
  try {
    console.log(`🔹 Saving Plan ID: ${plan?.PlanId} for ${selectedYear.value}`);

    await nextTick(); // Ensure the DOM is updated

    if (!plan || typeof plan !== "object") {
      console.error("❌ Error: Plan is undefined or not an object!", { plan });
      alert("❌ Error: Plan data is missing.");
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

    months.forEach((month) => {
      payload[month] = plan[month] ?? null;
    });

    console.log("📩 Sending Data:", payload);

    const response = await axios.post("/api/save-maintenance-plan", payload);

    console.log(" Maintenance plan saved successfully", response.data);

    // Update the PlanId if it's newly created
    if (!plan.PlanId && response.data.PlanId) {
      plan.PlanId = response.data.PlanId;
      console.log("🔄 Plan ID updated:", plan.PlanId);
    }

  } catch (error) {
    console.error("❌ Error in saveOnEnter:", error);
    alert(error.response?.data?.error || "Failed to save data.");
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
    ParentOffId: selectedParentOffice?.value || null, //  Ensure defined
    YrId: selectedYear.value,
  };

  console.log("📡 Sending request:", requestData);

  try {
    const response = await axios.post("/api/add-colleges", requestData);
    console.log(" Response received:", response.data);

    alert("Office added successfully!");

    //  Add office to prevent duplicates
    addedOffices.value.push(selectedOffice.value);
    
    //  Remove added office from dropdown
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

//  Watcher for updates
watch(maintenancePlans, (newValue) => {
  if (isFetchingData.value || !selectedYear.value || !newValue.length) return;

  newValue.forEach(plan => {
    Object.keys(plan).forEach(month => {
      if (month.endsWith("Temp")) {
        if (plan[month.replace("Temp", "")]) {
          plan[`${month.replace("Temp", "")}Readonly`] = true;
        }
      }
    });
  });
}, { deep: true });


//  Watcher for real-time updates (but skip if fetching data)
watch(maintenancePlans, (newValue) => {
  if (isFetchingData.value || !selectedYear.value || !newValue.length) return;

  newValue.forEach(plan => {
    Object.keys(plan).forEach(month => {
      if (["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].includes(month)) {
        if (plan[month]) {
          plan[`${month}Readonly`] = true;
        }
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

//On component mount
onMounted(async () => {
    await fetchOffices()
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
  window.print();
};

const deleteOffice = async (planId) => {
  if (!planId) {
    alert("Invalid Office ID.");
    return;
  }

  if (!confirm("Are you sure you want to delete this office?")) {
    return;
  }

  try {
    console.log(`🗑 Deleting Office with Plan ID: ${planId}`);

    // Make DELETE request to API
    await axios.delete(`/api/delete-maintenance-plan/${planId}`);

    //  Filter out deleted plan from `maintenancePlans`
    maintenancePlans.value = maintenancePlans.value.filter(plan => plan.PlanId !== planId);

    console.log(" Office deleted successfully.");
    alert("Office deleted successfully!");
  } catch (error) {
    console.error(" Error deleting office:", error);
    alert(error.response?.data?.message || "Failed to delete office.");
  }
};

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

          <div class="d-flex justify-content-center gap-3 mt-3 no-print">
            <button class="btn btn-success"><i class="fas fa-save"></i> Save</button>
            <button class="btn btn-warning"><i class="fas fa-lock"></i> Lock</button>
            <button class="btn btn-info" @click="printTable">
              <i class="fas fa-print"></i> Print
            </button>
          </div>

          <!-- Year Selection -->
          <div>
            <label for="year">Select Year:</label>
            <select v-model="selectedYear">
              <option v-for="year in years" :key="year.YrId" :value="year.YrId">
                {{ year.Name }}
              </option>
            </select>
          </div>
        </div>

        <!-- "Set A" Title -->
        <div class="text-success fw-bold fs-3 text-center mt-4">Set A</div>

        <!-- Table Section -->
        <div class="card mt-4">
          <div class="card-body">
            <!-- Top Controls -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <!-- Add College Button -->
              <button class="btn btn-success btn-lg fw-bold px-4 py-2 no-print" @click="openModal">
                <i class="fas fa-file-signature"></i> Add College/Office
              </button>
            </div>

        <!-- Data Table -->
        <div class="datatable text-center">
          <table class="table table-bordered table-hover" width="100%" cellspacing="0">
            <thead class="table-success">
              <tr>
                <th>Colleges</th>
                <th v-for="month in months" :key="month">{{ month }}</th>
                <th class="no-print">Actions</th>  <!-- Added Actions Column -->
              </tr>
            </thead>
            <tbody>
            <tr v-for="plan in maintenancePlans" :key="plan.PlanId">
              <td>{{ plan.OffName ?? 'N/A' }}</td>
              <td v-for="month in months" :key="month">
                <input 
                  v-model="plan[month]" 
                  @keyup.enter="saveOnEnter(plan, month)" 
                  :disabled="plan.isSaving || !isInputAllowed(plan[month])"
                />
                <span v-if="plan.isSaving">Saving...</span>
              </td>
              <td class="no-print text-center">
              <div class="d-flex justify-content-center gap-2">
              <!-- View Button -->

              <a v-if="plan.OffId" :href="route('office-user', { officeId: plan.OffId })"
                class="btn btn-sm btn-outline-primary d-flex align-items-center">
                <i class="fas fa-eye me-1"></i> View
              </a>
              


                <!-- Delete Button -->
                <button class="btn btn-sm btn-outline-danger d-flex align-items-center" @click="deleteOffice(plan.PlanId)">
                  <i class="fas fa-trash me-1"></i> Delete
                </button>
              </div>
            </td>
            </tr>
          </tbody>
          </table>
        </div>
        
         </div>
        </div>
      </div>

      <!-- Bootstrap Modal -->
      <div class="modal fade" id="addCollegeModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <label for="yearDropdown">Select Year:</label>
              <select id="yearDropdown" v-model="selectedYear" class="form-control">
                <option v-for="year in years" :key="year.YrId" :value="year.YrId">{{ year.Name }}</option>
              </select>

              <!-- Office Name Dropdown -->
              <label for="officeDropdown">Select Office:</label>
              <select id="officeDropdown" v-model="selectedOffice" class="form-control">
                <option v-for="office in offices" :key="office.OffId" :value="office.OffId">
                  {{ office.OfficeName }}
                </option>
              </select>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-success" @click="addOffice">Save</button>
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

@media print {
    a {
        text-decoration: none !important;
        color: black;
        pointer-events: none;
    }
}

</style>


