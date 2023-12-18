import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { inject, observer } from 'mobx-react';
import { Badge, Calendar, Card, Col, Popover, Row, Select } from 'antd';
import { BadgeProps } from 'antd/lib/badge';
import moment, { Moment } from 'moment';
import { CloseOutlined, DeleteOutlined, EditOutlined, QrcodeOutlined } from '@ant-design/icons';
import AppComponentBase from '../../components/AppComponentBase';
import Stores from '../../stores/storeIdentifier';
import './index.css';
import ClassTimelineStore from '../../stores/classTimelineStore';
import { EntityDto } from '../../services/dto/entityDto';
import { Shift, shiftNames } from '../../services/schedule/dto/shift';
import CreateQr from './components/createQr';
import CourseStore from '../../stores/courseStore';
import ClassStore from '../../stores/classStore';
import { L } from '../../lib/abpUtility';

export interface IScheduleProps {
  classTimelineStore: ClassTimelineStore;
  courseStore: CourseStore;
  classStore: ClassStore;
}

export interface IScheduleState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  filter: string;
  clasTimelineId: number;
  selectedClassId: number;
  selectedCourseId: number;
  maxResultClassCount: number;
  maxResultCourseCount: number;
  hashSchedule: string;
  clicked: any;
  hovered: any;
}

// const { confirm } = Modal;

