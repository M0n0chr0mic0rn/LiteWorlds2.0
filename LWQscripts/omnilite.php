<?php
if ($_GET["method"] == "omnilite")
{
    # code...
}

if ($_GET["method"] == "omnilite-test")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    if (isset($_GET["address"]))
    {
        $OMNILITE->test($_GET["address"]);
    }
    else
    {
        $RETURN->answer = "Parameter 'address' is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
}