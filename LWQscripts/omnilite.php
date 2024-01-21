<?php
if ($_GET["method"] == "omnilite")
{
    # code...
}

if ($_GET["method"] == "omnilite-get")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    echo json_encode($OMNILITE->Wallet($RETURN), JSON_PRETTY_PRINT);
}