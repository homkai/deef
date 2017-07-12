/**
 * Created by DOCer on 2017/7/11.
 */
import React from 'react';
import {Progress, Button} from 'antd';
const ButtonGroup = Button.Group;

export default ({percent, ...callbacks}) => {
    const {onIncrease, onDecline} = callbacks;

    return (
        <div style={{textAlign: 'center'}}>
            <Progress type="circle" percent={percent} />
            <ButtonGroup className="incDec">
                <Button onClick={onDecline} icon="minus" />
                <Button onClick={onIncrease} icon="plus" />
            </ButtonGroup>
        </div>
    );
};