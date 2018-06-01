import ethernalContractInterface from '../contract/EthernalMessageBook.interface'
import {BigNumber} from "bignumber.js";
import * as web3Utils from "./engrave-web3";
const util = require('util');


export default class EthernityBoard {

    static instance;

    constructor() {
        if (EthernityBoard.instance) {
            return EthernityBoard.instance;
        }
        console.log("Singleton instance of EthernityBoard was created");
        EthernityBoard.instance = this;
        this.contractAddress = process.env.contract_address;
        this.cachedMessages = {};
        this.multNumerator = 0;
        this.multDenominator = 0;

        this.isMetamaskInBrowser = false;
        this.metamaskWeb3InstanceNetworkId = -1;
        this.isMetamaskWeb3InstanceUsed = false;


        console.log("Web3 instance was not yet created. Going to do so now.");
        this.web3 = web3Utils.getWeb3WithCustomProvider(process.env.provider_url);
        // console.log(`Created custom web3. See it ${util.inspect(this.web3)}`);
        console.log(`Web3 is at version ${this.web3.version}`);

        if (web3Utils.isWeb3InjectedInToBrowser()) {
            console.log("Found Metamaks in the browser. Will rehook web3 after we check right network is selected");
            this.isMetamaskInBrowser = true;
            const metamaskWeb3 = web3Utils.getWeb3WithMetamaskProvider();
            metamaskWeb3.eth.net.getId()
                .then(this.rewireToMetamaskIfPossible.bind(this));
        }
        console.log(`Created web3 instanced, at version = ${this.web3.version}`);
        try {
            this.contract = new this.web3.eth.Contract(
                JSON.parse(ethernalContractInterface),
                this.contractAddress
            );
        }
        catch (error) {
            console.log("Contract was not loaded. Your browser has metamask on wrong network, or application has misconfigured contract address.")
        }
    }

    getWeb3() {
        return this.web3;
    }

    async rewireToMetamaskIfPossible(netId) {
        console.log(`Promise with Network ID returned!. Metamask seem to be hooked to networok ${netId}. Expected is ${process.env.expected_network}`);
        this.metamaskWeb3InstanceNetworkId = netId;
        if (netId === process.env.expected_network) {
            console.log("The network of metamask web3 is hooked to right network. Will use metamask web3 instance.");
            this.web3 = web3Utils.getWeb3WithMetamaskProvider();
            try {
                this.contract = new this.web3.eth.Contract(
                    JSON.parse(ethernalContractInterface),
                    this.contractAddress
                );
            }
            catch (error) {
                console.log("Contract was not loaded. Your browser has metamask on wrong network, or application has misconfigured contract address.")
            }
            // console.log(`Rewired metamask web3. See it ${util.inspect(this.web3)}`);
            this.isMetamaskWeb3InstanceUsed = true;
        }
        else {
            console.log(`Won't use Metamask web3, because required network ID is ${process.env.expected_network}`)
        }
    }

    async asureWebIsLoaded() {

    }

    isWeb3RunningAgainstExpectedNetwork(){
        return this.metamaskWeb3InstanceNetworkId.toString() === process.env.expected_network;
    }

    async getNumerator() {
        await this.asureWebIsLoaded();
        if (!this.multNumerator) {
            this.multNumerator = await this.contract.methods.multNumerator().call();
        }
        return this.multNumerator
    }

    async getDenominator() {
        await this.asureWebIsLoaded();
        if (!this.multDenominator) {
            this.multDenominator = await this.contract.methods.multDenominator().call();
        }
        return this.multDenominator;
    }


    getContractLink() {
        return this.getEtherscanLink(this.contractAddress);
    }

    async getSecondsToExpiry() {
        await this.asureWebIsLoaded();
        return parseInt(await this.contract.methods.getSecondsToExpiration().call());
    }

    getEtherscanLink(address) {
        return `${process.env.etherscan_base_url}/address/${address}`;
    }

    async getStartingPrice() {
        await this.asureWebIsLoaded();
        if (!this.startingPrice) {
            this.startingPrice = await this.contract.methods.startingPrice().call()
        }
        return this.startingPrice;
    }

    async getPriceOfNthMessage(n) {
        await this.asureWebIsLoaded();
        let price = BigNumber(await this.getStartingPrice());
        console.log(`Starting price ${price}`);
        for (let i = 0; i < n; i++) {
            price = price.times(await this.getNumerator()).dividedBy(await this.getDenominator());
            console.log(`price ... ${price}`);
        }
        return price.toString();
    }

    async getMessagesCount() {
        await this.asureWebIsLoaded();
        return parseInt(await this.contract.methods.getMessagesCount().call(), 10);
    }

    async getNthMessage(msgIndex) {
        await this.asureWebIsLoaded();
        if (!this.cachedMessages[msgIndex]) {
            const message = await this.contract.methods.messages(msgIndex).call();
            message['itemNumber'] = msgIndex;
            this.cachedMessages[msgIndex] = message;
        }
        return this.cachedMessages[msgIndex]
    };

    async getPriceOfNthMessage(n) {
        await this.asureWebIsLoaded();
        let price = BigNumber(await this.getStartingPrice());
        for (let i = 0; i < n; i++) {
            price = price.times(await this.getNumerator()).dividedBy(await this.getDenominator());
        }
        return price.toString();
    }

    async getPriceListInEth(upToN) {
        await this.asureWebIsLoaded();
        let priceWei = BigNumber(await this.getStartingPrice());
        let pricesWei = [];
        // let priceEth = web3.utils.fromWei(priceWei.toString(), 'ether') ;
        pricesWei .push(priceWei);

        for (let i = 0; i < upToN; i++) {
            priceWei = priceWei.times(await this.getNumerator()).dividedBy(await this.getDenominator());
            pricesWei.push(priceWei);
        }
        return pricesWei.map(function(val) {
            let wholeNumber = val.decimalPlaces(0).toString();
            return this.web3.utils.fromWei(wholeNumber , 'ether');
        }.bind(this));
    }

    async getLastMessage() {
        await this.asureWebIsLoaded();
        const messagesCount = await this.getMessagesCount();
        if (messagesCount > 0) {
            return this.getNthMessage(messagesCount - 1);
        }
        else {
            return {};
        }
    }

    async getCurrentPrice() {
        await this.asureWebIsLoaded();
        return await this.contract.methods.price().call();
    }

    async isLoggedInMetamask() {
        await this.asureWebIsLoaded();
        return !!(await this.getCurrentAccount())
    }

    async getCurrentAccount() {
        await this.asureWebIsLoaded();
        const accounts = await this.web3.eth.getAccounts();
        return accounts[0]; // metamask return currently used account on index 0
    }

    async getCurrentAccountBalance() {
        await this.asureWebIsLoaded();
        const account = await this.getCurrentAccount();
        console.log(`account = ${account}`);
        return await this.web3.contract.getBalance(account);
    }

    async getSummary() {
        await this.asureWebIsLoaded();
        const summary = await this.contract.methods.getSummary().call();
        return {
            numerator: summary[0],
            denominator: summary[1],
            startingPriceWei: summary[2],
            messagesCount: summary[3],
        }
    }

    async writeMessage(message, title, username, link, weiPrice, fromAccount) {
        await this.asureWebIsLoaded();
        return this.contract.methods
            .writeMessage(message, title, username, link, "{}")
            .send({
                from: fromAccount,
                value: weiPrice
            });
    }

}