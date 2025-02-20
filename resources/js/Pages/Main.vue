<script setup>
import MainLayout from '@/Layouts/MainLayout.vue';

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
        let script = document.createElement("script");
        script.src = file;
        script.async = true;
        document.head.appendChild(script);
    });
}

// Load JS scripts
loadScripts(files);
</script>
<template>


<MainLayout>


<body>
    <main>
        <div class="container">
            <!-- Header Section -->
            <div class="page-header-content pt-4 text-center">
                <h2 class="fw-bold">Preventive Maintenance System</h2>
                <div class="d-flex justify-content-center gap-3 mt-3">
                    <button class="btn btn-success"><i class="fas fa-save"></i> Save</button>
                    <button class="btn btn-secondary"><i class="fas fa-book"></i> Manual</button>
                    <button class="btn btn-warning"><i class="fas fa-lock"></i> Lock</button>
                </div>

                <!-- Year Dropdown -->
                <div class="mt-3">
                    <label for="yearSelect"><strong>Select Year:</strong></label>
                    <select id="yearSelect" class="form-select w-auto d-inline-block">
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                    </select>
                </div>

                <!-- Legend -->
                <div class="mt-3">
                    <strong>Legend:</strong>
                    <span class="badge bg-primary">A</span> Annual
                    <span class="badge bg-success">SA</span> Semi-Annual
                    <span class="badge bg-warning">QA</span> Quarterly Annual
                    <span class="badge bg-danger">M</span> Monthly
                </div>
            </div>
        </div>

        <!-- Main Table Content -->
        <div class="container mt-4">
            <div class="card mb-4 table-container">
                <div class="card-body">
                    <!-- Filter dropdown -->
                    <div class="d-flex justify-content-between mb-3">
                        <label>
                            Show 
                            <select id="filterSelect" class="form-select form-select-sm d-inline-block w-auto">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                            </select>
                            entries
                        </label>
                    </div>

                    <!-- Table -->
                    <div class="datatable text-center">
                        <table class="table table-bordered table-hover" id="dataTable" width="100%" cellspacing="0">
                            <thead class="table-dark">
                                <tr>
                                    <th>College</th>
                                    <th>January2</th>
                                    <th>February2</th>
                                    <th>March2</th>
                                    <th>April</th>
                                    <th>May</th>
                                    <th>June</th>
                                    <th>July</th>
                                    <th>August</th>
                                    <th>September</th>
                                    <th>October</th>
                                    <th>November</th>
                                    <th>December</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Agriculture</td>
                                    <td>A</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                </tr>
                                <tr>
                                    <td>College B</td>
                                    <td></td><td></td><td></td><td>A</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                </tr>
                                <tr>
                                    <td>College C</td>
                                    <td></td><td></td><td></td><td>SA</td><td></td><td></td><td></td><td>SA</td><td></td><td></td><td></td><td></td>
                                </tr>
                                <tr>
                                    <td>College D</td>
                                    <td>QA</td><td></td><td></td><td></td><td>QA</td><td></td><td></td><td></td><td>QA</td><td></td><td>QA</td><td></td>
                                </tr>
                                <tr>
                                    <td>College E</td>
                                    <td>M</td><td>M</td><td>M</td><td>M</td><td>M</td><td>M</td><td>M</td><td>M</td><td>M</td><td>M</td><td>M</td><td>M</td>
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

</body>

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