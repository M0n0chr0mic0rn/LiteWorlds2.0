const LITECOINSPACE = "https://litecoinspace.org/"
const ORD_CONTENT = "http://ordi.liteworlds.quest/content/"
const ORD_TX = "http://ordi.liteworlds.quest/output/"
const IPFS = "https://ipfs.io/ipfs/"
const LWQ_API = "https://v2.liteworlds.quest/?method="

const __LWQ_SC_STATLWQ = document.getElementById("STAT_LWQ")
const __LWQ_SC_STATEXP = document.getElementById("STAT_EXP")

fetch(LWQ_API + "hello").then(function(response)
{
    if (response["status"] == 200)
    {
        __LWQ_SC_STATLWQ.style.color = "#66FF66"
        __LWQ_SC_STATLWQ.innerText = "LiteWorldsQuest online"
    }
})

fetch(LITECOINSPACE + "api/address/MU78ANEyiaAAjM4Z7HT8zTB3HWCzrXvM6i/utxo").then(function(response)
{
    if (response["status"] == 200)
    {
        __LWQ_SC_STATEXP.style.color = "#66FF66"
        __LWQ_SC_STATEXP.innerText = "LitecoinSpace online"
    }
})

const __LWQ_SC_NAV = document.getElementById("LWQ_SC_NAV")
const __LWQ_SC_WALLET = document.getElementById("LWQ_SC_WALLET")
const __LWQ_SC_UTXOSEND = document.getElementById("LWQ_SC_UTXOSEND")
const __LWQ_SC_WALLET_address = document.getElementById("LWQ_SC_WALLET_address")
const __LWQ_SC_WALLET_balance = document.getElementById("LWQ_SC_WALLET_balance")
const __LWQ_SC_WALLET_pending = document.getElementById("LWQ_SC_WALLET_pending")
const __LWQ_SC_WALLET_cardinal = document.getElementById("LWQ_SC_WALLET_cardinal")
const __LWQ_SC_COINCONTROL = document.getElementById("LWQ_SC_COINCONTROL")
const __LWQ_SC_SIGN = document.getElementById("LWQ_SC_SIGN")
const __LWQ_SC_PROPERTIES = document.getElementById("LWQ_SC_PROPERTIES")
const __LWQ_SC_PROPERTYLIST = document.getElementById("LWQ_SC_PROPERTYLIST")
const __LWQ_SC_CREATEPROPERTY = document.getElementById("LWQ_SC_CREATEPROPERTY")
const __LWQ_SC_TOKEN = document.getElementById("LWQ_SC_TOKEN")
const __LWQ_SC_TOKENSEND = document.getElementById("LWQ_SC_TOKENSEND")
const __LWQ_SC_NFTOMNI = document.getElementById("LWQ_SC_NFTOMNI")
const __LWQ_SC_NFTORDI = document.getElementById("LWQ_SC_NFTORDI")
const __LWQ_SC_DEX = document.getElementById("LWQ_SC_DEX")
const __LWQ_SC_DEX_REQUEST = document.getElementById("LWQ_SC_DEX_REQUEST")
const __LWQ_SC_DEX_LIST = document.getElementById("LWQ_SC_DEX_LIST")

var _LWQ_SC_UTXO = new Array()
var _LWQ_SC_TOKENLIST = new Array()
var _LWQ_SC_NFTLIST = new Array()
var _LWQ_SC_BALANCE = new Array()

document.getElementById("LWQ_SC_enter_passwd").style.display = "none"

__LWQ_SC_NAV.onchange = function()
{
    switch (document.getElementById("LWQ_SC_NAV_SELECT").value)
    {
        case "Wallet":
            getWallet()
            break

        case "OmniliteProperties":
            displayProperties()
            break

        case "OmniliteToken":
            displayTokens()
            break

        case "OmniliteNFT":
            displayNFTLIST()
            break

        case "OrdinalNFT":
            displayInscriptions()
            break

        case "OmniliteDEX":
            displayDEX()
            break

        case "OmniliteNFTm":
            //displayDEX()
            break

        case "OrdinalNFTm":
            //displayDEX()
            break

        default:
            break
    }
}

function __init()
{
    if (_LWQ_SC_PASSWD === undefined)
    {
        getPass()
    }

    if (_LWQ_SC_SEED === undefined && _LWQ_SC_PASSWD !== undefined)
    {
        //port.postMessage({"function":"getSeed"})
    }

    try {
        document.getElementById("CallTest").onclick() = function(data)
        {
            console.log(data)
            testcall()
        }
    } catch (error) {
        
    }

    if (!locked)
    {
        __LWQ_SC_NAV.style.display = "inline-block"
        getWallet()
    }
}

function __hide()
{
    __LWQ_SC_WALLET.style.display = "none",
    __LWQ_SC_UTXOSEND.style.display = "none"
    __LWQ_SC_SIGN.style.display = "none"
    __LWQ_SC_PROPERTIES.style.display = "none"
    __LWQ_SC_TOKEN.style.display = "none"
    __LWQ_SC_TOKENSEND.style.display = "none"
    __LWQ_SC_NFTOMNI.style.display = "none"
    __LWQ_SC_NFTORDI.style.display = "none"
    __LWQ_SC_DEX.style.display = "none"
    __LWQ_SC_DEX_REQUEST.style.display = "none"
    __LWQ_SC_DEX_LIST.style.display = "none"
    //clearInterval(REFRESH_INTERVALL)
}

