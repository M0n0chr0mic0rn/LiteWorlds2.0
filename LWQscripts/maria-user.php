<?php
// The User Class - it manage all user specific requests.
// Values are stored in a database.

// We need the Key Class
require_once("../LWQscripts/key.php");

class User 
{
    private static $_db_username = "maria";
    private static $_db_passwort = "KerkerRocks22";
    private static $_db_host = "127.0.0.1";
    private static $_db_name = "API_user";
    private static $_db;
    
    function __construct()
    {
        try
        {
            self::$_db = new PDO("mysql:host=" . self::$_db_host . ";dbname=" . self::$_db_name, self::$_db_username, self::$_db_passwort);
        }
        catch(PDOException $e)
        {
            echo "<br>DATABASE ERROR<br>".$e;
            die();
        }
    }

    function hello($RETURN, $IP)
    {
        // The "Hello World" Example
        $RETURN->answer = "Hello World, I am a Litecoin-Node-API. How can I help U?";
        $RETURN->bool = true;
        $RETURN->ip = $IP;

        // Get total amount of users
        $stmt = self::$_db->prepare("SELECT * FROM user");
        $stmt->execute();
        $RETURN->total_users = $stmt->rowCount();

        // The command lists
        $RETURN->commands = array(
            "public"=>"list public commands", 
            "user"=>"list user commands", 
            "omni"=>"list omni commands"
        );

        // List the working email providers
        // Select all Emails from the user table and store it in data
        $stmt = self::$_db->prepare("SELECT Mail FROM user");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Create new array
        $array = array();

        // Loop throw data and add every provider in a unique list
        for ($a=0; $a < count($data); $a++)
        {
            // Cut of the user from the Email
            $provider = explode("@", $data[$a]["Mail"])[1];

            // If provider is not present in the list add it
            if (array_search($provider, $array) === false)
            {
                $array[count($array)] = $provider;
            }
        }

        // attach the provider list to the RETURN object
        $RETURN->mailprovider = $array;

        return $RETURN;
    }

