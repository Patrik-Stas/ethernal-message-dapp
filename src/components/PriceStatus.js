import React, {Component} from 'react';
import * as tools from "../tools";

import {Grid} from 'semantic-ui-react';
import EthernityBoard from "../blockchain/ethernityBoard";

class PriceStatus extends Component {

    constructor(props) {
        super(props);
        this.web3 = new EthernityBoard();
        this.state = {
            currentPrice: 0,
            nextPrice: 0,
        };
    }

    onCustomPreview = async (message, author) => {
        console.log(`${message} + ${author}`);
    };

    async componentDidMount() {
        this.loadCurrentPrice();
        this.loadNextPrice();
    }

    loadCurrentPrice = async () => {
        const currentPrice = await this.web3.getCurrentPrice();
        this.setState({currentPrice});
        return currentPrice;
    };

    loadNextPrice = async () => {
        const messageCount = await this.web3.getMessagesCount();
        const nextPrice = await this.web3.getPriceOfNthMessage(messageCount + 1);
        this.setState({nextPrice});
        return nextPrice;
    };

    render() {
        return (
            <Grid>
                <Grid.Column width={8}>
                    {!!this.state.currentPrice ? (
                        <span>Current price: <b> {tools.weiToReadableEthString(this.state.currentPrice)} ETH</b></span>
                    ) : (
                        <span>Current price:</span>
                    )}
                </Grid.Column>
                <Grid.Column width={8}>
                    {!!this.state.nextPrice ? (
                        <span>Next price: <b>{tools.weiToReadableEthString(this.state.nextPrice)} ETH</b></span>
                    ) : (
                        <span>Next price:</span>
                    )}
                </Grid.Column>

            </Grid>
        )
    }
}

export default PriceStatus;
