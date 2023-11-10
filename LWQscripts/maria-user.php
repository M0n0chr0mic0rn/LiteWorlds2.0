<?php
require_once("../LWQscripts/key.php");

class User {
    private static $_db_username = "maria";
    private static $_db_passwort = "KerkerRocks22";
    private static $_db_host = "127.0.0.1";
    private static $_db_name = "API_user";
    private static $_db;
    
    function __construct(){
        try{
            self::$_db = new PDO("mysql:host=" . self::$_db_host . ";dbname=" . self::$_db_name, self::$_db_username, self::$_db_passwort);
        }catch(PDOException $e){
            echo "<br>DATABASE ERROR<br>".$e;
            die();
        }
    }

    function hello($RETURN) {
        // The "Hello World" Example
        $RETURN->answer = "Hello World, I am a Litecoin-Node-API. How can I help U?";
        $RETURN->bool = true;
        $RETURN->ip = $_SERVER["REMOTE_ADDR"];

        // Get total amount of users
        $stmt = self::$_db->prepare("SELECT * FROM user");
        $stmt->execute();
        $RETURN->total_users = $stmt->rowCount();

        // The command lists
        $RETURN->commands = array(
            "public"=>"list public commands",
            "user"=>"list user commands",
            "omni"=>"list omni commands"
        );

        // List the working email providers
        // Select all Emails from the user table and store it in data
        $stmt = self::$_db->prepare("SELECT Mail FROM user");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Create new array
        $array = array();

        // Loop throw data and add every provider in a unique list
        for ($a=0; $a < count($data); $a++) {
            // Cut of the user from the Email
            $provider = explode("@", $data[$a]["Mail"])[1];

            // If provider is not present in the list add it
            if (array_search($provider, $array) === false) {
                $array[count($array)] = $provider;
            }
        }

        // attach the provider list to the RETURN object
        $RETURN->mailprovider = $array;

        return $RETURN;
    }
}