import React, {Component} from 'react';
import {Grid} from 'semantic-ui-react';

class Footer extends Component {

    render() {
        return (
            <div className="footer">
                <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <span>Ethernal Message ©2018 Patrik Staš. I am not responsible for the content loaded from the blockchain.</span>
                    </Grid.Column>
                </Grid.Row>
                </Grid>
            </div>
        )
    }
}

export default Footer;
