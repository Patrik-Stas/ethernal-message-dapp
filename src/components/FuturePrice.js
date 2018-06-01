import React, {Component} from 'react';
import {Grid, Table} from 'semantic-ui-react';

class FuturePrice extends Component {

    renderPrices() {

        const prices = [0.000010, 0.000016, 0.000026, 0.000042, 0.000069, 0.000111, 0.000179, 0.000290,
            0.000470, 0.000760, 0.001230, 0.001990, 0.003219, 0.005209, 0.008428, 0.013636, 0.022063, 0.035697,
            0.057758, 0.093453, 0.151206, 0.244652, 0.395847, 0.640480, 1.036297, 1.676729, 2.712948, 4.389550,
            7.102291, 11.491507, 18.593259, 30.083893, 48.675739, 78.757346, 127.429385, 206.180745, 333.600446,
            539.765521, 873.340613, 1413.065111];

        let rows = [];
        prices.forEach((val, idx) => {
            rows.push(
                <Table.Row>
                    <Table.Cell>{idx}</Table.Cell>
                    <Table.Cell>{val} ETH</Table.Cell>
                </Table.Row>
            )
        });
        return rows;

    }

    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <h2><i className="icon signal" style={{marginRight: 10}}/>Message pricetags</h2>

                        <Table celled fixed singleLine>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell width={1}>Message number</Table.HeaderCell>
                                    <Table.HeaderCell width={2}>Price</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                { this.renderPrices() }
                            </Table.Body>
                        </Table>
                    </Grid.Column>

                </Grid.Row>
            </Grid>
        )
    }
}

export default FuturePrice;