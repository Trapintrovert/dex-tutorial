Moralis.initialize("apnxripCmQMhmEXqyqX3xvVS9xu3oDWbJbv4skMC"); // Application id from moralise.io
Moralis.serverURL = "https://iw9uyduoh0nk.usemoralis.com:2053/server"

let currentTrade = {};
let currentSelectSide;
let tokens;

async function init(){
    await Moralis.initPlugins();
    await Moralis.enableWeb3();
    await listAvailableToken();
    
}

async function listAvailableToken(){
    const result = await Moralis.Plugins.oneInch.getSupportedTokens({
        chain: 'eth'
    });
    tokens = result.tokens;
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
    currentTrade[currentSelectSide] = tokens[address]
    console.log(currentTrade)
    renderInterface();
    getQuote()
}

function renderInterface() {
    if (currentTrade.from) {
      document.getElementById("from_token_img").src = currentTrade.from.logoURI;
      document.getElementById("from_token_text").innerHTML = currentTrade.from.symbol;
    }
    if (currentTrade.to) {
      document.getElementById("to_token_img").src = currentTrade.to.logoURI;
      document.getElementById("to_token_text").innerHTML = currentTrade.to.symbol;
    }
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

function openModal(side){
    currentSelectSide = side
    document.getElementById('token_modal').style.display = 'block'
}

function closeModal(){
    document.getElementById('token_modal').style.display = 'none'
}

async function getQuote(){
    if(!currentTrade.from || !currentTrade.to || !document.getElementById('from_amount').value) return

    let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);

    const quote = await Moralis.Plugins.oneInch.quote({
      chain: 'eth', // The blockchain you want to use (eth/bsc/polygon)
      fromTokenAddress: currentTrade.from.address, // The token you want to swap
      toTokenAddress: currentTrade.to.address, // The token you want to receive
      amount: amount,
    });
    console.log(quote);
    document.getElementById("gas_estimate").innerHTML = quote.estimatedGas;
    document.getElementById("to_amount").value = quote.toTokenAmount / 10 ** quote.toToken.decimals;
}

init();

document.getElementById('modal_close').onclick = closeModal;
document.getElementById('from_token_select').onclick = (() => {openModal("from")});
document.getElementById('to_token_select').onclick = (() => {openModal("to")});
document.getElementById('login_button').onclick = login
document.getElementById('from_amount').onblur = getQuote;