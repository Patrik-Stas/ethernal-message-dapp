import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Button} from 'semantic-ui-react'
class Navigation extends Component {

    render() {
        console.log(`Navigation component detects pathname: ${this.props.location.pathname}`);
        const selectedItem = "item active";
        const item = "item";
        const topMessage = (this.props.location.pathname === "/") ? selectedItem : item;
        const history = (this.props.location.pathname === "/history") ? selectedItem : item;

        return (
            <div style={{float: "right"}}>
                <Link className={topMessage} to="/top"><span className="navigationItem" style={{marginRight: 30}}>Last message</span></Link>
                <Link className={history} to="/history"><span className="navigationItem">Ethernal list</span></Link>
            </div>
        )
    }
}

export default withRouter(Navigation);
