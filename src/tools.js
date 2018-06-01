import ethernityBoard from './blockchain/ethernityBoard';

export function weiToReadableEthString(valueWei, length=8) {
    const ethBoard = new ethernityBoard();
    return ethBoard.getWeb3().utils.fromWei(valueWei.toString(), 'ether').substring(0, length);
}

export function assureLinkProtocol(link) {
    let adjustedLink = link;
    if (!!link && !(link.substring(0, 7) === "http://" || link.substring(0, 8) === "https://")) {
        adjustedLink = `http://${link}`
    }
    return adjustedLink;
}