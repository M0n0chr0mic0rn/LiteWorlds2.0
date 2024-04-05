const API = "https://v2.liteworlds.quest/?method="
const IPFS = "https://ipfs.io/ipfs/"
const ORDINAL = "https://ordinalslite.com/content/"

const NFT_PROTO = document.getElementById("NFT_PROTO")
const CONTENT_TRADER = document.getElementById("TRADER")
const CONTENT_PROPERTY = document.getElementById("PROPERTY")

const LOGIN = document.getElementById("login")

var NFT_TRADER_BOT = new Object

var AUTHKEY
var MASTER
let UTXO = new Array
UTXO["cardinal"] = new Array
UTXO["ordinal"] = new Array

//console.log(litecoin)
//console.log(chrome)

const __EXTID = "nhhekkeikolfiepadodiaopmbjpmbpne"

// Make a simple request:
const port = chrome.runtime.connect(__EXTID)
port.onMessage.addListener(function(o)
{
    console.log("Omnilite: ", o)

    if (o.hasOwnProperty("answer"))
    {
        if (o.answer == "Extension locked!") alert("Please unlock your Wallet first.")
    }
    else if (o.function == "getMaster")
    {
        MASTER = o.master

        port.postMessage({"function":"getBalance"})
        //__init()
    }
})

console.log(screen.orientation)
//alert(screen.orientation.type)
//alert("hello")
if (screen.orientation.type == "portrait-primary") alert("Please turn your Phone 90°")
//console.log(port)
//port.postMessage({"function":"getMaster"})

// LOGIN
// 1. Login via Extension
document.addEventListener('LWQ-AuthKey', function(data)
{
    AUTHKEY = data.detail
    Wallet()
})

__init()

function __init()
{
    if (MASTER != undefined)
    {
        console.log(LOGIN.children[1])
        LOGIN.children[1].innerHTML = MASTER.substring(0, 10) + "..." + MASTER.substring(MASTER.length - 5, MASTER.length)
        LOGIN.children[1].style.color = "whitesmoke"

        let cardinal = 0
        for (let a = 0; a < UTXO["cardinal"].length; a++)
        {
            const element = UTXO["cardinal"][a]
            console.log(element)

            cardinal += element.value
        }
        cardinal = (cardinal / 100000000).toFixed(8)

        let ordinal = 0
        for (let a = 0; a < UTXO["ordinal"].length; a++)
        {
            const element = UTXO["ordinal"][a]
            console.log(element)

            ordinal += element.value
        }
        ordinal = (ordinal / 100000000).toFixed(8)

        let balance = (parseFloat(cardinal) + parseFloat(ordinal)).toFixed(8) + " LTC"

        LOGIN.children[1].innerHTML += "<br><br>" + balance
    }
    //NFT_PROTO.remove()
    //TraderBotGET()
    

    //const test = NFT_PROTO.cloneNode(true)

    //test.children[1].innerHTML = "hello"

    //console.log(NFT_PROTO.children, test.children)
}

function connectSC()
{
    let port = chrome.runtime.connect(__EXTID)
    port.onMessage.addListener(function(o)
    {
        console.log("Omnilite: ", o)

        if (o.hasOwnProperty("answer"))
        {
            if (o.answer == "Extension locked!") alert("Please unlock your Wallet first.")
        }
        else if (o.function == "getMaster")
        {
            MASTER = o.master

            port.postMessage({"function":"getBalance"})
            //__init()
        }
        else if(o.function == "getBalance")
        {
            if (o.hasOwnProperty("cardinal")) UTXO["cardinal"] = o.cardinal
            if (o.hasOwnProperty("ordinal")) UTXO["ordinal"] = o.ordinal

            __init()
        }
    })
    //const tempPort = chrome.runtime.connect(__EXTID)
    port.postMessage({"function":"getMaster"})
}

function __toggle(CONTENT)
{
    CONTENT_TRADER.style.display = "none"
    CONTENT_PROPERTY.style.display = "none"

    switch (CONTENT) {
        case "TRADER": CONTENT_TRADER.style.display = "inline-block"
            break

        case "PROPERTY": CONTENT_PROPERTY.style.display = "inline-block"
            break
    
        default:
            break;
    }
}

function Wallet()
{
    const url = API + "omnilite-get&authkey=" + AUTHKEY
    console.log(url)
    fetch(url).then((responce) => responce.json()).then(function(data)
    {
        console.log(data)
    })
}

function TraderBotGET()
{
    let url = "https://api.liteworlds.quest/?method=omni-get-trader"
    fetch(url).then((responce) => responce.json()).then(function(data)
    {
        console.log(data)
        NFT_TRADER_BOT = data

        TraderBotPRINT()
    })
}

