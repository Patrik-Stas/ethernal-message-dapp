import Web3 from 'web3'



let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    console.log(`Metamask not available. Therefore custom instance for loading will be provided by the page.`);
    web3 = new Web3(window.web3.currentProvider);
} else {
    const provider = new Web3.providers.HttpProvider(process.env.provider_url);
    web3 = new Web3(provider);
    console.log(`Metamask available, using metamask-injected web3 for loading data and sending transactions.`);
}
console.log(`The version of web3 used ${web3.version}`);

export default web3;