<?php
if ($_GET["method"] == "omnilite")
{
    # code...
}

if ($_GET["method"] == "omnilite-sign")
{
    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET['user']) && isset($_GET['copper']) && isset($_GET['jade']) && isset($_GET['crystal']))
    {
        $OMNILITE->sign($_GET['user'], $IP, $_GET['copper'], $_GET['jade'], $_GET['crystal']);
    }
}

if ($_GET["method"] == "omnilite-get")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["authkey"]))
    {
        echo json_encode($OMNILITE->get($RETURN), JSON_PRETTY_PRINT);
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"authkey\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "omnilite-send-native")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["authkey"]))
    {
        $userdata = $USER->_get($AUTHKEY);

        if (isset($_GET["destination"]))
        {
            if (isset($_GET["amount"]))
            {
                echo json_encode($OMNILITE->native($RETURN, $userdata, $_GET["destination"], $_GET["amount"]), JSON_PRETTY_PRINT);
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
            $RETURN->answer = "Parameter \"destination\" is missing";
            $RETURN->bool = false;

            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"authkey\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "omnilite-dex-pay")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["authkey"]))
    {
        $userdata = $USER->_get($AUTHKEY);

        if (isset($_GET["destination"]))
        {
            if (isset($_GET["amount"]))
            {
                echo json_encode($OMNILITE->DEXpay($RETURN, $userdata, $_GET["destination"], $_GET["amount"]), JSON_PRETTY_PRINT);
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
            $RETURN->answer = "Parameter \"destination\" is missing";
            $RETURN->bool = false;

            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"authkey\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "omnilite-dex-accept")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["authkey"]))
    {
        $userdata = $USER->_get($AUTHKEY);

        if (isset($_GET["destination"]))
        {
            if (isset($_GET["amount"]))
            {
                if (isset($_GET["property"]))
                {
                    echo json_encode($OMNILITE->DEXaccept($RETURN, $userdata, (int)$_GET["property"], $_GET["amount"], $_GET["destination"]), JSON_PRETTY_PRINT);
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
                $RETURN->answer = "Parameter \"amount\" is missing";
                $RETURN->bool = false;

                echo json_encode($RETURN, JSON_PRETTY_PRINT);
            }
        }
        else
        {
            // prepare and print fail message as JSON
            $RETURN->answer = "Parameter \"destination\" is missing";
            $RETURN->bool = false;

            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        // prepare and print fail message as JSON
        $RETURN->answer = "Parameter \"authkey\" is missing";
        $RETURN->bool = false;

        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}