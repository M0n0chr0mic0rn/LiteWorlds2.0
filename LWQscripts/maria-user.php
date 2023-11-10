<?php
require_once("../LWQscripts/key.php");

class User {
    private static $_db_username = 'maria';
    private static $_db_passwort = 'KerkerRocks22';
    private static $_db_host = '127.0.0.1';
    private static $_db_name = 'API_user';
    private static $_db;
    
    function __construct(){
        try{
            self::$_db = new PDO('mysql:host=' . self::$_db_host . ';dbname=' . self::$_db_name, self::$_db_username, self::$_db_passwort);
        }catch(PDOException $e){
            echo '<br>DATABASE ERROR<br>'.$e;
            die();
        }
    }

    function hello($RETURN) {
        // The "Hello World" Example
        $RETURN->answer = 'Hello World, I am a Litecoin-Node-API. How can I help U?';
        $RETURN->bool = true;
        $RETURN->ip = $_SERVER['REMOTE_ADDR'];

        // Get total amount of users
        $stmt = self::$_db->prepare('SELECT * FROM user');
        $stmt->execute();
        $RETURN->total_users = $stmt->rowCount();

        // The command lists
        $RETURN->commands = array(
            'public'=>'list public commands',
            'user'=>'list user commands',
            'omni'=>'list omni commands'
        );

        // List the working email providers
        // TO DO: IMPROVE BY READOUT THE PROVIDERS FROM USER TABLE
        $stmt = self::$_db->prepare('SELECT * FROM mailprovider');
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        for ($a=0; $a < $stmt->rowCount(); $a++) { 
            $array[$a] = $data[$a]['Provider'];
        }
        $RETURN->mailprovider = $array;

        return $RETURN;
    }
}