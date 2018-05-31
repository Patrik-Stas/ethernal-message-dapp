import React, {Component} from 'react';
import EthernityBoard from "../blockchain/ethernityBoard";

import BasicRow from "./BasicRow";
import * as tools from "../tools";
import moment from 'moment'

class HistoryRow extends Component {

    constructor(props) {
        super();
        this.ethernityBoard = new EthernityBoard();

        this.state = {
            message: ""
        };


        this.getReadableEthValue = () => {
            return `${tools.weiToReadableEthString(this.state.message.value)} ETH`;
        };
    }

    async componentDidMount() {
        const message = await this.ethernityBoard.getNthMessage(this.props.number);
        this.setState({message});
    }

    render() {
        const unixTime = parseInt(this.state.message['time'], 10) * 1000; // JS got unixtime with miliseconds
        const date = moment(unixTime);
        if (!!this.state.message) {
            return (
                    <BasicRow
                        isCurrent={this.props.isCurrent}
                        number={this.props.number}
                        value={this.getReadableEthValue()}
                        author={this.state.message.authorName}
                        date={date.format("MM-DD-YYYY")}
                        title={this.state.message.title}
                        msg={this.state.message.msg}
                    />
            )
        } else {
            return (
                <BasicRow
                    isCurrent={this.props.isCurrent}
                    number={this.props.number}
                    value='...'
                    author='...'
                    msg='... loading from blockchain ... '
                />
            )
        }
    }
}

export default HistoryRow;