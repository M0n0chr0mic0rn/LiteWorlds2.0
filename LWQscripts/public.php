<?php
if ($_GET["method"] == "public")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // create the RETURN object
    $RETURN->answer = "Here are the public commands.";
    $RETURN->bool = true;
    $RETURN->commands = array(
        "public-hello"=>"Display the Hello World Example",
        "public-get-block"=>"Get block by blockhash",
        "public-get-mempool"=>"Get the actual mempool data",
        "public-get-mempool-entry"=>"Get a specific transaction from mempool by txid"
    );

    // print the RETURN as JSON
    echo json_encode($RETURN, JSON_PRETTY_PRINT);

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    die();
}

if ($_GET["method"] == "hello" || $_GET["method"] == "public-hello")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // call the hello function from the User class and print it as JSON
    echo json_encode($USER->hello($RETURN, $IP), JSON_PRETTY_PRINT);

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    die();
}

if ($_GET["method"] == "public-get-block")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    if (isset($_GET["blockhash"]))
    {
        // call the getBlock function from the Public class and print it as JSON
        echo json_encode($PUBLIC->getBlock($_GET["blockhash"]), JSON_PRETTY_PRINT);

        // increase the method counter
        $COUNTER->increase($_GET["method"]);

        die();
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"blockhash\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
}

if ($_GET["method"] == "public-get-mempool")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // call the getMempool function from the Public class and print it as JSON
    echo json_encode($PUBLIC->getMempool(), JSON_PRETTY_PRINT);

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    die();
}

if ($_GET["method"] == "public-get-mempool-entry")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    if (isset($_GET["txid"]))
    {
        // call the getMempool function from the Public class and print it as JSON
        echo json_encode($PUBLIC->getMempoolEntry($_GET["txid"]), JSON_PRETTY_PRINT);

        // increase the method counter
        $COUNTER->increase($_GET["method"]);

        die();
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"txid\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
}

if ($_GET["method"] == "txstreet-pending")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // call the getMempool function from the Public class and print it as JSON
    echo json_encode($PUBLIC->TxStreetPending());

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    die();
}