function TraderBotPRINT()
{
    __toggle("TRADER")

    for (let a = 0; a < (NFT_TRADER_BOT.length - 1); a++)
    {
        const element = NFT_TRADER_BOT[a]

        const HTMLELEMENT = NFT_PROTO.cloneNode(true)
        HTMLELEMENT.id = element["propertyid"]
        CONTENT_TRADER.appendChild(HTMLELEMENT)

        HTMLELEMENT.onclick = function()
        {
            PropertyPrint(element, false, 0)
        }
        
        let url = API + "public-get-nft&property=" + element["propertyid"] + "&token=" + element["list"][0]
        fetch(url).then((responce) => responce.json()).then(function(data)
        {
            let nft = data[0]

            nft["grantdata"] = nft["grantdata"].replaceAll("{'", '{"')
            nft["grantdata"] = nft["grantdata"].replaceAll("'}", '"}')
            nft["grantdata"] = nft["grantdata"].replaceAll("':'", '":"')
            nft["grantdata"] = nft["grantdata"].replaceAll("','", '","')

            //console.log(element, nft)

            let grantdata = JSON.parse(nft["grantdata"])

            

            HTMLELEMENT.children[3].innerHTML = element["list"].length + "/" + element["totaltokens"] + " NFTs listed"

            const video = document.createElement("video")
            const sourceV = document.createElement("source")
            const sourceA = document.createElement("source")
            video.appendChild(sourceV)
            video.appendChild(sourceA)

            video.controls = true
            video.width = 220

            sourceV.type = "video/mp4"
            sourceA.type = "audio/wav"
            //HTMLELEMENT.children[0].appendChild(video)

            HTMLELEMENT.children[1].innerHTML = element["name"]
            HTMLELEMENT.children[2].innerHTML = "#" + element["propertyid"]

            if (grantdata.hasOwnProperty("image"))
            {
                // Liteverse
                

                HTMLELEMENT.children[0].style.backgroundImage = 'url("' + IPFS + grantdata["image"].split("ipfs://")[1] + '")'
                HTMLELEMENT.children[0].style.backgroundSize = "cover"

                sourceV.src = IPFS + grantdata["image"].split("ipfs://")[1]
                sourceA.src = IPFS + grantdata["image"].split("ipfs://")[1]
                video.oncanplay = function() 
                {
                    HTMLELEMENT.children[0].appendChild(video)
                }

            }

            if (grantdata.hasOwnProperty("structure"))
            {
                // Liteworlds
                if (grantdata["structure"] == "epic")
                {
                    if (grantdata["source"] == "ordinal")
                    {
                        HTMLELEMENT.children[0].style.backgroundImage = 'url("' + ORDINAL + grantdata["content"] + '")'
                    }
                    
                    if (grantdata["source"] == "ipfs")
                    {
                        HTMLELEMENT.children[0].style.backgroundImage = 'url("' + IPFS + grantdata["content"] + '")'
                    }

                    HTMLELEMENT.children[0].style.backgroundSize = "cover"

                }
                
                if (grantdata["structure"] == "artefactual")
                {
                    let url = ORDINAL + grantdata["json"]
                    fetch(url).then((responce) => responce.json()).then(function(data)
                    {
                        //console.log(data)
                        HTMLELEMENT.children[0].style.backgroundImage = 'url("' + ORDINAL + data["content"][0] + '")'
                    })

                    HTMLELEMENT.children[0].style.backgroundSize = "cover"

                }
            }
        })
    }
}

