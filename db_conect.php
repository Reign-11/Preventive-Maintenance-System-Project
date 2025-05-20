<?php
$mysqli = new mysqli("localhost", "root", "", "mydb");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}
?>
