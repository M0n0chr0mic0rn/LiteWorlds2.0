<?php
require_once("../LWQscripts/key.php");

class Omnilite
{
    private static $_db_username = "maria";
    private static $_db_passwort = "KerkerRocks22";
    private static $_db_host = "127.0.0.1";
    private static $_db_name = "API_litecoin";
    private static $_db;

    private static $_rpc_user = 'user';
	private static $_rpc_pw = 'pass';
	private static $_rpc_host = '192.168.0.100';
	private static $_rpc_port = '10370';
    private static $_rpc_wallet;
	private static $_node;
	private static $_node_dev;
    private static $_wallet_wizzard;
    private static $_faucet_amount = 0.00025000;
    private static $_input_weight = 0.00000150;
    private static $_dust = 0.00006;
    
    function __construct($user)
    {
        try
        {
            self::$_rpc_wallet = "wallet/" . $user;
            self::$_db = new PDO("mysql:host=" . self::$_db_host . ";dbname=" . self::$_db_name, self::$_db_username, self::$_db_passwort);
            self::$_node = new Node(self::$_rpc_user, self::$_rpc_pw, self::$_rpc_host, self::$_rpc_port, self::$_rpc_wallet);
		    self::$_node_dev = new Node_Dev(self::$_rpc_user, self::$_rpc_pw, self::$_rpc_host, self::$_rpc_port, self::$_rpc_wallet);
            self::$_wallet_wizzard = new Node(self::$_rpc_user, self::$_rpc_pw, self::$_rpc_host, self::$_rpc_port);
        }
        catch (PDOException $e)
        {
            echo "<br>OMNILITE ERROR<br>" . $e;
            die();
        }
    }

    private function _INPUTBUILD($utxo, $amount)
    {
        var_dump($utxo, $amount);

        $_return = (object)array();
        $_return->list = array();
        $_return->amounts = array();
        $_return->amount = 0;
        $_return->merge = false;
        //$_return->chainfee = 0.000002;

        for ($a=0; $a < count($utxo); $a++)
        {
            // add utxo if amount is not enough
            if ($_return->amount < ($amount + self::$_faucet_amount))
            {
                $_return->list[$a] = array('txid'=>$utxo[$a]['txid'], 'vout'=>$utxo[$a]['vout']);
				$_return->amounts[$a] = $utxo[$a]['amount'];
				$_return->amount += $utxo[$a]['amount'];
				//$_return->chainfee += 0.00000148;
            }
            else
            {
                // if enough end loop
                $a = count($utxo);
            }

            // if to much utxos are used end loop
            if ($a > 15)
            {
                $_return->merge = true;
                $a = count($utxo);
            }
        }

        if (self::$_dust < ($_return->amount - ($amount + self::$_faucet_amount)))
        {
            $_return->change = $_return->amount - ($amount + self::$_faucet_amount);
            $_return->change = number_format($_return->change, 8, ".", "");
        }
        else
        {
            $_return->dust = $_return->amount - ($amount + self::$_faucet_amount);
            $_return->dust = number_format($_return->dust, 8, ".", "");
        }
        
        return $_return;
    }

