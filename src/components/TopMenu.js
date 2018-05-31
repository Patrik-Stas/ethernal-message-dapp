import React, {Component} from 'react';
import {Button, Grid} from 'semantic-ui-react';
import MessageInput from './MessageInput';
import Navigation from './Navigation'
import queryString from "query-string";
import {withRouter} from 'react-router-dom'

class TopMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPrice: 0,
            nextPrice: 0,
            displayInput: false
        };


        this.onEthernalizeClick = async () => {
            this.setState({displayInput: !this.state.displayInput});
        };
    }

    async componentDidMount() {
        this.setState({displayInput: (queryString.parse(this.props.location.search).displayInput === 'true')});
    }


    render() {
        return (
            <Grid style={{marginTop: 10}} id="statusBar">
                <Grid.Row>
                    <Grid.Column width={8}>
                        {!(this.props.location.pathname === "/history") &&
                        <Button primary style={{float: "left"}} onClick={this.onEthernalizeClick}>
                            {!this.state.displayInput ? (
                                <span>Start writing</span>
                            ) : (
                                <span>Close</span>
                            )}
                        </Button>
                        }
                    </Grid.Column>

                    <Grid.Column width={8}>
                        <Navigation/>
                    </Grid.Column>

                </Grid.Row>
                {this.state.displayInput &&
                <Grid.Row>
                    <Grid.Column>
                        <MessageInput onCustomPreview={this.props.onCustomPreview}/>
                    </Grid.Column>
                </Grid.Row>
                }
            </Grid>

        )
    }

}

export default withRouter(TopMenu);