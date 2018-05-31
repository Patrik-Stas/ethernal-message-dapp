import React, {Component} from 'react';
import {Table} from 'semantic-ui-react';
import {Link} from 'react-router-dom'

class BasicRow extends Component {
// <Link to={`/messages/${this.props.number}`}>{this.props.msg}</Link>
    render() {
        const {Row, Cell} = Table;
        return (
            <Row className={this.props.isCurrent ? ("messageTableRow historyTableCurrentMessage") : `messageTableRow `}>
                <Cell>{this.props.number}</Cell>
                <Cell>{this.props.date}</Cell>
                <Cell>{this.props.value}</Cell>
                <Cell>{this.props.author}</Cell>
                <Cell>{this.props.title}</Cell>

                <Cell>
                    {(!!this.props.jsxInjection) ? (
                        this.props.jsxInjection
                    ) : (
                        <Link to={`/messages/${this.props.number}`}>{this.props.msg}</Link>
                    )}
                </Cell>

            </Row>
        )
    }
}

export default BasicRow;