<?php

$conn = new mysqli(
    "localhost",
    "root",
    "",
    "campus_events"
);

if($conn->connect_error){
    die("Connection Failed");
}

?>