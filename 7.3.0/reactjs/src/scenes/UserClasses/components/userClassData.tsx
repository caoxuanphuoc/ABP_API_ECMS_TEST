import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { Button, Col, Dropdown, Input, Menu, Modal, Row, Table, Tag } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import moment from 'moment';
import AppComponentBase from '../../../components/AppComponentBase';
import UserClassStore from '../../../stores/userClassStore';
import { EntityDto } from '../../../services/dto/entityDto';
import { L } from '../../../lib/abpUtility';

export interface IUserClassIsActiveDataProps {
  isActive: boolean;
  userClassStore: UserClassStore;
}

export interface IUserClassIsActiveDataState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userClassId: number;
  filter: string;
}

const { confirm } = Modal;
const { Search } = Input;

class UserClassData extends AppComponentBase<
  IUserClassIsActiveDataProps,
  IUserClassIsActiveDataState
> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userClassId: 0,
    filter: '',
  };

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    await this.props.userClassStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      keyword: this.state.filter,
      isActive: this.props.isActive,
    });
  }

  handleTableChange = (pagination: any) => {
    this.setState(
      { skipCount: (pagination.current - 1) * this.state.maxResultCount! },
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
      await this.props.userClassStore.createUserClass();
    } else {
      await this.props.userClassStore.get(entityDto);
    }

    this.setState({ userClassId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.userClassStore.editUserClass });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.userClassStore.delete(input);
      },
    });
  }

  handleCreate = () => {
    const form = this.formRef.current;

    form!.validateFields().then(async (values: any) => {
      if (this.state.userClassId === 0) {
        await this.props.userClassStore.create(values);
      } else {
        await this.props.userClassStore.update({ ...values, id: this.state.userClassId });
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
    const { userClasses } = this.props.userClassStore;

    const columns = [
      {
        title: L('FullName'),
        dataIndex: 'name',
        key: 'name',
        width: 150,
        render: (text: string, record: any) => (
          <div>
            {record.user.surname} {record.user.name}
          </div>
        ),
      },
      {
        title: L('EmailAddress'),
        dataIndex: 'emailAddress',
        key: 'emailAddress',
        width: 150,
        render: (text: string, record: any) => <div>{record.user.emailAddress}</div>,
      },
      {
        title: L('OffTimes'),
        dataIndex: 'offTimes',
        key: 'offTimes',
        width: 150,
        render: (text: string) => <div>{text}</div>,
      },
      {
        title: L('DataStart'),
        dataIndex: 'dateStart',
        key: 'dateStart',
        width: 150,
        render: (text: string) => <div>{moment(text.split('T')[0]).format('DD/MM/YYYY')}</div>,
      },
      {
        title: L('IsActive'),
        dataIndex: 'isActive',
        key: 'isActive',
        width: 150,
        render: (text: boolean) =>
          text === true ? (
            <Tag color="#2db7f5">{L('Đã duyệt')}</Tag>
          ) : (
            <Tag color="red">{L('Chưa duyệt')}</Tag>
          ),
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
      <>
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
            <h2>{L('UserClasses')}</h2>
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
                total: userClasses === undefined ? 0 : userClasses.totalCount,
                defaultCurrent: 1,
              }}
              loading={userClasses === undefined}
              dataSource={userClasses === undefined ? [] : userClasses.items}
              onChange={this.handleTableChange}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default UserClassData;