    private function _SENDPREPARE($userdata, $txid, $origin, $input, $output, $chainfee)
    {
		$stmt = self::$_db->prepare("SELECT * FROM send WHERE BINARY User=:user");
		$stmt->bindParam(":user", $userdata->User);
		$stmt->execute();
		
        // check user has no prepaired transaction
		if ($stmt->rowCount() == 0)
        {
			// generate the keys for signing
			$done = false;
			$key = new Key;

			do
			{
				$keys = $key->Craft2FA();

				$stmt = self::$_db->prepare("SELECT * FROM send WHERE BINARY Copper=:copper OR BINARY Jade=:copper OR BINARY Crystal=:copper LIMIT 1");
				$stmt->bindParam(":copper", $keys->copper);
				$stmt->execute();

				if ($stmt->rowCount() == 0)
				{
					$stmt = self::$_db->prepare("SELECT * FROM send WHERE BINARY Copper=:jade OR BINARY Jade=:jade OR BINARY Crystal=:jade LIMIT 1");
					$stmt->bindParam(":jade", $keys->jade);
					$stmt->execute();

					if ($stmt->rowCount() == 0)
					{
						$stmt = self::$_db->prepare("SELECT * FROM send WHERE BINARY Copper=:crystal OR BINARY Jade=:crystal OR BINARY Crystal=:crystal LIMIT 1");
						$stmt->bindParam(":crystal", $keys->crystal);
						$stmt->execute();
						if ($stmt->rowCount() == 0)
						{
							$done = true;
						}
					}
				}
			}
			while (!$done);

			$time = time() + 120;

            // create send entry
			$stmt = self::$_db->prepare("INSERT INTO send (User, TXID, IP, Time, Copper, Jade, Crystal) VALUES (:user, :txid, :ip, :time, :copper, :jade, :crystal)");
			$stmt->bindParam(":user", $userdata->User);
			$stmt->bindParam(":txid", $txid);
			$stmt->bindParam(":ip", $userdata->LastIP);
			$stmt->bindParam(":time", $time);
			$stmt->bindParam(":copper", $keys->copper);
			$stmt->bindParam(":jade", $keys->jade);
			$stmt->bindParam(":crystal", $keys->crystal);
			$stmt->execute();
			//var_dump($stmt->errorInfo()[0]);
			if ($stmt->errorInfo()[0] == "00000")
            {
				// send mail for verfication
				$empfaenger  = $userdata->Mail;
				$betreff = 'Sign your Transaction on LiteWorlds.quest Network';
				
				// message
				$link = 'https://v2.liteworlds.quest/?method=omnilite-sign&user='.$userdata->User.'&copper='.$keys->copper.'&jade='.$keys->jade.'&crystal='.$keys->crystal;
				//echo '<br>'.$link;
				$nachricht = '
				<html>
					<body style="background-color: black; color: deepskyblue;">
					<table align="center">
					<tr>
						<td><img src="https://api.liteworlds.quest/LWLA.png" style="height:250px; margin-left:auto; margin-right:auto; display:block;"></td>
					</tr>

					<tr>
						<td><p align="center">Blockchain Fee: '.$chainfee.' LTC</p></td>
					</tr>
					<tr>
						<td><p align="center">INPUT<br>';
						for ($a=0; $a < count($input->list); $a++) { 
							$nachricht .= $origin.' => '.array_values($input->amounts)[$a].' LTC<br>';
						}
						$nachricht .= '</p></td>
					</tr>
					<tr>
						<td>
							<p align="center">OUTPUT<br>';
							for ($a=0; $a < count($output); $a++) { 
								$nachricht .= array_keys($output)[$a].' => '.array_values($output)[$a].' LTC<br>';
							}
							$nachricht .= '</p>
						</td>
					</tr>

					<tr>
						<td>
							<p align="center" style="color:crimson;">Please sign your Transaction</p>
							<a target="_blank" rel="noopener noreferrer" href="'.$link.'">
								<button style="font-size:24px;width:100%;background-color:transparent;border:3px solid deepskyblue;border-radius:7px;color: deepskyblue">SIGN & SEND</button>
							</a>
							<p align="center" style="color:crimson;">Time: '.time().'</p>
						</td>
					</tr>
					
					</table>

					</body>
				</html>
				';

				$header = 
					'From: Security <security@liteworlds.quest>' . "\r\n" .
					'Reply-To: Security <security@liteworlds.quest>' . "\r\n" .
					'MIME-Version: 1.0' . "\r\n" .
					'Content-type: text/html; charset=iso-8859-1' . "\r\n" .
					'X-Mailer: PHP/' . phpversion();

				// send mail
				if (mail($empfaenger, $betreff, $nachricht, $header))
                {
					return true;
				}
                else
                {
					return false;
				}
			}
		}
        else
        {
			return false;
		}

		
	}

