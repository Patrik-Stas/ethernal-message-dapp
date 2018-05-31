import {Button, Grid, Table} from 'semantic-ui-react';
import {Link} from 'react-router-dom'
import React, {Component} from 'react';
import EthernityBoard from '../blockchain/ethernityBoard'
import HistoryRow from "./HistoryRow";
import BasicRow from "./BasicRow";
import * as tools from "../tools";
import {BigNumber} from "bignumber.js";
import TopMenu from "./TopMenu";

class History extends Component {


    constructor() {
        super();
        this.state = {
            messages: [],
            messageCount: 0,
            currentPrice: '',
            numerator: 1,
            denominator: 1,
            startingPrice: 0,
        };
        this.ethernityBoard = new EthernityBoard();
        BigNumber.config({DECIMAL_PLACES: 0})
    }

    async componentDidMount() {
        const summary = await this.ethernityBoard.getSummary();
        this.setState({
            numerator: summary.numerator,
            denominator: summary.denominator,
            startingPriceWei: summary.startingPriceWei,
            messagesCount: parseInt(summary.messagesCount),
        });
        // console.log(`Component was mounted. Message count loaded is ${JSON.stringify(summary)}`);
        const currentPrice = await this.ethernityBoard.getCurrentPrice();
        this.setState({currentPrice: currentPrice});

    }

    getPriceOfNthMessage(n) {
        let price = BigNumber(this.state.startingPrice);
        for (let i = 0; i < n; i++) {
            price = price.times(this.state.numerator).dividedBy(this.state.denominator);
        }
        return price.toString();
    }

    renderFutureRows(n) {
        let rows = [];
        console.log(`Render future rows . Message count = ${this.state.messageCount}`);
        console.log(`typeof ${typeof(this.state.messageCount)}`);
        if (this.state)
            for (let i = parseInt(this.state.messagesCount) + n ; i > parseInt(this.state.messagesCount); i--) {
                rows.push(<BasicRow
                    number={i}
                    key={i}
                    value={this.weiToEthPriceLabel(this.getPriceOfNthMessage(i))}
                    author=""
                    msg=""
                    onCLick={() => {
                    }}
                />)
            }
        return rows;

    }

    renderHistoryRows() {
        let rows = [];
        for (let i = 0; i < this.state.messagesCount; i++) {
            if (i === (this.state.messagesCount-1)) {
                rows.push(<HistoryRow isCurrent={true} number={i} key={i}/>)
            }
            else {
                rows.push(<HistoryRow isCurrent={false} number={i} key={i}/>)
            }
        }
        rows.reverse();
        return rows;
    }

    weiToEthPriceLabel(weiString) {
        return `${tools.weiToReadableEthString(weiString)} ETH`;
    }


    renderAwaitingRow() { // TODO: Pass some parameters to tell the home page to render out input, highlight it.
        const engraveNowButton = (
            <Link to={`/?displayInput=true`}>
                <Button primary>Ethernalize your message here</Button>
            </Link>
        );
        return (
            <BasicRow
                number={this.state.messagesCount}
                value={this.weiToEthPriceLabel(this.state.currentPrice)}
                date=""
                author=""
                msg=""
                jsxInjection={engraveNowButton}
                onClick={() => {
                }}
            />
        )
    }

    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <TopMenu/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Table celled fixed singleLine>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell width={1}>ID</Table.HeaderCell>
                                    <Table.HeaderCell width={2}>Date</Table.HeaderCell>
                                    <Table.HeaderCell width={2}>Value</Table.HeaderCell>
                                    <Table.HeaderCell width={2}>Author</Table.HeaderCell>
                                    <Table.HeaderCell width={2}>Title</Table.HeaderCell>
                                    <Table.HeaderCell>Ethernal content</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.renderFutureRows(3)}
                                {this.renderAwaitingRow()}
                                {this.renderHistoryRows()}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    };
}

export default History;