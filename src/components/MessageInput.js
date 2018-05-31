import {Button, Divider, Form, Grid, Input, Message, Segment, Dimmer, Loader} from 'semantic-ui-react';
import React, {Component} from 'react';
import EthernityBoard from '../blockchain/ethernityBoard'
import {weiToReadableEthString} from "../tools";
import Countdown from 'react-countdown-now';
import moment from "moment";
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
            currentPrice: 0,
            loading: false,
            txSubmitted: false,
            txError: false,
            hasExpired: true

        };

        this.handleEthernalizeClicked = async (event) => {
            event.preventDefault();

            this.setState({txError: false});
            this.setState({txSubmitted: false});
            try {
                this.setState({loading: true});
                const gravingPrice = await this.ethernityBoard.getCurrentPrice();
                const currentAccount = await this.ethernityBoard.getCurrentAccount();

                await this.ethernityBoard.writeMessage(
                    this.state.userMessage,
                    this.state.title,
                    this.state.userName,
                    this.state.link,
                    gravingPrice,
                    currentAccount
                )

            } catch (err) {
                console.log(err.message);
                this.setState({txError: true});
            }
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
        const msToExpiry = 6000; // await this.ethernityBoard.getSecondsToExpiry() * 1000;
        const userBalance = await this.ethernityBoard.getCurrentAccountBalance();
        const isLoggedInMetamask = await this.ethernityBoard.isLoggedInMetamask();
        this.setState({isLoggedInMetamask});
        console.log(`user has ${userBalance}`);

        const hasExpired = 0 >= msToExpiry;
        if (hasExpired) {
            this.setState({hasExpired: true});
        }
        else {
            const expirationTime = BigNumber(moment().format('x')).plus(msToExpiry).toString();
            this.setState({hasExpired: false, expirationTime: parseInt(expirationTime)});
        }
        //     const countdownText = countdown(
        //         (BigNumber(moment().format('x'))).plus(5000).toString(),
        //         function (ts) {
        //             console.log(`ts = ${ts}`);
        //             // document.getElementById('pageTimer').innerHTML = ts.toHTML("strong");
        //             this.setState({expiryCountDown: ts.toString()});
        //         }.bind(this),
        //
        //         countdown.HOURS | countdown.MINUTES | countdown.SECONDS).toString();
        //     this.setState({countdownText: expiryCountDown});
        // }
        this.setState({userHasMetamask: this.ethernityBoard.doesUserHasMetamask()});
        this.setState({currentPrice: (await this.ethernityBoard.getCurrentPrice())});

    }


    render() {
        const hasMetamaskSetup = this.state.userHasMetamask && this.state.isLoggedInMetamask;
        const canBeEthernalized = hasMetamaskSetup && this.state.hasExpired;
        console.log(`Rerendering ${this.state.hasExpired}`);
        const contractLink = this.ethernityBoard.getEtherscanLink(this.ethernityBoard.contractAddress);
        const classes = "ui fluid icon";
        return (
            <Segment>
                <Dimmer active={this.state.loading} inverted>
                    <Loader/>
                </Dimmer>
                <h1 style={{textAlign: "center"}}>Message et<span style={{color: "#777777"}}>h</span>ernalization</h1>
                <Divider/>
                <Form error={this.state.txError}>
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
                                    this.state.userHasMetamask && this.state.userHasMetamask ? (
                                        <li><i className="green check icon"/>Metamask detected, looks good.</li>
                                    ) : (
                                        <li><i className="red exclamation triangle icon"/>Either you don't have Metamask installed, or you are not logged into your Metamask account.</li>
                                    )
                                }
                                <li><i className="grey info circle icon"/>Tip: Use <a href="https://ethgasstation.info/">https://ethgasstation.info</a> to adjust Gas price in Metamask. High gas price = quick ethernalization.</li>
                                <li><i className="grey info circle icon"/>Top: The more text you submit, the more gas you'll spend.</li>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Divider/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row id="inputPriceRow">
                            <Grid.Column width={5}>
                                <p><i className="blue ethereum icon"/>Price: {weiToReadableEthString(this.state.currentPrice, 10)} ETH</p>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                {hasMetamaskSetup &&
                                (
                                    !this.state.hasExpired ? (
                                        <span><i className="orange exclamation triangle icon"/>Time left:
                                        <Countdown date={this.state.expirationTime}
                                                   onComplete={this.onCountdownFinished}
                                                   daysInHours={true}/>
                                            <span className="infoText"><i className="info circle icon"/>Why?</span></span>
                                    ) : (
                                        <span><i className="green check icon"/>Ready to ethernalize<span className="infoText"><i className="info circle icon"/>Why?</span></span>
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

                    <Message error>
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