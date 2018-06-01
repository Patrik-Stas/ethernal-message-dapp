const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const sleep = require('sleep');
const BigNumber = require('bignumber.js');
const ethernalBookInterface = require('../src/contract/EthernalMessageBook.interface.json');
const ethernalBookBytecode = require('../src/contract/EthernalMessageBook.bytecode.json');
const util = require('util');

let accounts;
let ethernalBook;
let contractOwner;
let user1;
let user2;
let user3;
const initStartPrice = BigNumber(web3.utils.toWei('0.00011', 'ether'));
const initNumerator = 1618;
const initDenominator = 1000;
const expirySeconds = 2;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    contractOwner = accounts[0];
    user1 = accounts[1];
    user2 = accounts[2];
    user3 = accounts[3];
    ethernalBook = new web3.eth.Contract(JSON.parse(ethernalBookInterface));
    ethernalBook = await ethernalBook
        .deploy({
            data: ethernalBookBytecode,
            arguments: [initStartPrice, initNumerator, initDenominator, expirySeconds]
        })
        .send({from: contractOwner, gas: '2000000'});
    // console.log(util.inspect(messageEthernalizedEvent));
});


describe('Messages', () => {
    it('Deploys ethernalBoard contract', async () => {
        assert.ok(ethernalBook.options.address);
    });


    it('Deployed ethernalBoard contract should be correctly initialized', async () => {
        const messagesCountStart = await ethernalBook.methods.getMessagesCount().call();
        const price = BigNumber(await ethernalBook.methods.price().call());
        const contractNumberatorActual = await ethernalBook.methods.multNumerator().call();
        const contractDenominatorActual = await ethernalBook.methods.multDenominator().call();

        assert.equal('0', messagesCountStart);
        assert.equal(initStartPrice.toString(), price.toString());
        assert.equal(initNumerator.toString(), contractNumberatorActual);
        assert.equal(initDenominator.toString(), contractDenominatorActual);

    });

    it('it require value of starting price for the first transaction', async () => {
        await ethernalBook.methods.writeMessage('Hello world!', 'Greeting','CrazyLoco', 'www.google.com', '').send({
            from: user1,
            value: initStartPrice,
            gas: '1000000'
        });
        const messagesCount = await ethernalBook.methods.getMessagesCount().call();
        assert.equal('1', messagesCount);
        const message = await ethernalBook.methods.messages(0).call();
        assert.equal('Hello world!', message.msg);
        assert.equal('Greeting', message.title);
        assert.equal('CrazyLoco', message.authorName);
        assert.equal("www.google.com", message.link);
        assert.equal('', message.metadata);
        assert.equal(initStartPrice, message.value);
        assert.equal(user1, message.sourceAddr);
    });


    it('it should transfer ether to root acount', async () => {
        const rootBalanceBefore = BigNumber(await web3.eth.getBalance(contractOwner));
        await ethernalBook.methods.writeMessage('Hello world!','Greeting', 'CrazyLoco', 'google.com', '').send({
            from: user1,
            value: initStartPrice,
            gas: '1000000'
        });
        const rootBalanceAfter = BigNumber(await web3.eth.getBalance(contractOwner));
        assert.equal(rootBalanceBefore.toString(), (rootBalanceAfter.minus(initStartPrice).toString()));
    });

    it('it should emit MessageEthernalized event', async function() {
        this.timeout(5000);
        let eventCallbackScope = {
            lastEventMessageId: -1
        };
        ethernalizedEventCallback = function(error, result) {
           if (!error) {
               assert.equal(this.lastEventMessageId +1, result.returnValues.messageId);
               this.lastEventMessageId+=1;
           }
           else {
               assert(false);
           }
        }.bind(eventCallbackScope);
        ethernalBook.events.MessageEthernalized({}, ethernalizedEventCallback);
        const rootBalanceBefore = BigNumber(await web3.eth.getBalance(contractOwner));
        sleep.msleep(2000);
        await ethernalBook.methods.writeMessage('Hello world!', 'Greeting', 'CrazyLoco', 'google.com', '').send({
            from: user1,
            value: initStartPrice,
            gas: '1000000'
        });
        sleep.msleep(2000);
        await ethernalBook.methods.writeMessage('Hello world!', 'Greeting','CrazyLoco', 'google.com', '').send({
            from: user1,
            value:  BigNumber(web3.utils.toWei('0.0002', 'ether')),
            gas: '1000000'
        });
        assert.equal(eventCallbackScope.lastEventMessageId, 1);
    });


    it('it should be okay to send extra ether', async () => {
        increasedValueWei = initStartPrice.plus(100000);
        await ethernalBook.methods.writeMessage('Hello world!','Greeting', 'CrazyLoco', 'google.com', '').send({
            from: user1,
            value: increasedValueWei,
            gas: '1000000'
        });
        const messagesCount = await ethernalBook.methods.getMessagesCount().call();
        assert.equal('1', messagesCount);
        const message = await ethernalBook.methods.messages(0).call();
        assert.equal('Hello world!', message.msg);
        assert.equal('CrazyLoco', message.authorName);
        assert.equal('', message.metadata);
        assert.equal(increasedValueWei, message.value);
    });

    it('it should not accpet next message prior expiration', async function() {
        this.timeout(5000);
        await ethernalBook.methods.writeMessage('Hello world!', 'Greeting','CrazyLoco', 'google.com', '').send({
            from: user1,
            value: initStartPrice,
            gas: '1000000'
        });
        sleep.msleep(1000);
        try {
            await ethernalBook.methods.writeMessage('Hello world2!', 'Greeting2', 'CrazyLoco2', 'google2.com', '').send({
                from: user1,
                value: initStartPrice.times(2),
                gas: '1000000'
            });
            assert(false); // this should not be execute, code above should fail
        }
        catch(error) {
            assert(true);
        }
    });

    it('it should accpet next message after expiration', async function() {
        this.timeout(5000);
        await ethernalBook.methods.writeMessage('Hello world!', 'Greeting','CrazyLoco', 'google.com', '').send({
            from: user1,
            value: initStartPrice,
            gas: '1000000'
        });
        sleep.msleep(3000);
        await ethernalBook.methods.writeMessage('Hello world2!', 'Greeting2', 'CrazyLoco2', 'google2.com', '').send({
            from: user1,
            value: initStartPrice.times(2),
            gas: '1000000'
        });
        const messagesCountEnd = await ethernalBook.methods.getMessagesCount().call();
        assert.equal('2', messagesCountEnd);
    });


    it('it should return number of seconds left till expiration', async function() {
        this.timeout(5000);
        await ethernalBook.methods.writeMessage('Hello world!', 'Greeting','CrazyLoco', 'google.com', '').send({
            from: user1,
            value: initStartPrice,
            gas: '1000000'
        });

        const secondsToExpiration = await ethernalBook.methods.getSecondsToExpiration().call();
        assert.equal(secondsToExpiration, 2);

        sleep.msleep(1000);

        const secondsToExpiration2 = await ethernalBook.methods.getSecondsToExpiration().call();
        assert.equal(secondsToExpiration2, 1);
    });

    it('it fails if first transaction value is low', async () => {
        try {
            await ethernalBook.methods.writeMessage('Hello world!', 'Greeting','CrazyLoco', 'google.com', '').send({
                from: user1,
                value: initStartPrice.minus(1),
                gas: '1000000'
            });
            assert(false);
        }
        catch (error) {
            const messagesCountEnd = await ethernalBook.methods.getMessagesCount().call();
            assert.equal('0', messagesCountEnd);
        }
    });

    it('it should increase required value for next message by coefficient', async () => {
        const price1 = BigNumber(await ethernalBook.methods.price().call());

        await ethernalBook.methods.writeMessage('Hello world!','Greeting', 'CrazyLoco', 'google.com', '').send({
            from: user1,
            value: initStartPrice,
            gas: '1000000'
        });
        const messagesCount = await ethernalBook.methods.getMessagesCount().call();
        assert.equal('1', messagesCount);

        const price2 = BigNumber(await ethernalBook.methods.price().call());

        assert.equal(price1.times(initNumerator / initDenominator).toString(), price2.toString());
    });


    it('blockNumber should be number', async () => {
        await ethernalBook.methods.writeMessage('msg1','Greeting', 'from1', 'google.com', '{}').send({
            from: user1,
            value: initStartPrice,
            gas: '1000000'
        });
        const messagesCount = await ethernalBook.methods.getMessagesCount().call();
        assert.equal('1', messagesCount);

        const message0 = await ethernalBook.methods.messages(0).call();
        assert(message0.blockNumber);
        assert(parseInt(message0.blockNumber) >= 0);
    });


    it('blockNumber should get summary', async () => {
        await ethernalBook.methods.writeMessage('msg1','Greeting', 'from1', 'google.com', '{}').send({
            from: user1,
            value: initStartPrice,
            gas: '1000000'
        });
        const summary = await ethernalBook.methods.getSummary().call();
        const numerator = summary[0];
        const denominator = summary[1];
        const startingPriceWei = summary[2];
        const messagesCount = summary[3];

        assert.equal(numerator, initNumerator.toString());
        assert.equal(denominator, initDenominator.toString());
        assert.equal(startingPriceWei, initStartPrice);
        assert.equal(messagesCount, '1');
    });


    it('time should be increased', async function() {
        this.timeout(5000);
        await ethernalBook.methods.writeMessage('msg1','Greeting', 'from1', 'google.com', '{}').send({
            from: user1,
            value: initStartPrice,
            gas: '1000000'
        });
        sleep.msleep(2000);
        await ethernalBook.methods.writeMessage('msg2', 'Greeting','from2', 'google.com', '{}').send({
            from: user2,
            value: initStartPrice.times(2),
            gas: '1000000'
        });
        const messagesCount = await ethernalBook.methods.getMessagesCount().call();
        assert.equal('2', messagesCount);

        const message0 = await ethernalBook.methods.messages(0).call();
        const message1 = await ethernalBook.methods.messages(1).call();
        assert(message0.time < message1.time);
        assert(message0.blockNumber < message1.blockNumber);
    });

    it('complete e2e', async function() {
        this.timeout(8000);
        sleep.msleep(500);
        const rootBalanceBefore = await web3.eth.getBalance(contractOwner);

        const price1 = BigNumber(await ethernalBook.methods.price().call());

        const paidForFirstMessage = BigNumber(initStartPrice);
        await ethernalBook.methods.writeMessage('Hello world!', 'Greeting','CrazyLoco', 'google.com', '').send({
            from: user1,
            value: paidForFirstMessage,
            gas: '1000000'
        });

        sleep.msleep(2000);
        const rootBalanceDebug2 = BigNumber(await web3.eth.getBalance(contractOwner));

        const messagesCount2 = await ethernalBook.methods.getMessagesCount().call();
        const price2 = BigNumber(await ethernalBook.methods.price().call());
        const message2 = await ethernalBook.methods.messages(0).call();

        assert.equal('1', messagesCount2);
        assert.equal(price1.times(initNumerator / initDenominator).toString(), price2.toString());
        assert.equal('Hello world!', message2.msg);
        assert.equal('CrazyLoco', message2.authorName);
        assert.equal('', message2.metadata);
        assert.equal(price1, message2.value);


        // Now let's do invalid transaction, sending less eth then required
        try {
            await ethernalBook.methods.writeMessage('SomeAdvert.com', 'Greeting','www.barrrr.com', 'google.com', '{}').send({
                from: user2,
                value: price2.minus(1),
                gas: '1000000'
            });
            assert(false);
        }
        catch (error) {
            const messagesCountEnd = await ethernalBook.methods.getMessagesCount().call();
            assert.equal(messagesCountEnd, '1');
        }
        const price3 = BigNumber(await ethernalBook.methods.price().call());
        const messagesCount3 = await ethernalBook.methods.getMessagesCount().call();

        // Nothing should be changed
        assert.equal('1', messagesCount3);
        assert.equal(price2.toString(), price3.toString());

        // Now let's do another valid transaction, in fact send even more than required eth
        const paidForSecondMessage = price3.times(10);
        await ethernalBook.methods.writeMessage('SomeAdvert.com', 'Greeting','www.barrrr.com', 'google.com', '{}').send({
            from: user2,
            value: paidForSecondMessage,
            gas: '1000000'
        });

        sleep.msleep(2000);
        const messagesCount4 = await ethernalBook.methods.getMessagesCount().call();
        const price4 = BigNumber(await ethernalBook.methods.price().call());

        assert.equal('2', messagesCount4);
        assert.equal(price3.times(initNumerator / initDenominator).toString(), price4.toString());

        const message4_0 = await ethernalBook.methods.messages(0).call();
        assert.equal('Hello world!', message4_0.msg);
        assert.equal('CrazyLoco', message4_0.authorName);
        assert.equal('', message4_0.metadata);
        assert.equal(paidForFirstMessage, message4_0.value);

        const message4_1 = await ethernalBook.methods.messages(1).call();
        assert.equal('SomeAdvert.com', message4_1.msg);
        assert.equal('www.barrrr.com', message4_1.authorName);
        assert.equal('{}', message4_1.metadata);
        assert.equal(paidForSecondMessage, message4_1.value);


        // Edge case - weird input
        // Last transaction received more money. Should not impact how much is required for this on to pass through
        const paidForThirdMessage = price4;
        await ethernalBook.methods.writeMessage('', '', '', '', '').send({
            from: user3,
            value: paidForThirdMessage,
            gas: '1000000'
        });
        const messagesCount5 = await ethernalBook.methods.getMessagesCount().call();
        const price5 = BigNumber(await ethernalBook.methods.price().call());
        assert.equal('3', messagesCount5);
        assert.equal(price4.times(initNumerator / initDenominator).toString(), price5.toString());

        const message5 = await ethernalBook.methods.messages(2).call();
        assert.equal('', message5.msg);
        assert.equal('', message5.authorName);
        assert.equal('', message5.metadata);


        const rootBalanceAfter = BigNumber(await web3.eth.getBalance(contractOwner));
        const spentTotal = paidForFirstMessage.plus(paidForSecondMessage).plus(paidForThirdMessage);
        // console.log(`root balance change... ${rootBalanceBefore}wei -> ${rootBalanceAfter}wei`);
        // console.log(`root balance change... ${web3.utils.fromWei(rootBalanceBefore.toString(), 'ether')}eth -> ${web3.utils.fromWei(rootBalanceAfter.toString(), 'ether')}eth `);
        //
        // console.log(`Spent planned = ${spentTotal} wei = ${web3.utils.fromWei(spentTotal.toString(), 'ether')}eth`);
        // console.log(`Spent calculated: root balance diff... ${rootBalanceAfter.minus(rootBalanceBefore) }`);
        assert.equal(rootBalanceBefore.toString(), rootBalanceAfter.minus(spentTotal).toString());
    });

});