function getWallet()
{
    __LWQ_SC_COINCONTROL.innerHTML = ""

    __hide()
    __LWQ_SC_WALLET.style.display = "inline-block"

    __LWQ_SC_WALLET_address.innerText = "Loading Wallet data"

    litecoin.getMultiSigWallet(2, 2, "normal", _LWQ_SC_SEED, _LWQ_SC_PASSWD).then(async function(Wallet)
    {
        _LWQ_SC_WALLET = Wallet
        chrome.storage.session.set({"LWQ_SC_MASTER": _LWQ_SC_WALLET.master})

        let utxos = await getUTXOS()
        //setTimeout(function(){displayWallet()}, 500)
        displayWallet()
        getToken()
    })
}

async function getUTXOS()
{
    _LWQ_SC_UTXO["cardinal"] = new Array()
    _LWQ_SC_UTXO["ordinal"] = new Array()

    const url = "https://litecoinspace.org/api/address/" + _LWQ_SC_WALLET.master + "/utxo"
    await fetch(url).then((response) => response.json()).then(async function(utxos)
    {
        utxos.sort(function(a, b){return b.value - a.value})

        _LWQ_SC_BALANCE["total"] = 0
        _LWQ_SC_BALANCE["cardinal"] = 0
        _LWQ_SC_BALANCE["ordinal"] = 0

        for (let a = 0; a < utxos.length; a++)
        {
            const utxo = utxos[a]
            _LWQ_SC_BALANCE["total"] += utxo.value

            const ordi = ORD_TX + utxo.txid + ":" + utxo.vout
            await fetch(ordi).then((response) => response.text()).then(function(data)
            {
                let html = document.createElement("html")
                html.innerHTML = data

                if (html.children[1].children[1].children[1].children[1].children[0] === undefined)
                {
                    _LWQ_SC_UTXO["cardinal"].push(utxo)
                    _LWQ_SC_BALANCE["cardinal"] += utxo.value
                }
                else
                {
                    _LWQ_SC_UTXO["ordinal"].push(utxo)
                    _LWQ_SC_BALANCE["ordinal"] += utxo.value
                }

                if (a == (utxos.length - 1))
                {
                    _LWQ_SC_UTXO["cardinal"].sort(function(a, b){return b.value - a.value})
                    _LWQ_SC_UTXO["ordinal"].sort(function(a, b){return b.value - a.value})

                    chrome.storage.session.set({"LWQ_SC_CARDINAL": _LWQ_SC_UTXO["cardinal"]})
                    chrome.storage.session.set({"LWQ_SC_ORDINAL": _LWQ_SC_UTXO["ordinal"]})
                }
            })
        }
    })

    return true
}

function displayWallet()
{
    __LWQ_SC_WALLET_address.innerText = _LWQ_SC_WALLET.master
    __LWQ_SC_WALLET_balance.innerText = "total " + (_LWQ_SC_BALANCE["total"] / 100000000).toFixed(8) + " LTC"
    __LWQ_SC_WALLET_cardinal.innerText = "cardinal " + (_LWQ_SC_BALANCE["cardinal"] / 100000000).toFixed(8) + " LTC"

    if (_LWQ_SC_UTXO["cardinal"].length == 0)
    {
        __LWQ_SC_WALLET_balance.innerText= "Empty Pocket!"
        __LWQ_SC_WALLET_cardinal.innerHTML = ""
    }

    for (let a = 0; a < _LWQ_SC_UTXO["cardinal"].length; a++)
    {
        const utxo = _LWQ_SC_UTXO["cardinal"][a]
        displayCardinal(utxo, false)
    }
}

function displayCardinal(utxo)
{
    const div = document.createElement("div")
    __LWQ_SC_COINCONTROL.appendChild(div)
    div.style.width = "90%"
    div.style.height = "1.37rem"
    div.style.border = "1px solid deepskyblue"
    div.style.borderRadius = "7px"
    div.style.marginBottom = "0.37rem"
    div.style.marginLeft = "5%"
    div.style.float = "left"
    div.style.cursor = "crosshair"

    const value = document.createElement("b")
    div.appendChild(value)

    const status = document.createElement("b")
    div.appendChild(status)

    value.innerHTML = utxo.value + " lits "

    if (utxo.value < 50000)
    {
        value.style.color = "crimson"
    }

    if (utxo.status.confirmed)
    {
        status.innerHTML = "confirmed"

        div.onclick = function()
        {
            sendCardinal(utxo)
        }
        
    }
    else
    {
        status.innerHTML = "unconfirmed"
        status.style.color = "crimson"
        div.style.border = "1px solid crimson"
    }
}

