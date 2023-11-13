<?php
// The Counter Class - it counts the number of requests

class Counter
{
    private static $_db_username = "maria";
    private static $_db_passwort = "KerkerRocks22";
    private static $_db_host = "127.0.0.1";
    private static $_db_name = "API_counter";
    private static $_db;

    function __construct()
    {
        try
        {
            self::$_db = new PDO("mysql:host=" . self::$_db_host . ";dbname=" . self::$_db_name, self::$_db_username, self::$_db_passwort);
        }
        catch(PDOException $e)
        {
            echo "COUNTER ERROR";
            die();
        }
    }

    function get()
    {
        // Select the full counter table and return it
        $stmt = self::$_db->prepare("SELECT * FROM counter ORDER BY Name ASC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    function increase($name)
    {
        // Get value from the given method
        $stmt = self::$_db->prepare("SELECT Value FROM counter WHERE Name=:name");
        $stmt->bindParam(":name", $name);
        $stmt->execute();
        if ($stmt->rowCount() > 0)
        {
            // If method have been found, increase the value by one
            $value = (int)$stmt->fetch()["Value"] + 1;

            // Write the new value back into the table
            $stmt = self::$_db->prepare("UPDATE counter SET Value=:value WHERE Name=:name");
            $stmt->bindParam(":value", $value);
            $stmt->bindParam(":name", $name);
            $stmt->execute();
        }
        else
        {
            // If method haven"t benn found create it with value 1
            $value = 1;

            $stmt = self::$_db->prepare("INSERT INTO counter (Name, Value) VALUES (:name, :value)");
            $stmt->bindParam(":value", $value);
            $stmt->bindParam(":name", $name);
            $stmt->execute();
        }
    }
}