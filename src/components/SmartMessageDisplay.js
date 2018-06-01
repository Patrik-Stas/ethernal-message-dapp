import React, {Component} from 'react'
import EthernityBoard from "../blockchain/ethernityBoard";
import MessageDisplay from "./MessageDisplay";
import {assureLinkProtocol} from "../tools";
import ordinal from 'ordinal';

class SmartMessageDisplay extends Component {

    constructor(props) {
        super();
        this.web3 = new EthernityBoard();
        this.state = {
            displayedMessage: ' ... Loading. Make sure you have selected MainNet Network in your Metamask ...',
            displayedAuthor: '',
            displayedLink: 'https://ethernalmessage.com',
            displayedMessageStyle: {},
            displayedPrice: '42',
            currentPrice: '0',
            displayedItemIndex: props.displayedItemIndex,
            displayedSourceAddress: '1x337',
            lastMessageIndex: '0',
            displayedTitle: 'Title'
        };


        this.loadUpMessage = async () => {
            let message = {
                displayedItemIndex: '0',
                sourceAddr: '0x123',
                authorName: 'stub',
                msg: 'No messages found. But once there will be ethernalized message, the content will display ' +
                'somewhat like this text right here!',
                value: '0',
                title: 'The message title',
                time: '954813782',
                link: 'www.ethernalmessage.com'
            };
            try {
                this.setState({lastMessageIndex: (parseInt(await this.web3.getMessagesCount(), 10)) - 1});
                if (this.state.displayedItemIndex > this.state.lastMessageIndex) {
                    this.setState({displayedItemIndex: this.state.lastMessageIndex});
                }
                if (this.state.displayedItemIndex >= 0) {
                    message = await this.web3.getNthMessage(this.state.displayedItemIndex);
                }
            }
            catch (error) {
                console.error("Error loading message from blockchain");
            }
            this.setState({
                displayedItemIndex: message.itemNumber,
                displayedSourceAddress: message.sourceAddr,
                displayedMessage: message.msg,
                displayedAuthor: message.authorName,
                displayedMessageStyle: {},
                displayedPrice: message.value,
                displayedTime: message.time,
                displayedTitle: message.title,
                displayedLink: assureLinkProtocol(message.link)
            });
        };
    }

    async componentWillReceiveProps(props) {
        this.setState({displayedItemIndex: props.displayedItemIndex});
        this.loadUpMessage();
    }


    async componentDidMount() {
        this.loadUpMessage();
    }

    render() {
        const isLast = this.state.displayedItemIndex === this.state.lastMessageIndex;
        const messageHeader = (isLast) ?
            <span><b>The last</b> <i>ethernalized</i> message</span>
                : (
                <span>{ordinal(this.props.displayedItemIndex + 1)} <i>ethernal</i> message</span>
                );

        return (
            <MessageDisplay contractAddress={this.web3.contractAddress}
                            sourceAddress={this.state.displayedSourceAddress}
                            messageStyle={this.state.displayedMessageStyle}
                            message={this.state.displayedMessage}
                            title={this.state.displayedTitle}
                            price={this.state.displayedPrice}
                            author={this.state.displayedAuthor}
                            link={this.state.displayedLink}
                            unixTime={this.state.displayedTime}
                            itemNumber={this.state.displayedItemIndex + 1}
                            header={messageHeader}
            />
        )
    }
}

export default SmartMessageDisplay;