function displayDEX()
{
    __hide()
    __LWQ_SC_DEX.style.display = "inline-block"
    __LWQ_SC_DEX.innerHTML = ""

    let url = LWQ_API + "public-get-dex"
    fetch(url).then((responce) => responce.json()).then(function(dex)
    {
        for (let a = 0; a < dex.length; a++)
        {
            const element = dex[a]
            
            if (element["minimumfee"] === "0.00000100" && element["timelimit"] == 21)
            {
                let div = document.createElement("div")
                __LWQ_SC_DEX.appendChild(div)
                div.style.border = "1px solid deepskyblue"
                div.style.borderRadius = "7px"
                div.style.float = "left"
                div.style.width = "100%"
                div.style.marginTop = "0.37rem"

                let url = LWQ_API + "public-get-property&property=" + element["propertyid"]
                fetch(url).then((responce) => responce.json()).then(function(data)
                {
                    const table = document.createElement("table")
                    const tr1 = document.createElement("tr")
                    const tr2 = document.createElement("tr")
                    const td1 = document.createElement("td")
                    const td2 = document.createElement("td")
                    const td3 = document.createElement("td")
                    const img = document.createElement("img")

                    table.appendChild(tr1)
                    table.appendChild(tr2)
                    tr1.appendChild(td1)
                    tr1.appendChild(td2)
                    tr2.appendChild(td3)
                    td1.appendChild(img)

                    table.style.width = "100%"

                    td1.rowSpan = 2

                    img.style.width = "3.7rem"
                    img.style.height = "3.7rem"

                    try
                    {
                        const deepdata = JSON.parse(data["data"])

                        if (deepdata["structure"] == "epic")
                        {
                            if (deepdata["type"] == "image")
                            {
                                if (deepdata["source"] == "ipfs")
                                {
                                    img.src = IPFS + deepdata["content"]
                                }
                            }
                        }

                        if (deepdata["structure"] == "artifactual" || deepdata["structure"] == "artefactual")
                        {
                            fetch(ORD_CONTENT + deepdata["json"]).then((response) => response.json()).then(function(data)
                            {
                                let index = 0
                                let maxindex = data["type"].length

                                if (data["type"][index] == "image")
                                {
                                    img.src = ORD_CONTENT + data["content"][index]

                                    setInterval(function()
                                    {
                                        if (index < (maxindex - 1)) index++
                                        else index = 0

                                        if (data["type"][index] == "image") img.src = ORD_CONTENT + data["content"][index]
                                    }, 1337)
                                }
                            })
                        }
                    }
                    catch (error)
                    {
                        img.src = "https://v2.liteworlds.quest/no-image.png"
                    }

                    


                    td1.style.width = "3.7rem"

                    div.appendChild(table)

                    td2.innerHTML = data["name"] + "<br>@" + dex[a]["unitprice"] + " LTC"

                    if (element["accepts"].length > 0)
                    {
                        let foundorder = false
                        for (let b = 0; b < element["accepts"].length; b++)
                        {
                            const subelement = element["accepts"][b]

                            if (_LWQ_SC_WALLET.master == subelement["buyer"])
                            {
                                const pay = document.createElement("button")
                                td3.appendChild(pay)
                                pay.innerHTML = "Pay: " + subelement["amounttopay"]
                                pay.onclick = function(){
                                    DEXpay(element["seller"], subelement["amounttopay"])
                                }

                                b = element["accepts"].length
                                foundorder = true
                            }
                        }

                        if (!foundorder && element["seller"] != _LWQ_SC_WALLET.master)
                        {
                            let take = document.createElement("button")
                            td3.appendChild(take)
                            take.innerHTML = "Request Purchase"
                            take.onclick = function(){
                                displayDEXrequest(dex[a])
                            }
                        }
                    }
                    else
                    {
                        if (element["seller"] != _LWQ_SC_WALLET.master)
                        {
                            let take = document.createElement("button")
                            td3.appendChild(take)
                            take.innerHTML = "Request Purchase"
                            take.onclick = function(){
                                displayDEXrequest(dex[a])
                            }
                        }
                        else
                        {
                            //cancel listing
                            const cancel = document.createElement("button")
                            td3.appendChild(cancel)
                            cancel.innerHTML = "Cancel Listing"
                            cancel.onclick = function()
                            {
                                displaycancelDEX(dex[a])
                            }
                        }
                    }
                })
            }
        }
    })
}

function displayDEXrequest(dexentry)
{
    __hide()
    __LWQ_SC_DEX_REQUEST.innerHTML = ""
    __LWQ_SC_DEX_REQUEST.style.display = "inline-block"

    const propertyid = document.createElement("p")
    __LWQ_SC_DEX_REQUEST.appendChild(propertyid)
    propertyid.innerHTML = dexentry["propertyid"]
    propertyid.style.fontSize = "1rem"

    let url = LWQ_API + "public-get-property&property=" + dexentry["propertyid"]
    fetch(url).then((responce) => responce.json()).then(function(data)
    {
        const name = document.createElement("p")
        __LWQ_SC_DEX_REQUEST.appendChild(name)
        name.innerHTML = data["name"]
        name.style.fontSize = "1.37rem"

        const available = document.createElement("p")
        __LWQ_SC_DEX_REQUEST.appendChild(available)
        available.innerHTML = "available: " + dexentry["amountavailable"]

        const unitprice = document.createElement("p")
        __LWQ_SC_DEX_REQUEST.appendChild(unitprice)
        unitprice.innerHTML = "unitprice: " + dexentry["unitprice"] + " LTC"

        const question = document.createElement("p")
        __LWQ_SC_DEX_REQUEST.appendChild(question)
        question.innerHTML = "How much do you want to request?"
        question.style.marginTop = "1.37rem"

        const amount = document.createElement("input")
        __LWQ_SC_DEX_REQUEST.appendChild(amount)
        amount.type = "number"

        const br = document.createElement("br")
        __LWQ_SC_DEX_REQUEST.appendChild(br)

        const take = document.createElement("button")
        __LWQ_SC_DEX_REQUEST.appendChild(take)
        take.classList.add("button-terminal")
        take.innerHTML = "Send Request"
        take.onclick = function()
        {
            DEXaccept(dexentry["propertyid"], amount.value, dexentry["seller"])
        }
    })
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

function displayUTXO(utxo, ord, html)
{
    const div = document.createElement("div")
    div.style.width = "90%"
    div.style.height = "1.37rem"
    div.style.border = "1px solid deepskyblue"
    div.style.borderRadius = "7px"
    div.style.marginBottom = "0.37rem"
    div.style.marginLeft = "5%"
    div.style.float = "left"
    div.style.cursor = "crosshair"

    const value = document.createElement("b")
    div.appendChild(value)

    const status = document.createElement("b")
    div.appendChild(status)

    value.innerHTML = utxo.value + " lits "

    if (utxo.value < 50000)
    {
        value.style.color = "crimson"
    }

    const destination = document.createElement("input")
    //if (utxo.status.confirmed) div.appendChild(destination)
    destination.classList.add("input-terminal")
    destination.id = utxo.txid + ":" + utxo.vout
    destination.style.maxWidth = "90%"

    const send = document.createElement("button")
    //if (utxo.status.confirmed) div.appendChild(send)
    send.classList.add("button-terminal")
    send.innerHTML = "SEND"
    send.onclick = function()
    {
        exitUTXO(utxo.txid, utxo.vout, utxo.value)
    }

    
    if (utxo.status.confirmed)
    {
        status.innerHTML = "confirmed"

        div.onclick = function()
        {
            if (ord) sendOrdinal(utxo)
            else sendCardinal(utxo)
        }
    }
    else
    {
        status.innerHTML = "unconfirmed"
        status.style.color = "crimson"
        div.style.border = "1px solid crimson"
    }

    if (ord)
    {
        status.innerHTML += "<b style=\"color: deepskyblue;\"> ordinal</b>"
        let inscription = html.children[1].children[1].children[1].children[1].children[0].href.split("/")[4]

        let image = document.createElement("img")
        image.src = ORD_CONTENT + inscription
        image.style.width = "100%"
        image.style.height = "100%"

        const hover = document.createElement("div")
        hover.appendChild(image)

        hover.style.position = "absolute"
        hover.style.transform = "translate(0%, -125%)"
        hover.style.width = "9rem"
        hover.style.height = "9rem"

        div.onmouseover = function(data)
        {
            hover.style.top = data.layerY
            div.appendChild(hover)
        }

        div.onmouseleave = function(data)
        {
            hover.remove()
        }
    }

    document.getElementById("LWQ_SC_COINCONTROL").appendChild(div)
}

async function getFee(txid)
{
    const url = "https://v2.liteworlds.quest/decode.php"
    var fee
    await fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(txid)
    }).then((response) => response.json()).then(function(data)
    {
        fee = data
    })

    return fee
}