    function get($RETURN)
    {
        $wallet = explode("/", self::$_rpc_wallet)[1];

        //check wallet is loaded
        if (!self::$_node->help())
        {
            // if not load wallet
            $a = self::$_wallet_wizzard->loadwallet($wallet);

            if (!$a)
            {
                // if wallet isnt present create it
                self::$_wallet_wizzard->createwallet($wallet);
                self::Wallet($RETURN);
            }
            else
            {
                // wallet loaded and rescan started
                $RETURN->answer = "Wallet found and rescan running";
                $RETURN->bool = false;

                return $RETURN;
            }
        }
        else
        {
            // wallet is loaded

            // check for default address
            if (!self::$_node->getaddressesbylabel("default"))
            {
                // if not found, create it
                self::$_node->getnewaddress("default", "p2sh-segwit");
                self::Wallet($RETURN);
            }
            else
            {
                // if found, get data

                // get address itself
                $default_address = array_keys(self::$_node->getaddressesbylabel("default"))[0];

                // get utxo lists
                $default_pending_utxo = self::$_node->listunspent(0, 0, array($default_address));
                $default_balance_utxo = self::$_node->listunspent(1, 999999999, array($default_address));

                // get unconfirmed balance
                $default_pending = 0;
                for ($a=0; $a < count($default_pending_utxo); $a++)
                { 
                    $element = $default_pending_utxo[$a];
                    $default_pending += $element["amount"];
                }
                // convert to string to avoid float errors
                $default_pending = number_format($default_pending, 8, ".", "");

                // get confirmed balance
                $default_balance = 0;
                for ($a=0; $a < count($default_balance_utxo); $a++)
                { 
                    $element = $default_balance_utxo[$a];
                    $default_balance += $element["amount"];
                }
                // convert to string to avoid float errors
                $default_balance = number_format($default_balance, 8, ".", "");
            }

            // prepare RETURN object
            $RETURN->answer = "Wallet found";
            $RETURN->bool = true;
            $RETURN->addresspool = array();
            
            // set default address + balance to addresspool
            $RETURN->addresspool["default"] = array(
                "address" => $default_address,
                "pending" => $default_pending,
                "balance" => $default_balance,
                "utxo_pending" => $default_pending_utxo,
                "utxo_balance" => $default_balance_utxo
            );

            return $RETURN;
        }
    }

    function sign($user, $ip, $copper, $jade, $crystal)
    {
		$stmt = self::$_db->prepare("SELECT TXID FROM send WHERE BINARY User=:user AND BINARY Copper=:copper AND BINARY Jade=:jade AND BINARY Crystal=:crystal");
		$stmt->bindParam(":user", $user);
		$stmt->bindParam(":copper", $copper);
		$stmt->bindParam(":jade", $jade);
		$stmt->bindParam(":crystal", $crystal);
		$stmt->execute();
		//var_dump($stmt->errorInfo());
		if($stmt->rowCount() === 1)
        {
			$txid = $stmt->fetch()['TXID'];
			//echo $txid;
			//return 0;
			$signtx = self::$_node->signrawtransactionwithwallet($txid);
			//print_r($signtx);
			//var_dump($signtx['hex']);
			if($signtx['complete'] == 1)
            {
				$txid = self::$_node->sendrawtransaction($signtx['hex']);

				if ($txid)
                {
					$time = time() + 30;
					$status = 1;

					$stmt = self::$_db->prepare("DELETE FROM send WHERE BINARY User=:user AND BINARY Copper=:copper AND BINARY Jade=:jade AND BINARY Crystal=:crystal");
					$stmt->bindParam(":user", $user);
					$stmt->bindParam(":copper", $copper);
					$stmt->bindParam(":jade", $jade);
					$stmt->bindParam(":crystal", $crystal);
					$stmt->execute();

					echo '
						<!DOCTYPE html>
						<html>
						<head>
							<link rel="stylesheet" href="style.css">
						</head>
						<body style="background-color: black;">
							<h1 style="text-align: center;margin-left: auto;margin-right: auto;width: 50%;font-weight: bold;color: deepskyblue">You made it!</h1>
							<img src="https://api.liteworlds.quest/LWLA.png" style="height:250px; margin-left:auto; margin-right:auto; display:block;">
							<h1 style="text-align: center;margin-left: auto;margin-right: auto;width: 50%;font-weight: bold;color: deepskyblue">HURRAY</h1>
							<p style="text-align: center;margin-left: auto;margin-right: auto;width: 50%;font-weight: bold;color: deepskyblue">Your Transaction has been succesfully created and submitted to the Litecoin MemoryPool</p>
							<p style="text-align: center;margin-left: auto;margin-right: auto;width: 50%;font-weight: bold;color: deepskyblue">You get redirected in <b id="time">5</b> seconds</p>
						</body>
						</html>
						<script>
							setTimeout(function(){
								window.location.replace("https://litecoinspace.org/tx/'.$txid.'")
							}, 5000)

							let sec = 4
							setInterval(function () {
								document.getElementById("time").innerHTML = sec
								
								if (sec > 0) {
									sec--
								}
							}, 1000)
						</script>
					';
				}
                else
                {
					echo 'Transaction Error';
					var_dump($signtx['hex']);
				}
			}
		}
	}

