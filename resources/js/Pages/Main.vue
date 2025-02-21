<script setup>
import { ref, onMounted } from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';

const selectedYear = ref(2024); // Initialize selectedYear
const entriesToShow = ref(10);

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

function loadScripts(fileList) {
    fileList.forEach(file => {
        if (!document.querySelector(`script[src="${file}"]`)) { // Prevent duplicate script loading
            let script = document.createElement("script");
            script.src = file;
            script.async = true;
            document.head.appendChild(script);
        }
    });
}

// Load scripts when component is mounted
onMounted(() => {
    loadScripts(files);
});
</script>

<template>
<MainLayout>
    <main>
        <div class="container mt-4">
            <!-- Header Section -->
            <div class="text-center">
                <h2 class="fw-bold">Preventive Maintenance System - {{ selectedYear }}</h2>

                <!-- Legend -->
                <div class="mt-2">
                    <strong>Legend:</strong>
                    <span class="badge bg-primary text-white">A</span> Annual
                    <span class="badge bg-success text-white">SA</span> Semi-Annual
                    <span class="badge bg-warning text-white">QA</span> Quarterly Annual
                    <span class="badge bg-warning text-white">M</span> Monthly
                </div>

                <div class="d-flex justify-content-center gap-3 mt-3">
                    <button class="btn btn-success"><i class="fas fa-save"></i> Save</button>
                    <button class="btn btn-secondary"><i class="fas fa-book"></i> Manual</button>
                    <button class="btn btn-warning"><i class="fas fa-lock"></i> Lock</button>
                </div>

                <!-- Year Selection -->
                <div class="mt-3">
                    <label for="yearSelect"><strong>Select Year:</strong></label>
                    <select id="yearSelect" v-model="selectedYear" class="form-select w-auto d-inline-block">
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                    </select>
                </div>
            </div>

            <!-- Table Section -->
            <div class="card mt-4">
                <div class="card-body">
                    <!-- Top Controls -->
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <!-- Set A Button -->
                        <button class="btn btn-success">
                            Set A <i class="fas fa-check"></i>
                        </button>

                        <!-- Show Entries Dropdown -->
                        <div>
                            <label>
                                Show 
                                <select v-model="entriesToShow" class="form-select form-select-sm d-inline-block w-auto">
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                </select>
                                entries
                            </label>
                        </div>
                    </div>

                    <!-- Table -->
                    <div class="datatable text-center">
                        <table class="table table-bordered table-hover" id="dataTable" width="100%" cellspacing="0">
                            <thead class="table-success">
                                <tr>
                                    <th>Colleges</th>
                                    <th>Jan</th>
                                    <th>Feb</th>
                                    <th>Mar</th>
                                    <th>Apr</th>
                                    <th>May</th>
                                    <th>Jun</th>
                                    <th>Jul</th>
                                    <th>Aug</th>
                                    <th>Sep</th>
                                    <th>Oct</th>
                                    <th>Nov</th>
                                    <th>Dec</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>College of Veterinary Medicine</td>
                                    <td></td><td>A</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                </tr>
                                <tr>
                                    <td>College of Agriculture</td>
                                    <td></td><td></td><td>A</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                </tr>
                                <tr>
                                    <td>College of Education</td>
                                    <td></td><td></td><td></td><td>A</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                </tr>
                                <tr>
                                    <td>College of Business and Management</td>
                                    <td></td><td></td><td></td><td></td><td>A</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                </tr>
                                <tr>
                                    <td>College of Forestry and Environmental Science</td>
                                    <td></td><td></td><td></td><td></td><td></td><td>A</td><td></td><td></td><td></td><td></td><td></td><td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Navigation Buttons -->
                    <div class="pagination-buttons">
                        <button class="btn btn-secondary btn-sm">
                            <i class="fas fa-arrow-left"></i> Previous
                        </button>
                        <button class="btn btn-primary btn-sm">
                            Next <i class="fas fa-arrow-right"></i>
                        </button>
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
}
.pagination-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
}
</style>
