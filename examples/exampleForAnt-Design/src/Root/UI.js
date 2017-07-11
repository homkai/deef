/**
 * Created by DOCer 17/7/11.
 */
import React from 'react';
import {history} from 'app';
import PropTypes from 'prop-types';
import Todo from './modules/Todo';
import Test from './modules/Test';
import partial from 'lodash/partial';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const moduleMap = {Todo, Test};

const UI = ({module, onGoModule}) => {
    const Module = moduleMap[module];
    const handelGoModule = (...navInfo) =>{
      const [, key, keyPath] = navInfo;
      const path = keyPath[1] ? `${keyPath[1]}/${keyPath[0]}` : `Home/${keyPath[0]}`;
      //改用replace防止push相同时报错
      history.replace(`/${path}`);
      partial(onGoModule, key)()
    }
    return <Layout>
    <Header className="header">
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[module]}
        style={{ lineHeight: '64px' }}
        onClick={({item, key, keyPath}) => handelGoModule(item, key, keyPath)}
      >
        <Menu.Item key="Test">Test</Menu.Item>
        <Menu.Item key="nav2">nav 2</Menu.Item>
        <Menu.Item key="nav3">nav 3</Menu.Item>
      </Menu>
    </Header>
    <Layout>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
          onClick={({item, key, keyPath}) => handelGoModule(item, key, keyPath)}
        >
          <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
            <Menu.Item key="Todo">Todo</Menu.Item>
            <Menu.Item key="option2">option2</Menu.Item>
            <Menu.Item key="option3">option3</Menu.Item>
            <Menu.Item key="option4">option4</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
            <Menu.Item key="option5">option5</Menu.Item>
            <Menu.Item key="option6">option6</Menu.Item>
            <Menu.Item key="option7">option7</Menu.Item>
            <Menu.Item key="option8">option8</Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
            <Menu.Item key="option9">option9</Menu.Item>
            <Menu.Item key="option10">option10</Menu.Item>
            <Menu.Item key="option11">option11</Menu.Item>
            <Menu.Item key="option12">option12</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>{module}</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          {Module ? <Module /> : `${module}`}
        </Content>
      </Layout>
    </Layout>
  </Layout>
};
UI.propTypes = {
  onGoModule: PropTypes.func.isRequired,
  module: PropTypes.string.isRequired,
};
export default UI;