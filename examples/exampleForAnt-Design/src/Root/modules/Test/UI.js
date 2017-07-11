/**
 * Created by DOCer on 2017/7/11.
 */
import './style.less';
import React from 'react';
import {Card, Row, Col, Button, Spin} from 'antd';
import {Calendar} from 'antd';
import {Table} from 'antd';
import {Cascader} from 'antd';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;
import {Progress} from 'antd';
const ButtonGroup = Button.Group;

export default ({isLoading, onIncrease, onDecline, percent}) => {
	//Calendar
	const onPanelChange = (value, mode) => {
	  console.log(value, mode);
	}

	//Table
	const columns = [{
	  title: 'Name',
	  dataIndex: 'name',
	}, {
	  title: 'Age',
	  dataIndex: 'age',
	}, {
	  title: 'Address',
	  dataIndex: 'address',
	}];

	const data = [];
	for (let i = 0; i < 32; i++) {
	  data.push({
	    key: i,
	    name: `Edward King ${i}`,
	    age: 32,
	    address: `London, Park Lane no. ${i}`,
	  });
	}
	const state = {
    selectedRowKeys: [3],  // Check here to configure the default column
    loading: false,
  };
  const start = () => {
    
  }
  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    
  }
	const { loading, selectedRowKeys } = state;
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  //Cascader
	const options = [{
	  value: 'zhejiang',
	  label: 'Zhejiang',
	  children: [{
	    value: 'hangzhou',
	    label: 'Hanzhou',
	    children: [{
	      value: 'xihu',
	      label: 'West Lake',
	    }],
	  }],
	}, {
	  value: 'jiangsu',
	  label: 'Jiangsu',
	  children: [{
	    value: 'nanjing',
	    label: 'Nanjing',
	    children: [{
	      value: 'zhonghuamen',
	      label: 'Zhong Hua Men',
	    }],
	  }],
	}];

	//Collapse
	const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
	`;
	return (
		<main>
			<Spin size="large" tip="Loading..." spinning={isLoading}>
				<Row gutter={48} className="section">
			    <Col span={12}>
				  	<Card 
					  	title="Table" 
					  	bordered={true} 
				  	>
			        <div style={{ marginBottom: 16 }}>
			          <Button
			            type="primary"
			          >
			            Reload
			          </Button>
			        </div>
				      <Table 
					      rowSelection={rowSelection} 
					      columns={columns} 
					      dataSource={data} 
				      />
				  	</Card>
					</Col>
			    <Col span={12}>
				  	<Card 
					  	title="Calendar" 
					  	bordered={true}
				  	>
				    	<div style={{margin: "auto", width: 290, border: '1px solid #d9d9d9', borderRadius: 4}}>
						    <Calendar 
							    fullscreen={false} 
							    onPanelChange={onPanelChange} 
						    />
							</div>
				  	</Card>
			    </Col>
			  </Row>
			  <Row gutter={48} className="section">
					<Col span={12}>
						<Card 
							title="Cascader" 
							bordered={true} 
							style={{margin: "auto"}}
						>
							<Cascader 
								options={options} 
								onChange={(v) =>{console.log(v)}} 
								changeOnSelect 
							/>
						</Card>
					</Col>
					<Col span={12}>
						<Card 
							title="Collapse" 
							bordered={true} 
							style={{margin: "auto"}}
						>
							<Collapse onChange={(key) => {console.log(key)}}>
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
						</Card>
					</Col>
			  </Row>
			  <Row gutter={48} className="section">
					<Col span={12}>
						<Card 
							title="Progress" 
							bordered={true} 
							style={{"textAlign": "center"}}
						>
							<div>
						    <Progress type="circle" percent={75} format={percent => `${percent} Days`} />
						    <Progress type="circle" percent={100} format={() => 'Done'} />
						  </div>
						</Card>
					</Col>
					<Col span={12}>
						<Card 
							title="Progress controllable" 
							bordered={true} 
							style={{"textAlign": "center"}}
						>
							<div style={{margin: "auto"}}>
				        <Progress type="circle" percent={percent} />
				        <ButtonGroup className="incDec">
				          <Button onClick={onDecline} icon="minus" />
				          <Button onClick={onIncrease} icon="plus" />
				        </ButtonGroup>
				      </div>
						</Card>
					</Col>
			  </Row>
			</Spin>
		</main>
	)
}