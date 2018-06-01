import React, {Component} from 'react'
import {Grid} from 'semantic-ui-react'
import EthernityBoard from "../blockchain/ethernityBoard";

class Info extends Component {

    constructor(props) {
        super();
        this.state = {
            displayPriceList: false
        };

        this.onSeeFuturePriceList = (event) => {
            this.setState({displayPriceList:!this.state.displayPriceList});
        };

        this.web3 = new EthernityBoard();
    }


    render() {
        return (
            <Grid>

                <Grid.Row>


                    <Grid.Column width={5}>
                        <h2><i className="icon quote left" style={{marginRight: 10}}/>What is this?</h2>
                        <p>This is <b>interface</b> to view and create <i>ethernalized messages</i> - messages engraved into blocks of <b>Ethereum blockchain</b>.
                        </p><p>On the homepage is displayed <b>the last</b> ethernalized message. All ethernalized messages are to be found in <b><a href="/history">Ethernal list</a></b> section.</p>
                        <p>Messages in blockchain are replicated across <b>thousands of servers</b> and <b>cannot be deleted</b>. I dare you to try!</p>
                    </Grid.Column>

                    <Grid.Column width={6}>
                        <h2><i className="icon signal" style={{marginRight: 10}}/>The 1.618 scarcity</h2>
                        <p>Having message <i>ethernalized</i> is scarce. The price is rising exponentially - every time new message is <i>ethernalized</i> by someone,
                            the <a href={this.web3.getContractLink()}><b>smart contract</b></a> storing <i>ethernalized messages</i> starts to
                            require <b><a href="https://www.google.com/search?q=golden+ratio">1.618 times</a></b> more
                            ether for ethernalizing next message.</p> <p><b>The first message has started at price of 0.00001 ether</b>. At
                        35th message, the smart contract won't let in anything under staggering <b>127 ether</b> per message.</p><p> How far are we gonna get?</p>
                    </Grid.Column>

                    <Grid.Column width={5}>
                        <h2><i className="ethereum icon" style={{marginRight: 10}}/>Become part of history</h2>
                        <p>Humans over centuries tried to eternalize themselves by leaving behind grandiose sculptures,
                            beautiful paintings, touching lireature. Things are easier with blockchain.
                        </p>
                        <p><b>Make your words eternal and famous</b>. The project is
                            designed to carry a pinch of controversy with it.
                            You can think of this as a modified text version of <a
                                href="http://milliondollarhomepage.com"><b>Million dollar homepage</b></a> on
                            Ethereum blockchain.</p>
                    </Grid.Column>

                </Grid.Row>
                <Grid.Row>

                    <Grid.Column width={5}>
                        <h2><i className="icon code left" style={{marginRight: 10}}/>Why was this created?</h2>
                        <p>To exchange of value between you and me - your words receive exposure as much as this project,
                            and I earn some ether and land myself blockchain job.
                            I wrote more about it in <b><a href="https://www.ethernalmessage.com/messages/0">the first ethernalized message</a></b>.</p>
                        <p>Have any job seekers ever used raw blockchain as platform to find a job? <b>I might be the first one.</b></p>
                    </Grid.Column>

                    <Grid.Column width={6}>
                        <h2><i className="icon lightbulb outline left" style={{marginRight: 10}}/>What should I write?</h2>
                        <p>Almost anything, here's some tips: message for your great-great-grandchildren, advertisement, self promotion,
                            wedding proposal, meaningful GPS location, diary, inspirational quote, confession, ... </p>
                        <p>I am sure you will come up with something cool!</p>
                    </Grid.Column>

                    <Grid.Column width={5}>
                        <h2><i className="icon bullhorn left" style={{marginRight: 10}}/>Can I write anything?</h2>
                        <p>Yes, anything you write will be stored in blockchain. However, in the scope of this website,
                            I grant myself right to censore offensive content or malicious links.
                        </p><p>You can always go ahead and run
                        your own modified instance of this website, if you want - here's <a href="https://github.com/Patrik-Stas/ethernal-message-website"><b>GitHub source</b></a> of this page.</p>
                    </Grid.Column>

                </Grid.Row>
            </Grid>
        )
    }
}

export default Info;
