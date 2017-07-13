/**
 * Created by DOCer on 2017/7/11.
 */
import React from 'react';
import partial from 'lodash/partial';
import {Table, Button} from 'antd';

export default ({loading, columns, data, rowSelection, ...callbacks}) => {
    const {onStart, onChange} = callbacks;
    rowSelection = {
        ...rowSelection,
        onChange: onChange
    };
    const selectedNum = rowSelection.selectedRowKeys.length;
    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    onClick={onStart}
                    disabled={!selectedNum}
                    loading={loading}
                >
                    Reload
                </Button>
                <span style={{ marginLeft: 8 }}>
                    {selectedNum ? `Selected ${selectedNum} items` : ''}
                </span>
            </div>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
            />
        </div>
    );
};