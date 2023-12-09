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
            self::$_node = new Node(self::$_rpc_user, self::$_rpc_pw, self::$_rpc_host, self::$_rpc_port);
		    self::$_node_dev = new Node_Dev(self::$_rpc_user, self::$_rpc_pw, self::$_rpc_host, self::$_rpc_port);
        }
        catch(PDOException $e)
        {
            echo "<br>OMNILITE ERROR<br>".$e;
            die();
        }
    }

    function test($address)
    {
        // get utxo of foreign address
        $content = file_get_contents("https://litecoinspace.org/api/address/" . $address . "/utxo");
        $content = json_decode($content);

        echo json_encode($content, JSON_PRETTY_PRINT);

        $input = (object)array();
        $input->list = array();
        $input->list[0] = array("txid"=>$content[0]->txid, "vout"=>$content[0]->vout);

        $output = array();
        $output[$address] = ($content[0]->value - 500) / 100000000;
        $output[$address] = number_format($output[$address], 8, ".", "");

        //$output["MU78ANEyiaAAjM4Z7HT8zTB3HWCzrXvM6i"] = "0.00005000";

        var_dump($input, $output);

        $rawtxid = self::$_node_dev->createrawtransaction($input->list, $output);
        var_dump($rawtxid);
    }
}