async function mergeUTXOS()
{
    await getUTXOS()

    let totalamount = 0
    let input = new Array()

    // take one utxo with a value greater then 50k
    for (let a = 0; a < _LWQ_SC_UTXO["cardinal"].length; a++)
    {
        const element = _LWQ_SC_UTXO["cardinal"][a]

        if (element.status.confirmed)
        {
            totalamount += element.value

            let obj = new Object()
            obj.txid = element.txid
            obj.index = element.vout
            obj.amount = element.value
            input.push(obj)
        }
    }

    litecoin.newMultiSigTransaction({
        network: "normal",
        witnessScript: _LWQ_SC_WALLET.witnessScript,
        keys: [_LWQ_SC_WALLET.keys[0].wif, _LWQ_SC_WALLET.keys[1].wif],
        signatures: 2,
        utxo: input,
        output: [
        {
            address: _LWQ_SC_WALLET.master,
            amount: totalamount - 1000
        }],
        fee: 1000
    }).then(async function(data)
    {
        const weight = await getFee(data.rawTransaction)
        fee = parseInt(weight) + 1

        litecoin.newMultiSigTransaction({
            network: "normal",
            witnessScript: _LWQ_SC_WALLET.witnessScript,
            keys: [_LWQ_SC_WALLET.keys[0].wif, _LWQ_SC_WALLET.keys[1].wif],
            signatures: 2,
            utxo: input,
            output: [
            {
                address: _LWQ_SC_WALLET.master,
                amount: totalamount - fee
            }],
            fee: fee
        }).then(async function(data)
        {
            //sign(data.rawTransaction, _LWQ_SC_WALLET.master, input, "Merge UTXOS")
            submit(data.rawTransaction, _LWQ_SC_WALLET.master, input, "Merge UTXOS")
        })
    })
}

function sendCardinal(utxo)
{
    __hide()
    __LWQ_SC_UTXOSEND.innerHTML = ""
    __LWQ_SC_UTXOSEND.style.display = "inline-block"

    const amount = document.createElement("p")
    __LWQ_SC_UTXOSEND.appendChild(amount)
    amount.style.marginTop = "3.7rem"
    amount.innerHTML = "Sending " + utxo.value + " lits to"

    const destination = document.createElement("input")
    __LWQ_SC_UTXOSEND.appendChild(destination)
    destination.classList.add("input-terminal")
    destination.id = utxo.txid + ":" + utxo.vout
    destination.style.width = "90%"

    const send = document.createElement("button")
    __LWQ_SC_UTXOSEND.appendChild(send)
    send.classList.add("button-terminal")
    send.innerHTML = "SEND"
    send.onclick = function()
    {
        exitUTXO(utxo.txid, utxo.vout, utxo.value)
    }

    const merge = document.createElement("button")
    __LWQ_SC_UTXOSEND.appendChild(merge)
    merge.classList.add("button-terminal")
    merge.innerHTML = "MERGE UTXOS"
    merge.onclick = function()
    {
        mergeUTXOS()
    }
}

function sendOrdinal(utxo)
{

}

