import React, {Component} from 'react';
import {Button, Grid} from 'semantic-ui-react';

class MessageControl extends Component {


    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Button left onClick={this.props.onCurrentClick}>Current</Button>
                        <Button right onClick={this.props.onNewerClick}>Newer</Button>
                        <Button left onClick={this.props.onOlderClick}>Older</Button>
                    </Grid.Column>
                </Grid.Row>

            </Grid>
        )
    }
}

export default MessageControl;