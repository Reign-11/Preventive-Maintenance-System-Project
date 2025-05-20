<?php
$mysqli = new mysqli("localhost", "root", "", "mydb");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$sql = "SELECT * FROM tbl_preventive_maintainance"; // Replace form_data with your actual table name
$result = $mysqli->query($sql);

if ($result->num_rows > 0) {
    echo "<table border='1'>";
    echo "<tr><th>ID</th><th>Name</th><th>Email</th></tr>"; // customize headers based on your table
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>".$row["id"]."</td>";
        echo "<td>".$row["name"]."</td>";
        echo "<td>".$row["email"]."</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "No data found.";
}

$mysqli->close();
?>
