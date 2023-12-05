<?php
require_once("../LWQscripts/key.php");

class Omnilite
{
    private static $_db_username = "maria";
    private static $_db_passwort = "KerkerRocks22";
    private static $_db_host = "127.0.0.1";
    private static $_db_name = "API_litecoin";
    private static $_db;

    private static $_rpc_user = 'user';
	private static $_rpc_pw = 'pw';
	private static $_rpc_host = '192.168.0.100';
	private static $_rpc_port = '10370';
	private static $_node;
	private static $_node_dev;
    
    function __construct()
    {
        try
        {
            self::$_db = new PDO("mysql:host=" . self::$_db_host . ";dbname=" . self::$_db_name, self::$_db_username, self::$_db_passwort);
        }
        catch(PDOException $e)
        {
            echo "<br>DATABASE ERROR<br>".$e;
            die();
        }
    }
}