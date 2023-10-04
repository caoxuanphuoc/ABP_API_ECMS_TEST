import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table } from 'antd';
import RoomStore from '../../stores/roomStore';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import CreateOrUpdateRoom from './components/createOrUpdateRoom';

export interface IRoomProps {
  roomStore: RoomStore;
}

export interface IRoomState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  roomId: number;
  filter: string;
}

const { confirm } = Modal;
const { Search } = Input;

@inject(Stores.RoomStore)
@observer
class Room extends AppComponentBase<IRoomProps, IRoomState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    roomId: 0,
    filter: '',
  };

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    await this.props.roomStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      keyword: this.state.filter,
    });
  }

  handleTableChange = (pagination: any) => {
    this.setState(
      {
        skipCount: (pagination.current - 1) * this.state.maxResultCount,
      },
      async () => await this.getAll()
    );
  };

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  async createOrUpdateModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      await this.props.roomStore.createRoom();
    } else {
      await this.props.roomStore.get(entityDto);
    }

    this.setState({
      roomId: entityDto.id,
    });
    this.Modal();
    setTimeout(() => {
      this.formRef.current?.setFieldsValue({
        ...this.props.roomStore.editRoom,
      });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you want to delete these items?',
      onOk() {
        self.props.roomStore.delete(input);
      },
    });
  }

  handleCreate = () => {
    const form = this.formRef.current;

    form!.validateFields().then(async (values: any) => {
      if (this.state.roomId === 0) {
        await this.props.roomStore.create(values);
      } else {
        await this.props.roomStore.update({ ...values, id: this.state.roomId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll());
  };

  public render() {
    const { rooms } = this.props.roomStore;
    const columns = [
      {
        title: L('RoomName'),
        dataIndex: 'roomName',
        key: 'roomName',
        width: 150,
        render: (text: string) => <div>{text}</div>,
      },
      {
        title: L('MaxContainer'),
        dataIndex: 'maxContainer',
        key: 'maxContainer',
        width: 150,
        render: (text: string) => <div>{text}</div>,
      },
      {
        title: L('Actions'),
        width: 150,
        render: (text: string, item: any) => (
          <div>
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu>
                  <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.id })}>
                    {L('Edit')}
                  </Menu.Item>
                  <Menu.Item onClick={() => this.delete({ id: item.id })}>{L('Delete')}</Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
            >
              <Button type="primary" icon={<SettingOutlined />}>
                {L('Actions')}
              </Button>
            </Dropdown>
          </div>
        ),
      },
    ];

    return (
      <Card>
        <Row>
          <Col
            xs={{ span: 4, offset: 0 }}
            sm={{ span: 4, offset: 0 }}
            md={{ span: 4, offset: 0 }}
            lg={{ span: 2, offset: 0 }}
            xl={{ span: 2, offset: 0 }}
            xxl={{ span: 2, offset: 0 }}
          >
            {' '}
            <h2>{L('Rooms')}</h2>
          </Col>
          <Col
            xs={{ span: 14, offset: 0 }}
            sm={{ span: 15, offset: 0 }}
            md={{ span: 15, offset: 0 }}
            lg={{ span: 1, offset: 21 }}
            xl={{ span: 1, offset: 21 }}
            xxl={{ span: 1, offset: 21 }}
          >
            <Button
              type="primary"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={() => this.createOrUpdateModalOpen({ id: 0 })}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 10, offset: 0 }}>
            <Search placeholder={this.L('Filter')} onSearch={this.handleSearch} />
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 24, offset: 0 }}
            xl={{ span: 24, offset: 0 }}
            xxl={{ span: 24, offset: 0 }}
          >
            <Table
              rowKey={(record) => record.id.toString()}
              bordered
              columns={columns}
              pagination={{
                pageSize: 10,
                total: rooms === undefined ? 0 : rooms.totalCount,
                defaultCurrent: 1,
              }}
              loading={rooms === undefined ? true : false}
              dataSource={rooms === undefined ? [] : rooms.items}
              onChange={this.handleTableChange}
            />
          </Col>
        </Row>
        <CreateOrUpdateRoom
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
            this.formRef.current?.resetFields();
          }}
          modalType={this.state.roomId === 0 ? 'create' : 'edit'}
          onCreate={this.handleCreate}
        />
      </Card>
    );
  }
}

export default Room;
