<?php
if ($_GET["method"] == "public")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // create the RETURN object
    $RETURN->answer = "Here are the public commands.";
    $RETURN->bool = true;
    $RETURN->commands = array(
        "public-hello"=>"Display the Hello World Example",
        "public-get-block"=>"Get block by blockhash",
        "public-get-mempool"=>"Get the actual mempool data",
        "public-get-mempool-entry"=>"Get a specific transaction from mempool by txid",
        "public-get-propertylist"=>"Get a all omnilite properies",
        "public-get-property"=>"Get a specific omnilite properies by propertyID",
        "public-get-property-locations"=>"Get a list of all NFT origins for this property by propertyID",
        "public-get-nft"=>"Get the NFT data by propertyID and tokenID"
    );

    // print the RETURN as JSON
    echo json_encode($RETURN, JSON_PRETTY_PRINT);

    die();
}

if ($_GET["method"] == "hello" || $_GET["method"] == "public-hello")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // call the hello function from the User class and print it as JSON
    echo json_encode($USER->hello($RETURN, $IP), JSON_PRETTY_PRINT);

    die();
}

if ($_GET["method"] == "public-get-block")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["blockhash"]))
    {
        // call the getBlock function from the Public class and print it as JSON
        echo json_encode($PUBLIC->getBlock($_GET["blockhash"]), JSON_PRETTY_PRINT);
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"blockhash\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "public-get-mempool")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // call the getMempool function from the Public class and print it as JSON
    echo json_encode($PUBLIC->getMempool(), JSON_PRETTY_PRINT);

    die();
}

if ($_GET["method"] == "public-get-mempool-entry")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["txid"]))
    {
        // call the getMempool function from the Public class and print it as JSON
        echo json_encode($PUBLIC->getMempoolEntry($_GET["txid"]), JSON_PRETTY_PRINT);
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"txid\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "public-get-propertylist")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    echo json_encode($PUBLIC->getPropertyList(), JSON_PRETTY_PRINT);

    die();
}

if ($_GET["method"] == "public-get-dex")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    echo json_encode($PUBLIC->getDEX(), JSON_PRETTY_PRINT);

    die();
}