function displayTokens()
{
    __hide()
    __LWQ_SC_TOKEN.innerHTML = ""
    __LWQ_SC_TOKEN.style.display = "inline-block"

    for (let a = 0; a < _LWQ_SC_TOKENLIST.length; a++)
    {
        const tokenelement = _LWQ_SC_TOKENLIST[a]
        let isNFT = false
        
        for (let b = 0; b < _LWQ_SC_NFTLIST.length; b++)
        {
            const nftelement = _LWQ_SC_NFTLIST[b]

            if (tokenelement["propertyid"] == nftelement.property["propertyid"])
            {
                isNFT = true
            }
        }

        if (!isNFT)
        {
            let div = document.createElement("div")
            __LWQ_SC_TOKEN.appendChild(div)
            div.style.border = "1px solid deepskyblue"
            div.style.float = "left"
            div.style.width = "100%"
            div.style.borderRadius = "1.37dvh"
            div.style.marginBottom = "1.37dvh"
            div.style.overflow = "hidden"

            let url = LWQ_API + "public-get-property&property=" + tokenelement["propertyid"]
            fetch(url).then((responce) => responce.json()).then(function(data)
            {
                let balance = document.createElement("b")
                div.appendChild(balance)
                balance.innerHTML = "#" + tokenelement["propertyid"] + "<br>" + tokenelement["balance"] + " " + data["name"] + "<br>"

                let send = document.createElement("button")
                div.appendChild(send)
                send.innerHTML = "send"
                send.style.width = "50%"
                send.style.background = "transparent"
                send.style.border = "1px solid deepskyblue"
                send.style.color = "deepskyblue"
                send.style.fontSize = "1rem"
                send.style.marginTop = "0.37rem"
                send.onclick = function()
                {
                    displayToken(tokenelement)
                }

                let dex = document.createElement("button")
                div.appendChild(dex)
                dex.innerHTML = "list"
                dex.style.width = "50%"
                dex.style.width = "50%"
                dex.style.background = "transparent"
                dex.style.border = "1px solid deepskyblue"
                dex.style.color = "deepskyblue"
                dex.style.fontSize = "1rem"
                dex.style.marginTop = "0.37rem"
                dex.onclick = function()
                {
                    displaylistDEX(tokenelement)
                }
            })
        }
    }
}

function displayToken(token)
{
    __hide()
    __LWQ_SC_TOKENSEND.innerHTML = ""
    __LWQ_SC_TOKENSEND.style.display = "inline-block"

    let url = LWQ_API + "public-get-property&property=" + token["propertyid"]
    fetch(url).then((response) => response.json()).then(function(property)
    {
        const balance = document.createElement("p")
        __LWQ_SC_TOKENSEND.appendChild(balance)
        balance.innerHTML = token["balance"] + " " + property["name"] + " available<br>How muc Token do you want to send?"

        const amount = document.createElement("input")
        __LWQ_SC_TOKENSEND.appendChild(amount)
        amount.classList.add("input-terminal")
        amount.type = "number"
        amount.value = 1

        const desti = document.createElement("p")
        __LWQ_SC_TOKENSEND.appendChild(desti)
        desti.innerHTML = "Destination Address"

        const destination = document.createElement("input")
        __LWQ_SC_TOKENSEND.appendChild(destination)
        destination.classList.add("input-terminal")
        destination.id = "destinationToken"
        destination.style.width = "90%"

        const send = document.createElement("button")
        __LWQ_SC_TOKENSEND.appendChild(send)
        send.classList.add("button-terminal")
        send.innerHTML = "SEND"
        send.onclick = function()
        {
            TokenSend(token["propertyid"], amount.value, destination.value)
        }
    })
}

