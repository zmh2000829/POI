import React, {Component} from 'react';
import {AutoSizer, Table, Column} from 'react-virtualized';

class ProductList extends Component {

    getColumnWidth = (totalWidth) => {
        const widths = [];
        const ratios = [1/7, 1/7, 120, 1/7, 1/7, 1/7, 1/7, 1/7];
        let curWidth = 0;
        ratios.forEach((ratio, index) => {
            if(ratio > 1) {
                curWidth += ratio;
                widths.push(ratio);
            } else if(index === (ratio.length - 1)) {
                widths.push(totalWidth - curWidth);
            } else {
                let width = Math.round(totalWidth * ratio);
                curWidth += width;
                widths.push(width);
            }
        });
        return widths;
    }

    noRowsRender = () => {
        return (
            <div className="no-data-tip">No data</div>
        );
    }

    render() {
        const {data = []} = this.props;
        return (
            <AutoSizer>
                {({width, height}) => {
                    const widths = this.getColumnWidth(width);
                    return (
                        <Table
                            className="product-list"
                            headerHeight={40}
                            width={width}
                            height={height}
                            rowHeight={40}
                            rowCount={data.length}
                            rowGetter={({index}) => data[index]}
                            noRowsRenderer={this.noRowsRender}
                        >
                            <Column
                                label="Name"
                                dataKey="Name"
                                width={widths[0]}
                            />
                            <Column
                                label="Strength"
                                dataKey="Strength"
                                width={widths[1]}
                            />
                            <Column
                                label="StartDate"
                                dataKey="StartDate"
                                width={widths[2]}
                            />
                            <Column
                                label="Company"
                                dataKey="Company"
                                width={widths[3]}
                            />
                            <Column
                                label="Source"
                                dataKey="Source"
                                width={widths[4]}
                            />
                            <Column
                                label="Route"
                                dataKey="Route"
                                width={widths[5]}
                            />
                            <Column
                                label="MarketStatus"
                                dataKey="MarketStatus"
                                width={widths[6]}
                            />
                            <Column
                                label="DosageForm"
                                dataKey="DosageForm"
                                width={widths[7]}
                            />
                        </Table>
                   );
                }}
            </AutoSizer>
        );
    }
}

export default ProductList;
