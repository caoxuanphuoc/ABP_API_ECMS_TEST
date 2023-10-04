import { inject, observer } from 'mobx-react';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table, Tag } from 'antd';
import moment from 'moment';
import { FormInstance } from 'antd/lib/form';
import React from 'react';
import ClassStore from '../../stores/classStore';
import CourseStore from '../../stores/courseStore';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import CreateOrUpdateClass from './components/createOrUpdateClass';
import { CourseCreen } from './components/Courses/courseScreen';
import Course from './components/Courses/course';
import ScheduleStore from '../../stores/scheduleStore';
import Schedule from './components/Schedules/Schedule';

export interface IClassProps {
  classStore: ClassStore;
  courseStore: CourseStore;
  scheduleStore: ScheduleStore;
}

export interface IClassState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  classId: number;
  filter: string;
  selectedCourseId: number;
  course: CourseCreen;
  modalVisibleCourse: boolean;
  modalVisibleSchedule: boolean;
}

const { confirm } = Modal;
const { Search } = Input;

@inject(Stores.ClassStore, Stores.CourseStore, Stores.ScheduleStore)
@observer
class ClassRoom extends AppComponentBase<IClassProps, IClassState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    classId: 0,
    filter: '',
    selectedCourseId: 0,
    course: {
      code: '',
      courseName: '',
      courseFee: 0,
      quantity: 0,
      limitStudent: 0,
      currentStudent: 0,
      lessionTimes: 0,
    },
    modalVisibleCourse: false,
    modalVisibleSchedule: false,
  };

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    await this.props.classStore.getAll({
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

  ModalCourse = () => {
    this.setState({
      modalVisibleCourse: !this.state.modalVisibleCourse,
    });
  };

  ModalSchedule = () => {
    this.setState({
      modalVisibleSchedule: !this.state.modalVisibleSchedule,
    });
  };

  async getCourse(
    id: EntityDto,
    code: any,
    limitStudent: any,
    currentStudent: any,
    lessionTimes: any
  ) {
    const { course } = this.state;
    const { courseStore } = this.props;
    await courseStore.get(id);

    const result = courseStore.editCourse;

    const updateCourse = {
      ...course,
      code: code.code,
      courseName: result.courseName,
      courseFee: result.courseFee,
      quatity: result.quantity,
      limitStudent: limitStudent.limitStudent,
      currentStudent: currentStudent.currentStudent,
      lessionTimes: lessionTimes.lessionTimes,
    };
    this.setState({ course: updateCourse });
    this.ModalCourse();
  }

  async getSchedule(id: EntityDto, code: any) {
    const { course } = this.state;
    const { courseStore } = this.props;
    await courseStore.get(id);

    const result = courseStore.editCourse;

    const updateCourse = {
      ...course,
      code: code.code,
      courseName: result.courseName,
    };
    this.setState({ course: updateCourse });
    this.ModalSchedule();
  }

  async createOrUpdateModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      await this.props.classStore.createClass();
    } else {
      await this.props.classStore.get(entityDto);
    }

    this.setState({
      selectedCourseId: this.props.classStore.editClass?.course?.id,
      classId: entityDto.id,
    });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.classStore.editClass });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you want to delete these items?',
      onOk() {
        self.props.classStore.delete(input);
      },
    });
  }

  handleCreate = () => {
    const form = this.formRef.current;

    form!.validateFields().then(async (values: any) => {
      if (this.state.classId === 0) {
        await this.props.classStore.create(values);
      } else {
        await this.props.classStore.update({ ...values, id: this.state.classId });
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
    const { classes } = this.props.classStore;
    const columns = [
      {
        title: L('Code'),
        dataIndex: 'code',
        key: 'code',
        with: 150,
        render: (text: string) => <div>{text}</div>,
      },
      {
        title: L('StartDate'),
        dataIndex: 'startDate',
        key: 'startDate',
        with: 150,
        render: (text: string) => <div>{moment(text.split('T')[0]).format('DD/MM/YYYY')}</div>,
      },
      {
        title: L('EndDate'),
        dataIndex: 'endDate',
        key: 'endDate',
        with: 150,
        render: (text: string) => <div>{moment(text.split('T')[0]).format('DD/MM/YYYY')}</div>,
      },
      {
        title: L('IsActive'),
        dataIndex: 'isActive',
        key: 'isActive',
        width: 150,
        render: (text: boolean) =>
          text === true ? <Tag color="#2db7f5">{L('Yes')}</Tag> : <Tag color="red">{L('No')}</Tag>,
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
                  <Menu.Item
                    onClick={() =>
                      this.getCourse(
                        { id: item.id },
                        { code: item.code },
                        { limitStudent: item.limitStudent },
                        { currentStudent: item.currentStudent },
                        { lessionTimes: item.lessionTimes }
                      )
                    }
                  >
                    {L('Course')}
                  </Menu.Item>
                  <Menu.Item onClick={() => this.getSchedule({ id: item.id }, { code: item.code })}>
                    {L('Schedule')}
                  </Menu.Item>
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
            <h2>{L('Classes')}</h2>
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
                total: classes === undefined ? 0 : classes.totalCount,
                defaultCurrent: 1,
              }}
              loading={classes === undefined}
              dataSource={classes === undefined ? [] : classes.items}
              onChange={this.handleTableChange}
            />
          </Col>
        </Row>
        <CreateOrUpdateClass
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
            this.formRef.current?.resetFields();
          }}
          modalType={this.state.classId === 0 ? 'create' : 'edit'}
          onCreate={this.handleCreate}
          courseStore={this.props.courseStore}
          selectedCourseId={this.state.selectedCourseId}
        />
        <Course
          visible={this.state.modalVisibleCourse}
          onCancel={() => {
            this.setState({
              modalVisibleCourse: false,
            });
          }}
          course={this.state.course}
        />
        <Schedule
          visible={this.state.modalVisibleSchedule}
          onCancel={() => {
            this.setState({
              modalVisibleSchedule: false,
            });
          }}
          scheduleStore={this.props.scheduleStore}
          classId={this.state.classId}
          course={this.state.course}
        />
      </Card>
    );
  }
}

export default ClassRoom;
