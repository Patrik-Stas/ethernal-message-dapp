import web3 from "./blockchain/engrave-web3";

export function weiToReadableEthString(valueWei, length=8) {
    return web3.utils.fromWei(valueWei.toString(), 'ether').substring(0, length);
}

export function assureLinkProtocol(link) {
    let adjustedLink = link;
    if (!!link && !(link.substring(0, 7) === "http://" || link.substring(0, 8) === "https://")) {
        adjustedLink = `http://${link}`
    }
    return adjustedLink;
}