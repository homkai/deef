/**
 * Created by DOCer on 2017/7/11.
 */
import React from 'react';
import partial from 'lodash/partial';
import '../style.less';
import {Spin, Row, Col, Card} from 'antd';
import {Cascader, Progress} from 'antd';
import {default as TableUI} from './Table.ui';
import {default as CalendarUI} from './Calendar.ui';
import {default as CollapseUI} from './Collapse.ui';
import {default as ProgressControllableUI} from './ProgressControllable.ui';

export default ({isLoading, tableData, cascaderData, collapseData, progressData, ...callbacks}) => {
    const {rowSelection, columns, data, loading} = tableData;
    const {options} = cascaderData;
    const {text} = collapseData;
    const {percent} = progressData;
    const {onChange, onStart, onPanelChange, onCascaderChange, onCollapseChange, onDecline, onIncrease} = callbacks;
    
    return (
        <main>
            <Spin
                size="large"
                tip="Loading..."
                spinning={isLoading}
            >
                <Row gutter={48} className="section">
                    <Col span={12}>
                        <Card
                            title='Table'
                            bordered={true}
                        >
                            <TableUI
                                rowSelection={rowSelection}
                                onChange={onChange}
                                columns={columns}
                                data={data}
                                loading={loading}
                                {...{
                                    onChange,
                                    onStart,
                                }}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            title='Calendar'
                            bordered={true}
                        >
                            <CalendarUI
                                onPanelChange={onPanelChange}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={48} className="section">
                    <Col span={12}>
                        <Card
                            title='Cascader'
                            bordered={true}
                        >
                            <div style={{textAlign: 'center'}}>
                                <Cascader
                                    options={options}
                                    onChange={value => onCascaderChange(value)}
                                    changeOnSelect
                                />
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            title='Collapse'
                            bordered={true}
                        >
                            <CollapseUI
                                text={text}
                                onCollapseChange={onCollapseChange}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={48} className="section">
                    <Col span={12}>
                        <Card
                            title='Progress'
                            bordered={true}
                        >
                            <div style={{textAlign: 'center'}}>
                                <Progress className="progressDemo" type="circle" percent={75} format={percent => `${percent} Days`} />
                                <Progress className="progressDemo" type="circle" percent={100} format={() => 'Done'} />
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            title='Progress Controllable'
                            bordered={true}
                        >
                            <ProgressControllableUI
                                percent={percent}
                                {...{
                                    onIncrease: onIncrease,
                                    onDecline: onDecline,
                                }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </main>
    );
};
