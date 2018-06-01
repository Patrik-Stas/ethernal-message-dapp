import {Button, Divider, Form, Grid, Input, Message, Segment, Dimmer, Loader} from 'semantic-ui-react';
import React, {Component} from 'react';
import EthernityBoard from '../blockchain/ethernityBoard'
import {weiToReadableEthString} from "../tools";
import Countdown from 'react-countdown-now';
import moment from "moment";
import ReactTooltip from 'react-tooltip'
import {BigNumber} from "bignumber.js";


class MessageInput extends Component {


    constructor(props) {
        super(props);
        this.ethernityBoard = new EthernityBoard();
        this.state = {
            userMessage: '',
            userName: '',
            title: '',
            link: '',
            userHasMetamask: false,
            currentPrice: '0',
            loading: false,
            txSubmitted: false,
            txError: false,
            hasExpired: true

        };

        this.handleEthernalizeClicked = async (event) => {
            event.preventDefault();
            console.log("ethernalization startin");

            this.setState({txError: false});
            this.setState({txSubmitted: false});
            try {
                console.log("ethernalization startin2");
                this.setState({loading: true});
                await this.ethernityBoard.writeMessage(
                    this.state.userMessage,
                    this.state.title,
                    this.state.userName,
                    this.state.link,
                    this.state.currentPrice,
                    this.state.currentAccount
                );

                console.log("After await");
                this.setState({loading: false});

            } catch (err) {
                this.setState({loading: false});
                console.log("Error sending transaction.");
                console.log(err.message);
                this.setState({txError: true});
            }
            console.log("Setting .Loading. to false");
            this.setState({loading: false});
            if (!this.state.txError) {
                this.setState({txSubmitted: true});
            }
        };

        this.handlePreviewClicked = (e) => {
            this.props.onCustomPreview(this.state.userMessage, this.state.title, this.state.userName, this.state.link);
        };

        this.onCountdownFinished = async () => {
            this.setState({hasExpired: true});
        }
    }


    async componentDidMount() {
        const msToExpiry = await this.ethernityBoard.getSecondsToExpiry() * 1000;
        const isLoggedInMetamask = await this.ethernityBoard.isLoggedInMetamask();
        if (isLoggedInMetamask) {
            this.setState({currentAccount: await(this.ethernityBoard.getCurrentAccount())});
        }
        this.setState({isLoggedInMetamask});

        const hasExpired = 0 >= msToExpiry;
        if (hasExpired) {
            this.setState({hasExpired: true});
        }
        else {
            const expirationTime = BigNumber(moment().format('x')).plus(msToExpiry).toString();
            this.setState({hasExpired: false, expirationTime: parseInt(expirationTime)});
        }
        this.setState({userHasMetamask: this.ethernityBoard.doesUserHasMetamask()});
        this.setState({currentPrice: (await this.ethernityBoard.getCurrentPrice())});

    }


