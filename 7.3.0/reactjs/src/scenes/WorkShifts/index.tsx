import { inject, observer } from 'mobx-react';
import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table } from 'antd';
import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import moment from 'moment';
import WorkShiftStore from '../../stores/workShiftStore';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import CreateOrUpdateWorkShift from './components/createOrUpdateWorkShift';

export interface IWorkShiftProps {
  workShiftStore: WorkShiftStore;
}

export interface IWorkShiftState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  workShiftId: number;
  filter: string;
}

const { confirm } = Modal;
const { Search } = Input;

@inject(Stores.WorkShiftStore)
@observer
class WorkShift extends AppComponentBase<IWorkShiftProps, IWorkShiftState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    workShiftId: 0,
    filter: '',
  };

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    await this.props.workShiftStore.getAll({
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
      await this.props.workShiftStore.createWorkShift();
    } else {
      await this.props.workShiftStore.get(entityDto);
    }

    this.setState({ workShiftId: entityDto.id });
    this.Modal();
    setTimeout(() => {
      this.formRef.current?.setFieldsValue({
        ...this.props.workShiftStore.editWorkShift,
        timeStart: moment(this.props.workShiftStore.editWorkShift.timeStart, 'HH:mm'),
      });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you want to delete these items?',
      onOk() {
        self.props.workShiftStore.delete(input);
      },
    });
  }

  handleCreate = () => {
    const form = this.formRef.current;

    form!.validateFields().then(async (values: any) => {
      const updatedValues = { ...values };
      updatedValues.timeStart = values.timeStart.format('HH:mm');
      updatedValues.timeEnd = values.timeEnd.format('HH:mm');
      if (this.state.workShiftId === 0) {
        await this.props.workShiftStore.create(updatedValues);
      } else {
        await this.props.workShiftStore.update({ ...updatedValues, id: this.state.workShiftId });
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
    const { workShifts } = this.props.workShiftStore;
    const columns = [
      {
        title: L('Code'),
        dataIndex: 'code',
        key: 'code',
        with: 150,
        render: (text: string) => <div>{text}</div>,
      },
      {
        title: L('TimeStart'),
        dataIndex: 'timeStart',
        key: 'timeStart',
        with: 350,
        render: (text: string) => <div>{moment(text).format('HH:mm')}</div>,
      },
      {
        title: L('TimeEnd'),
        dataIndex: 'timeEnd',
        key: 'timeEnd',
        with: 350,
        render: (text: string) => <div>{moment(text).format('HH:mm')}</div>,
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
            <h2>{L('WorkShifts')}</h2>
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
                total: workShifts === undefined ? 0 : workShifts.totalCount,
                defaultCurrent: 1,
              }}
              loading={workShifts === undefined ? true : false}
              dataSource={workShifts === undefined ? [] : workShifts.items}
              onChange={this.handleTableChange}
            />
          </Col>
        </Row>
        <CreateOrUpdateWorkShift
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
            this.formRef.current?.resetFields();
          }}
          modalType={this.state.workShiftId === 0 ? 'edit' : 'create'}
          onCreate={this.handleCreate}
        />
      </Card>
    );
  }
}

export default WorkShift;
