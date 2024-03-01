console.log("Background says hello :)")

// opens a communication port
chrome.runtime.onConnect.addListener(function(port)
{
    console.log(port)
    // listen for every message passing throw it
    port.onMessage.addListener(function(o)
    {
        // if the message comes from the popup
        if (o.from && o.from === 'popup' && o.start && o.start === 'Y')
        {
            console.log("You called so I do this")
            port.postMessage({
                'callback': 'Hello Website'
            })

            /*chrome.windows.create({url:"sign.html", type:"popup"}).then(function(popup)
            {
                console.log(popup)
            })*/

            
            
        }

        if (o.function && o.function === "getPass")
        {
            chrome.storage.local.get("LWQ_SC_PASSWD").then((local) =>
            {
                chrome.storage.session.get("LWQ_SC_PASSWD").then((session) =>
                {
                    port.postMessage({
                        "function": "getPass",
                        "local": local.LWQ_SC_PASSWD,
                        "session": session.LWQ_SC_PASSWD
                    })
                })
            })
        }

        if (o.function && o.function === "getSeed")
        {
            chrome.storage.local.get("LWQ_SC_MNEMONIC").then((local) =>
            {
                port.postMessage({
                    "function": o.function,
                    "seed": local.LWQ_SC_MNEMONIC
                })
            })
        }

        if (o.function && o.function === "getMaster")
        {
            chrome.storage.local.get("LWQ_SC_MASTER").then((local) =>
            {
                port.postMessage({
                    "function": o.function,
                    "master": local.LWQ_SC_MASTER
                })
            })
        }

        if (o.function && o.function === "setMaster")
        {
            chrome.storage.local.set({"LWQ_SC_MASTER": o.master})
        }
    })
})

chrome.runtime.onConnectExternal.addListener(function(port)
{
    console.log(port)
    port.onMessage.addListener(function(o)
    {
        console.log(o)

        chrome.storage.local.get("LWQ_SC_PASSWD").then((local) =>
        {
            console.log(local.LWQ_SC_PASSWD)
            if (local.LWQ_SC_PASSWD !== undefined)
            {
                chrome.storage.session.get("LWQ_SC_PASSWD").then((session) =>
                {
                    console.log(session.LWQ_SC_PASSWD)
                    if (session.LWQ_SC_PASSWD !== undefined)
                    {
                        if (local.LWQ_SC_PASSWD === session.LWQ_SC_PASSWD)
                        {
                            if (o.function && o.function === "getMaster")
                            {
                                chrome.storage.local.get("LWQ_SC_MASTER").then((local) =>
                                {
                                    console.log("Unlocked, ", local.LWQ_SC_MASTER)
                                    port.postMessage({
                                        "function": o.function,
                                        "master": local.LWQ_SC_MASTER
                                    })
                                })
                            }
                        }
            else
            {
                console.log("Locked!")
                port.postMessage({
                    "function": "failed",
                    "answer": "Extension Locked!"
                })
            }
                    }
                    else
                    {
                        console.log("Locked!")
                        port.postMessage({
                            "function": "failed",
                            "answer": "Extension locked!"
                        })
                    }
                })
            }
            else
            {
                console.log("Not setup!")
                port.postMessage({
                    "function": "failed",
                    "answer": "Extension not setup!"
                })
            }
        })
    })
})