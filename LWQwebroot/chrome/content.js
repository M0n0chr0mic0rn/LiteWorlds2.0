const __LWQ_SC_NAV = document.getElementById("LWQ_SC_NAV")

const __LWQ_SC_WALLET = document.getElementById("LWQ_SC_WALLET")
const __LWQ_SC_WALLET_address = document.getElementById("LWQ_SC_WALLET_address")
const __LWQ_SC_WALLET_balance = document.getElementById("LWQ_SC_WALLET_balance")
const __LWQ_SC_WALLET_pending = document.getElementById("LWQ_SC_WALLET_pending")

const __LWQ_SC_COINCONTROL = document.getElementById("LWQ_SC_COINCONTROL")

const __LWQ_SC_SIGN = document.getElementById("LWQ_SC_SIGN")

const __LWQ_SC_PROPERTIES = document.getElementById("LWQ_SC_PROPERTIES")
const __LWQ_SC_PROPERTYLIST = document.getElementById("LWQ_SC_PROPERTYLIST")
const __LWQ_SC_CREATEPROPERTY = document.getElementById("LWQ_SC_CREATEPROPERTY")
const __LWQ_SC_TOKEN = document.getElementById("LWQ_SC_TOKEN")
const __LWQ_SC_NFT = document.getElementById("LWQ_SC_NFT")

const LITECOINSPACE = "https://litecoinspace.org/"
const ORDINALSLITE = "https://ordinalslite.com/content/"
const IPFS = "https://ipfs.io/ipfs/"
const LWQ_API = "https://v2.liteworlds.quest/?method="

var REFRESH_INTERVALL = 0
var GLOBCOUNT = 0

var _LWQ_SC_UTXO = new Array()
var _LWQ_SC_NFTLIST = new Array()

var _LWQ_SC_SEED
var _LWQ_SC_PASSWD
var _LWQ_SC_MASTER
var _LWQ_SC_WITNESSSCRIPT
var _LWQ_SC_PRIVATEKEY1
var _LWQ_SC_PRIVATEKEY2

var _LWQ_SC_WALLET

try
{
    document.getElementById("LWQ_SC_NAV").onchange = function()
    {
        let e = document.getElementById("LWQ_SC_NAV_SELECT")

        switch (e.value)
        {
            case "WALLET":
                getWallet()
                break

            case "PROPERTIES":
                displayProperties()
                break

            case "TOKEN":
                displayTokens()
                break

            case "NFT":
                displayNFTLIST()
                break

            default:
                break
        }
    }
}
catch (error)
{
    
}

__init()
function __init()
{
    chrome.storage.local.get("LWQ_SC_PASSWD").then((local) =>
    {
        if (local.LWQ_SC_PASSWD === undefined)
        {
            createPasswd()
        }
        else
        {
            _LWQ_SC_PASSWD = local.LWQ_SC_PASSWD
            chrome.storage.session.get("LWQ_SC_PASSWD").then((session) =>
            {
                if (session.LWQ_SC_PASSWD === undefined)
                {
                    enterPasswd()
                }
                else
                {
                    chrome.storage.local.get("LWQ_SC_MNEMONIC").then((data) =>
                    {
                        if (data.LWQ_SC_MNEMONIC === undefined)
                        {
                            displayMnemonicOptions()
                        }
                        else
                        {
                            _LWQ_SC_SEED = data.LWQ_SC_MNEMONIC

                            __LWQ_SC_NAV.style.display = "inline-block"
                            /*__LWQ_SC_WALLET.style.display = "inline-block"
                            __LWQ_SC_COINCONTROL.style.display = "inline-block"

                            document.getElementById("LWQ_SC_NAV_WALLET").onclick = function()
                            {
                                displayWallet()
                            }
                            document.getElementById("LWQ_SC_NAV_COINCONTROL").onclick = function()
                            {
                                displayUTXO()
                            }
                            document.getElementById("LWQ_SC_NAV_TOKEN").onclick = function()
                            {
                                displayTOKENLIST()
                            }
                            document.getElementById("LWQ_SC_NAV_NFT").onclick = function()
                            {
                                displayNFTLIST()
                            }*/

                            getWallet()
                        }
                    })
                }
            })
        }
    })
}

function __hide()
{
    __LWQ_SC_WALLET.style.display = "none"
    __LWQ_SC_PROPERTIES.style.display = "none"
    __LWQ_SC_NFT.style.display = "none"
    clearInterval(REFRESH_INTERVALL)
}

function getWallet()
{
    litecoin.getMultiSigWallet(2, 2, "normal", _LWQ_SC_SEED, _LWQ_SC_PASSWD).then(function(Wallet)
    {
        _LWQ_SC_WALLET = Wallet
        getToken()
        displayWallet()
    })
}

