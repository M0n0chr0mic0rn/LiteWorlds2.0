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

    function TxStreetPending()
    {
        $mempool = self::getMempool();
        $array = array();
        $index = 0;

        $keys = array_keys($mempool);

        for ($a=0; $a < count($mempool); $a++)
        {
            $element = $mempool[$keys[$a]];
            $object = (object)array();

            $object->tx = $keys[$a];
            $object->lpb = (float)number_format(($element["fee"] / $element["size"]) * 100000000, 2);
            $object->s = $element["size"];
            $object->rs = $element["size"];
            $object->tot = (float)number_format(self::getTXtotal($keys[$a]), 5);
            $object->t = -1;
            $object->ia = $element["time"];

            $array[$a] = $object;

            if ($a == 0) {
                self::$_node->gettxout($$keys[$a], $index);
            }

            //echo json_encode($array);
            //var_dump($element);
        }

        return $array;

        /*foreach($mempool as $entry)
        {
            var_dump($entry);
            $object = (object)array();
            $object->tx = $entry[""]
            $array[$index] = $object;
        }*/
    }

    function getTXtotal($txid)
    {
        $loop = true;
        $index = 0;
        $total = 0;

        do
        {
            $entry = self::$_node->gettxout($txid, $index);

            if (!is_null($entry))
            {
                $total += $entry["value"];
                $index++;
            }
            else
            {
                $loop = false;
            }
        }
        while($loop);

        return $total;
    }
}