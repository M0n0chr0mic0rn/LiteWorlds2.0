<?php

if ($_GET["method"] == "hello") {
    // set Content Type to JSON
    header('Content-type: application/json; charset=utf-8');

    // increase the method counter
    $COUNTER->increase($_GET['method']);

    // call the hello function from the User Class
    echo json_encode($USER->hello($RETURN), JSON_PRETTY_PRINT);
}