    render() {
        const hasMetamaskSetup = this.state.userHasMetamask && this.state.isLoggedInMetamask;
        const canBeEthernalized = hasMetamaskSetup && this.state.hasExpired;
        const classes = "ui fluid icon";
        return (
            <Segment>
                <Dimmer active={this.state.loading} inverted>
                    <Loader>
                        Please wait
                    </Loader>
                </Dimmer>
                <h1 style={{textAlign: "center"}}>Message et<span style={{color: "#777777"}}>h</span>ernalization</h1>
                <Divider/>
                <Form>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <div className="field">
                                    <label>Title</label>
                                    <Input
                                        className={classes}
                                        value={this.state.title}
                                        onChange={event => this.setState({title: event.target.value})}
                                        placeholder="(optional)"
                                    />
                                </div>
                            </Grid.Column>

                            <Grid.Column width={5}>

                                <div className="field">
                                    <label>Author</label>
                                    <Input
                                        className={classes}
                                        value={this.state.userName}
                                        onChange={event => this.setState({userName: event.target.value})}
                                        placeholder="(optional)"
                                    />
                                </div>
                            </Grid.Column>

                            <Grid.Column width={5}>
                                <div className="field">
                                    <label>Website link</label>
                                    <Input
                                        className={classes}
                                        value={this.state.link}
                                        onChange={event => this.setState({link: event.target.value})}
                                        placeholder="Website link (optional)"
                                    />
                                </div>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column width={16}>
                                <div className="field">
                                    <label>The message</label>
                                    <Input
                                        className={classes}
                                        value={this.state.userMessage}
                                        onChange={event => this.setState({userMessage: event.target.value})}
                                        placeholder="Your ethernal message."
                                    />
                                </div>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                {
                                    hasMetamaskSetup ? (
                                        <p><i className="green check icon"/>Metamask detected, looks good.</p>
                                    ) : (
                                        <p><i className="red exclamation triangle icon"/><b>Either you don't have Metamask
                                            installed, or you are not logged into your Metamask account.</b></p>
                                    )
                                }
                                <p><i className="grey info circle icon"/>Tip: Use <a
                                    href="https://ethgasstation.info/">https://ethgasstation.info</a> to adjust Gas
                                    price in Metamask. High gas price = quick ethernalization.</p>
                                <p><i className="grey info circle icon"/>Top: The more text you submit, the more gas
                                    you'll spend.</p>

                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Divider/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row id="inputPriceRow">
                            <Grid.Column width={5}>
                                <p><i
                                    className="blue ethereum icon"/>Price: {weiToReadableEthString(this.state.currentPrice, 10)} ETH
                                </p>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                {hasMetamaskSetup &&
                                (
                                    !this.state.hasExpired ? (
                                        <span><i className="orange exclamation triangle icon"/>Time left:
                                            <Countdown date={this.state.expirationTime}
                                                       onComplete={this.onCountdownFinished}
                                                       daysInHours={true}/>
                                            <ReactTooltip/>
                                            <p data-tip="After a message is ethernalized, the smart contract accepts new requests only after 6 hours pass. You need to wait a bit."
                                               className="infoText"><i className="info circle icon"/>What does it mean?</p>
                                        </span>
                                    ) : (
                                        <span><i className="green check icon"/>Ready to ethernalize

                                            <ReactTooltip/>
                                            <p data-tip="After a message is ethernalized, the smart contract accepts new requests only after 6 hours pass. The smart contract is now ready."
                                               className="infoText"><i className="info circle icon"/>What does it mean?</p>
                                        </span>
                                    )
                                )
                                }
                            </Grid.Column>

                            <Grid.Column width={6}>
                                <Button primary style={{float: "right"}}
                                        className={!canBeEthernalized ? ("disabled") : ""}
                                        onClick={this.handleEthernalizeClicked}>Ethernalize</Button>
                                <Button style={{float: "right"}} onClick={this.handlePreviewClicked}>Quick
                                    Preview</Button>
                            </Grid.Column>
                        </Grid.Row>

                    </Grid>

                    {!!(this.state.txError) &&
                    <Message>
                        <ul>
                            <li>Transaction failed. Possible reasons are:</li>
                            <ul>
                                <li>you are not logged in Metamask,</li>
                                <li>you selected in Metamask network other than Main Ethereum Network,</li>
                                <li>the account you have selected in Metamask has insufficient balance,</li>
                                <li>you rejected transaction.</li>
                            </ul>
                        </ul>
                    </Message>
                    }
                    {!!(this.state.txSubmitted) &&
                        <Message className="green">
                            <ul>
                                <li>Keep in mind that:</li>
                                <ul>
                                    <li>it might take several minutes for your message to appear here,</li>
                                    <li>in case some else's transaction would be confirmed before yours, your Ether will be
                                        returned back to you.
                                    </li>
                                </ul>
                            </ul>
                        </Message>
                    }
                </Form>
            </Segment>
        )
    }

}

export default MessageInput;