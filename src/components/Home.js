import React, {Component} from 'react';
import {Divider, Grid} from 'semantic-ui-react';
import EthernityBoard from '../blockchain/ethernityBoard'
import TopMenu from "./TopMenu";
import Info from "./Info";
import PriceGraph from './PriceGraph'
import SmartMessageDisplay from "./SmartMessageDisplay";
import MessageDisplay from "./MessageDisplay";
import {assureLinkProtocol} from "../tools";
import moment from "moment/moment";

class Home extends Component {

    constructor() {
        super();
        this.ethernityBoard = new EthernityBoard();
        this.state = {
            currentPrice: '0',
            displayedItemNumber: '0',
            displayBlockchainMessage: true
        };


        this.displayBlockchainMessage = () => {
           this.setState({displayBlockchainMessage:true});
        };

        this.onCustomPreview = async (message, title, author, link) => {
            this.setState({
                displayBlockchainMessage: false,
                previewMessage: message,
                previewAuthor: author,
                previewPrice: this.state.currentPrice,
                previewLink: assureLinkProtocol(link),
                previewStyle: {color: "gray"},
                previewHeader: "Message preview",
                previewTitle: title
            });
            setTimeout(this.displayBlockchainMessage, 4000);
        };
    }

    async componentDidMount() {
        const currentPrice = await this.ethernityBoard.getCurrentPrice();
        const messagesCount = await this.ethernityBoard.getMessagesCount();
        const priceList25 = await this.ethernityBoard.getPriceListInEth(25);
        this.setState({messagesCount});
        this.setState({currentPrice});
        this.setState({priceList25});
    }

    calculateItemNumber() {
        if (this.props.location.pathname === "/" || this.props.location.pathname === "/top") {
            return 9999999;
        }
        else {
            return parseInt(this.props.match.params.id, 10);
        }
    }

// msg, value, sourceAddr, authorName, time, blockNumber, metadata
    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <TopMenu onCustomPreview={this.onCustomPreview}/>
                    </Grid.Column>
                </Grid.Row>

                <Divider style={{margin: 10}}/>

                <Grid.Row>
                    <Grid.Column>
                        { this.state.displayBlockchainMessage ?
                            (
                                <SmartMessageDisplay
                                    displayedItemIndex={this.calculateItemNumber()}
                                />
                            ) : (
                                <MessageDisplay
                                    contractAddress=""
                                    sourceAddress=""
                                    messageStyle={this.state.previewStyle}
                                    message={this.state.previewMessage}
                                    price={this.state.previewPrice}
                                    author={this.state.previewAuthor}
                                    link={this.state.previewLink}
                                    header={this.state.previewHeader}
                                    title={this.state.previewTitle}
                                    itemNumber={0}
                                    isLast={true}
                                    unixTime={moment().format('X')}
                                />
                            )

                        }

                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                        {/*<span>{JSON.stringify(this.props)}</span>*/}
                        <Divider style={{margin: 40}}/>
                    </Grid.Column>
                </Grid.Row>

                <Info/>

                <Grid.Row>
                    <Grid.Column>
                        <Divider style={{margin: 10}}/>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column style={{alignText: "center"}}>
                        <h1>FOMO price chart</h1>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {
                            (!!this.state.priceList25) &&
                            <PriceGraph
                                priceList={this.state.priceList25}
                                lastItemIndex={this.state.messagesCount - 1}
                            />
                        }
                    </Grid.Column>
                </Grid.Row>

            </Grid>
        );
    }
}

export default Home;
