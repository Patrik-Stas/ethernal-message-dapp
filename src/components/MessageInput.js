import {Button, Divider, Form, Grid, Input, Message, Segment, Dimmer, Loader} from 'semantic-ui-react';
import React, {Component} from 'react';
import util from 'util';
import EthernityBoard from '../blockchain/ethernityBoard'
import {weiToReadableEthString} from "../tools";
import {Link} from 'react-router-dom'
// import countdown from 'countdown';
// import countdown from 'moment-countdown';
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
        const canBeEthernalized = this.state.userHasMetamask && this.state.hasExpired && this.state.isLoggedInMetamask;
        console.log(`Rerendering ${this.state.hasExpired}`);
        const contractLink = this.ethernityBoard.getEtherscanLink(this.ethernityBoard.contractAddress);
        const classes = "ui fluid icon";
        return (
            <Segment>
                <Dimmer active={this.state.loading} inverted>
                    <Loader/>
                </Dimmer>
                <h2 style={{textAlign: "center"}}>Message et<span style={{color: "#777777"}}>h</span>ernalization</h2>
                <Form error={this.state.txError}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <ul>
                                    <li>In order to ethernalize message:</li>
                                    <ul>
                                        <li>you need to have <b>installed Metamask</b> extension
                                            {this.state.userHasMetamask ? (
                                                <span> (<i className="check green icon"/> Metamask detected)</span>
                                            ) : (
                                                <span> (<i className="exclamation triangle red icon"></i> Metamask not detected in your browser. Get it here <a
                                                    href="https://metamask.io/">Metamask</a>),</span>
                                            )}
                                        </li>
                                        <li>in your Metamask, MainNet Network have to be selected.</li>
                                        <li>your active Metamask account needs to have enough <b>ether to cover the
                                            price</b>.
                                        </li>
                                    </ul>
                                    <br/>
                                    <li>Before you submit transaction:</li>
                                    <ul>
                                        <li>Use <b>Preview button</b> to check how it will appear. There's no refunds or
                                            edits. Ethernal message is eternal.
                                        </li>
                                        <li>verify that the <b>website link works</b> correctly, if you are including it
                                            in your message
                                        </li>
                                    </ul>
                                    <br/>
                                    <li>Note that:</li>
                                    <ul>
                                        <li>Everything you type in will be stored in blockchain unchanged, however, <b>offensive
                                            content</b> will censored on the website. Hyperlinks
                                            to <b>malicious websites</b> will be deactivated.
                                        </li>
                                        <li>I recommend using <b><a
                                            href="https://ethgasstation.info/">https://ethgasstation.info</a> to decide</b> for
                                            what gas price you should aim for. If you use
                                            low gas price, your transaction will take longer time to process and might
                                            fail if someone else sends message with higher gas price
                                            in the meantime. <b>If your transaction fails, you'll get your ether
                                                back.</b>
                                        </li>
                                        <li>Take in consideration that <b>the more text you submit, the more gas it will
                                            cost</b>. The biggest message I succeeded sending on TestNet was about
                                            100kb.
                                        </li>
                                    </ul>
                                    <br/>
                                    <li>After you ethernalize message:</li>
                                    <ul>
                                        <li>it can take up to <b>few minutes</b> until your message appears (the
                                            transaction must be confirmed by Ethereum network),
                                        </li>
                                        <li>the message will be <b>stored in <a href={contractLink}>smart
                                            contract</a></b> on Ethereum blockchain,
                                        </li>
                                        <li>the message will be <b>displayed below</b> as the latest message - until
                                            someone else ethernalizes another message,
                                        </li>
                                        <li>the message will be displayed in <b><Link
                                            to="/history">History</Link></b> section.
                                        </li>
                                    </ul>
                                </ul>
                            </Grid.Column>
                        </Grid.Row>
                        <Divider/>

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
                            <Grid.Column width={8}>
                                <h2>Price: {weiToReadableEthString(this.state.currentPrice, 10)} ETH</h2>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Button primary style={{float: "right"}}
                                        className={!canBeEthernalized ? ("disabled") : ""}
                                        onClick={this.handleEthernalizeClicked}>Ethernalize</Button>
                                <Button style={{float: "right"}} onClick={this.handlePreviewClicked}>Preview</Button>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column width={8}>
                                {
                                    this.state.userHasMetamask ? (
                                        <span><i class="check icon"></i>Metamask detected</span>
                                    ) : (
                                        <span><i class="exclamation triangle icon"></i>Metamask not detected. Please install Metamask plugin.</span>
                                    )
                                }
                            </Grid.Column>
                        </Grid.Row>

                        {!!this.state.userHasMetamask && (
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    {
                                        !!this.state.isLoggedInMetamask ? (
                                            <span><i class="check icon"></i>Logged in Metamask</span>
                                        ) : (
                                            <span><i class="exclamation triangle icon"></i>Not logged into Metamask account. Please, log in.</span>
                                        )
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        )}

                        <Grid.Row>
                            <Grid.Column width={8}>
                                {
                                    !this.state.hasExpired ? (
                                        <span><i class="exclamation triangle  icon"></i>Next message can be ethernalized after
                                        <Countdown date={this.state.expirationTime}
                                                   onComplete={this.onCountdownFinished}/>
                                            </span>
                                    ) : (
                                        <span><i class="check icon"></i>Ready to ethernalize new message!</span>
                                    )
                                }
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