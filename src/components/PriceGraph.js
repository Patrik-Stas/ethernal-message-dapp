import React, {Component} from 'react';
import {Grid} from 'semantic-ui-react';
import {Bar} from 'react-chartjs-2';

class PriceGraph extends Component {


    constructor(props) {
        super();
        this.state = {
            priceList: props.priceList,
            lastItemIndex: props.lastItemIndex
        }
    }

    render() {
        const labels = [];
        for (var i = 1; i <= this.state.priceList.length; i++) {
            // labels.push(ordinal(i));
            labels.push(i);
        }
        labels[this.props.lastItemIndex] = "We are here";
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <i>* Note the price directly correlates with amount of regret not ethernalizing message while it was cheap.</i>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>

                        <Bar data={{
                            // labels: [1,  2,  3,  4,  5,  "we are here",  7,  8,  9,  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
                            labels,
                            datasets: [{
                                label: 'Price for n-th message accepted by the Ethernal Message Book smart contract',
                                backgroundColor: "#3e95cd",
                                // backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                                data: this.state.priceList,
                                // data: [0.000010, 0.000016, 0.000026, 0.000042, 0.000069, 0.000111, 0.000179, 0.000290, 0.000470, 0.000760, 0.001230, 0.001990, 0.003219, 0.005209, 0.008428, 0.013636, 0.022063, 0.035697, 0.057758, 0.093453, 0.151206, 0.244652, 0.395847, 0.640480, 1.036297],
                                borderWidth: 1
                            }],
                        }}
                             options={{
                                 scales: {
                                     yAxes: [{
                                         ticks: {
                                             // Include a dollar sign in the ticks
                                             callback: function (value, index, values) {
                                                 return `${value}ETH`;
                                             }
                                         }
                                     }]
                                 }
                             }}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default PriceGraph;