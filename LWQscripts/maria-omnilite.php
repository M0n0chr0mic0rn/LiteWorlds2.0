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
	private static $_rpc_pw = 'pass';
	private static $_rpc_host = '192.168.0.100';
	private static $_rpc_port = '10370';
    private static $_rpc_wallet;
	private static $_node;
	private static $_node_dev;
    private static $_wallet_wizzard;
    
    function __construct($userdata)
    {
        try
        {
            self::$_rpc_wallet = "wallet/" . $userdata->User;
            self::$_db = new PDO("mysql:host=" . self::$_db_host . ";dbname=" . self::$_db_name, self::$_db_username, self::$_db_passwort);
            self::$_node = new Node(self::$_rpc_user, self::$_rpc_pw, self::$_rpc_host, self::$_rpc_port, self::$_rpc_wallet);
		    self::$_node_dev = new Node_Dev(self::$_rpc_user, self::$_rpc_pw, self::$_rpc_host, self::$_rpc_port, self::$_rpc_wallet);
            self::$_wallet_wizzard = new Node(self::$_rpc_user, self::$_rpc_pw, self::$_rpc_host, self::$_rpc_port);
        }
        catch (PDOException $e)
        {
            echo "<br>OMNILITE ERROR<br>".$e;
            die();
        }
    }

    function Wallet($RETURN)
    {
        $wallet = explode("/", self::$_rpc_wallet)[1];

        //check wallet is loaded
        if (!self::$_node->help())
        {
            // if not load wallet
            $a = self::$_wallet_wizzard->loadwallet($wallet);

            if (!$a)
            {
                // if wallet isnt present create it
                self::$_wallet_wizzard->createwallet($wallet);
            }

            self::Wallet($RETURN);
        }
        else
        {
            // wallet is loaded

            $RETURN->answer = "Wallet found";
            $RETURN->bool = true;
            $RETURN->addressgrouping = self::$_node->listaddressgroupings();

            return $RETURN;
        }
    }
}