if ($_GET["method"] == "public-get-property")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["property"]))
    {
        echo json_encode($PUBLIC->getProperty((int)$_GET["property"]), JSON_PRETTY_PRINT);
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"property\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "public-get-property-locations")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["property"]))
    {
        $result = $PUBLIC->getPropertyNFTLocations((int)$_GET["property"]);
        if ($result !== false)
        {
            echo json_encode($result, JSON_PRETTY_PRINT);
        }
        else
        {
            echo json_encode($PUBLIC->getPropertyLocations((int)$_GET["property"]), JSON_PRETTY_PRINT);
        }
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"property\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "public-get-nft")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["property"]))
    {
        if (isset($_GET["token"]))
        {
            $result = $PUBLIC->getNFT((int)$_GET["property"], (int)$_GET["token"], (int)$_GET["token"]);
            if ($result !== false)
            {
                echo json_encode($result, JSON_PRETTY_PRINT);
            }
            else
            {
                // prepare and print fail message as JSON
                $RETURN->answer = "This property isnt a NFT property";
                $RETURN->bool = false;

                echo json_encode($RETURN, JSON_PRETTY_PRINT);
            }
        }
        else
        {
            // prepare and print fail message as JSON
            $RETURN->answer = "Parameter \"token\" is missing";
            $RETURN->bool = false;

            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"property\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "public-address-balances")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["address"]))
    {
        echo json_encode($PUBLIC->addressBalances($_GET["address"]), JSON_PRETTY_PRINT);
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"address\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "public-address-nft")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["address"]))
    {
        echo json_encode($PUBLIC->addressNFTs($_GET["address"]), JSON_PRETTY_PRINT);
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"address\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "public-payload-listdex")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["txid"]))
    {
        if (isset($_GET["property"]))
        {
            if (isset($_GET["amount"]))
            {
                if (isset($_GET["desire"]))
                {
                    echo json_encode($PUBLIC->payloadListDEX($RETURN, $_GET["txid"], (int)$_GET["property"], $_GET["amount"], $_GET["desire"]), JSON_PRETTY_PRINT);
                }
                else
                {
                    // prepare and print fail message as JSON
                    $RETURN->answer = "Parameter \"desire\" is missing";
                    $RETURN->bool = false;
    
                    echo json_encode($RETURN, JSON_PRETTY_PRINT);
                }
            }
            else
            {
                // prepare and print fail message as JSON
                $RETURN->answer = "Parameter \"amount\" is missing";
                $RETURN->bool = false;
    
                echo json_encode($RETURN, JSON_PRETTY_PRINT);
            }
        }
        else
        {
            // prepare and print fail message as JSON
            $RETURN->answer = "Parameter \"property\" is missing";
            $RETURN->bool = false;
    
            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"txid\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "public-payload-sendnft")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["txid"]))
    {
        if (isset($_GET["property"]))
        {
            if (isset($_GET["tokenstart"]))
            {
                if (isset($_GET["tokenend"]))
                {
                    echo json_encode($PUBLIC->payloadSendNFT($RETURN, $_GET["txid"], (int)$_GET["property"], (int)$_GET["tokenstart"], (int)$_GET["tokenend"]), JSON_PRETTY_PRINT);
                }
                else
                {
                    // prepare and print fail message as JSON
                    $RETURN->answer = "Parameter \"tokenend\" is missing";
                    $RETURN->bool = false;
    
                    echo json_encode($RETURN, JSON_PRETTY_PRINT);
                }
            }
            else
            {
                // prepare and print fail message as JSON
                $RETURN->answer = "Parameter \"tokenstart\" is missing";
                $RETURN->bool = false;
    
                echo json_encode($RETURN, JSON_PRETTY_PRINT);
            }
        }
        else
        {
            // prepare and print fail message as JSON
            $RETURN->answer = "Parameter \"property\" is missing";
            $RETURN->bool = false;
    
            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"txid\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "public-payload-sendtoken")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["txid"]))
    {
        if (isset($_GET["property"]))
        {
            if (isset($_GET["amount"]))
            {
                echo json_encode($PUBLIC->payloadSendToken($RETURN, $_GET["txid"], (int)$_GET["property"], $_GET["amount"]), JSON_PRETTY_PRINT);
            }
            else
            {
                // prepare and print fail message as JSON
                $RETURN->answer = "Parameter \"amount\" is missing";
                $RETURN->bool = false;
    
                echo json_encode($RETURN, JSON_PRETTY_PRINT);
            }
        }
        else
        {
            // prepare and print fail message as JSON
            $RETURN->answer = "Parameter \"property\" is missing";
            $RETURN->bool = false;
    
            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"txid\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "public-payload-dex-accept")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["txid"]))
    {
        if (isset($_GET["property"]))
        {
            if (isset($_GET["amount"]))
            {
                echo json_encode($PUBLIC->payloadDEXaccept($RETURN, $_GET["txid"], (int)$_GET["property"], $_GET["amount"]), JSON_PRETTY_PRINT);
            }
            else
            {
                // prepare and print fail message as JSON
                $RETURN->answer = "Parameter \"tokenstart\" is missing";
                $RETURN->bool = false;
    
                echo json_encode($RETURN, JSON_PRETTY_PRINT);
            }
        }
        else
        {
            // prepare and print fail message as JSON
            $RETURN->answer = "Parameter \"property\" is missing";
            $RETURN->bool = false;
    
            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"txid\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "public-payload-mintproperty")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["name"]))
    {
        if (isset($_GET["category"]))
        {
            if (isset($_GET["subcategory"]))
            {
                if (isset($_GET["structure"]))
                {
                    if (isset($_GET["content"]))
                    {
                        if (isset($_GET["contenttype"]))
                        {
                            if (isset($_GET["source"]))
                            {
                                if (isset($_GET["ecosystem"]))
                                {
                                    if (isset($_GET["tokentype"]))
                                    {
                                        if (isset($_GET["fixed"]))
                                        {
                                            if (isset($_GET["amount"]))
                                            {
                                                if (isset($_GET["txid"]))
                                                {
                                                    $data = (object)array();
                                                    $data->content = $_GET["content"];
                                                    $data->type = $_GET["type"];
                                                    $data->source = $_GET["source"];
                                                    $data->structure = $_GET["structure"];
                                                    $data = json_encode($data);
                                                    
                                                    // add mint property payload
                                                    echo json_encode($PUBLIC->payloadMintProperty($RETURN, $_GET["txid"], $_GET["name"], $_GET["category"], $_GET["subcategory"], $_GET["url"], $data, $_GET["ecosystem"], $_GET["tokentype"], $_GET["fixed"], $_GET["amount"]), JSON_PRETTY_PRINT);
                                                }
                                                else
                                                {
                                                    // prepare and print fail message as JSON
                                                    $RETURN->answer = "Parameter \"txid\" is missing";
                                                    $RETURN->bool = false;

                                                    echo json_encode($RETURN, JSON_PRETTY_PRINT);
                                                }
                                            }
                                            else
                                            {
                                                // prepare and print fail message as JSON
                                                $RETURN->answer = "Parameter \"amount\" is missing";
                                                $RETURN->bool = false;

                                                echo json_encode($RETURN, JSON_PRETTY_PRINT);
                                            }
                                        }
                                        else
                                        {
                                            // prepare and print fail message as JSON
                                            $RETURN->answer = "Parameter \"fixed\" is missing";
                                            $RETURN->bool = false;

                                            echo json_encode($RETURN, JSON_PRETTY_PRINT);
                                        }
                                    }
                                    else
                                    {
                                        // prepare and print fail message as JSON
                                        $RETURN->answer = "Parameter \"tokentype\" is missing";
                                        $RETURN->bool = false;

                                        echo json_encode($RETURN, JSON_PRETTY_PRINT);
                                    }
                                }
                                else
                                {
                                    // prepare and print fail message as JSON
                                    $RETURN->answer = "Parameter \"ecosystem\" is missing";
                                    $RETURN->bool = false;

                                    echo json_encode($RETURN, JSON_PRETTY_PRINT);
                                }
                            }
                            else
                            {
                                // prepare and print fail message as JSON
                                $RETURN->answer = "Parameter \"source\" is missing";
                                $RETURN->bool = false;

                                echo json_encode($RETURN, JSON_PRETTY_PRINT);
                            }
                        }
                        else
                        {
                            // prepare and print fail message as JSON
                            $RETURN->answer = "Parameter \"contenttype\" is missing";
                            $RETURN->bool = false;

                            echo json_encode($RETURN, JSON_PRETTY_PRINT);
                        }
                    }
                    else
                    {
                        // prepare and print fail message as JSON
                        $RETURN->answer = "Parameter \"content\" is missing";
                        $RETURN->bool = false;

                        echo json_encode($RETURN, JSON_PRETTY_PRINT);
                    }
                }
                else
                {
                    // prepare and print fail message as JSON
                    $RETURN->answer = "Parameter \"structure\" is missing";
                    $RETURN->bool = false;

                    echo json_encode($RETURN, JSON_PRETTY_PRINT);
                }
            }
            else
            {
                // prepare and print fail message as JSON
                $RETURN->answer = "Parameter \"subcategory\" is missing";
                $RETURN->bool = false;

                echo json_encode($RETURN, JSON_PRETTY_PRINT);
            }
        }
        else
        {
            // prepare and print fail message as JSON
            $RETURN->answer = "Parameter \"category\" is missing";
            $RETURN->bool = false;

            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"name\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "public-inscriptions")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["page"]))
    {
        $page = $_GET["page"];
    }
    else
    {
        $page = 0;
    }
    
    // get latest inscriptions
    echo json_encode($PUBLIC->inscriptions($RETURN, $page), JSON_PRETTY_PRINT);
    
    die();
}

if ($_GET["method"] == "public-inscription-by-number")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["number"]))
    {
        // get inscriptions by number
        echo json_encode($PUBLIC->inscriptionByNumber($RETURN, $_GET["number"]), JSON_PRETTY_PRINT);
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"number\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    
    die();
}