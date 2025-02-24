<script setup>
import { ref, onMounted } from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';

const selectedYear = ref(2024);
const entriesToShow = ref(10);

// Define reactive table data
const tableData = ref([
    { college: "College of Veterinary Medicine", months: ["", "A", "", "", "", "", "", "", "", "", "", ""] },
    { college: "College of Agriculture", months: ["", "", "A", "", "", "", "", "", "", "", "", ""] },
    { college: "College of Education", months: ["", "", "", "A", "", "", "", "", "", "", "", ""] },
    { college: "College of Business and Management", months: ["", "", "", "", "A", "", "", "", "", "", "", ""] },
    { college: "College of Forestry and Environmental Science", months: ["", "", "", "", "", "A", "", "", "", "", "", ""] }
]);

const printTable = () => {
    window.print();
};

// Modal state
const newCollegeName = ref("");
let modalInstance = null;

// Open Modal
const openModal = () => {
    modalInstance = new bootstrap.Modal(document.getElementById('addCollegeModal'));
    modalInstance.show();
};

// Close Modal
const closeModal = () => {
    modalInstance.hide();
};

// Add College
const addCollege = () => {
    if (newCollegeName.value.trim() === "") return;

    tableData.value.push({
        college: newCollegeName.value,
        months: Array(12).fill("")
    });

    newCollegeName.value = "";
    closeModal();
};

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

                <div class="d-flex justify-content-center gap-3 mt-3 no-print">
                    <button class="btn btn-success"><i class="fas fa-save"></i> Save</button>
                    <button class="btn btn-secondary"><i class="fas fa-book"></i> Manual</button>
                    <button class="btn btn-warning"><i class="fas fa-lock"></i> Lock</button>
                    <button class="btn btn-info" @click="printTable">
                        <i class="fas fa-print"></i> Print
                    </button>
                </div>

                <!-- Year Selection -->
                <div class="mt-3 no-print">
                    <label for="yearSelect"><strong>Select Year:</strong></label>
                    <select id="yearSelect" v-model="selectedYear" class="form-select w-auto d-inline-block">
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
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
                            <i class="fas fa-file-signature"></i> Add College
                        </button>

                        <!-- Show Entries Dropdown -->
                        <div class="no-print">
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
                        <table class="table table-bordered table-hover" width="100%" cellspacing="0">
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
                                <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
                                    <td>{{ row.college }}</td>
                                    <td v-for="(value, monthIndex) in row.months" :key="monthIndex">
                                        <span class="print-only">{{ value }}</span>
                                        <input 
                                            type="text" 
                                            v-model="tableData[rowIndex].months[monthIndex]" 
                                            class="form-control text-center no-print"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Navigation Buttons -->
                    <div class="pagination-buttons no-print">
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

        <!-- Add College Modal -->
        <div class="modal fade" id="addCollegeModal" tabindex="-1" aria-hidden="true" ref="modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add College</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <label for="collegeName">College Name:</label>
                        <input type="text" id="collegeName" v-model="newCollegeName" class="form-control" placeholder="Enter college name">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" @click="closeModal">Close</button>
                        <button type="button" class="btn btn-success" @click="addCollege">Save</button>
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

@media print {
    .no-print {
        display: none !important;
    }
    .print-only {
        display: inline !important;
    }
}

.print-only {
    display: none;
}
</style>
