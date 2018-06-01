const config = require('config');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const ethernalBookInterface = require('./build/EthernalMessageBook.interface.json');
const ethernalBookBytecode = require('./build/EthernalMessageBook.bytecode.json');
const assert = require('assert');
const BigNumber = require('bignumber.js');
var rl = require("readline");

const startPriceWei = BigNumber(Web3.utils.toWei('0.00001', 'ether'));

const contractNumerator = 1618;
const contractDenumerator = 1000;
const expireSeconds = 3600*6;



const deploy = async (deployerAccount, gasLimit, gasPrice) => {
    try {

        console.log(`Using mnemonic: ${config.get('mnemonic')}`);
        console.log(`Using provider url: ${config.get('provider_url')}`);

        console.log(`Attempting to deploy from account ${deployerAccount}`);
        const result = await new web3.eth.Contract(JSON.parse(ethernalBookInterface))
            .deploy({
                data: ethernalBookBytecode,
                arguments: [startPriceWei, contractNumerator, contractDenumerator, expireSeconds]
            })
            .send({
                gas: gasLimit,
                from: deployerAccount,
                gasPrice: gasPrice
            });

        console.log(`Contract was deployed to: ${result.options.address}`);
    }
    catch(error) {
        console.log(error.message);
    }
};

const provider = new HDWalletProvider(
    config.get('mnemonic'),
    config.get('provider_url')
);

const web3 = new Web3(provider);


const askUser = async() => {

    const accounts = await web3.eth.getAccounts();
    const deployerAccount = accounts[0];
    const gasLimit = '1500000';
    const gasPriceWei =  web3.utils.toWei('22', "gwei").toString();

    console.log('----USING CONFIGURATION : ' + config.util.getEnv('NODE_CONFIG_ENV'));
    console.log(`Mnemonic:${config.get('mnemonic')}`);
    console.log(`Provider:${config.get('provider_url')}`);
    console.log(`StartPriceWei: ${startPriceWei.toString()} WEI`);
    console.log(`StartPriceWei: ${web3.utils.fromWei(startPriceWei.toString(), 'ether')} ETH`);
    console.log(`Numerator: ${contractNumerator.toString()}`);
    console.log(`Denominator: ${contractDenumerator.toString()}`);

    console.log("-----Deployer account information-----");
    console.log(`From account: ${deployerAccount.toString()}`);
    console.log(`Account balance: ${await web3.eth.getBalance(deployerAccount)} WEI`);
    console.log(`Account balance: ${web3.utils.fromWei(await web3.eth.getBalance(deployerAccount), 'ether')} ETH`);

    console.log(`Gas limit is set to: ${gasLimit}`);
    console.log(`Gas price is set to: ${gasPriceWei} WEI`);
    console.log(`Gas price is set to: ${web3.utils.fromWei(gasPriceWei, 'gwei')} GWEI <<<`);
    console.log(`Gas price is set to: ${web3.utils.fromWei(gasPriceWei, 'ether')} ETH`);
    console.log(`Maximal possible spending cap: ${web3.utils.fromWei(BigNumber(gasLimit).times(gasPriceWei).toString(), 'ether')}`);

    const prompts = rl.createInterface(process.stdin, process.stdout);
    prompts.question("Are you use you want to continue in deployment? yes/no\n", function (answer) {
        if (answer === "yes") {
            console.log("Starting deployment!");
            deploy(deployerAccount, gasLimit, gasPriceWei);
        } else {
            console.log("Deployment aborted");
            process.exit();
        }
    });
};

askUser();