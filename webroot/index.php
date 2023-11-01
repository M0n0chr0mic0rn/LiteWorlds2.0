<?php
/*
LiteWorlds2.0
The redefined and fully commented Version

The Folder webroot is the access-point for the webserver, it should point to index.php (this file)
The Folder scripts contains access data for the Database and the Litecoin Node, that's why it is outside of the webroot!
Also be sure to whitelist the Server IP on the Litecoin Node if you run it on a seperated device, otherwise whitelist localhost
*/

// first we check the parameter "method" is set
if (!isset($_GET["method"])) {
    // if not we call the website
    include("./index.html");
    exit();
} else {
    // if "method" is set we go into API section
    if ($_GET["method"] == "help") {
        // Include a help page here
    } else {
        // Allow Cross Origin
        header('Access-Control-Allow-Origin:*');

        // prepare the return object
        $return = (object)array();

        // Include the Libarys
        // USER
        require_once("../scripts/maria-user.php");
        $USER = new User;

        // OMNILITE
        require_once("../scripts/maria-omni.php");
        $OMNI = new Omni;


        // Call the header files
        include("../scripts/public.php");
        include("../scripts/user.php");
        include("../scripts/omni.php");
    }
}