function PropertyPrint(property, full, start)
{
    __toggle("PROPERTY")

    if (full)
    {
        let end = start + 24
        //if (start > (property["totaltokens"] - 25)) start = property["totaltokens"] - 25
        if (start < 1) start = 1
        if ((start + 25) > property["totaltokens"]) end = property["totaltokens"]

        if (!full || start == 1) CONTENT_PROPERTY.innerHTML = ""

        CONTENT_PROPERTY.onscroll = function(data)
        {
            //console.log(data, data.target.offsetHeight + data.target.scrollTop, data.target.scrollHeight)
            if ((data.target.offsetHeight + data.target.scrollTop) >= data.target.scrollHeight)
            {
                // you're at the bottom of the page
                console.log("Bottom of page")
                if (end != property["totaltokens"]) PropertyPrint(property, true, (end + 1))
            }
        }

        for (let a = start; a <= end; a++)
        {
            const HTMLELEMENT = NFT_PROTO.cloneNode(true)
            HTMLELEMENT.id = property["propertyid"]
            CONTENT_PROPERTY.appendChild(HTMLELEMENT)

            HTMLELEMENT.onclick = function()
            {
                //PropertyPrint(element, false)
            }

            const video = document.createElement("video")
            const sourceV = document.createElement("source")
            const sourceA = document.createElement("source")
            //video.appendChild(sourceV)
            video.appendChild(sourceA)

            video.controls = true
            video.width = 220

            sourceV.type = "video/mp4"
            sourceA.type = "audio/wav"
            //HTMLELEMENT.children[0].appendChild(video)
            
            let url = API + "public-get-nft&property=" + property["propertyid"] + "&token=" + a
            fetch(url).then((responce) => responce.json()).then(function(data)
            {
                console.log(data)
                let nft = data[0]

                nft["grantdata"] = nft["grantdata"].replaceAll("{'", '{"')
                nft["grantdata"] = nft["grantdata"].replaceAll("'}", '"}')
                nft["grantdata"] = nft["grantdata"].replaceAll("':'", '":"')
                nft["grantdata"] = nft["grantdata"].replaceAll("','", '","')

                //console.log(element, nft)
                HTMLELEMENT.children[2].innerHTML = property["propertyid"] + "#" + nft["index"]

                let grantdata = JSON.parse(nft["grantdata"])

                if (grantdata.hasOwnProperty("image"))
                {
                    // Liteverse
                    HTMLELEMENT.children[1].innerHTML = grantdata["name"]

                    HTMLELEMENT.children[0].style.backgroundImage = 'url("' + IPFS + grantdata["image"].split("ipfs://")[1] + '")'
                    HTMLELEMENT.children[0].style.backgroundSize = "cover"

                    sourceV.src = IPFS + grantdata["image"].split("ipfs://")[1]
                    sourceA.src = IPFS + grantdata["image"].split("ipfs://")[1]
                    video.oncanplay = function() 
                    {
                        HTMLELEMENT.children[0].appendChild(video)
                    }

                }

                if (grantdata.hasOwnProperty("structure"))
                {
                    // Liteworlds
                    if (grantdata["structure"] == "epic")
                    {
                        HTMLELEMENT.children[1].innerHTML = grantdata["name"]

                        if (grantdata["source"] == "ordinal")
                        {
                            HTMLELEMENT.children[0].style.backgroundImage = 'url("' + ORDINAL + grantdata["content"] + '")'
                        }
                        
                        if (grantdata["source"] == "ipfs")
                        {
                            HTMLELEMENT.children[0].style.backgroundImage = 'url("' + IPFS + grantdata["content"] + '")'
                        }

                        HTMLELEMENT.children[0].style.backgroundSize = "cover"

                    }
                    
                    if (grantdata["structure"] == "artefactual")
                    {
                        let url = ORDINAL + grantdata["json"]
                        fetch(url).then((responce) => responce.json()).then(function(data)
                        {
                            //console.log(data)
                            HTMLELEMENT.children[1].innerHTML = data["data"]["name"]
                            HTMLELEMENT.children[0].style.backgroundImage = 'url("' + ORDINAL + data["content"][0] + '")'
                        })

                        HTMLELEMENT.children[0].style.backgroundSize = "cover"

                    }
                }

                try
                {
                    let listed = false
                    for (let b = 0; b < property["list"].length; b++)
                    {
                        const element = property["list"][b];
                        
                        if (a == element) listed = true
                    }

                    if (listed)
                    {
                        const holderdata = JSON.parse(nft["holderdata"])

                        HTMLELEMENT.children[3].innerHTML = holderdata["desire"] + " LTC"
                        HTMLELEMENT.children[4].innerHTML = holderdata["destination"].substring(0, 10) + "..." + holderdata["destination"].substring(holderdata["destination"].length - 10, holderdata["destination"].length)
                    }
                    else
                    {
                        HTMLELEMENT.children[0].style.opacity = 0.37
                        HTMLELEMENT.style.color = "crimson"
                        HTMLELEMENT.children[3].innerHTML = nft["owner"].substring(0, 10) + "..." + nft["owner"].substring(nft["owner"].length - 10, nft["owner"].length)
                    }
                }
                catch (error)
                {
                    HTMLELEMENT.children[0].style.opacity = 0.37
                    HTMLELEMENT.style.color = "crimson"
                }
            })
        }
    }
    else
    {
        CONTENT_PROPERTY.innerHTML = ""

        for (let a = 0; a < property["list"].length; a++)
        {
            const element = property["list"][a]

            const HTMLELEMENT = NFT_PROTO.cloneNode(true)
            HTMLELEMENT.id = property["propertyid"]
            CONTENT_PROPERTY.appendChild(HTMLELEMENT)

            HTMLELEMENT.onclick = function()
            {
                //PropertyPrint(element, false)
            }

            if (a == (property["list"].length - 1))
            {
                const showall = document.createElement("button")
                showall.onclick = function()
                {
                    showall.remove()
                    PropertyPrint(property, true, 1)
                }
                showall.innerHTML = "Show All"
                showall.style.background = "transparent"
                showall.style.color = "deepskyblue"
                showall.style.fontSize = "1.37rem"
                showall.style.zIndex = 5

                CONTENT_PROPERTY.appendChild(showall)
            }

            const video = document.createElement("video")
            const sourceV = document.createElement("source")
            const sourceA = document.createElement("source")
            //video.appendChild(sourceV)
            video.appendChild(sourceA)

            video.controls = true
            video.width = 220

            sourceV.type = "video/mp4"
            sourceA.type = "audio/wav"
            //HTMLELEMENT.children[0].appendChild(video)

            let url = API + "public-get-nft&property=" + property["propertyid"] + "&token=" + element
            fetch(url).then((responce) => responce.json()).then(function(data)
            {
                console.log(data)
                let nft = data[0]

                nft["grantdata"] = nft["grantdata"].replaceAll("{'", '{"')
                nft["grantdata"] = nft["grantdata"].replaceAll("'}", '"}')
                nft["grantdata"] = nft["grantdata"].replaceAll("':'", '":"')
                nft["grantdata"] = nft["grantdata"].replaceAll("','", '","')

                //console.log(element, nft)
                HTMLELEMENT.children[2].innerHTML = property["propertyid"] + "#" + nft["index"]

                let grantdata = JSON.parse(nft["grantdata"])

                if (grantdata.hasOwnProperty("image"))
                {
                    // Liteverse
                    HTMLELEMENT.children[1].innerHTML = grantdata["name"]

                    HTMLELEMENT.children[0].style.backgroundImage = 'url("' + IPFS + grantdata["image"].split("ipfs://")[1] + '")'
                    HTMLELEMENT.children[0].style.backgroundSize = "cover"

                    sourceV.src = IPFS + grantdata["image"].split("ipfs://")[1]
                    sourceA.src = IPFS + grantdata["image"].split("ipfs://")[1]
                    video.oncanplay = function() 
                    {
                        HTMLELEMENT.children[0].appendChild(video)
                    }

                    const holderdata = JSON.parse(nft["holderdata"])

                    HTMLELEMENT.children[3].innerHTML = holderdata["desire"] + " LTC"
                    HTMLELEMENT.children[4].innerHTML = holderdata["destination"].substring(0, 10) + "..." + holderdata["destination"].substring(holderdata["destination"].length - 10, holderdata["destination"].length)
                }

                if (grantdata.hasOwnProperty("structure"))
                {
                    // Liteworlds
                    if (grantdata["structure"] == "epic")
                    {
                        HTMLELEMENT.children[1].innerHTML = grantdata["name"]

                        if (grantdata["source"] == "ordinal")
                        {
                            HTMLELEMENT.children[0].style.backgroundImage = 'url("' + ORDINAL + grantdata["content"] + '")'
                        }
                        
                        if (grantdata["source"] == "ipfs")
                        {
                            HTMLELEMENT.children[0].style.backgroundImage = 'url("' + IPFS + grantdata["content"] + '")'
                        }

                        HTMLELEMENT.children[0].style.backgroundSize = "cover"

                        const holderdata = JSON.parse(nft["holderdata"])

                        HTMLELEMENT.children[3].innerHTML = holderdata["desire"] + " LTC"
                        HTMLELEMENT.children[4].innerHTML = holderdata["destination"].substring(0, 10) + "..." + holderdata["destination"].substring(holderdata["destination"].length - 10, holderdata["destination"].length)
                    }
                    
                    if (grantdata["structure"] == "artefactual")
                    {
                        let url = ORDINAL + grantdata["json"]
                        fetch(url).then((responce) => responce.json()).then(function(data)
                        {
                            //console.log(data)
                            HTMLELEMENT.children[1].innerHTML = data["data"]["name"]
                            HTMLELEMENT.children[0].style.backgroundImage = 'url("' + ORDINAL + data["content"][0] + '")'
                        })

                        HTMLELEMENT.children[0].style.backgroundSize = "cover"

                        const holderdata = JSON.parse(nft["holderdata"])

                        HTMLELEMENT.children[3].innerHTML = holderdata["desire"] + " LTC"
                        HTMLELEMENT.children[4].innerHTML = holderdata["destination"].substring(0, 10) + "..." + holderdata["destination"].substring(holderdata["destination"].length - 10, holderdata["destination"].length)
                    }
                }
            })
        }
    }
}