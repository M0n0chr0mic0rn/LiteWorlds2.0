//console.log("hello")
// opens a communication between scripts
var port = chrome.runtime.connect()
//console.log(port)
//port.disconnect()
//port = chrome.runtime.connect()





// Website API soon

port.onMessage.addListener(function(o)
{
    if (o.function && o.function === "getMaster")
    {
        console.log("CONTENT: ", o)
        getMaster()
    }
})

function getMaster()
{
    port.postMessage({"function":"getMaster"})
}

//getMaster()