/**
 * Created by DOCer on 2017/7/11.
 */
import React from 'react';
import {Calendar} from 'antd';

export default ({onPanelChange}) => {
    return (
        <div 
            style={{margin: 'auto', width: 290, border: '1px solid #d9d9d9', borderRadius: 4}}
        >
            <Calendar
                fullscreen={false}
                onPanelChange={(value, mode) => onPanelChange(value, mode)}
            />
        </div>
    );
};