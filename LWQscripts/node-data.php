<?php

require_once("../LWQscripts/node.php");
require_once("../LWQscripts/node-dev.php");

class NodeData
{
    private static $_rpc_user = "user";
	private static $_rpc_pw = "password";
	private static $_rpc_host = "192.168.0.165";
	private static $_rpc_port = "10000";
	private static $_node;
	private static $_node_dev;
    
    function __construct()
    {
        try
        {
            self::$_node = new Node(self::$_rpc_user, self::$_rpc_pw, self::$_rpc_host, self::$_rpc_port);
		    self::$_node_dev = new Node_Dev(self::$_rpc_user, self::$_rpc_pw, self::$_rpc_host, self::$_rpc_port);
        }
        catch(PDOException $e)
        {
            var_dump($e);
            die();
        }
    }

    function getBlock($blockhash)
    {
        return self::$_node->getblock($blockhash, 2);
    }

    function getMempool()
    {
        return self::$_node->getrawmempool(true);
    }

    function getMempoolEntry($txid)
    {
        return self::$_node->getmempoolentry($txid);
    }

    function getTransaction($txid)
    {
        return self::$_node->gettransaction($txid);
    }
}