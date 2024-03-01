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

    function getPropertyList()
    {
        return self::$_node->omni_listproperties();
    }

    function getDEX()
    {
        return self::$_node->omni_getactivedexsells();
    }

    function getProperty($property)
    {
        return self::$_node->omni_getproperty($property);
    }

    function getPropertyLocations($property)
    {
        return self::$_node->omni_getallbalancesforid($property);
    }

    function getPropertyNFTLocations($property)
    {
        return self::$_node->omni_getnonfungibletokenranges($property);
    }

    function getNFT($property, $token)
    {
        return self::$_node->omni_getnonfungibletokendata($property, $token, $token);
    }

    function addressBalances($address)
    {
        return self::$_node->omni_getallbalancesforaddress($address);
    }

    function addressNFTs($address)
    {
        return self::$_node->omni_getnonfungibletokens($address);
    }

    function payloadListDEX($RETURN, $txid, $property, $amount, $desire)
    {
        $paymentwindow = 21;
        $minacceptfee = "0.00000100";
        $action = 1;

        $payload = self::$_node->omni_createpayload_dexsell($property, $amount, $desire, $paymentwindow, $minacceptfee, $action);
        $modtxid = self::$_node->omni_createrawtx_opreturn($txid, $payload);

        if ($modtxid)
        {
            $RETURN->payload = $payload;
            $RETURN->txid = $modtxid;
            $RETURN->bool = true;
        }
        else
        {
            $RETURN->answer = "something went wrong";
            $RETURN->bool = false;
        }

        return $RETURN;
    }

    function payloadMintProperty($RETURN, $txid, $name, $category, $subcategory, $url, $data, $ecosystem, $tokentype, $fixed, $amount)
    {
        if ($tokentype == "indivisible")
        {
            $tokentype = 1;
        }

        if ($tokentype == "divisible")
        {
            $tokentype = 2;
        }

        if ($ecosystem == "main")
        {
            $ecosystem = 1;
        }

        if ($ecosystem == "test")
        {
            $ecosystem = 2;
        }

        $previd = 0;

        if ($fixed == "fixed")
        {
            if ($tokentype == "nft")
            {
                $RETURN->answer = "NFT Property need to be managed, not fixed";
                $RETURN->bool = false;

                return $RETURN;
            }
            else
            {
                $payload = self::$_node->omni_createpayload_issuancefixed($ecosystem, $tokentype, $previd, $category, $subcategory, $name, $url, $data, $amount);
                $modtxid = self::$_node->omni_createrawtx_multisig($txid, $payload, "M9gZJYf8MFSy3x7T7Puf3BkeTVL8wK2hVh", "M9gZJYf8MFSy3x7T7Puf3BkeTVL8wK2hVh");

                if ($modtxid)
                {
                    $RETURN->payload = $payload;
                    $RETURN->txid = $modtxid;
                    $RETURN->bool = true;
                }
                else
                {
                    $RETURN->answer = "something went wrong";
                    $RETURN->bool = false;
                }

                return $RETURN;
            }
        }

        if ($fixed == "managed")
        {
            var_dump("CREATE MANAGED PROPERTY");
        }

        // add crowdsale
    }

    function payloadSendNFT($RETURN, $txid, $property, $tokenstart, $tokenend)
    {
        $payload = self::$_node->omni_createpayload_sendnonfungible($property, $tokenstart, $tokenend);
        $modtxid = self::$_node->omni_createrawtx_opreturn($txid, $payload);

        if ($modtxid)
        {
            $RETURN->payload = $payload;
            $RETURN->txid = $modtxid;
            $RETURN->bool = true;
        }
        else
        {
            $RETURN->answer = "something went wrong";
            $RETURN->bool = false;
        }

        return $RETURN;
    }

    function payloadSendToken($RETURN, $txid, $property, $amount)
    {
        $payload = self::$_node->omni_createpayload_simplesend($property, $amount);
        $modtxid = self::$_node->omni_createrawtx_opreturn($txid, $payload);

        if ($modtxid)
        {
            $RETURN->payload = $payload;
            $RETURN->txid = $modtxid;
            $RETURN->bool = true;
        }
        else
        {
            $RETURN->answer = "something went wrong";
            $RETURN->bool = false;
        }

        return $RETURN;
    }

    function payloadDEXaccept($RETURN, $txid, $property, $amount)
    {
        $payload = self::$_node->omni_createpayload_dexaccept($property, $amount);
        $modtxid = self::$_node->omni_createrawtx_opreturn($txid, $payload);

        if ($modtxid)
        {
            $RETURN->payload = $payload;
            $RETURN->txid = $modtxid;
            $RETURN->bool = true;
        }
        else
        {
            $RETURN->answer = "something went wrong";
            $RETURN->bool = false;
        }

        return $RETURN;
    }

    function mempoolSubmit($RETURN, $txid)
    {
        $final = self::$_node->sendrawtransaction($txid);

        //var_dump($final);

        if ($final)
        {
            $RETURN->answer = "your raw transaction have been succesfully submited to the Litecoin mempool";
            $RETURN->bool = true;
            $RETURN->txid = $final;
        }
        else
        {
            $RETURN->answer = "Something went wrong";
            $RETURN->bool = false;
        }

        return $RETURN;
    }

    function inscriptions($RETURN, $page)
    {
        $curl = curl_init("http://192.168.0.100:80/inscriptions/" . $page);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Accept: application/json'));
        $response = curl_exec($curl);

        $RETURN->answer = "Here are the latest inscriptions.";
        $RETURN->bool = true;
        $RETURN->page = (int)$page;
        $RETURN->inscriptions = json_decode($response)->inscriptions;
        return $RETURN;
    }

    function inscriptionByNumber($RETURN, $number)
    {
        $curl = curl_init("http://192.168.0.100:80/inscription/" . $number);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Accept: application/json'));
        $response = curl_exec($curl);

        $RETURN->answer = "Here is the the inscription.";
        $RETURN->bool = true;
        $RETURN->inscription = json_decode($response);
        return $RETURN;
    }

    /*function TxStreetPending()
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
        }

        return $array;
    }*/
}