/**
 * Created by DOCer on 2017/7/11.
 */
import React from 'react';
import {Collapse} from 'antd';
const Panel = Collapse.Panel;

export default ({text, onCollapseChange}) => {
    return (
        <Collapse 
            onChange={key => onCollapseChange(key)}
        >
            <Panel header={'This is panel header 1'} key="1">
                  <Collapse defaultActiveKey="1">
                    <Panel header={'This is panel nest panel'} key="1">
                        <p>{text}</p>
                    </Panel>
                  </Collapse>
            </Panel>
            <Panel header={'This is panel header 2'} key="2">
                <p>{text}</p>
            </Panel>
            <Panel header={'This is panel header 3'} key="3">
                <p>{text}</p>
            </Panel>
          </Collapse>
    );
};