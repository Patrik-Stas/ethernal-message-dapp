import web3 from './engrave-web3';

import EthernalBoard from './build/EthernalBoard'

export default (address) => {
    return new web3.eth.Contract(
        JSON.parse(EthernalBoard.interface),
        address
    );
}