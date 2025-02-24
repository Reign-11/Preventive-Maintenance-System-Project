<script setup>
import MainLayout from '@/Layouts/MainLayout.vue';
import { ref } from 'vue';

// Form Data
const formData = ref({
  userOperator: '',
  officeUnit: '',
  dateAcquired: '',
  equipmentInstalled: [],
  osInstalled: '',
  osLicense: '',
  softwareInstalled: [],
  desktopSpecs: {
    Processor: '',
    Motherboard: '',
    Memory: '',
    GraphicCard: '',
    UPS: '',
    HardDisk: '',
    OpticalDrive: '',
    Monitor: '',
    Casing: '',
    Printer: '',
    PowerSupply: '',
    Keyboard: '',
    Mouse: '',
    AVR: '',
    NetWorkMacIp: ''
  }
});

// Options for checkboxes
const equipmentOptions = ['CPU', 'Keyboard', 'Monitor', 'Mouse', 'Printer', 'UPS', 'AVR', 'Other'];
const osOptions = ['Windows 10', 'Windows 11', 'Other'];
const softwareOptions = ['Enrollment System', 'Adobe Reader', 'Word Processor', 'Media Player', 'Anti-Virus', 'Browser', 'Other'];

// Checklist Data
const checklist = ref([
  { item: 1, task: 'System Boot', description: 'Boot system from a cold start.Monitor for errors and speed of entire boot process.', status: '' },
  { item: 2, task: 'System Log-in', description: 'Monitor for Errors. Monitor login script.', status: '' },
  { item: 3, task: 'Network Settings', description: 'Monitor login script.\nTCP/IP and IPX settings are correct.\nDomain Name\nSecurity Settings\nClient Configurations\nComputer Name', status: '' },
  { item: 4, task: 'Computer Hardware Settings', description: 'Verify Device Manager settings\nBIOS up-to-date\nHard Disk\nDVD/CD-RW firmware up-to-date\nMemory is O.K.\nFor Laptop battery run-time is norm', status: '' },
  { item: 5, task: 'Browser/Proxy Settings', description: 'Verify proper settings and operation.', status: '' },
  { item: 6, task: 'Proper Software Loads', description: 'Required software is installed and operating.', status: '' },
  { item: 7, task: 'Viruses and Malware', description: 'Anti-virus installed\nVirus scan done', status: '' },
  { item: 8, task: 'Clearance', description: 'Unused software removed\nTemporary files removed\nRecycle bin and caches emptied\nPeripheral devices clean', status: '' },
  { item: 9, task: 'Interiors and Cleaning', description: 'Dust removed\nNo loose parts\nAirflow is O.K.\nCables unplugged and re-plugged\nFans are operating', status: '' },
  { item: 10, task: 'Peripheral Devices', description: 'Mouse\nKeyboard\nMonitor\nUPS\nPrinter\nTelephone extension\nFax', status: '' },
]);

// Modal state
const showModal = ref(false);

// Open modal function
const openModal = () => {
  showModal.value = true;
};

