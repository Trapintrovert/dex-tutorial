Moralis.initialize("apnxripCmQMhmEXqyqX3xvVS9xu3oDWbJbv4skMC"); // Application id from moralise.io
Moralis.serverURL = "https://iw9uyduoh0nk.usemoralis.com:2053/server"

let currentTrade = {};

async function init(){
    await Moralis.initPlugins();
    await Moralis.enableWeb3();
    await listAvailableToken();
    
}

async function listAvailableToken(){
    const result = await Moralis.Plugins.oneInch.getSupportedTokens({
        chain: 'eth'
    });
    const tokens = result.tokens;
    console.log(tokens)
    let parent = document.getElementById('token_list')
    for( const address in tokens){
        let token = tokens[address]
        let div = document.createElement('div');
        div.setAttribute('data-address', address)
        div.className = 'token_row'
        let html = `
            <img class='token_list_img' src="${token.logoURI}"/>
            <span class="token_list_text">${token.symbol}</span>
        `
        div.innerHTML = html;
        div.onclick = selectToken;
        parent.appendChild(div)
    }
}

async function selectToken(){
    closeModal();
    let address = event.target.getAttribute("data-address")
    console.log(address)
}


async function login() {
    try {
        currentUser = Moralis.User.current();
        if(!currentUser){
            currentUser = await Moralis.Web3.authenticate() 
        }
    } catch (error) {  
        console.log(error)
    }
}

function openModal(){
    document.getElementById('token_modal').style.display = 'block'
}

function closeModal(){
    document.getElementById('token_modal').style.display = 'none'
}


init();

document.getElementById('modal_close').onclick = closeModal;
document.getElementById('from_token_select').onclick = openModal;
document.getElementById('login_button').onclick = login