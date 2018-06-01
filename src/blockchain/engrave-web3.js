import Web3 from 'web3'



let web3;



if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    console.log(`Metamask available. Using provider from Metamask`);
    web3 = new Web3(window.web3.currentProvider);


} else {
    console.log(`Metamask  NOT found. Using custom HTTP provider. Using provider from Metamask`);
    const provider = new Web3.providers.HttpProvider(process.env.provider_url);
    web3 = new Web3(provider);
}
console.log(`The version of web3 used ${web3.version}`);

export default web3;