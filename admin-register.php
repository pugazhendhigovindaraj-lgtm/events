<?php

include "config.php";

$college = $_POST['college'];
$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];

$sql = "INSERT INTO admins(college,name,email,password)
VALUES('$college','$name','$email','$password')";

if($conn->query($sql) === TRUE)
{
    header("Location: admin-login.html");
    exit();
}
else
{
    echo "Error: " . $conn->error;
}

$conn->close();

?>