function displayNFTLIST()
{
    __hide()
    if (_LWQ_SC_NFTLIST.length == 0)
    {
        __LWQ_SC_NFTOMNI.innerHTML = "No Data"
    }
    else
    {
        __LWQ_SC_NFTOMNI.innerHTML = ""
    }
    __LWQ_SC_NFTOMNI.style.display = "inline-block"

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
                __LWQ_SC_NFTOMNI.appendChild(div)
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

                        let url = ORD_CONTENT + grantdata.json
                        fetch(url).then((responce) => responce.json()).then
                        (
                            function(ord_json)
                            {
                                image.src = ORD_CONTENT + ord_json.content[0]
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
                            image.src = ORD_CONTENT + grantdata.content
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
        __LWQ_SC_NFTOMNI.innerHTML = ""
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
                        __LWQ_SC_NFTOMNI.appendChild(div)
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
                                let url = ORD_CONTENT + grantdata.json
                                fetch(url).then((responce) => responce.json()).then
                                (
                                    function(ord_json)
                                    {
                                        image.src = ORD_CONTENT + ord_json.content[0]
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
                                    image.src = ORD_CONTENT + grantdata.content
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

function displayInscriptions()
{
    __hide()
    if (_LWQ_SC_UTXO["ordinal"].length == 0)
    {
        __LWQ_SC_NFTORDI.innerHTML = "No Data"
    }
    else
    {
        __LWQ_SC_NFTORDI.innerHTML = ""
    }
    __LWQ_SC_NFTORDI.style.display = "inline-block"

    for (let a = 0; a < _LWQ_SC_UTXO["ordinal"].length; a++)
    {
        const element = _LWQ_SC_UTXO["ordinal"][a]
        
        fetch(ORD_TX + element.txid + ":" + element.vout).then((response) => response.text()).then(function(data)
        {
            const html = document.createElement("html")
            html.innerHTML = data
            //throw html.children[1].children[1].children[1].children[1].childElementCount
            //throw html.children[1].children[1].children[1].children[1].children[0].href.split("/inscription/")[1]

            const inscription = html.children[1].children[1].children[1].children[1].children[0].href.split("/inscription/")[1]

            const img = document.createElement("img")
            __LWQ_SC_NFTORDI.appendChild(img)
            img.src = ORD_CONTENT + inscription

            img.style.width = "8em"
            img.style.height = "8em"

            img.onclick = function()
            {
                displayInscription(inscription, element)
            }
        })
    }
}

function displayInscription(inscription, element)
{
    __LWQ_SC_NFTORDI.innerHTML = ""

    let div = document.createElement("div")
    __LWQ_SC_NFTORDI.appendChild(div)
    div.style.textAlign = "center"
    div.style.width = "20em"
    div.style.height = "20em"
    div.style.marginLeft = "1em"
    div.style.display = "inline-block"
    div.id = inscription

    let p = document.createElement("p")
    div.appendChild(p)
    p.innerHTML = inscription.substring(0, 10) + "..." + inscription.substring(inscription.length - 5, inscription.length)
    p.style.fontSize = "1.37em"

    let value = document.createElement("p")
    div.appendChild(value)
    value.innerHTML = element.value + " lits"
    value.style.fontSize = "1.37em"
    
    let image = document.createElement("img")
    div.appendChild(image)
    image.style.width = "20em"
    image.style.height = "20em"
    image.src = ORD_CONTENT + inscription

    let destination = document.createElement("input")
    div.appendChild(destination)
    destination.classList.add("input-terminal")
    destination.style.marginTop = "0.37em"

    let br = document.createElement("br")
    div.appendChild(br)

    let send = document.createElement("button")
    div.appendChild(send)
    send.classList.add("button-terminal")
    send.innerHTML = "SEND ORDI"
    send.onclick = function()
    {
        createSendORDI(inscription, element, destination.value)
    }

    let split = document.createElement("button")
    if (element.value >= 20000) div.appendChild(split)
    split.classList.add("button-terminal")
    split.innerHTML = "SPLIT"
    split.onclick = function()
    {
        splitORDI(inscription, element)
    }
}

function splitORDI(inscription, utxo)
{
    let input = new Array()
    let totalvalue = utxo.value
    let split = 0

    input[0] = new Object()
    input[0].txid = utxo.txid
    input[0].index = utxo.vout
    input[0].amount = utxo.value
 
    if (totalvalue % 2)
    {
        split = (utxo.value - 1) / 2
    }
    else
    {
        split = (utxo.value - 2) / 2
    }

    litecoin.newMultiSigTransaction({
        network: "normal",
        witnessScript: _LWQ_SC_WALLET.witnessScript,
        keys: [_LWQ_SC_WALLET.keys[0].wif, _LWQ_SC_WALLET.keys[1].wif],
        signatures: 2,
        utxo: input,
        output: [
        {
            address: _LWQ_SC_WALLET.master,
            amount: totalvalue - split
        },
        {
            address: _LWQ_SC_WALLET.master,
            amount: split - 500
        }],
        fee: 500
    }).then(async function(data)
    {
        const weight = await getFee(data.rawTransaction)
        let fee = parseInt(weight) + 1
        
        litecoin.newMultiSigTransaction({
            network: "normal",
            witnessScript: _LWQ_SC_WALLET.witnessScript,
            keys: [_LWQ_SC_WALLET.keys[0].wif, _LWQ_SC_WALLET.keys[1].wif],
            signatures: 2,
            utxo: input,
            output: [
                {
                    address: _LWQ_SC_WALLET.master,
                    amount: totalvalue - split
                },
                {
                    address: _LWQ_SC_WALLET.master,
                    amount: split - fee
                }],
            fee: fee
        }).then(async function(data)
        {
            submit(data.rawTransaction, _LWQ_SC_WALLET.master, input, "send ordi")
        })
    })
}

function createSendORDI(inscription, utxo, destination)
{
    let input = new Array()
    let totalvalue = utxo.value

    let input0 = new Object()
    input0.txid = utxo.txid
    input0.index = utxo.vout
    input0.amount = utxo.value
    input.push(input0)

    litecoin.newMultiSigTransaction({
        network: "normal",
        witnessScript: _LWQ_SC_WALLET.witnessScript,
        keys: [_LWQ_SC_WALLET.keys[0].wif, _LWQ_SC_WALLET.keys[1].wif],
        signatures: 2,
        utxo: input,
        output: [
        {
            address: destination,
            amount: totalvalue - 500
        }],
        fee: 500
    }).then(async function(data)
    {
        const weight = await getFee(data.rawTransaction)
        const fee = parseInt(weight) + 1
        
        litecoin.newMultiSigTransaction({
            network: "normal",
            witnessScript: _LWQ_SC_WALLET.witnessScript,
            keys: [_LWQ_SC_WALLET.keys[0].wif, _LWQ_SC_WALLET.keys[1].wif],
            signatures: 2,
            utxo: input,
            output: [
                {
                    address: destination,
                    amount: totalvalue - fee
                }],
            fee: fee
        }).then(async function(data)
        {
            submit(data.rawTransaction, destination, input, "send ordi")
        })
    })
}

async function displaylistDEX(token)
{
    __hide()
    __LWQ_SC_DEX_LIST.style.display = "inline-block"
    __LWQ_SC_DEX_LIST.innerHTML = ""

    var url = LWQ_API + "public-get-property&property=" + token["propertyid"]
    fetch(url).then((response) => response.json()).then(function(property)
    {
        const name = document.createElement("p")
        const amount = document.createElement("b")
        const amountinput = document.createElement("input")
        const desire = document.createElement("b")
        const desireinput = document.createElement("input")
        const list = document.createElement("button")

        __LWQ_SC_DEX_LIST.appendChild(name)
        __LWQ_SC_DEX_LIST.appendChild(amount)
        __LWQ_SC_DEX_LIST.appendChild(amountinput)
        __LWQ_SC_DEX_LIST.appendChild(desire)
        __LWQ_SC_DEX_LIST.appendChild(desireinput)
        __LWQ_SC_DEX_LIST.appendChild(document.createElement("br"))
        __LWQ_SC_DEX_LIST.appendChild(list)

        name.innerHTML = token["balance"] + " " + property["name"]
        amount.innerHTML = "<br>Amount:<br>"
        amountinput.type = "number"
        amountinput.value = 1
        desire.innerHTML = "<br>Desire per unit:<br>"
        desireinput.type = "number"
        desireinput.value = 0.001
        list.innerHTML = "List on DEX"

        amountinput.style.marginBottom = "1.37rem"
        list.classList.add("button-terminal")
        list.onclick = async function()
        {
            await getUTXOS()

            let totalamount = 0
            let fee = 255
            let input = new Array()

            // take one utxo with a value greater then 50k
            for (let a = 0; a < _LWQ_SC_UTXO["cardinal"].length; a++)
            {
                const element = _LWQ_SC_UTXO["cardinal"][a]
                if (element.value > 50000)
                {
                    totalamount = element.value

                    let obj = new Object()
                    obj.txid = element.txid
                    obj.index = element.vout
                    obj.amount = element.value
                    input.push(obj)

                    a = _LWQ_SC_UTXO["cardinal"].length
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

                const finDesire = (desireinput.value * amountinput.value).toFixed(8)
                
                //(data.unsignedtx) // the prepared and unsigned transaction hex

                // send the raw transaction to liteworlds.quest to create and add the payload for omnilite operation/action (server side)
                url = LWQ_API + "public-payload-listdex&txid=" + data.unsignedtx + "&property=" + token["propertyid"] + "&amount=" + amountinput.value + "&desire=" + finDesire
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
                            sign(data.rawTransaction, _LWQ_SC_WALLET.master, input, "List DEX " + property["propertyid"] + "#" + amountinput.value + "<br>for total " + finDesire + " LTC")
                        })
                    }
                )
            })
        }
    })
}

function displaycancelDEX(token)
{
    __hide()
    __LWQ_SC_DEX_LIST.style.display = "inline-block"
    __LWQ_SC_DEX_LIST.innerHTML = ""

    var url = LWQ_API + "public-get-property&property=" + token["propertyid"]
    fetch(url).then((response) => response.json()).then(function(property)
    {
        const name = document.createElement("p")
        const list = document.createElement("button")

        __LWQ_SC_DEX_LIST.appendChild(name)
        __LWQ_SC_DEX_LIST.appendChild(document.createElement("br"))
        __LWQ_SC_DEX_LIST.appendChild(list)

        name.innerHTML = token["amountavailable"] + " " + property["name"]
        list.innerHTML = "Cancel Listing"
        list.classList.add("button-terminal")
        list.onclick = async function()
        {
            await getUTXOS()

            let totalamount = 0
            let fee = 255
            let input = new Array()

            // take one utxo with a value greater then 50k
            for (let a = 0; a < _LWQ_SC_UTXO["cardinal"].length; a++)
            {
                const element = _LWQ_SC_UTXO["cardinal"][a]
                if (element.value > 50000)
                {
                    totalamount = element.value

                    let obj = new Object()
                    obj.txid = element.txid
                    obj.index = element.vout
                    obj.amount = element.value
                    input.push(obj)

                    a = _LWQ_SC_UTXO["cardinal"].length
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
                
                //(data.unsignedtx) // the prepared and unsigned transaction hex

                // send the raw transaction to liteworlds.quest to create and add the payload for omnilite operation/action (server side)
                url = LWQ_API + "public-payload-listdex&txid=" + data.unsignedtx + "&property=" + token["propertyid"] + "&amount=0&desire=0&action=3"
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
                            sign(data.rawTransaction, _LWQ_SC_WALLET.master, input, "Cancel Listing " + property["propertyid"])
                        })
                    }
                )
            })
        }
    })
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

    if (passwd === prove && passwd !== "")
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








