import React, {Component} from 'react'
import {Grid} from 'semantic-ui-react'
import * as tools from "../tools";
import EthernityBoard from "../blockchain/ethernityBoard";
import ordinal from 'ordinal';
import moment from "moment/moment";

class MessageDisplay extends Component {

    constructor(props) {
        super();
        this.web3 = new EthernityBoard();
    }

    render() {
        const contractLink = this.web3.getEtherscanLink(this.props.contractAddress);
        const senderLink = this.web3.getEtherscanLink(this.props.sourceAddress);

        const unixTime = parseInt(this.props.unixTime, 10) * 1000; // JS got unixtime with seconds
        const messageDate = moment(unixTime).format("HH:mm:ss, MMMM Do YYYY");
        // console.log(`About to render message from props ${util.inspect(this.props)}`);
        return (
            <div id="messageGrid">
                <Grid>
                    <Grid.Row className="messageCaptionRow">
                        <Grid.Column width={8}>
                            {this.props.header}
                        </Grid.Column>
                        <Grid.Column width={8}>
                            {messageDate}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Grid id="messageRow" style={this.props.messageStyle}>
                                <Grid.Column>
                                    <Grid>
                                        <Grid.Row id="messageTitle">
                                            <Grid.Column>
                                                {this.props.title}
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <div id="messageArea">
                                                    <p>{this.props.message}</p>
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row className="signatureArea">
                                            <Grid.Column width={6} style={{color: "gray"}}>
                                                <p>{tools.weiToReadableEthString(this.props.price)} ETH</p>
                                            </Grid.Column>

                                            <Grid.Column width={4}>
                                            </Grid.Column>

                                            <Grid.Column width={6} id="authorArea" style={{textAlign: "center"}}>
                                                <Grid>
                                                    <Grid.Row>
                                                        <Grid.Column>
                                                            <p>{this.props.author}</p>
                                                        </Grid.Column>
                                                    </Grid.Row>

                                                </Grid>
                                            </Grid.Column>
                                        </Grid.Row>

                                        <Grid.Row className="messageLinkArea">
                                            <Grid.Column style={{textAlign: "center"}}>
                                                <a href={this.props.link}>{this.props.link}</a>
                                            </Grid.Column>
                                        </Grid.Row>

                                    </Grid>
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="txInfoRow">
                        <Grid.Column width={11}>
                            <span>{ordinal(this.props.itemNumber)} message @EthernalMessage.com contract: <a
                                href={contractLink}>{this.props.contractAddress}</a> from <a
                                href={senderLink}>{this.props.sourceAddress}</a>
                            </span>
                        </Grid.Column>
                        {/*<Grid.Column width={5}>*/}
                        {/*<MessageControl/>*/}
                        {/*</Grid.Column>*/}
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

export default MessageDisplay;
