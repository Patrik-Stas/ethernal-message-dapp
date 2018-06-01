import ethernalContractInterface from '../contract/EthernalMessageBook.interface'
// import web3 from "./engrave-web3";
import {BigNumber} from "bignumber.js";
import web3 from "./engrave-web3";
// import Web3 from "web3/index";



export default class EthernityBoard {

    static instance;

    constructor() {

        if (this.instance) {
            return this.instance;
        }
        this.contractAddress = process.env.contract_address;
        this.ethernityBoard = {};
        this.cachedMessages = {};
        this.multNumerator = 0;
        this.multDenominator = 0;

        // this.instance = this;
        console.log(`Ethernity board constructor. Web3 = ${web3.version}`);
        try {
            this.ethernityBoard = new web3.eth.Contract(
                JSON.parse(ethernalContractInterface),
                this.contractAddress
            );
        }
        catch (error){
            console.log("Contract was not loaded. Your browser has metamask on wrong network, or application has misconfigured contract address.")
        }
    }


    async getNumerator() {
        if (!this.multNumerator) {
            this.multNumerator = await this.ethernityBoard.methods.multNumerator().call();
        }
        return this.multNumerator
    }

    async getDenominator() {
        if (!this.multDenominator) {
            this.multDenominator = await this.ethernityBoard.methods.multDenominator().call();
        }
        return this.multDenominator;
    }

    doesUserHasMetamask() {
        return (typeof window !== 'undefined' && typeof window.web3 !== 'undefined');
    }

    getContractLink() {
        return this.getEtherscanLink(this.contractAddress);
    }

    async getExpirationTime() {
        return await this.ethernityBoard.methods.expirationTime().call();
    }

    async getSecondsToExpiry() {
        return parseInt(await this.ethernityBoard.methods.getSecondsToExpiration().call());
    }

    getEtherscanLink(address) {
        return `${process.env.etherscan_base_url}/address/${address}`;
    }

    async getStartingPrice() {
        if (!this.startingPrice) {
            this.startingPrice = await this.ethernityBoard.methods.startingPrice().call()
        }
        return this.startingPrice;
    }

    async getPriceOfNthMessage(n) {
        let price = BigNumber(await this.getStartingPrice());
        console.log(`Starting price ${price}`);
        for (let i = 0; i < n; i++) {
            price = price.times(await this.getNumerator()).dividedBy(await this.getDenominator());
            console.log(`price ... ${price}`);
        }
        return price.toString();
    }

    async getMessagesCount() {
        return parseInt(await this.ethernityBoard.methods.getMessagesCount().call(), 10);
    }

    async getNthMessage(msgIndex) {
        if (!this.cachedMessages[msgIndex]) {
            const message = await this.ethernityBoard.methods.messages(msgIndex).call();
            message['itemNumber'] = msgIndex;
            this.cachedMessages[msgIndex] = message;
        }
        return this.cachedMessages[msgIndex]
    };

    async getPriceOfNthMessage(n) {
        let price = BigNumber(await this.getStartingPrice());
        for (let i = 0; i < n; i++) {
            price = price.times(await this.getNumerator()).dividedBy(await this.getDenominator());
        }
        return price.toString();
    }

    async getPriceListInEth(upToN) {
        let priceWei = BigNumber(await this.getStartingPrice());
        let pricesWei = [];
        // let priceEth = web3.utils.fromWei(priceWei.toString(), 'ether') ;
        pricesWei .push(priceWei);

        for (let i = 0; i < upToN; i++) {
            priceWei = priceWei.times(await this.getNumerator()).dividedBy(await this.getDenominator());
            pricesWei.push(priceWei);
        }
        return pricesWei.map((val) => {
            let wholeNumber = val.decimalPlaces(0).toString();
            return web3.utils.fromWei(wholeNumber , 'ether')
        });
    }

    async getLastMessage() {
        const messagesCount = await this.getMessagesCount();
        if (messagesCount > 0) {
            return this.getNthMessage(messagesCount - 1);
        }
        else {
            return {};
        }
    }

    async getCurrentPrice() {
        return await this.ethernityBoard.methods.price().call();
    }

    async isLoggedInMetamask() {
        return !!(await this.getCurrentAccount())
    }

    async getCurrentAccount() {
        const accounts = await web3.eth.getAccounts();
        return accounts[0]; // metamask return currently used account on index 0
    }

    async getCurrentAccountBalance() {
        const account = await this.getCurrentAccount();
        console.log(`account = ${account}`);
        return await web3.eth.getBalance(account);
    }

    async getSummary() {
        const summary = await this.ethernityBoard.methods.getSummary().call();
        return {
            numerator: summary[0],
            denominator: summary[1],
            startingPriceWei: summary[2],
            messagesCount: summary[3],
        }
    }

    writeMessage(message, title, username, link, weiPrice, fromAccount) {
        return this.ethernityBoard.methods
            .writeMessage(message, title, username, link, "{}")
            .send({
                from: fromAccount,
                value: weiPrice
            });
    }

}