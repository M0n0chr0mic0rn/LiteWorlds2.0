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

/*if ($_GET["method"] == "txstreet-pending")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // call the getMempool function from the Public class and print it as JSON
    echo json_encode($PUBLIC->TxStreetPending());

    die();
}*/