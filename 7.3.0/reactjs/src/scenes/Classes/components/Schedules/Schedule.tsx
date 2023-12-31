import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { Button, Card, Col, Dropdown, Menu, Modal, Row, Table } from 'antd';
import moment from 'moment';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import ScheduleStore from '../../../../stores/scheduleStore';
import { EntityDto } from '../../../../services/dto/entityDto';
import { L } from '../../../../lib/abpUtility';
import AppComponentBase from '../../../../components/AppComponentBase';
import { CourseCreen } from '../Courses/courseScreen';

export interface IScheduleProps {
  visible: boolean;
  scheduleStore: ScheduleStore;
  classId: number;
  onCancel: () => void;
  course: CourseCreen;
}

export interface IScheduleState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  scheduleId: number;
  filter: string;
  code: string;
  courseName: string;
}

const { confirm } = Modal;
// const { Search } = Input;

class Schedule extends AppComponentBase<IScheduleProps, IScheduleState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 0,
    skipCount: 0,
    scheduleId: 0,
    filter: '',
    code: '',
    courseName: '',
  };

  async componentDidMount() {
    this.getAll();
  }

  async getAll() {
    const { scheduleStore } = this.props;
    await scheduleStore.getAllWithClassIdFilter(
      {
        maxResultCount: this.state.maxResultCount,
        skipCount: this.state.skipCount,
        keyword: this.state.filter,
      },
      this.props.classId
    );
  }

  handleTableChange = (pagination: any) => {
    this.setState(
      { skipCount: (pagination.current - 1) * this.state.maxResultCount! },
      async () => {
        await this.getAll();
      }
    );
  };

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  async createOrUpdateModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      await this.props.scheduleStore.createSchedule();
    } else {
      await this.props.scheduleStore.get(entityDto);

      this.setState({ scheduleId: entityDto.id });
      this.Modal();

      setTimeout(() => {
        this.formRef.current?.setFieldsValue({ ...this.props.scheduleStore.editSchedule });
      }, 100);
    }
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you want to delete these items',
      onOk() {
        self.props.scheduleStore.delete(input);
      },
    });
  }

  handleCreate = () => {
    const form = this.formRef.current;

    form!.validateFields().then(async (values: any) => {
      if (this.state.scheduleId === 0) {
        await this.props.scheduleStore.create(values);
      } else {
        await this.props.scheduleStore.update({ ...values, id: this.state.scheduleId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  public render() {
    const { schedules } = this.props.scheduleStore;

    const { onCancel, visible, course } = this.props;

    const columns = [
      {
        title: L('Date'),
        dataIndex: 'date',
        key: 'date',
        with: 150,
        render: (text: string) => <div>{moment(text.split('T')[0]).format('DD/MM/YYYY')}</div>,
      },
      {
        title: L('Code'),
        dataIndex: 'code',
        key: 'code',
        width: 150,
        render: (text: string, record: any) => <div>{record.workShift.code}</div>,
      },
      {
        title: L('TimeStart'),
        dataIndex: 'timeStart',
        key: 'timeStart',
        with: 350,
        render: (text: string, record: any) => (
          <div>{moment(record.workShift.timeStart).format('HH:mm')}</div>
        ),
      },
      {
        title: L('EndStart'),
        dataIndex: 'endStart',
        key: 'endStart',
        with: 350,
        render: (text: string, record: any) => (
          <div>{moment(record.workShift.endStart).format('HH:mm')}</div>
        ),
      },
      {
        title: L('Actions'),
        width: 150,
        render: (text: string, item: any) => (
          <>
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
          </>
        ),
      },
    ];

    return (
      <Modal
        visible={visible}
        cancelText={L('Cancel')}
        okText={L('OK')}
        onCancel={onCancel}
        onOk={onCancel}
        title={<h2>{`Schedule - ${course.code} - ${course.courseName}`}</h2>}
        destroyOnClose
        width={700}
      >
        <Card>
          <Row>
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
                  total: schedules === undefined ? 0 : schedules.totalCount,
                  defaultCurrent: 1,
                }}
                loading={schedules === undefined ? true : false}
                dataSource={schedules === undefined ? [] : schedules.items}
                onChange={this.handleTableChange}
              />
            </Col>
          </Row>
        </Card>
      </Modal>
    );
  }
}

export default Schedule;
