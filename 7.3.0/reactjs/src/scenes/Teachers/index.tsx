import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import moment from 'moment';
import TeacherStore from '../../stores/teacherStore';
import AppComponentBase from '../../components/AppComponentBase';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import CreateOrUpdateTeacher from './components/createOrUpdateTeacher';
import UserStore from '../../stores/userStore';

export interface ITeacherProps {
  teacherStore: TeacherStore;
  userStore: UserStore;
}

export interface ITeacherState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  teacherId: number;
  filter: string;
  selectedUserId: number;
}

const { confirm } = Modal;
const { Search } = Input;

@inject(Stores.TeacherStore, Stores.UserStore)
@observer
class Teacher extends AppComponentBase<ITeacherProps, ITeacherState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    teacherId: 0,
    filter: '',
    selectedUserId: 0,
  };

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    await this.props.teacherStore.getAll({
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
      await this.props.teacherStore.createTeacher();
    } else {
      await this.props.teacherStore.get(entityDto);
    }

    this.setState({
      selectedUserId: this.props.teacherStore.editTeacher?.user?.id,
      teacherId: entityDto.id,
    });
    this.Modal();
    setTimeout(() => {
      this.formRef.current?.setFieldsValue({
        ...this.props.teacherStore.editTeacher,
      });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you want to delete these items?',
      onOk() {
        self.props.teacherStore.delete(input);
      },
    });
  }

  handleCreate = () => {
    const form = this.formRef.current;

    form!.validateFields().then(async (values: any) => {
      if (this.state.teacherId === 0) {
        await this.props.teacherStore.create(values);
      } else {
        await this.props.teacherStore.update({ ...values, id: this.state.teacherId });
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
    const { teachers } = this.props.teacherStore;
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
        title: L('SchoolName'),
        dataIndex: 'schoolName',
        key: 'schoolName',
        width: 150,
        render: (text: string) => <div>{text}</div>,
      },
      {
        title: L('Certificate'),
        dataIndex: 'certificate',
        key: 'certificate',
        width: 150,
        render: (text: string) => <div>{text}</div>,
      },
      {
        title: L('Wage'),
        dataIndex: 'wage',
        key: 'wage',
        width: 150,
        render: (text: string) => <div>{text}</div>,
      },
      {
        title: L('StartTime'),
        dataIndex: 'startTime',
        key: 'startTime',
        with: 150,
        render: (text: string) => <div>{moment(text.split('T')[0]).format('DD/MM/YYYY')}</div>,
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
            <h2>{L('Teachers')}</h2>
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
                total: teachers === undefined ? 0 : teachers.totalCount,
                defaultCurrent: 1,
              }}
              loading={teachers === undefined ? true : false}
              dataSource={teachers === undefined ? [] : teachers.items}
              onChange={this.handleTableChange}
            />
          </Col>
        </Row>
        <CreateOrUpdateTeacher
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
            this.formRef.current?.resetFields();
          }}
          modalType={this.state.teacherId === 0 ? 'create' : 'edit'}
          onCreate={this.handleCreate}
          selectedUserId={this.state.selectedUserId}
          userStore={this.props.userStore}
        />
      </Card>
    );
  }
}

export default Teacher;
