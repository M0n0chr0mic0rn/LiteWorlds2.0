<?php
/*
LiteWorlds2.0
The redefined and fully commented Version

The Folder LWQwebroot is the access-point for the webserver, it should point to index.php (this file)
The Folder LWQscripts contains access data for the Database and the Litecoin Node, that is why it is outside of the LWQwebroot!
This is very important for using a VPS!
Also be sure to whitelist the Server IP on the Litecoin Node if you run it on a seperated device, otherwise whitelist localhost
*/

// first we check the parameter "method" is set
if (!isset($_GET["method"])) 
{
    // if not we call the website
    include("./index.html");
    die();
} 
else 
{
    // if "method" is set we go into API section
    if ($_GET["method"] == "help") 
    {
        // Include a help page here
    } 
    else 
    {
        // Allow Cross Origin
        header("Access-Control-Allow-Origin:*");

        // prepare the RETURN object
        // the RETURN object will be lead tthrow the whole process and is in the end the final JSON output
        // (immitate a call by referece function)
        $RETURN = (object)array();

        // grep request IP
        $IP = $_SERVER["REMOTE_ADDR"];

        // AuthKey Security
        if (isset($_GET["authkey"]))
        {
            if (!is_null($_GET["authkey"]))
            {
                if ($_GET["authkey"] === preg_replace( "/[^a-zA-Z0-9]/", "", $_GET["authkey"]))
                {
                    // define AUTHKEY
                    $AUTHKEY = $_GET["authkey"];
                }
                else
                {
                    $RETURN->answer = "Parameter \"authkey\" cant contain special characters";
                    $RETURN->bool = false;

                    // set Content Type to JSON
                    header("Content-type: application/json; charset=utf-8");

                    echo json_encode($RETURN, JSON_PRETTY_PRINT);
                    die();
                }
            }
            else
            {
                $RETURN->answer = "Parameter \"authkey\" cant be NULL";
                $RETURN->bool = false;

                // set Content Type to JSON
                header("Content-type: application/json; charset=utf-8");

                echo json_encode($RETURN, JSON_PRETTY_PRINT);
                die();
            }
        }

        // Include the Libarys
        // COUNTER
        require_once("../LWQscripts/maria-counter.php");
        $COUNTER = new Counter;

        // PUBLIC
        require_once("../LWQscripts/node-data.php");
        $PUBLIC = new NodeData;

        // USER
        require_once("../LWQscripts/maria-user.php");
        $USER = new User;

        // OMNILITE
        require_once("../LWQscripts/maria-omnilite.php");
        $OMNILITE = new Omnilite;

        // Call the header files
        include("../LWQscripts/public.php");
        include("../LWQscripts/user.php");
        include("../LWQscripts/omnilite.php");
    }
}