var _LWQ_SC_SEED
var _LWQ_SC_PASSWD
var _LWQ_SC_WALLET

var locked = true



function getPass()
{
    chrome.storage.local.get("LWQ_SC_PASSWD").then((local) =>
    {
        chrome.storage.session.get("LWQ_SC_PASSWD").then((session) =>
        {
            _LWQ_SC_PASSWD = local.LWQ_SC_PASSWD

            if (_LWQ_SC_PASSWD === undefined)
            {
                createPasswd()
            }
            else if (session.LWQ_SC_PASSWD === undefined)
            {
                enterPasswd()
            }
            else if (_LWQ_SC_PASSWD === session.LWQ_SC_PASSWD)
            {
                locked = false
                getSeed()
                //port.postMessage({"function":"getSeed"})
            }
        })
    })

    
}

function getSeed()
{
    chrome.storage.local.get("LWQ_SC_MNEMONIC").then((local) =>
    {
        if (local.LWQ_SC_MNEMONIC === undefined)
        {
            displayMnemonicOptions()
        }
        else
        {
            _LWQ_SC_SEED = local.LWQ_SC_MNEMONIC
            __init()
        }
    })
}






// opens a communication between scripts
var port = chrome.runtime.connect()

port.onMessage.addListener(function(o)
{
    console.log("Callback: ", o.function)

    if (o.function && o.function === "getPass")
    {
        _LWQ_SC_PASSWD = o.local

        if (_LWQ_SC_PASSWD === undefined)
        {
            createPasswd()
        }
        else if (o.session === undefined)
        {
            enterPasswd()
        }
        else if (_LWQ_SC_PASSWD === o.session)
        {
            locked = false
            port.postMessage({"function":"getSeed"})
        }
    }

    if (o.function && o.function === "getSeed")
    {
        if (o.seed === undefined)
        {
            displayMnemonicOptions()
        }
        else
        {
            _LWQ_SC_SEED = o.seed
            __init()
        }
    }

    if (o.function && o.function === "getMaster")
    {
        console.log(o.master)
    }
})


function getToken()
{
    let url = LWQ_API + "public-address-balances&address=" + _LWQ_SC_WALLET.master
    fetch(url).then((responce) => responce.json()).then
    (
        function(data)
        {
            _LWQ_SC_TOKENLIST = data
        }
    )


    url = LWQ_API + "public-address-nft&address=" + _LWQ_SC_WALLET.master
    fetch(url).then((responce) => responce.json()).then
    (
        function(data)
        {
            if (data.length == 0)
            {
                __LWQ_SC_NFTOMNI.innerHTML = "No Data"
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
                                            NFT[0]["propertyid"] = property.propertyid
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

async function DEXaccept(propertyid, amount, destination)
{
    await getUTXOS()

    let totalamount = 0
    let sendingamount = 5460
    let fee = 255
    let input = new Array()

    // take one utxo with a value greater then 50k
    for (let a = 0; a < _LWQ_SC_UTXO["cardinal"].length; a++)
    {
        const element = _LWQ_SC_UTXO["cardinal"][a]
        if (element.value > 50000)
        {
            totalamount = element.value

            let obj = new Object()
            obj.txid = element.txid
            obj.index = element.vout
            obj.amount = element.value
            input.push(obj)

            a = _LWQ_SC_UTXO["cardinal"].length
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
        let url = LWQ_API + "public-payload-dex-accept&txid=" + data.unsignedtx + "&property=" + propertyid + "&amount=" + amount
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
                    sign(data.rawTransaction, destination, input, "DEX accept offer " + propertyid + "#" + amount)
                })
            }
        )
    })
}