    function native($RETURN, $userdata, $destination, $amount)
    {
        // format amount
        $amount = number_format((float)$amount, 8, ".", "");

        // get wallet data
        $RETURN = self::get($RETURN);

        // minimum amount for transaction
        if ((float)$RETURN->addresspool["default"]["balance"] < 0.00035)
        {
            $RETURN->answer = "Not enough funds to create Transaction.";
            $RETURN->bool = false;

            return $RETURN;
        }

        // no self transaction
        if ($destination == $RETURN->addresspool["default"]["address"])
        {
            //var_dump("destination = self");
            $RETURN->answer = "No self transaction yet.";
            $RETURN->bool = false;

            return $RETURN;
        }
        
        // no transaction to faucet
        if ($destination == "MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG")
        {
            //var_dump("destination = faucet");
            $RETURN->answer = "No transaction to faucet yet.";
            $RETURN->bool = false;

            return $RETURN;
        }

        // check balance is enough
        if (((float)$RETURN->addresspool["default"]["balance"] - self::$_faucet_amount - (count($RETURN->addresspool["default"]["utxo_balance"]) * self::$_input_weight)) < (float)$amount)
        {
            //var_dump("exit all");
            $RETURN->answer = "Damage control measures - Dust Error";
            $RETURN->bool = false;

            return $RETURN;
        }

        // no transaction to MWEB
        if (substr($destination, 0, 7) == "ltcmweb")
        {
            $RETURN->answer = "No Transaction to MWEB yet.";
            $RETURN->bool = false;

            return $RETURN;
        }

        // build input
        $input = self::_INPUTBUILD($RETURN->addresspool["default"]["utxo_balance"], $amount);

        // if input build used to much utxos abort
        if ($input->merge)
        {
            $RETURN->answer = "Too much utxos, merge them and try again.";
            $RETURN->bool = false;

            return $RETURN;
        }

        // build output
        $output = array();

        if (isset($input->change))
        {
            // if change is set create change output 
            $output[$RETURN->addresspool["default"]["address"]] = number_format($input->change, 8, ".", "");
        }

        // create faucet output
        $output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"] = number_format(self::$_faucet_amount, 8, ".", "");
        
        // create destination output
        $output[$destination] = number_format($amount, 8, ".", "");

        //var_dump($input, $output);

        // create rawtransaction
        $txid = self::$_node->createrawtransaction($input->list, $output);
        //var_dump($txid);

        // sign rawtransaction
        $signtx = self::$_node->signrawtransactionwithwallet($txid);
        //var_dump($signtx);
        if ($signtx["complete"] == 1)
        {
            // decode rawtransaction
            $txdata = self::$_node->decoderawtransaction($signtx["hex"]);
            //var_dump($txdata);

            if (isset($input->change))
            {
                // read out transaction vsize and subtract from change
                $output[$RETURN->addresspool["default"]["address"]] = (float)$output[$RETURN->addresspool["default"]["address"]] - ($txdata["vsize"] / 100000000);
                
                // check dust range again
                if ($output[$RETURN->addresspool["default"]["address"]] < self::$_dust)
                {
                    // if yes use faucet as buffer and remove change
                    $output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"] = (float)$output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"] + (float)$output[$RETURN->addresspool["default"]["address"]];
                    $output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"] = number_format($output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"], 8, ".", "");
                    unset($output[$RETURN->addresspool["default"]["address"]]);
                }
                else
                {
                    // if no format change
                    $output[$RETURN->addresspool["default"]["address"]] = number_format($output[$RETURN->addresspool["default"]["address"]], 8, ".", "");
                }
            }
            else
            {
                // if no change is set add dust to faucet output
                $output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"] = (float)$output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"] + ((float)$input->dust - (($txdata["vsize"] / 100000000)));
                $output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"] = number_format($output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"], 8, ".", "");
            }

            //var_dump($input, $output);

            // create final rawtransaction
            $txid = self::$_node->createrawtransaction($input->list, $output);
            //var_dump($txid);

            // send mail to user
            if ($txid)
            {
                if (self::_SENDPREPARE($userdata, $txid, $RETURN->addresspool["default"]["address"], $input, $output, number_format(($txdata["vsize"] / 100000000), 8, ".", "")))
                {
                    $RETURN->answer = "Sending creation prepared, sign it via email";
                    $RETURN->bool = true;
                    $RETURN->input = $input;
                    $RETURN->output = $output;
                    $RETURN->chainfee = number_format(($txdata["vsize"] / 100000000), 8, ".", "");

                    return $RETURN;
                }
                else
                {
                    $RETURN->answer = "Sending creation error, email could not be send";
                    $RETURN->bool = false;

                    return $RETURN;
                }
            }
        }
        else
        {
            $RETURN->answer = "Sending creation error";
            $RETURN->bool = false;

            return $RETURN;
        }
    }

    function DEXpay($RETURN, $userdata, $destination, $amount)
    {
        // format amount
        $amount = number_format((float)$amount, 8, ".", "");

        // get wallet data
        $RETURN = self::get($RETURN);

        // minimum amount for transaction
        if ((float)$RETURN->addresspool["default"]["balance"] < 0.00035)
        {
            $RETURN->answer = "Not enough funds to create Transaction.";
            $RETURN->bool = false;

            return $RETURN;
        }

        // no self transaction
        if ($destination == $RETURN->addresspool["default"]["address"])
        {
            //var_dump("destination = self");
            $RETURN->answer = "No self transaction yet.";
            $RETURN->bool = false;

            return $RETURN;
        }
        
        // no transaction to faucet
        if ($destination == "MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG")
        {
            //var_dump("destination = faucet");
            $RETURN->answer = "No transaction to faucet yet.";
            $RETURN->bool = false;

            return $RETURN;
        }

        // check balance is enough
        if (((float)$RETURN->addresspool["default"]["balance"] - self::$_faucet_amount - (count($RETURN->addresspool["default"]["utxo_balance"]) * self::$_input_weight)) < (float)$amount)
        {
            //var_dump("exit all");
            $RETURN->answer = "Damage control measures - Dust Error";
            $RETURN->bool = false;

            return $RETURN;
        }

        // no transaction to MWEB
        if (substr($destination, 0, 7) == "ltcmweb")
        {
            $RETURN->answer = "No Transaction to MWEB yet.";
            $RETURN->bool = false;

            return $RETURN;
        }

        // build input
        $input = self::_INPUTBUILD($RETURN->addresspool["default"]["utxo_balance"], $amount);

        // if input build used to much utxos abort
        if ($input->merge)
        {
            $RETURN->answer = "Too much utxos, merge them and try again.";
            $RETURN->bool = false;

            return $RETURN;
        }

        // build output
        $output = array();

        if (isset($input->change))
        {
            // if change is set create change output 
            $output[$RETURN->addresspool["default"]["address"]] = number_format(((float)$input->change + self::$_faucet_amount - 0.00005460), 8, ".", "");
        }

        // create omni output
        $output["LTceXoduS2cetpWJSe47M25i5oKjEccN1h"] = "0.00005460";
        
        // create destination output
        $output[$destination] = number_format($amount, 8, ".", "");

        //var_dump($input, $output);

        // create rawtransaction
        $txid = self::$_node->createrawtransaction($input->list, $output);
        //var_dump($txid);

        // sign rawtransaction
        $signtx = self::$_node->signrawtransactionwithwallet($txid);
        //var_dump($signtx);
        if ($signtx["complete"] == 1)
        {
            // decode rawtransaction
            $txdata = self::$_node->decoderawtransaction($signtx["hex"]);
            //var_dump($txdata);

            if (isset($input->change))
            {
                // read out transaction vsize and subtract from change
                $output[$RETURN->addresspool["default"]["address"]] = (float)$output[$RETURN->addresspool["default"]["address"]] - ($txdata["vsize"] / 100000000);
                
                // check dust range again
                if ($output[$RETURN->addresspool["default"]["address"]] < self::$_dust)
                {
                    // if yes use faucet as buffer and remove change
                    //$output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"] = (float)$output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"] + (float)$output[$RETURN->addresspool["default"]["address"]];
                    //$output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"] = number_format($output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"], 8, ".", "");
                    //unset($output[$RETURN->addresspool["default"]["address"]]);
                }
                else
                {
                    // if no format change
                    //$output[$RETURN->addresspool["default"]["address"]] = number_format($output[$RETURN->addresspool["default"]["address"]], 8, ".", "");
                }
            }
            else
            {
                // if no change is set add dust to faucet output
                //$output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"] = (float)$output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"] + ((float)$input->dust - (($txdata["vsize"] / 100000000)));
                //$output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"] = number_format($output["MCtYmUDUvjCatos2whjAsPaBr2a1nwA1tG"], 8, ".", "");
            }

            //var_dump($input, $output);

            // create final rawtransaction
            $txid = self::$_node->createrawtransaction($input->list, $output);
            //var_dump($txid);

            // send mail to user
            if ($txid)
            {
                if (self::_SENDPREPARE($userdata, $txid, $RETURN->addresspool["default"]["address"], $input, $output, number_format(($txdata["vsize"] / 100000000), 8, ".", "")))
                {
                    $RETURN->answer = "Sending creation prepared, sign it via email";
                    $RETURN->bool = true;
                    $RETURN->input = $input;
                    $RETURN->output = $output;
                    $RETURN->chainfee = number_format(($txdata["vsize"] / 100000000), 8, ".", "");

                    return $RETURN;
                }
                else
                {
                    $RETURN->answer = "Sending creation error, email could not be send";
                    $RETURN->bool = false;

                    return $RETURN;
                }
            }
        }
        else
        {
            $RETURN->answer = "Sending creation error";
            $RETURN->bool = false;

            return $RETURN;
        }
    }

    function DEXaccept($RETURN, $userdata, $property, $amount, $destination)
    {
        // get wallet data
        $RETURN = self::get($RETURN);

        $input = self::_INPUTBUILD($RETURN->addresspool["default"]["utxo_balance"], "0.00005460");
        
        $output = array();

        $output[$RETURN->addresspool["default"]["address"]] = number_format(((float)$input->change + self::$_faucet_amount - 0.00005460), 8, ".", "");
        //$output["LTceXoduS2cetpWJSe47M25i5oKjEccN1h"] = "0.00005460";
        $output[$destination] = "0.00005460";

        $rawtx = self::$_node->createrawtransaction($input->list, $output);

        $payload = self::$_node->omni_createpayload_dexaccept($property, $amount);
        $omnitx = self::$_node->omni_createrawtx_opreturn($rawtx, $payload);

        $signtx = self::$_node->signrawtransactionwithwallet($omnitx);
        //var_dump($rawtx, $payload, $omnitx, $signtx);
        if ($signtx["complete"] == 1)
        {
            // decode rawtransaction
            $txdata = self::$_node->decoderawtransaction($signtx["hex"]);
            //var_dump($txdata);

            $output[$RETURN->addresspool["default"]["address"]] = number_format(((float)$output[$RETURN->addresspool["default"]["address"]] - ($txdata["vsize"] / 100000000)), 8, ".", "");

            $rawtx = self::$_node->createrawtransaction($input->list, $output);

            $payload = self::$_node->omni_createpayload_dexaccept($property, $amount);
            $omnitx = self::$_node->omni_createrawtx_opreturn($rawtx, $payload);

            $signtx = self::$_node->signrawtransactionwithwallet($omnitx);
            $txid = self::$_node->sendrawtransaction($signtx["hex"]);
            var_dump($txid);
        }
    }
}