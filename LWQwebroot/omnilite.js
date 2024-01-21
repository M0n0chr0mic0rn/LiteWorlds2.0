const API = "https://v2.liteworlds.quest/?method="

var AUTHKEY

// LOGIN
// 1. Login via Extension
document.addEventListener('LWQ-AuthKey', function(data) {
    AUTHKEY = data.detail
    Wallet()
})

__init()

function __init()
{
    const div = document.createElement("div")
    document.body.appendChild(div)

    const destination = document.createElement("input")
    div.appendChild(destination)

    const amount = document.createElement("input")
    div.appendChild(amount)

    const send = document.createElement("button")
    div.appendChild(send)

    destination.id = "destination"
    amount.id = "amount"

    send.innerHTML = "SEND"
    send.onclick = function()
    {
        const url = API + "omnilite-send&authkey=" + AUTHKEY + "&destination=" + destination.value + "&amount=" + amount
        console.log(url)
        fetch(url).then((responce) => responce.json()).then(function(data)
        {
            console.log(data)
        })
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