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
    exit();
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

        // prepare the return object
        $RETURN = (object)array();

        // grep request IP
        $IP = $_SERVER["REMOTE_ADDR"];

        // Include the Libarys
        // COUNTER
        require_once("../LWQscripts/maria-counter.php");
        $COUNTER = new Counter;

        // USER
        require_once("../LWQscripts/maria-user.php");
        $USER = new User;

        // OMNILITE
        require_once("../LWQscripts/maria-omni.php");
        $OMNILITE = new Omnilite;

        // Call the header files
        include("../LWQscripts/public.php");
        include("../LWQscripts/user.php");
        include("../LWQscripts/omni.php");
    }
}