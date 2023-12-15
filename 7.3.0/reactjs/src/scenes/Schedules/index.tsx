import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { inject, observer } from 'mobx-react';
import { Badge, Calendar, Card, Col, Row, Select, Tooltip } from 'antd';
import { BadgeProps } from 'antd/lib/badge';
import moment, { Moment } from 'moment';
import AppComponentBase from '../../components/AppComponentBase';
import Stores from '../../stores/storeIdentifier';
import './index.css';
import ClassTimelineStore from '../../stores/classTimelineStore';
import { EntityDto } from '../../services/dto/entityDto';
import { Shift, shiftNames } from '../../services/schedule/dto/shift';
import CreateQr from './components/createQr';
import CourseStore from '../../stores/courseStore';
import ClassStore from '../../stores/classStore';

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
          return {
            type: 'success',
            content: `${shiftNames[shiftValue]} -
                      ${matchingSchedule.class.code} -
                      ${matchingSchedule.class.course.courseName}`,
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
            <li key={item.id} onClick={() => this.handleQrCode(item.id)}>
              <Tooltip title={item.content}>
                <Badge
                  className={`date-cell ${hasEvents ? 'important-date-cell' : ''}`}
                  status={item.type as BadgeProps['status']}
                  text={item.content}
                />
              </Tooltip>
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
