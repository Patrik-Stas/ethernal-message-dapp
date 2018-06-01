import Web3 from 'web3'


export function getWeb3WithMetamaskProvider() {
    return new Web3(window.web3.currentProvider);
}

export function getWeb3WithCustomProvider(providerUrl) {
    const customProvider = new Web3.providers.HttpProvider(providerUrl);
    return new Web3(customProvider);
}

export function isWeb3InjectedInToBrowser() {
    return (typeof window !== 'undefined' && typeof window.web3 !== 'undefined');
}

export async function getWeb3Network(web3) {
    web3.eth.net.getId();
}

// export async function getWeb3 (fallbackProviderUrl) {
//     let web3;
//     let isUsingMetamaskProvider = false;
//     if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
//         console.log(`Metamask available. Using provider from Metamask.`);
//         web3 = getWeb3WithMetamaskProvider();
//         isUsingMetamaskProvider = true;
//     } else {
//         console.log(`Metamask not found. Using custom HTTP provider pointing to ${fallbackProviderUrl}`);
//         const provider = getWeb3WithCustomProvider(fallbackProviderUrl);
//         web3 = new Web3(provider);
//     }
//     return {web3, isUsingMetamaskProvider};
// }