@inject(Stores.ClassTimelineStore, Stores.ClassStore, Stores.CourseStore)
@observer
class Schedule extends AppComponentBase<IScheduleProps, IScheduleState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    filter: '',
    clasTimelineId: 0,
    selectedClassId: 0,
    selectedCourseId: 0,
    maxResultClassCount: 10,
    maxResultCourseCount: 10,
    hashSchedule: '',
    clicked: {},
    hovered: {},
  };

  async componentDidUpdate(prevProps: any, prevState: { maxResultCourseCount: number; }) {
    if (prevState.maxResultCourseCount !== this.state.maxResultCourseCount) {
      await this.getAll();
    }
  }

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    const {
      maxResultCount,
      skipCount,
      filter,
      selectedClassId,
      selectedCourseId,
      maxResultClassCount,
      maxResultCourseCount,
    } = this.state;

    await this.props.classTimelineStore.getAll({
      maxResultCount,
      skipCount,
      keyword: filter,
      classId: selectedClassId,
      courseId: selectedCourseId,
    });

    await this.props.classStore.getAll({
      maxResultCount: maxResultClassCount,
      skipCount: 0,
      keyword: '',
    });

    await this.props.courseStore.getAll({
      maxResultCount: maxResultCourseCount,
      skipCount: 0,
      keyword: '',
    });

    const totalClassTimelineCount = this.props.classTimelineStore.classTimelines.totalCount;
    this.setState({ maxResultCount: totalClassTimelineCount });

    const totalClassCount = this.props.classStore.classes.totalCount;
    this.setState({ maxResultClassCount: totalClassCount });

    const totalCourseCount = this.props.courseStore.courses.totalCount;
    this.setState({ maxResultCourseCount: totalCourseCount });
  }

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  async createOrUpdateModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      await this.props.classTimelineStore.createClassTimeline();
    } else {
      await this.props.classTimelineStore.get(entityDto);
    }

    this.setState({
      // selectedClassId: this.props.classTimelineStore.editClassTimeline?.class?.id,
      clasTimelineId: entityDto.id,
    });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.classTimelineStore.editClassTimeline });
    }, 100);
  }

  // handleCreate = () => {
  //   const form = this.formRef.current;

  //   form!.validateFields().then(async (values: any) => {
  //     const updateValues = { ...values };
  //     if (this.state.clasTimelineId === 0) {
  //       await this.props.scheduleStore.create(updateValues);
  //     } else {
  //       await this.props.scheduleStore.update({ ...updateValues, id: this.state.scheduleId });
  //     }

  //     await this.getAll();
  //     this.setState({ modalVisible: false });
  //     form!.resetFields();
  //   });
  // };

  handleClassChange = (value: any) => {
    const selectedClassId = value === 'Select Class' ? 0 : value;
    this.setState({ selectedClassId }, async () => await this.getAll());
  };

  handleCourseChange = (value: any) => {
    const selectedCourseId = value === 'Select Course' ? 0 : value;
    this.setState({ selectedCourseId }, async () => await this.getAll());
  };

  handleQrCode = (id: number) => {
    this.hashSchedule(id);
    this.Modal();
  };

  async hashSchedule(id: number) {
    const { classTimelineStore } = this.props;
    await classTimelineStore.hashSchedule(id);

    const result = classTimelineStore.hashString;
    this.setState({ hashSchedule: result });
  }

  hide = (item: number): void => {
    this.setState((prevState) => ({
      clicked: {...prevState.clicked, [item]: false},
      hovered: {...prevState.hovered, [item]: false},
    }))
  }

  handleHoverChange = (open: boolean, itemId: number): void => {
    this.setState((prevState) => ({
      hovered: { ...prevState.hovered, [itemId]: open },
      clicked: { ...prevState.clicked, [itemId]: false },
    }));
  }

  handleClickedChange = (open: boolean, itemId: number): void => {
    this.setState((prevState) => ({
      hovered: { ...prevState.hovered, [itemId]: false },
      clicked: { ...prevState.clicked, [itemId]: open },
    }));
  }

  public render() {
    const { classTimelineStore, classStore, courseStore } = this.props;
    const classeTimelines = classTimelineStore.classTimelines?.items || [];
    const classes = classStore.classes?.items || [];
    const courses = courseStore.courses?.items || [];

    const getListData = (value: Moment) => {
      let listData;

      const matchingSchedules = classeTimelines.filter((classeTimeline) =>
        moment(classeTimeline.schedule.date.toString().split('T')[0]).isSame(value, 'day')
      );

      if (matchingSchedules.length > 0) {
        listData = matchingSchedules.map((matchingSchedule) => {
          const shiftValue: Shift =
            Shift[matchingSchedule.schedule.shift as unknown as keyof typeof Shift];

          // Format the shift information (Tiết 1 - Tiết 2 => Tiết: 1 - 2)
          const lession = shiftNames[shiftValue].match(/\d+/g);
          const formattedShift = lession ? `${lession.join(' - ')}` : shiftValue;

          return {
            type: 'success',
            content: `${shiftNames[shiftValue]} -
                      ${matchingSchedule.class.code} -
                      ${matchingSchedule.class.course.courseName}`,
            lesson: `${L(`Lession`)}: ${formattedShift}`,
            classroom: `${L(`Classroom`)}: ${matchingSchedule.class.code}`,
            title: matchingSchedule.class.course.courseName,
            id: matchingSchedule.id,
          };
        });
      }

      return listData || [];
    };

    const dateCellRender = (value: Moment) => {
      const listData = getListData(value);
      const hasEvents = listData.length > 0;
      return (
        <ul className="events">
          {listData.map((item) => (
            <li key={item.id}>
              <Popover
                content={(
                  <div>
                    <p>- {item.lesson}</p>
                    <p>- {item.classroom}</p>
                  </div>
                )}
                title={(
                  <div style={{ textAlign : 'center' }}>
                    {item.title}
                  </div>
                )}
                trigger="hover"
                visible={this.state.hovered[item.id]}
                onVisibleChange={(visible) => this.handleHoverChange(visible, item.id)}
              >
                <Popover
                  content={(
                    <Row gutter={[16, 8]}>
                      <Col span={8}>
                        <QrcodeOutlined onClick={() => this.handleQrCode(item.id)} style={{ fontSize: 32}} />
                      </Col>
                      <Col span={8}>
                        <EditOutlined style={{ fontSize: 32}} />
                      </Col>
                      <Col span={8}>
                        <DeleteOutlined style={{ fontSize: 32}} />
                      </Col>
                    </Row>
                  )}
                  title={(
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 20 }}>
                      <span>Action</span>
                      <CloseOutlined style={{ marginLeft: 'auto' }} onClick={() => this.hide(item.id)} />
                    </div>
                  )}
                  trigger="click"
                  visible={this.state.clicked[item.id]}
                  onVisibleChange={(visible) => this.handleClickedChange(visible, item.id)}
                >
                  <Badge
                    className={`date-cell ${hasEvents ? 'important-date-cell' : ''}`}
                    status={item.type as BadgeProps['status']}
                    text={item.content}
                  />
                </Popover>
              </Popover>
            </li>
          ))}
        </ul>
      );
    };

    return (
      <Card>
        <Row>
          <Col
            xs={{ span: 6, offset: 1 }}
            sm={{ span: 6, offset: 1 }}
            md={{ span: 6, offset: 1 }}
            lg={{ span: 4, offset: 1 }}
            xl={{ span: 4, offset: 1 }}
            xxl={{ span: 4, offset: 1 }}
          >
            <Select
              options={[
                { key: 0, value: 0, label: 'Select Course' },
                ...courses.map((course) => ({
                  key: course.id,
                  value: course.id,
                  label: course.courseName,
                })),
              ]}
              defaultValue={0} // Set the initial default value to 0
              onChange={this.handleCourseChange}
              style={{ width: 200 }}
            />
          </Col>
          <Col
            xs={{ span: 6, offset: 1 }}
            sm={{ span: 6, offset: 1 }}
            md={{ span: 6, offset: 1 }}
            lg={{ span: 4, offset: 1 }}
            xl={{ span: 4, offset: 1 }}
            xxl={{ span: 4, offset: 1 }}
          >
            <Select
              options={[
                { key: 0, value: 0, label: 'Select Class' },
                ...classes.map((classroom) => ({
                  key: classroom.id,
                  value: classroom.id,
                  label: classroom.code,
                })),
              ]}
              defaultValue={0} // Set the initial default value to 0
              onChange={this.handleClassChange}
              style={{ width: 200 }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Calendar dateCellRender={dateCellRender} />
        </Row>
        <CreateQr
          hashSchedule={this.state.hashSchedule}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
          }}
        />
      </Card>
    );
  }
}

export default Schedule;