// Close modal function
const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <MainLayout>
    <div class="container mt-4 p-4 rounded shadow-sm bg-white">
      <h2 class="text-center fw-bold">Preventive Maintenance Checklist</h2>

      <!-- User & Date Info -->
      <div class="row mb-3">
        <div class="col-md-4">
          <label class="form-label">User/Operator</label>
          <input type="text" class="form-control" v-model="formData.userOperator" placeholder="Enter Name">
        </div>
        <div class="col-md-4">
          <label class="form-label">Office/College/Unit</label>
          <select class="form-select" v-model="formData.officeUnit">
            <option value="" disabled>Select</option>
            <option>IT Department</option>
            <option>Engineering</option>
            <option>Finance</option>
            <option>Other</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Date Acquired</label>
          <input type="date" class="form-control" v-model="formData.dateAcquired">
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
              >
              <label class="form-check-label">{{ option }}</label>
            </div>
            <!-- Show input field if "Other" is checked -->
            <input 
              v-if="option === 'Other' && formData.equipmentInstalled.includes('Other')" 
              type="text" 
              class="form-control mt-1" 
              v-model="formData.otherEquipment" 
              placeholder="Specify Other Equipment"
            >
          </div>
        </div>
      </div>

      <!-- Operating System Installed -->
      <div class="card p-3 mt-3">
        <h6 class="fw-bold">Operating System Installed:</h6>
        <div v-for="(option, index) in osOptions" :key="index" class="mb-2">
            <div class="form-check">
            <input 
                type="radio" 
                class="form-check-input" 
                :value="option" 
                v-model="formData.osInstalled"
            >
            <label class="form-check-label fw-bold">{{ option }}</label>
            </div> 

            <!-- Show input field only if "Other" is selected -->
            <div v-if="formData.osInstalled === 'Other' && option === 'Other'" class="ms-3">
            <input 
                type="text" 
                class="form-control mt-1" 
                v-model="formData.otherOS" 
                placeholder="Specify Other OS"
            >
            </div>

            <!-- License Status (Only for Windows 10 and 11) -->
            <div v-if="formData.osInstalled === option && option !== 'Other'" class="ms-3">
            <div class="form-check">
                <input type="radio" class="form-check-input" value="Licensed" v-model="formData.osLicense">
                <label class="form-check-label">Licensed</label>
            </div>
            <div class="form-check">
                <input type="radio" class="form-check-input" value="Not Licensed" v-model="formData.osLicense">
                <label class="form-check-label">Not Licensed</label>
            </div>
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
              >
              <label class="form-check-label">{{ option }}</label>
            </div>
            <!-- Show input field if "Other" is checked -->
            <input 
              v-if="option === 'Other' && formData.softwareInstalled.includes('Other')" 
              type="text" 
              class="form-control mt-1" 
              v-model="formData.otherSoftware" 
              placeholder="Specify Other Software"
            >
          </div>
        </div>
      </div>

      <!-- Desktop Specifications -->
      <div class="card p-3 mt-3">
        <h6 class="fw-bold">Desktop Specifications:</h6>
        <div class="row">
            <div v-for="(value, key) in formData.desktopSpecs" :key="key" class="col-md-2">
            <label class="form-label">{{ key.replace(/([A-Z])/g, ' $1') }}</label>
            <input type="text" class="form-control" v-model="formData.desktopSpecs[key]" placeholder="Enter">
            </div>
        </div>
        </div>

      <!-- Next Button -->
      <div class="text-center mt-4">
          <button class="btn btn-success" @click="openModal" type="button">
              <i class="fas fa-arrow-right"></i> Next
          </button>
      </div>

        <!-- Modal -->
        <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
            <h4 class="fw-bold text-center">Preventive Maintenance Checklist</h4>
            
            <table class="table table-bordered mt-3">
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
                <template v-for="(check, index) in checklist" :key="index">
                <tr v-for="(desc, i) in check.description.split('\n')" :key="index + '-' + i">
                    <!-- Show item and task only on the first row of each group -->
                    <td v-if="i === 0" :rowspan="check.description.split('\n').length">{{ check.item }}</td>
                    <td v-if="i === 0" :rowspan="check.description.split('\n').length">{{ check.task }}</td>

                    <!-- Description -->
                    <td>{{ desc }}</td>

                    <!-- Radio Buttons -->
                    <td class="text-center">
                    <input type="radio" :name="'status-' + index + '-' + i" value="OK" v-model="check.status[i]">
                    </td>
                    <td class="text-center">
                    <input type="radio" :name="'status-' + index + '-' + i" value="Repair" v-model="check.status[i]">
                    </td>
                    <td class="text-center">
                    <input type="radio" :name="'status-' + index + '-' + i" value="N/A" v-model="check.status[i]">
                    </td>
                </tr>
                </template>
            </tbody>
            </table>


            <!-- <table class="table table-bordered mt-3">
            <thead class="table-light">
                <tr>
                <th>Item</th>
                <th>Task</th>
                <th>Description</th>
                <th>OK</th>
                <th>Repair</th>
                <th>N/A</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in checklist" :key="index">
                <td>{{ row.item }}</td>
                <td>{{ row.task }}</td>
                <td><pre class="m-0">{{ row.description }}</pre></td>
                <td>
                    <input type="radio" :name="'status-' + index" value="OK" v-model="row.status">
                </td>
                <td>
                    <input type="radio" :name="'status-' + index" value="Repair" v-model="row.status">
                </td>
                <td>
                    <input type="radio" :name="'status-' + index" value="N/A" v-model="row.status">
                </td>
                </tr>
            </tbody>
            </table> -->

            <!-- Save Button -->
            <div class="text-center mt-3">
                <button class="btn btn-success" @click="closeModal">
                    <i class="fas fa-save"></i> Save
                </button>
            </div>

        </div>
        </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.container {
  max-width: 90%;
  background: white;
}

.card {
  border-radius: 8px;
  border: 1px solid #ddd;
}

.form-check-label {
  font-weight: 500;
}

.btn {
  min-width: 120px;
}

/*Background Color */
.container {
  background: linear-gradient(to bottom, #d4f8c4, #b0f2a7); /* Same green */
  padding: 20px;
  border-radius: 10px;
}

/* Modal Styles */
/* .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
} */

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal Box */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-height: 80vh;
  overflow-y: auto;
}

/* Table Styling */
.table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

pre {
  white-space: pre-wrap;
  text-align: left;
  font-size: 14px;
}


</style>