async function DEXpay(destination, amount)
{
    amount = parseInt((parseFloat(amount) * 100000000).toFixed(8))

    await getUTXOS()

    let totalamount = 0
    let sendingamount = amount
    let loshan = 5460
    let fee = 255
    let input = new Array()

    // take one utxo with a value greater then 50k
    for (let a = 0; a < _LWQ_SC_UTXO["cardinal"].length; a++)
    {
        const element = _LWQ_SC_UTXO["cardinal"][a]
        if (element.value > (amount + loshan + fee))
        {
            totalamount = element.value

            let obj = new Object()
            obj.txid = element.txid
            obj.index = element.vout
            obj.amount = element.value
            input.push(obj)

            a = _LWQ_SC_UTXO["cardinal"].length
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
            amount: totalamount - sendingamount - fee - loshan
        },
        {
            address: "LTceXoduS2cetpWJSe47M25i5oKjEccN1h",
            amount: loshan
        },
        {
            address: destination,
            amount: sendingamount
        }],
        fee: fee
    }).then(function(data){
        sign(data.rawTransaction, destination, input, "pay DEX request")
    })
}





function TokenSend(property, amount, destination)
{
    let url = LITECOINSPACE + "api/address/" + _LWQ_SC_WALLET.master + "/utxo"
    fetch(url).then((responce) => responce.json()).then
    (
        function(utxo)
        {
            let totalamount = 0
            let sendingamount = 5460
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
                let url = LWQ_API + "public-payload-sendtoken&txid=" + data.unsignedtx + "&property=" + property + "&amount=" + amount
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
                            sign(data.rawTransaction, destination, input, "Send Token " + property + "#" + amount)
                        })
                    }
                )
            })
        }
    )
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

        //getWallet()
        
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

        input1.autocomplete = "off"
        input2.autocomplete = "off"

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
            document.getElementById("LWQ_SC_mnemonic_enter").style.display = "Please wait a second"
            setTimeout(function()
            {
                document.getElementById("LWQ_SC_mnemonic_enter").style.display = "none"
                //port.postMessage({"function":"getPass"})
                getPass()
            }, 500)
            
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

    __LWQ_SC_SIGN.style.display = "inline-block"
    document.getElementById("LWQ_SC_SIGN_txid").innerHTML = "TXID<br>" + txid.substring(0,10) + "..." + txid.substring((txid.length - 10), txid.length)
    document.getElementById("LWQ_SC_SIGN_amount").innerHTML = "Amount<br>" + input[0].amount + " lits"
    document.getElementById("LWQ_SC_SIGN_destination").innerHTML = "Destination<br>" + destination
    document.getElementById("LWQ_SC_SIGN_omnilite").innerHTML = "Omnilite Action<br>" + action
    document.getElementById("LWQ_SC_SIGN_button").onclick = function()
    {
        document.getElementById("LWQ_SC_SIGN_button").remove()

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
                    const done = document.createElement("button")
                    done.classList.add("button-terminal")
                    done.innerText = "Done - back to Wallet"
                    done.onclick = function()
                    {
                        __LWQ_SC_NAV.value = "Wallet"
                        getWallet()
                    }

                    const show = document.createElement("button")
                    show.innerText = "Show on LitecoinSpace"
                    show.classList.add("button-terminal")
                    show.onclick = function()
                    {
                        const a = document.createElement("a")
                        a.target = "_blank"
                        a.rel = "noopener noreferrer"
                        a.href = "https://litecoinspace.org/tx/" + data.txid
                        a.click()
                    }

                    document.getElementById("LWQ_SC_SIGN_output").appendChild(done)
                    document.getElementById("LWQ_SC_SIGN_output").appendChild(show)
                }
            )
        })
    }

    try
    {
        
    }
    catch (error)
    {
        
    }
}

function submit(txid, destination, input, action)
{
    __hide()

    __LWQ_SC_SIGN.style.display = "inline-block"
    document.getElementById("LWQ_SC_SIGN_txid").innerHTML = "TXID<br>" + txid.substring(0,10) + "..." + txid.substring((txid.length - 10), txid.length)
    document.getElementById("LWQ_SC_SIGN_amount").innerHTML = "Amount<br>" + input[0].amount + " lits"
    document.getElementById("LWQ_SC_SIGN_destination").innerHTML = "Destination<br>" + destination
    document.getElementById("LWQ_SC_SIGN_omnilite").innerHTML = "Omnilite Action<br>" + action
    document.getElementById("LWQ_SC_SIGN_button").onclick = function()
    {
        //throw data.rawTransaction
        // submit to mempool
        let url = "https://v2.liteworlds.quest/mempool-submit.php"
        fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(txid)
        }).then((response) => response.json()).then
        (
            function(data)
            {
                document.getElementById("LWQ_SC_SIGN_output").innerHTML = "<a style=\"text-decoration: none; color: #4AF626\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://litecoinspace.org/tx/" + data.txid + "\">" + data.answer + " <br>Click here to see your Transaction</a>"   
            }
        )
    }
}




__init()