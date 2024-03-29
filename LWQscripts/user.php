<?php
if ($_GET["method"] == "user")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // create the RETURN object
    $RETURN->answer = "Here are the user commands.";
    $RETURN->bool = true;
    $RETURN->commands = array(
        "user-execute"=>"Sign a prepared action, 2FA Function gets called by system itself",
        "user-iplock"=>"Turn on or off the IP lock, always IP locked, Parameters: authkey",
        "user-register"=>"Prepares a register action, always IP locked, Parameters: user, pass, mail",
        "user-login"=>"Prepares a login action, Parameters: user, pass",
        "user-logout"=>"Logout the user and delete its authkey from database, no sign needed, always IP locked, Parameters: authkey",
        "user-get"=>"Get public user data, Parameters: authkey",
        "user-change-mail"=>"Prepares a mail change action, need to be signed from both Emails, Parameters: authkey, mail",
        "user-change-pass"=>"Prepares a pass change action, Parameters: authkey, pass",
        "user-pass-recovery"=>"Set a new password if it get lost, auth by username and email, always IP locked, Parameters: user, mail, pass",
        "user-pairing"=>"Start the self-custody pairing process, Parameters: authkey, address",
        "user-pairing-sign"=>"Complete the self-custody pairing process, Parameters: authkey, txid"
    );

    // print the RETURN as JSON
    echo json_encode($RETURN, JSON_PRETTY_PRINT);
    die();
}

if ($_GET["method"] == "user-execute")
{
    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($_GET["action"]) && isset($_GET["copper"]) && isset($_GET["jade"]) && isset($_GET["crystal"]))
    {
        echo $USER->execute($_GET["action"], $_GET["copper"], $_GET["jade"], $_GET["crystal"], $IP);
    }
    die();
}

if ($_GET["method"] == "user-iplock")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    if (isset($AUTHKEY)) {
        // run the register function
        echo json_encode($USER->iplock($RETURN, $AUTHKEY, $IP), JSON_PRETTY_PRINT);
    }
    else
    {
        $RETURN->answer = "Parameter 'authkey' is missing";
        $RETURN->bool = false;
        
        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "user-register")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // check all parameters are given
    if (isset($_GET["user"]))
    {
        if (isset($_GET["pass"]))
        {
            if (isset($_GET["mail"]))
            {
                // run the register function
                echo json_encode($USER->register($RETURN, $_GET["user"], $_GET["pass"], $_GET["mail"], $IP), JSON_PRETTY_PRINT);
            }
            else
            {
                $RETURN->answer = "Parameter 'mail' is missing";
                $RETURN->bool = false;
        
                echo json_encode($RETURN, JSON_PRETTY_PRINT);
            }
        }
        else
        {
            $RETURN->answer = "Parameter 'pass' is missing";
            $RETURN->bool = false;
        
            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        $RETURN->answer = "Parameter 'user' is missing";
        $RETURN->bool = false;
        
        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "user-login")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // check all parameters are given
    if (isset($_GET["user"]))
    {
        if (isset($_GET["pass"]))
        {
            // run the login function
            echo json_encode($USER->login($RETURN, $_GET["user"], $_GET["pass"], $IP), JSON_PRETTY_PRINT);
        }
        else
        {
            $RETURN->answer = "Parameter 'pass' is missing";
            $RETURN->bool = false;
        
            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        $RETURN->answer = "Parameter 'user' is missing";
        $RETURN->bool = false;
        
        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "user-logout")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // check all parameters are given
    if (isset($_GET["authkey"]))
    {
        // run the login function
        echo json_encode($USER->logout($RETURN, $AUTHKEY, $IP), JSON_PRETTY_PRINT);
    }
    else
    {
        $RETURN->answer = "Parameter 'authkey' is missing";
        $RETURN->bool = false;
        
        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "user-get")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // check all parameters are given
    if (isset($_GET["authkey"]))
    {
        // run the get function
        echo json_encode($USER->get($RETURN, $AUTHKEY, $IP), JSON_PRETTY_PRINT);
    }
    else
    {
        $RETURN->answer = "Parameter 'authkey' is missing";
        $RETURN->bool = false;
        
        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "user-change-mail")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // check all parameters are given
    if (isset($_GET["authkey"]))
    {
        if (isset($_GET["mail"]))
        {
            // run the change mail function
            echo json_encode($USER->changeMail($RETURN, $AUTHKEY, $_GET["mail"], $IP), JSON_PRETTY_PRINT);
        }
        else
        {
            $RETURN->answer = "Parameter 'mail' is missing";
            $RETURN->bool = false;
            
            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
        
    }
    else
    {
        $RETURN->answer = "Parameter 'authkey' is missing";
        $RETURN->bool = false;
        
        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "user-change-pass")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // check all parameters are given
    if (isset($_GET["authkey"]))
    {
        if (isset($_GET["pass"]))
        {
            // run the change pass function
            echo json_encode($USER->changePass($RETURN, $AUTHKEY, $_GET["pass"], $IP), JSON_PRETTY_PRINT);
        }
        else
        {
            $RETURN->answer = "Parameter 'pass' is missing";
            $RETURN->bool = false;
            
            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
        
    }
    else
    {
        $RETURN->answer = "Parameter 'authkey' is missing";
        $RETURN->bool = false;
        
        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "user-pass-recovery")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    //check all parameters are given
    if (isset($_GET["user"]))
    {
        if (isset($_GET["mail"]))
        {
            if (isset($_GET["pass"]))
            {
                // run the pass recovery function
                echo json_encode($USER->passRecovery($RETURN, $_GET["user"], $_GET["mail"], $_GET["pass"], $IP), JSON_PRETTY_PRINT);
            }
            else
            {
                // set and print answer
                $RETURN->answer = "Parameter 'pass' is missing";
                $RETURN->bool = false;
                
                echo json_encode($RETURN, JSON_PRETTY_PRINT);
            }
        }
        else
        {
            // set and print answer
            $RETURN->answer = "Parameter 'mail' is missing";
            $RETURN->bool = false;
            
            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        // set and print answer
        $RETURN->answer = "Parameter 'user' is missing";
        $RETURN->bool = false;
        
        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "user-pairing")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // check all parameters are given
    if (isset($_GET["authkey"]))
    {
        if (isset($_GET["address"]))
        {
            // run the pairing function
            echo json_encode($USER->pairing($RETURN, $AUTHKEY, $_GET["address"], $IP), JSON_PRETTY_PRINT);
        }
        else
        {
            $RETURN->answer = "Parameter 'address' is missing";
            $RETURN->bool = false;
            
            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        $RETURN->answer = "Parameter 'authkey' is missing";
        $RETURN->bool = false;
        
        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}

if ($_GET["method"] == "user-pairing-sign")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // check all parameters are given
    if (isset($_GET["authkey"]))
    {
        if (isset($_GET["txid"]))
        {
            // run the pairing sign function
            echo json_encode($USER->pairingSign($RETURN, $AUTHKEY, $_GET["txid"], $IP), JSON_PRETTY_PRINT);
        }
        else
        {
            $RETURN->answer = "Parameter 'txid' is missing";
            $RETURN->bool = false;
            
            echo json_encode($RETURN, JSON_PRETTY_PRINT);
        }
    }
    else
    {
        $RETURN->answer = "Parameter 'authkey' is missing";
        $RETURN->bool = false;
        
        echo json_encode($RETURN, JSON_PRETTY_PRINT);
    }
    die();
}