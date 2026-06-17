<?php

include "config.php";

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT * FROM admins
        WHERE email='$email'
        AND password='$password'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {

    header("Location: admin.html");
    exit();

} else {

    echo "<h2>Invalid Email or Password</h2>";

}

?>