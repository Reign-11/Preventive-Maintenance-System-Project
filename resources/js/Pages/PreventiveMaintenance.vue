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

      <!-- Save Button -->
      <div class="text-center mt-4">
        <button class="btn btn-success"><i class="fas fa-save"></i> Save</button>

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

</style>