function getToken()
{
    let url = LWQ_API + "public-address-nft&address=" + _LWQ_SC_WALLET.master
    fetch(url).then((responce) => responce.json()).then
    (
        function(data)
        {
            if (data.length == 0)
            {
                __LWQ_SC_NFT.innerHTML = "No Data"
            }
            else
            {
                // loop into properties
                for (let a = 0; a < data.length; a++)
                {
                    const property = data[a]

                    // request property data
                    let url = LWQ_API + "public-get-property&property=" + property.propertyid
                    fetch(url).then((responce) => responce.json()).then
                    (
                        function(propertydata)
                        {
                            // create new Array in NFTLIST
                            _LWQ_SC_NFTLIST[a] = {
                                property : propertydata,
                                token : new Array()
                            }

                            let property_balance = 0

                            // loop into tokens array
                            for (let b = 0; b < property.tokens.length; b++)
                            {
                                // each subelement = token array
                                const tokens = property.tokens[b]
                                property_balance += tokens.amount

                                // loop into each NFT
                                for (let c = tokens.tokenstart; c <= tokens.tokenend; c++)
                                {
                                    // get NFT data
                                    let url = LWQ_API + "public-get-nft&property=" + property.propertyid + "&token=" + c
                                    fetch(url).then((responce) => responce.json()).then
                                    (
                                        function(NFT)
                                        {
                                            // add new entry in the NFTLIST
                                            _LWQ_SC_NFTLIST[a].token.push(NFT[0])

                                            // on commplete
                                            if (_LWQ_SC_NFTLIST[a].token.length == property_balance)
                                            {
                                                // sort array by NFT index ASC
                                                _LWQ_SC_NFTLIST[a].token.sort(function(a, b){return a.index - b.index})
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    )
                }
            }
        }
    )
}

function displayWallet()
{
    __hide()
    __LWQ_SC_WALLET.style.display = "inline-block"
    let url = "https://litecoinspace.org/api/address/" + _LWQ_SC_WALLET.master + "/utxo"
    fetch(url).then((responce) => responce.json()).then
    (
        function(data)
        {
            data.sort(function(a, b){return a.value - b.value})
            _LWQ_SC_UTXO = data

            let balance = 0
            let a = 0
            for (a = 0; a < data.length; a++)
            {
                const element = data[a]
                balance += element.value
            }

            GLOBCOUNT++

            try
            {
                __LWQ_SC_WALLET_address.innerHTML = "Address: " + _LWQ_SC_WALLET.master

                if (a == 0)
                {
                    __LWQ_SC_WALLET_balance.innerHTML = "BALANCE: empty Pocket!"
                }
                else
                {
                    __LWQ_SC_WALLET_balance.innerHTML = "BALANCE: " + (balance / 100000000) + " LTC (REFRESH#" + GLOBCOUNT + ")" 
                }
            }
            catch (error) {}

            displayUTXO()

            clearInterval(REFRESH_INTERVALL)
            REFRESH_INTERVALL = setTimeout(function()
            {
                displayWallet()
            }, 10000)
        }
    )
}

function displayUTXO()
{
    //__hide()
    //utxo.sort(function(a, b){return a.value - b.value})
    try
    {
        __LWQ_SC_COINCONTROL.innerHTML = ""
        //__LWQ_SC_COINCONTROL.style.display = "inline-block"
    }
    catch (error) {}

    for (let a = 0; a < _LWQ_SC_UTXO.length; a++)
    {
        const element = _LWQ_SC_UTXO[a]
        
        const div = document.createElement("div")
        div.style.width = "98%"
        div.style.border = "1px solid #4AF626"
        div.style.borderRadius = "7px"
        div.style.marginBottom = "0.37em"

        const value = document.createElement("p")
        div.appendChild(value)

        const status = document.createElement("p")
        div.appendChild(status)

        if (element.value > 50000)
        {
            value.innerHTML = element.value + " lits"
        }
        else
        {
            value.innerHTML = element.value + " lits<br>Low Value UTXO!"
            value.style.color = "crimson"
            div.style.border = "1px solid crimson"
        }

        const destination = document.createElement("input")
        div.appendChild(destination)
        destination.classList.add("input-terminal")
        destination.id = element.txid + ":" + element.vout

        const send = document.createElement("button")
        div.appendChild(send)
        send.classList.add("button-terminal")
        send.innerHTML = "SEND"
        send.onclick = function()
        {
            exitUTXO(element.txid, element.vout, element.value)
        }

        
        if (element.status.confirmed)
        {
            status.innerHTML = "confirmed"
        }
        else
        {
            status.innerHTML = "unconfirmed"
            status.style.color = "crimson"
        }

        try
        {
            document.getElementById("LWQ_SC_COINCONTROL").appendChild(div)
        }
        catch (error) {}
    }
}

function displayProperties()
{
    __hide()
    __LWQ_SC_PROPERTYLIST.innerHTML = ""
    __LWQ_SC_CREATEPROPERTY.innerHTML = ""
    __LWQ_SC_PROPERTIES.style.display = "inline-block"
    document.getElementById("LWQ_SC_PROPERTIES_CREATE").style.display = "none"

    let button = document.getElementById("LWQ_SC_PROPERTIES_CREATE")
    button.onclick = function()
    {
        createNewProperty()
    }

    let url = LWQ_API + "public-get-propertylist"
    fetch(url).then((responce) => responce.json()).then(function(data)
    {
        //document.getElementById("LWQ_SC_PROPERTIES_CREATE").style.display = "inline-block"

        let empty = true
        for (let a = 0; a < data.length; a++)
        {
            //throw _LWQ_SC_WALLET.master
            const element = data[a];
            if (element.issuer == _LWQ_SC_WALLET.master)
            {
                empty = false
            }
        }

        if (empty)
        {
            __LWQ_SC_PROPERTYLIST.innerHTML = "No Property Data"
        }
    })
}

function displayNFTLIST()
{
    __hide()
    if (_LWQ_SC_NFTLIST.length == 0)
    {
        __LWQ_SC_NFT.innerHTML = "No Data"
    }
    else
    {
        __LWQ_SC_NFT.innerHTML = ""
    }
    __LWQ_SC_NFT.style.display = "inline-block"

    for (let a = 0; a < _LWQ_SC_NFTLIST.length; a++)
    {
        const property = _LWQ_SC_NFTLIST[a]

        for (let b = 0; b < property.token.length; b++)
        {
            const token = property.token[b]

            try
            {
                let grantdata = token.grantdata

                if (grantdata.includes("{'"))
                {
                    grantdata = grantdata.replaceAll("{'", '{"')
                    grantdata = grantdata.replaceAll("'}", '"}')
                    grantdata = grantdata.replaceAll("':'", '":"')
                    grantdata = grantdata.replaceAll("','", '","')
                }

                grantdata = JSON.parse(grantdata)

                let div = document.createElement("div")
                __LWQ_SC_NFT.appendChild(div)
                div.style.textAlign = "center"
                div.style.width = "8em"
                div.style.marginLeft = "1em"
                div.style.display = "inline-block"
                div.id = property.property.propertyid + "#" + token.index

                let seal = document.createElement("b")
                div.appendChild(seal)
                seal.innerHTML = property.property.propertyid + "#" + token.index

                let image = document.createElement("img")
                div.appendChild(image)
                image.style.width = "8em"
                image.style.height = "8em"

                image.onclick = function()
                {
                    displayNFT(div.id)
                }

                // LiteWorlds Formatting
                if (grantdata.hasOwnProperty("structure"))
                {
                    // Artefactual
                    if (grantdata.structure == "artefactual")
                    {
                        div.style.border = "1px solid crimson"

                        let url = ORDINALSLITE + grantdata.json
                        fetch(url).then((responce) => responce.json()).then
                        (
                            function(ord_json)
                            {
                                image.src = ORDINALSLITE + ord_json.content[0]
                            }
                        )
                    }

                    // Epic
                    if (grantdata.structure == "epic")
                    {
                        div.style.border = "1px solid deepskyblue"

                        if (grantdata.source == "ipfs")
                        {
                            image.src = IPFS + grantdata.content
                        }

                        if (grantdata.source == "ordinal")
                        {
                            image.src = ORDINALSLITE + grantdata.content
                        }
                    }
                }
                else
                {
                    // LiteVerse Formatting
                    if (grantdata.hasOwnProperty("image"))
                    {
                        image.src = IPFS + grantdata.image.split("ipfs://")[1]
                        div.style.border = "1px solid gold"
                    }
                }

            }
            catch (error) {
                throw error
            }
        }
    }
}

function displayNFT(id)
{
    let propertyid = id.split("#")[0]
    let tokenid = id.split("#")[1]

    try
    {
        __LWQ_SC_NFT.innerHTML = ""
    }
    catch (error) {}

    for (let a = 0; a < _LWQ_SC_NFTLIST.length; a++)
    {
        const property = _LWQ_SC_NFTLIST[a]
        if (property.property.propertyid == propertyid)
        {
            for (let b = 0; b < property.token.length; b++)
            {
                const token = property.token[b]
                if (token.index == tokenid)
                {
                    try
                    {
                        let grantdata = token.grantdata

                        if (grantdata.includes("{'"))
                        {
                            grantdata = grantdata.replaceAll("{'", '{"')
                            grantdata = grantdata.replaceAll("'}", '"}')
                            grantdata = grantdata.replaceAll("':'", '":"')
                            grantdata = grantdata.replaceAll("','", '","')
                        }

                        grantdata = JSON.parse(grantdata)

                        let div = document.createElement("div")
                        __LWQ_SC_NFT.appendChild(div)
                        div.style.textAlign = "center"
                        div.style.width = "20em"
                        div.style.height = "20em"
                        div.style.marginLeft = "1em"
                        div.style.display = "inline-block"
                        div.id = id

                        let p = document.createElement("p")
                        div.appendChild(p)
                        p.innerHTML = id
                        p.style.fontSize = "1.37em"
                        

                        let image = document.createElement("img")
                        div.appendChild(image)
                        image.style.width = "20em"
                        image.style.height = "20em"

                        let destination = document.createElement("input")
                        div.appendChild(destination)
                        destination.classList.add("input-terminal")
                        destination.style.marginTop = "0.37em"
                        destination.style.marginBottom = "0.37em"

                        let br = document.createElement("br")
                        div.appendChild(br)

                        let send = document.createElement("button")
                        div.appendChild(send)
                        send.classList.add("button-terminal")
                        send.style.marginBottom = "0.37em"
                        send.innerHTML = "SEND TOKEN"
                        send.onclick = function()
                        {
                            createSendNFT(id, destination.value)
                        }

                        if (grantdata.hasOwnProperty("structure"))
                        {
                            if (grantdata.structure == "artefactual")
                            {
                                let url = ORDINALSLITE + grantdata.json
                                fetch(url).then((responce) => responce.json()).then
                                (
                                    function(ord_json)
                                    {
                                        image.src = ORDINALSLITE + ord_json.content[0]
                                    }
                                )
                            }

                            if (grantdata.structure == "epic")
                            {
                                if (grantdata.source == "ipfs")
                                {
                                    image.src = IPFS + grantdata.content
                                }

                                if (grantdata.source == "ordinal")
                                {
                                    image.src = ORDINALSLITE + grantdata.content
                                }
                            }
                        }
                        else
                        {
                            if (grantdata.hasOwnProperty("image"))
                            {
                                image.src = IPFS + grantdata.image.split("ipfs://")[1]
                            }
                        }
                    }
                    catch (error) {
                        throw error
                    }
                }
            }
        }      
    }
}


function createPasswd()
{
    document.getElementById("LWQ_SC_create_passwd").style.display = "inline-block"
    document.getElementById("LWQ_SC_create_passwd_button").onclick = function()
    {
        setPasswd()
    }
}

function setPasswd()
{
    let passwd = "empty"
    let prove = "something else"

    try
    {
        passwd = document.getElementById("LWQ_SC_create_passwd_passwd").value
        prove = document.getElementById("LWQ_SC_create_passwd_prove").value
    }
    catch (error) {}

    if (passwd === prove)
    {
        chrome.storage.local.set({"LWQ_SC_PASSWD": passwd})
        document.getElementById("LWQ_SC_create_passwd").style.display = "none"
        __init()
    }
    else
    {
        document.getElementById("LWQ_SC_create_passwd_button").innerHTML = "Passwords dont match"
        setTimeout(function()
        {
            document.getElementById("LWQ_SC_create_passwd_button").innerHTML = "Save Password"
        }, 3000)
    }
}

function enterPasswd()
{
    document.getElementById("LWQ_SC_enter_passwd").style.display = "inline-block"
    document.getElementById("LWQ_SC_enter_passwd_button").onclick = function()
    {
        unlockExtension()
    }
}

function unlockExtension()
{
    let passwd = document.getElementById("LWQ_SC_enter_passwd_passwd").value

    if (_LWQ_SC_PASSWD === passwd)
    {
        chrome.storage.session.set({"LWQ_SC_PASSWD": passwd})
        document.getElementById("LWQ_SC_enter_passwd").style.display = "none"
    }
    else
    {
        document.getElementById("LWQ_SC_enter_passwd_passwd").value = ""
        document.getElementById("LWQ_SC_enter_passwd_button").innerHTML = "Password wrong"
        setTimeout(function()
        {
            document.getElementById("LWQ_SC_enter_passwd_button").innerHTML = "unlock"
        }, 3000)
    }
    __init()

}

function displayMnemonicOptions()
{
    document.getElementById("LWQ_SC_mnemonic").style.display = "inline-block"

    document.getElementById("LWQ_SC_mnemonic_button_create").onclick = function()
    {
        document.getElementById("LWQ_SC_mnemonic").style.display = "none"
        createMnemonicSeed()
    }

    document.getElementById("LWQ_SC_mnemonic_button_enter").onclick = function()
    {
        document.getElementById("LWQ_SC_mnemonic").style.display = "none"
        enterMnemonicSeed()
    }
}

function createMnemonicSeed()
{
    document.getElementById("LWQ_SC_mnemonic_create").style.display = "inline-block"
    _LWQ_SC_SEED = bip39.generateMnemonic()

    for (let a = 0; a < _LWQ_SC_SEED.split(" ").length; a++)
    {
        const element = _LWQ_SC_SEED.split(" ")[a]
        
        document.getElementById("LWQ_SC_mnemonic_create_table_" + a).innerHTML = element
        /*let tr = document.createElement("tr")
        let td1 = document.createElement("td")
        let td2 = document.createElement("td")

        td1.innerHTML = a +1
        td2.innerHTML = element

        tr.appendChild(td1)
        tr.appendChild(td2)
        document.getElementById("LWQ_SC_mnemonic_create_table").appendChild(tr)*/
    }

    let cooldown = 9
    let interval = setInterval(function()
    {
        if (cooldown <= 0)
        {
            document.getElementById("LWQ_SC_mnemonic_create_button").innerHTML = "Start Seed Prove"
            document.getElementById("LWQ_SC_mnemonic_create_button").disabled = false
            document.getElementById("LWQ_SC_mnemonic_create_button").classList.add("button-terminal")
            document.getElementById("LWQ_SC_mnemonic_create_button").classList.remove("button-crimson")
            document.getElementById("LWQ_SC_mnemonic_create_button").onclick = function()
            {
                document.getElementById("LWQ_SC_mnemonic_create").style.display = "none"
                proveMnemonicSeed()
            }
            clearInterval(interval)
        }
        else
        {
            document.getElementById("LWQ_SC_mnemonic_create_button").innerHTML = "Start Seed Prove (" + cooldown + ")"
            cooldown--
        }
    }, 1000)
}

function proveMnemonicSeed()
{
    document.getElementById("LWQ_SC_mnemonic_prove").style.display = "inline-block"

    let rand = new Array()
    rand[0] = Math.floor(Math.random() * 12)
    do
    {
        rand[1] = Math.floor(Math.random() * 12)
    }
    while (rand[1] == rand[0])

    do
    {
        rand[2] = Math.floor(Math.random() * 12)
    }
    while (rand[2] == rand[0] || rand[2] == rand[1])

    document.getElementById("LWQ_SC_mnemonic_prove_word").innerHTML = "Enter Seed Word " + (rand[0] + 1) + " and hit Double Check"
    document.getElementById("LWQ_SC_mnemonic_prove_button").onclick = function()
    {
        seedProve(rand, 0)
    }
}

function seedProve(rand, index)
{
    let seed_word = _LWQ_SC_SEED.split(" ")[rand[index]]
    let seed_word_input = document.getElementById("LWQ_SC_mnemonic_prove_input").value

    if (seed_word == seed_word_input)
    {
        if (index < 2)
        {
            document.getElementById("LWQ_SC_mnemonic_prove_word").innerHTML = "Enter Seed Word " + (rand[index +1] +1) + " and hit Double Check"
            document.getElementById("LWQ_SC_mnemonic_prove_input").value = ""
            document.getElementById("LWQ_SC_mnemonic_prove_button").onclick = function()
            {
                seedProve(rand, index +1)
            }
        }
        else
        {
            // seed prove done
            document.getElementById("LWQ_SC_mnemonic_prove").remove()
            document.getElementById("LWQ_SC_mnemonic_create").remove()

            chrome.storage.local.set({"LWQ_SC_MNEMONIC": _LWQ_SC_SEED})
            __init()
        }
    }
    else
    {
        document.getElementById("LWQ_SC_mnemonic_prove_input").value = ""
        document.getElementById("LWQ_SC_mnemonic_prove_button").innerHTML = "Wrong word"
        document.getElementById("LWQ_SC_mnemonic_prove_button").classList.add("button-crimson")
        document.getElementById("LWQ_SC_mnemonic_prove_button").classList.remove("button-terminal")
        setTimeout(function()
        {
            document.getElementById("LWQ_SC_mnemonic_prove_button").innerHTML = "Double Check"
            document.getElementById("LWQ_SC_mnemonic_prove_button").classList.add("button-terminal")
            document.getElementById("LWQ_SC_mnemonic_prove_button").classList.remove("button-crimson")
        }, 3000)
    }
}

function enterMnemonicSeed()
{
    document.getElementById("LWQ_SC_mnemonic_enter").style.display = "inline-block"

    const inputHandler = function(data)
    {
        validateSeed()
    }
    
    for (let a = 0; a < 6; a++)
    {
        let tr = document.createElement("tr")
        
        let td1 = document.createElement("td")
        let td2 = document.createElement("td")
        let td3 = document.createElement("td")
        let td4 = document.createElement("td")

        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)

        document.getElementById("LWQ_SC_mnemonic_enter_table").appendChild(tr)

        let input1 = document.createElement("input")
        let input2 = document.createElement("input")

        td2.appendChild(input1)
        td4.appendChild(input2)

        td1.innerHTML = a +a +1
        td3.innerHTML = a +a +2

        input1.classList.add("input-terminal")
        input2.classList.add("input-terminal")

        input1.style.width = "7.3em"
        input2.style.width = "7.3em"

        input1.id = "LWQ_SC_SEEDWORD" + (a +a +1)
        input2.id = "LWQ_SC_SEEDWORD" + (a +a +2)

        input1.addEventListener("input", inputHandler)
        input2.addEventListener("input", inputHandler)
    }

}

function validateSeed()
{
    let seed = ""

    for (let a = 1; a <= 12; a++)
    {
        const element = document.getElementById("LWQ_SC_SEEDWORD" + a).value
        
        if (a < 12)
        {
            seed += element + " "
        }
        else
        {
            seed += element
        }
    }

    let ding = bip39.validateMnemonic(seed)
    if (ding)
    {
        // seed valid
        document.getElementById("LWQ_SC_mnemonic_enter_button").classList.add("button-terminal")
        document.getElementById("LWQ_SC_mnemonic_enter_button").classList.remove("button-crimson")
        document.getElementById("LWQ_SC_mnemonic_enter_button").innerHTML = "Continue"
        document.getElementById("LWQ_SC_mnemonic_enter_button").disabled = false
        document.getElementById("LWQ_SC_mnemonic_enter_button").onclick = function()
        {
            chrome.storage.local.set({"LWQ_SC_MNEMONIC": seed})
            document.getElementById("LWQ_SC_mnemonic_enter").style.display = "none"
            __init()
        }
    }
    else
    {
        // seed not valid
        document.getElementById("LWQ_SC_mnemonic_enter_button").classList.add("button-crimson")
        document.getElementById("LWQ_SC_mnemonic_enter_button").classList.remove("button-terminal")
        document.getElementById("LWQ_SC_mnemonic_enter_button").innerHTML = "Not a Mnemonic-Seed"
        document.getElementById("LWQ_SC_mnemonic_enter_button").onclick = null
        document.getElementById("LWQ_SC_mnemonic_enter_button").disabled = true
    }
}

function createNewProperty()
{
    __LWQ_SC_CREATEPROPERTY.innerHTML = ""
    __LWQ_SC_PROPERTYLIST.innerHTML = ""
    document.getElementById("LWQ_SC_PROPERTIES_CREATE").style.display = "none"

    const name = document.createElement("input")
    const category = document.createElement("input")
    const subcategory = document.createElement("input")
    const url = document.createElement("input")
    const structure = document.createElement("select")
    const content = document.createElement("input")
    const contentType = document.createElement("select")
    const source = document.createElement("select")
    const ecosystem = document.createElement("select")
    const tokentype = document.createElement("select")
    const fixed = document.createElement("select")
    const amount = document.createElement("input")

    name.id = "LWQ_SC_CP_name"
    category.id = "LWQ_SC_CP_category"
    subcategory.id = "LWQ_SC_CP_subcategory"
    url.id = "LWQ_SC_CP_url"
    structure.id = "LWQ_SC_CP_structure"
    content.id = "LWQ_SC_CP_content"
    contentType.id = "LWQ_SC_CP_contenttype"
    source.id = "LWQ_SC_CP_source"
    ecosystem.id = "LWQ_SC_CP_ecosystem"
    tokentype.id = "LWQ_SC_CP_tokentype"
    fixed.id = "LWQ_SC_CP_fixed"
    amount.id = "LWQ_SC_CP_amount"

    name.classList.add("input-terminal")
    category.classList.add("input-terminal")
    subcategory.classList.add("input-terminal")
    url.classList.add("input-terminal")
    content.classList.add("input-terminal")
    amount.classList.add("input-terminal")

    structure.classList.add("select-terminal")
    contentType.classList.add("select-terminal")
    source.classList.add("select-terminal")
    ecosystem.classList.add("select-terminal")
    tokentype.classList.add("select-terminal")
    fixed.classList.add("select-terminal")

    const EPIC = document.createElement("option")
    EPIC.innerHTML = "EPIC (IPFS/ORDINAL)"
    EPIC.value = "epic"
    const ARTEFACTUAL = document.createElement("option")
    ARTEFACTUAL.innerHTML = "ARTEFACTUAL (ORDINAL JSON)"
    ARTEFACTUAL.value = "artefactual"
    structure.appendChild(EPIC)
    structure.appendChild(ARTEFACTUAL)

    const CTimage = document.createElement("option")
    CTimage.innerHTML = "Image"
    CTimage.value = "image"
    const CTaudio = document.createElement("option")
    CTaudio.innerHTML = "Audio"
    CTaudio.value = "audio"
    const CTvideo = document.createElement("option")
    CTvideo.innerHTML = "Video"
    CTvideo.value = "video"
    const CTtext = document.createElement("option")
    CTtext.innerHTML = "Text"
    CTtext.value = "text"
    contentType.appendChild(CTimage)
    contentType.appendChild(CTaudio)
    contentType.appendChild(CTvideo)
    contentType.appendChild(CTtext)

    const Sipfs = document.createElement("option")
    Sipfs.innerHTML = "IPFS"
    Sipfs.value = "ipfs"
    const Sord = document.createElement("option")
    Sord.innerHTML = "Ordinal"
    Sord.value = "ordinal"
    source.appendChild(Sipfs)
    source.appendChild(Sord)

    const Emain = document.createElement("option")
    Emain.innerHTML = "Main"
    Emain.value = "main"
    const Etest = document.createElement("option")
    Etest.innerHTML = "Test"
    Etest.value = "test"
    ecosystem.appendChild(Emain)
    ecosystem.appendChild(Etest)

    const TTindi =  document.createElement("option")
    TTindi.innerHTML = "Indivisible"
    TTindi.value = "indivisible"
    const TTdivi =  document.createElement("option")
    TTdivi.innerHTML = "Divisible"
    TTdivi.value = "divisible"
    const TTnft =  document.createElement("option")
    TTnft.innerHTML = "NFT"
    TTnft.value = "nft"
    tokentype.appendChild(TTindi)
    tokentype.appendChild(TTdivi)
    tokentype.appendChild(TTnft)

    const Fyes = document.createElement("option")
    Fyes.innerHTML = "Fixed"
    Fyes.value = "fixed"
    const Fno = document.createElement("option")
    Fno.innerHTML = "Managed"
    Fno.value = "managed"
    fixed.appendChild(Fyes)
    fixed.appendChild(Fno)

    const table = document.createElement("table")
    __LWQ_SC_CREATEPROPERTY.appendChild(table)

    const button = document.createElement("button")
    __LWQ_SC_CREATEPROPERTY.appendChild(button)
    button.innerHTML = "create Property"
    button.classList.add("button-terminal")
    button.onclick = function()
    {
        mintProperty(name.value, category.value, subcategory.value, url.value, structure.value, content.value, contentType.value, source.value, ecosystem.value, tokentype.value, fixed.value, amount.value)
    }

    for (let a = 0; a < 12; a++)
    {
        const tr = document.createElement("tr")
        const td1 = document.createElement("td")
        const td2 = document.createElement("td")

        table.appendChild(tr)
        tr.appendChild(td1)
        tr.appendChild(td2)

        switch (a)
        {
            case 0:
                td1.innerHTML = "Name"
                td2.appendChild(name)
                break

            case 1:
                td1.innerHTML = "Category"
                td2.appendChild(category)
                break

            case 2:
                td1.innerHTML = "SubCategory"
                td2.appendChild(subcategory)
                break

            case 3:
                td1.innerHTML = "URL"
                td2.appendChild(url)
                break

            case 4:
                td1.innerHTML = "Structure"
                td2.appendChild(structure)
                break

            case 5:
                td1.innerHTML = "Content"
                td2.appendChild(content)
                break

            case 6:
                td1.innerHTML = "Content Type"
                td2.appendChild(contentType)
                break

            case 7:
                td1.innerHTML = "Source"
                td2.appendChild(source)
                break

            case 8:
                td1.innerHTML = "Ecosystem"
                td2.appendChild(ecosystem)
                break

            case 9:
                td1.innerHTML = "Token Type"
                td2.appendChild(tokentype)
                break

            case 10:
                td1.innerHTML = "Amount Type"
                td2.appendChild(fixed)
                break
        
            case 11:
                td1.innerHTML = "Amount"
                td2.appendChild(amount)
                break

            default:
                break
        }
    }
}

function mintProperty(name, category, subcategory, url, structure, content, contenttype, source, ecosystem, tokentype, fixed, amount)
{
    let fetch_url = LITECOINSPACE + "api/address/" + _LWQ_SC_WALLET.master + "/utxo"
    fetch(fetch_url).then((responce) => responce.json()).then(function(utxo)
    {
        let totalamount = 0
        let sendingamount = 21180
        let fee = 22200
        let input = new Array()

        // take as much utxos we need for minimal input
        for (let a = 0; a < utxo.length; a++)
        {
            const element = utxo[a]
            if (element.value > 50000)
            {
                totalamount = element.value

                let obj = new Object()
                obj.txid = element.txid
                obj.index = element.vout
                obj.amount = element.value
                input.push(obj)

                a = utxo.length
            }
        }

        // create the raw transaction (client side)
        litecoin.newMultiSigTransaction({
            network: "normal",
            witnessScript: _LWQ_SC_WALLET.witnessScript,
            keys: [_LWQ_SC_WALLET.keys[0].wif], // The transaction builder needs a private key or it runs into error -> this wont get used at this time
            signatures: 2,
            utxo: input,
            output: [
            {
                address: _LWQ_SC_WALLET.master,
                amount: totalamount - fee
            }],
            fee: fee
        }).then(function(data)
        {
            fetch_url = LWQ_API + "public-payload-mintproperty&name=" + name + "&category=" + category + "&subcategory=" + subcategory + "&url=" + url + "&structure=" + structure + "&content=" + content + "&contenttype=" + contenttype + "&source=" + source + "&ecosystem=" + ecosystem + "&tokentype=" + tokentype + "&fixed=" + fixed + "&amount=" + amount + "&txid=" + data.unsignedtx
            fetch(fetch_url).then((responce) => responce.json()).then(function(data)
            {
                //throw data.txid + " - " + data.payload
                // sign the modified raw transaction (client side)
                litecoin.signPartialMultiSigTransaction({
                    network: "normal",
                    rawTransaction: data.txid,
                    witnessScript: _LWQ_SC_WALLET.witnessScript,
                    keys: [_LWQ_SC_WALLET.keys[0].wif],
                    utxo: input,
                    totalSignatures: 2,
                    state: 'incomplete'
                }).then(function(data)
                {

                    litecoin.signPartialMultiSigTransaction({
                        network: "normal",
                        rawTransaction: data.rawTransaction,
                        witnessScript: _LWQ_SC_WALLET.witnessScript,
                        keys: [_LWQ_SC_WALLET.keys[1].wif],
                        utxo: input,
                        totalSignatures: 2,
                        state: 'incomplete'
                    }).then(function(data)
                    {
                        throw data.rawTransaction
                        // submit to mempool
                        let url = "https://v2.liteworlds.quest/mempool-submit.php"
                        fetch(url, {
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(data.rawTransaction)
                        }).then((responce) => responce.json()).then
                        (
                            function(data)
                            {
                                throw data.answer
                                if (data.bool)
                                {
                                    //document.getElementById(id).remove()
                                } 
                            }
                        )
                    })
                })
            })
        })
    })

    
    //throw encodeURI(fetch_url)
    
}

function createSendNFT(id, destination)
{
    let propertyid = id.split("#")[0]
    let tokenid = id.split("#")[1]

    // request the utxo / unspent information data from litecoinspace.org
    let url = LITECOINSPACE + "api/address/" + _LWQ_SC_WALLET.master + "/utxo"
    fetch(url).then((responce) => responce.json()).then
    (
        function(utxo)
        {
            let totalamount = 0
            let sendingamount = 10000
            let fee = 255
            let input = new Array()

            // take one utxo with a value greater then 50k
            for (let a = 0; a < utxo.length; a++)
            {
                const element = utxo[a]
                if (element.value > 50000)
                {
                    totalamount = element.value

                    let obj = new Object()
                    obj.txid = element.txid
                    obj.index = element.vout
                    obj.amount = element.value
                    input.push(obj)

                    a = utxo.length
                }
            }

            // create the raw transaction (client side)
            litecoin.newMultiSigTransaction({
                network: "normal",
                witnessScript: _LWQ_SC_WALLET.witnessScript,
                keys: [_LWQ_SC_WALLET.keys[0].wif], // The transaction builder needs a private key or it runs into error -> this wont get used at this time
                signatures: 2,
                utxo: input,
                output: [
                {
                    address: _LWQ_SC_WALLET.master,
                    amount: totalamount - sendingamount - fee
                },{
                    address: destination,
                    amount: sendingamount
                }],
                fee: fee
            }).then(function(data)
            {
                //(data.unsignedtx) // the prepared and unsigned transaction hex

                // send the raw transaction to liteworlds.quest to create and add the payload for omnilite operation/action (server side)
                let url = LWQ_API + "public-payload-sendnft&txid=" + data.unsignedtx + "&property=" + propertyid + "&tokenstart=" + tokenid + "&tokenend=" + tokenid
                fetch(url).then((responce) => responce.json()).then
                (
                    function(data)
                    {

                        // sign the modified raw transaction step 1 (client side)
                        litecoin.signPartialMultiSigTransaction({
                            network: "normal",
                            rawTransaction: data.txid,
                            witnessScript: _LWQ_SC_WALLET.witnessScript,
                            keys: [_LWQ_SC_WALLET.keys[0].wif],
                            utxo: input,
                            totalSignatures: 2,
                            state: 'incomplete'
                        }).then(function(data)
                        {
                            sign(data.rawTransaction, destination, input, "Send NFT " + propertyid + "#" + tokenid)
                        })
                    }
                )
            })
        }
    )
}

function exitUTXO(txid, vout, value)
{
    let destination = document.getElementById(txid + ":" + vout).value

    let input = new Array()
    let obj = new Object()
    obj.txid = txid
    obj.index = vout
    obj.amount = value
    input.push(obj)

    litecoin.newMultiSigTransaction({
        network: "normal",
        witnessScript: _LWQ_SC_WALLET.witnessScript,
        keys: [_LWQ_SC_WALLET.keys[0].wif],
        signatures: 2,
        utxo: input,
        output: [
        {
            address: destination,
            amount: value - 200
        }],
        fee: 200
    }).then(function(data)
    {
        sign(data.rawTransaction, destination, input, "none")
    })
}

function sign(txid, destination, input, action)
{
    __hide()

    try
    {
        __LWQ_SC_SIGN.style.display = "inline-block"
        document.getElementById("LWQ_SC_SIGN_txid").innerHTML = "TXID<br>" + txid.substring(0,10) + "..." + txid.substring((txid.length - 10), txid.length)
        document.getElementById("LWQ_SC_SIGN_amount").innerHTML = "Amount<br>" + input[0].amount + " lits"
        document.getElementById("LWQ_SC_SIGN_destination").innerHTML = "Destination<br>" + destination
        document.getElementById("LWQ_SC_SIGN_omnilite").innerHTML = "Omnilite Action<br>" + action
        document.getElementById("LWQ_SC_SIGN_button").onclick = function()
        {
            litecoin.signPartialMultiSigTransaction({
                network: "normal",
                rawTransaction: txid,
                witnessScript: _LWQ_SC_WALLET.witnessScript,
                keys: [_LWQ_SC_WALLET.keys[1].wif],
                utxo: input,
                totalSignatures: 2,
                state: 'incomplete'
            }).then(function(data)
            {
                // submit to mempool
                let url = "https://v2.liteworlds.quest/mempool-submit.php"
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data.rawTransaction)
                }).then((responce) => responce.json()).then
                (
                    function(data)
                    {
                        document.getElementById("LWQ_SC_SIGN_output").innerHTML = "<a style=\"text-decoration: none; color: #4AF626\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://litecoinspace.org/tx/" + data.txid + "\">" + data.answer + " <br>Click here to see your Transaction</a>"
                        setTimeout(function(){
                            document.getElementById("LWQ_SC_SIGN_output").innerHTML = ""
                            getWallet()
                        }, 5000)
                    }
                )
            })
        }
    }
    catch (error)
    {
        
    }
}

/*
function getToken()
{
    try
    {
        document.getElementById("LWQ_SC_DISPLAY_NFTLIST").innerHTML = ""
        document.getElementById("LWQ_SC_DISPLAY_NFT").innerHTML = ""
    }
    catch (error) {}

    let url = LWQ_API + "public-address-nft&address=" + _LWQ_SC_MASTER
    fetch(url).then((responce) => responce.json()).then
    (
        function(data)
        {
            TOKEN = data

            if (TOKEN.length == 0)
            {
                try
                {
                    document.getElementById("LWQ_SC_DISPLAY_NFTLIST").innerHTML = "No NFT's found on this address"
                } 
                catch (error) {}
            }
            else
            {
                // loop into properties
                for (let a = 0; a < data.length; a++)
                {
                    // each element = a property
                    const element = data[a]

                    // request property data
                    let url = LWQ_API + "public-get-property&property=" + element.propertyid
                    fetch(url).then((responce) => responce.json()).then
                    (
                        function(propertydata)
                        {
                            // create new Array in NFTLIST
                            _LWQ_SC_NFTLIST[a] = {
                                property : propertydata,
                                token : new Array()
                            }
                            let property_balance = 0

                            // loop into tokens array
                            for (let b = 0; b < element.tokens.length; b++)
                            {
                                // each subelement = token array
                                const subelement = element.tokens[b]
                                property_balance += subelement.amount

                                // loop into each NFT
                                for (let c = subelement.tokenstart; c <= subelement.tokenend; c++)
                                {
                                    // get NFT data
                                    let url = LWQ_API + "public-get-nft&property=" + element.propertyid + "&token=" + c
                                    fetch(url).then((responce) => responce.json()).then
                                    (
                                        function(NFT)
                                        {
                                            // add new entry in the NFTLIST
                                            _LWQ_SC_NFTLIST[a].token.push(NFT[0])

                                            // on commplete
                                            if (_LWQ_SC_NFTLIST[a].token.length == property_balance)
                                            {
                                                // sort array by NFT index ASC
                                                _LWQ_SC_NFTLIST[a].token.sort(function(a, b){return a.index - b.index})

                                                // display NFTs
                                                // displayNFTLIST(element.propertyid)
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    )
                }
            }
        }
    )
}





function displayNFTLIST()
{
    for (let a = 0; a < _LWQ_SC_NFTLIST.length; a++) {
        const property = _LWQ_SC_NFTLIST[a]
        for (let b = 0; b < property.token.length; b++)
        {
            const token = property.token[b]

            try
            {
                document.getElementById("LWQ_SC_DISPLAY_NFTLIST").innerHTML = ""
                document.getElementById("LWQ_SC_DISPLAY_NFT").innerHTML = ""

                let grantdata = JSON.parse(token.grantdata)

                let div = document.createElement("div")
                div.style.textAlign = "center"
                div.style.width = "8em"
                div.style.height = "8em"
                div.style.marginLeft = "1em"
                div.id = property.property.propertyid + "#" + token.index

                let seal = document.createElement("b")
                div.appendChild(seal)
                seal.innerHTML = property.property.propertyid + "#" + token.index

                let image = document.createElement("img")
                div.appendChild(image)
                image.style.width = "8em"
                image.style.height = "8em"

                image.onclick = function()
                {
                    displayNFT(div.id)
                }

                if (grantdata.structure == "artefactual")
                {
                    let url = ORDINALSLITE + grantdata.json
                    fetch(url).then((responce) => responce.json()).then
                    (
                        function(ord_json)
                        {
                            image.src = ORDINALSLITE + ord_json.content[0]
                        }
                    )
                }

                if (grantdata.structure == "epic")
                {
                    if (grantdata.source == "ipfs")
                    {
                        image.src = IPFS + grantdata.content
                    }
                }

                document.getElementById("LWQ_SC_DISPLAY_NFTLIST").appendChild(div)
            }
            catch (error)
            {

            }
        }
    }
}

function displayNFT(id)
{
    let propertyid = id.split("#")[0]
    let tokenid = id.split("#")[1]

    try
    {
        document.getElementById("LWQ_SC_DISPLAY_NFTLIST").innerHTML = ""
        document.getElementById("LWQ_SC_DISPLAY_NFT").innerHTML = ""
    }
    catch (error) {}

    for (let a = 0; a < _LWQ_SC_NFTLIST.length; a++)
    {
        const property = _LWQ_SC_NFTLIST[a]
        if (property.property.propertyid == propertyid)
        {
            for (let b = 0; b < property.token.length; b++)
            {
                const token = property.token[b]
                if (token.index == tokenid)
                {
                    try
                    {
                        let grantdata = JSON.parse(token.grantdata)

                        let div = document.createElement("div")
                        div.style.textAlign = "center"
                        div.style.width = "20em"
                        div.style.height = "20em"
                        div.style.marginLeft = "2em"
                        div.id = id

                        let image = document.createElement("img")
                        div.appendChild(image)
                        image.style.width = "20em"
                        image.style.height = "20em"
                        image.style.marginLeft = "2em"

                        let destination = document.createElement("input")
                        div.appendChild(destination)

                        let send = document.createElement("button")
                        div.appendChild(send)
                        send.innerHTML = "SEND TOKEN"
                        send.onclick = function()
                        {
                            createSendNFT(id, destination.value)
                        }

                        if (grantdata.structure == "artefactual")
                        {
                            let url = ORDINALSLITE + grantdata.json
                            fetch(url).then((responce) => responce.json()).then
                            (
                                function(ord_json)
                                {
                                    image.src = ORDINALSLITE + ord_json.content[0]
                                }
                            )
                        }

                        if (grantdata.structure == "epic")
                        {
                            if (grantdata.source == "ipfs")
                            {
                                image.src = IPFS + grantdata.content
                            }
                        }

                        try
                        {
                            document.getElementById("LWQ_SC_DISPLAY_NFT").appendChild(div)
                        }
                        catch (error) {}
                    }
                    catch (error) {
                    }
                }
            }
        }      
    }
}

function createSendNFT(id, destination)
{
    let propertyid = id.split("#")[0]
    let tokenid = id.split("#")[1]

    //let destination = document.getElementById("NFT-destination").value

    // request the utxo / unspent information data from litecoinspace.org
    let url = LITECOINSPACE + "api/address/" + _LWQ_SC_MASTER + "/utxo"
    fetch(url).then((responce) => responce.json()).then
    (
        function(utxo)
        {
            let totalamount = 0
            let sendingamount = 10000
            let fee = 255
            let input = new Array()

            // take as much utxos we need for minimal input
            for (let a = 0; a < utxo.length; a++)
            {
                const element = utxo[a]
                if (element.value > 50000)
                {
                    totalamount = element.value

                    let obj = new Object()
                    obj.txid = element.txid
                    obj.index = element.vout
                    obj.amount = element.value
                    input.push(obj)

                    a = utxo.length
                }
            }

            // create the raw transaction (client side)
            litecoin.newMultiSigTransaction({
                network: "normal",
                witnessScript: _LWQ_SC_WITNESSSCRIPT,
                keys: [_LWQ_SC_PRIVATEKEY1], // The transaction builder needs a private key or it runs into error -> this wont get used at this time
                signatures: 2,
                utxo: input,
                output: [
                {
                    address: _LWQ_SC_MASTER,
                    amount: totalamount - sendingamount - fee
                },{
                    address: destination,
                    amount: sendingamount
                }],
                fee: fee
            }).then(function(data)
            {

                // send the raw transaction to liteworlds.quest to create and add the payload for omnilite operation/action (server side)
                let url = LWQ_API + "public-payload-sendnft&txid=" + data.unsignedtx + "&property=" + propertyid + "&tokenstart=" + tokenid + "&tokenend=" + tokenid
                fetch(url).then((responce) => responce.json()).then
                (
                    function(data)
                    {

                        // sign the modified raw transaction (client side)
                        litecoin.signPartialMultiSigTransaction({
                            network: "normal",
                            rawTransaction: data.txid,
                            witnessScript: _LWQ_SC_WITNESSSCRIPT,
                            keys: [_LWQ_SC_PRIVATEKEY1],
                            utxo: input,
                            totalSignatures: 2,
                            state: 'incomplete'
                        }).then(function(data)
                        {

                            litecoin.signPartialMultiSigTransaction({
                                network: "normal",
                                rawTransaction: data.rawTransaction,
                                witnessScript: _LWQ_SC_WITNESSSCRIPT,
                                keys: [_LWQ_SC_PRIVATEKEY2],
                                utxo: input,
                                totalSignatures: 2,
                                state: 'incomplete'
                            }).then(function(data)
                            {

                                // submit to mempool
                                let url = "https://v2.liteworlds.quest/mempool-submit.php"
                                fetch(url, {
                                    method: "POST",
                                    headers: {
                                        "Accept": "application/json",
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(data.rawTransaction)
                                }).then((responce) => responce.json()).then
                                (
                                    function(data)
                                    {
                                        if (data.bool)
                                        {
                                            document.getElementById(id).remove()
                                        } 
                                    }
                                )
                            })
                        })
                    }
                )
            })
        }
    )
}*/