    function execute($action, $copper, $jade, $crystal, $IP)
    {
        if ($action == "register")
        {
            //var_dump($action, $copper, $jade, $crystal, $IP);
            $status = 0;

            // get user data
            $stmt = self::$_db->prepare("SELECT * FROM register WHERE BINARY Copper=:copper AND BINARY Jade=:jade AND BINARY Crystal=:crystal AND Status=:status AND IP=:IP LIMIT 1");
            $stmt->bindParam(":copper", $copper);
            $stmt->bindParam(":jade", $jade);
            $stmt->bindParam(":crystal", $crystal);
            $stmt->bindParam(":status", $status);
            $stmt->bindParam(":IP", $IP);
            $stmt->execute();

            //var_dump($stmt->fetchAll(PDO::FETCH_ASSOC));
            //return false;

            if($stmt->rowCount() == 1)
            {
                // create Account
                $data = (object)$stmt->fetchAll(PDO::FETCH_ASSOC)[0];
                $time = time();

                $stmt = self::$_db->prepare("INSERT INTO user (User, Mail, Pass, CreateTime, CreateIP) VALUES (:user, :mail, :pass, :createTime, :ip)");
                $stmt->bindParam(":user", $data->User);
                $stmt->bindParam(":mail", $data->Mail);
                $stmt->bindParam(":pass", $data->Pass);
                $stmt->bindParam(":createTime", $time);
                $stmt->bindParam(":ip", $IP);
                $stmt->execute();

                if($stmt->rowCount() == 1)
                {
                    // Set Memory Table to solved
                    $time = time() + 60;
                    $status = 1;

                    $stmt = self::$_db->prepare("UPDATE register SET Time=:time, Status=:status WHERE User=:user");
                    $stmt->bindParam(":time", $time);
                    $stmt->bindParam(":status", $status);
                    $stmt->bindParam(":user", $data->User);
                    $stmt->execute();

                    // return success page
                    $page = "<body style=\"background-color: black; color: deepskyblue; text-align: center;\">
                            <img src=\"https://v2.liteworlds.quest/icon.png\">
                            <h1>Your Account has been succesfully created</h1>
                            <script>setTimeout(function(){window.close()}, 10000)</script>";

                    return $page;
                }
                else
                {
                    // return fail page
                    $page = "<body style=\"background-color: black; color: crimson; text-align: center;\">
                            <img src=\"https://v2.liteworlds.quest/icon.png\">
                            <h1>Internal Database write error</h1>";

                    return $page;
                }
            }
            else
            {
                // return fail page
                $page = "<body style=\"background-color: black; color: crimson; text-align: center;\">
                        <img src=\"https://v2.liteworlds.quest/icon.png\">
                        <h1>Action not found in database</h1>
                        </body>";

                return $page;
            }
        }
    }
    function register($RETURN, $user, $pass, $mail, $IP)
    {
        // PRECHECK
        // check pass is sha512 hash
        if (strlen($pass) != strlen(preg_replace( "/[^a-zA-Z0-9]/", "", $pass)) || strlen($pass) != 128)
        {
            $RETURN->answer = "Password is not sha512 encrypted";
            $RETURN->bool = false;
            return $RETURN;
        }

        // check IP didn"t allrdy create some accounts
        $stmt = self::$_db->prepare("SELECT * FROM user WHERE CreateIP=:ip LIMIT 5");
        $stmt->bindParam(":ip", $IP);
        $stmt->execute();

        if($stmt->rowCount() >= 5)
        {
            $RETURN->answer = "To much Account creations from this IP";
            $RETURN->bool = false;
            return $RETURN;
        }

        // check user availability
        $stmt = self::$_db->prepare("SELECT * FROM user WHERE User=:user LIMIT 1");
        $stmt->bindParam(":user", $user);
        $stmt->execute();
        $user_user = $stmt->rowCount();

        $stmt = self::$_db->prepare("SELECT * FROM register WHERE User=:user LIMIT 1");
        $stmt->bindParam(":user", $user);
        $stmt->execute();
        $user_register = $stmt->rowCount();

        if($user_user > 0 || $user_register > 0)
        {
            $RETURN->answer = "Username already exists";
            $RETURN->bool = false;
            return $RETURN;
        }

        // check mail availability
        $stmt = self::$_db->prepare("SELECT * FROM user WHERE Mail=:mail LIMIT 1");
        $stmt->bindParam(":mail", $mail);
        $stmt->execute();
        $mail_user = $stmt->rowCount();
        
        $stmt = self::$_db->prepare("SELECT * FROM register WHERE Mail=:mail LIMIT 1");
        $stmt->bindParam(":mail", $mail);
        $stmt->execute();
        $mail_register = $stmt->rowCount();

        $stmt = self::$_db->prepare("SELECT * FROM mail WHERE Mail=:mail LIMIT 1");
        $stmt->bindParam(":mail", $mail);
        $stmt->execute();
        $mail_mail = $stmt->rowCount();

        if($mail_user > 0 || $mail_register > 0 || $mail_mail > 0)
        {
            $RETURN->answer = "Mail is allready taken";
            $RETURN->bool = false;
            return $RETURN;
        }

        // PREPARINGS
        // generate the keys
        $done = false;
        $key = new Key;
        do 
        {
            // create the keys
            $keys = $key->Craft2FA();

            // check keys are unique
            $stmt = self::$_db->prepare("SELECT * FROM register WHERE BINARY Copper=:copper OR BINARY Jade=:jade OR BINARY Crystal=:crystal LIMIT 1");
            $stmt->bindParam(":copper", $keys->copper);
            $stmt->bindParam(":jade", $keys->jade);
            $stmt->bindParam(":crystal", $keys->crystal);
            $stmt->execute();
            if ($stmt->rowCount() == 0) 
            {
                $done = true;
            }
        } 
        while (!$done);

        // adding to MemoryTable with a 10 minute TimeWindow
        $time = time() + 600;

        $stmt = self::$_db->prepare("INSERT INTO register (User, Mail, Pass, Time, Copper, Jade, Crystal, IP) VALUES (:user, :mail, :pass, :time, :copper, :jade, :crystal, :ip)");
        $stmt->bindParam(":user", $user);
        $stmt->bindParam(":mail", $mail);
        $stmt->bindParam(":pass", $pass);
        $stmt->bindParam(":time", $time);
        $stmt->bindParam(":copper", $keys->copper);
        $stmt->bindParam(":jade", $keys->jade);
        $stmt->bindParam(":crystal", $keys->crystal);
        $stmt->bindParam(":ip", $IP);
        $stmt->execute();
        
        if($stmt->rowCount() == 1)
        {
            // send mail for signing
            $empfaenger = $mail;
            $betreff = "Sign your Registration on LiteWorlds.quest Network";

            // create the message in html
            $link = "https://v2.liteworlds.quest/?method=user-execute&action=register&copper=".$keys->copper."&jade=".$keys->jade."&crystal=".$keys->crystal;
            $nachricht = "
            <html>
                <body style=\"background-color: black; color: deepskyblue;\">
                <table align=\"center\">
                <tr>
                    <td><img src=\"https://v2.liteworlds.quest/LWLA.png\" style=\"height:250px; margin-left:auto; margin-right:auto; display:block;\"></td>
                </tr>

                <tr>
                    <td><p align=\"center\" style=\"color:deepskyblue;\">You are going to create an Account at LiteWorlds</p></td>
                </tr>
                <tr>
                    <td><p align=\"center\" style=\"color:deepskyblue;\">User: ".$user."</p></td>
                </tr>
                <tr>
                    <td>
                        <p align=\"center\" style=\"color:crimson;\">Please sign your Action</p>
                        <a target=\"_blank\" rel=\"noopener noreferrer\" href=".$link.">
                            <button style=\"font-size:24px;width:100%;color:deepskyblue;background-color:transparent;cursor:crosshair;border:3px solid deepskyblue;border-radius:7px;\">SIGN</button>
                        </a>
                        <p align=\"center\" style=\"color:crimson;\">Time: ".time()."</p>
                    </td>
                </tr>
                </table>
                </body>
            </html>
            ";

            // setup email headers
            $header = 
                "From: Security <security@liteworlds.quest>" . "\r\n" .
                "Reply-To: Security <security@liteworlds.quest>" . "\r\n" .
                "MIME-Version: 1.0" . "\r\n" .
                "Content-type: text/html; charset=iso-8859-1" . "\r\n" .
                "X-Mailer: PHP/" . phpversion();

            // send mail
            mail($empfaenger, $betreff, $nachricht, $header);

            $RETURN->answer = "Account creation prepared, sign your registration via Email";
            $RETURN->bool = true;
            return $RETURN;
        }
        else
        {
            $RETURN->answer = "Account creation failed by internal database error";
            $RETURN->bool = false;
            return $RETURN;
        }
    }
    function login($RETURN, $authkey)
    {}
}