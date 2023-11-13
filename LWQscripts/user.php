<?php
if ($_GET["method"] == "user")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // create the RETURN object
    $RETURN->answer = "Here are the public commands.";
    $RETURN->bool = true;
    $RETURN->commands = array("user-register"=>"Prepares a register action");

    // print the RETURN as JSON
    echo json_encode($RETURN, JSON_PRETTY_PRINT);
    die();
}

if ($_GET["method"] == "user-register")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // check all parameters are given
    if (isset($_GET["user"]))
    {
        if (isset($_GET["pass"]))
        {
            if (isset($_GET["mail"]))
            {
                // run the register function
                echo json_encode($USER->register($RETURN, $_GET["user"], $_GET["pass"], $_GET["mail"], $IP));
            }
            else
            {
                $RETURN->answer = "Parameter \"mail\" is missing";
                $RETURN->bool = false;
        
                echo json_encode($RETURN, JSON_PRETTY_PRINT);
            }
        }
        else
        {
            $RETURN->answer = "Parameter \"pass\" is missing";
            $RETURN->bool = false;
        
            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        $RETURN->answer = "Parameter \"user\" is missing";
        $RETURN->bool = false;
        
        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "user-execute")
{
    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["action"]) && isset($_GET["copper"]) && isset($_GET["jade"]) && isset($_GET["crystal"]))
    {
        echo $USER->execute($_GET["action"], $_GET["copper"], $_GET["jade"], $_GET["crystal"], $IP);
    }
    die();
}