import React, {Component} from 'react'

class Header extends Component {

    render() {
        const headerInfo = (process.env.network_name !== 'mainnet')
            ? `This is running against non-mainnet network ${process.env.network_name}`
            : "";
        return (
            <div>
                <link rel="stylesheet"
                      href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css">
                </link>
                <div id="header-warning">
                    <span>{headerInfo}</span>
                </div>
                <div id="header">

                    <h1 style={{marginBottom:0}}>Ethernal message</h1>
                    <h3 style={{margin:5}}>Put your words on blockchain and make them eternal</h3>
                </div>
            </div>
        )
    }
}

export default Header;
