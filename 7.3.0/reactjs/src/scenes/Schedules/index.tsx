import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { inject, observer } from 'mobx-react';
import { Badge, Button, Calendar, Card, Col, Popover, Row, Select } from 'antd';
import { BadgeProps } from 'antd/lib/badge';
import moment, { Moment } from 'moment';
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
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
import RoomStore from '../../stores/roomStore';
import CreateOrUpdateSchedule from './components/createOrUpdateSchedule';
import { WorkShiftDto } from '../../services/schedule/dto/workShiftDto';

export interface IScheduleProps {
  classTimelineStore: ClassTimelineStore;
  courseStore: CourseStore;
  classStore: ClassStore;
  roomStore: RoomStore;
}

export interface IScheduleState {
  modalVisible: boolean;
  modalQR: boolean;
  maxResultCount: number;
  skipCount: number;
  filter: string;
  classTimelineId: number;
  selectedClassId: number;
  selectedClassIdInModal: number;
  selectedCourseId: number;
  selectedRoomId: number;
  maxResultClassCount: number;
  maxResultCourseCount: number;
  maxResultRoomCount: number;
  hashSchedule: string;
  lsWorkSheet: WorkShiftDto[];
  clicked: any;
  hovered: any;
}

// const { confirm } = Modal;

@inject(Stores.ClassTimelineStore, Stores.ClassStore, Stores.CourseStore, Stores.RoomStore)
@observer
class Schedule extends AppComponentBase<IScheduleProps, IScheduleState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    modalQR: false,
    maxResultCount: 10,
    skipCount: 0,
    filter: '',
    classTimelineId: 0,
    selectedClassId: 0,
    selectedClassIdInModal: 0,
    selectedCourseId: 0,
    selectedRoomId: 0,
    maxResultClassCount: 10,
    maxResultCourseCount: 10,
    maxResultRoomCount: 10,
    hashSchedule: '',
    lsWorkSheet: [],
    clicked: {},
    hovered: {},
  };

  async componentDidUpdate(
    __prevProps: unknown,
    prevState: {
      maxResultCourseCount: number;
      maxResultClassCount: number;
      selectedCourseId: number;
      selectedClassId: number;
    }
  ): Promise<void> {
    if (
      prevState.maxResultCourseCount !== this.state.maxResultCourseCount ||
      prevState.maxResultClassCount !== this.state.maxResultClassCount ||
      prevState.selectedCourseId !== this.state.selectedCourseId ||
      prevState.selectedClassId !== this.state.selectedClassId
    ) {
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

    const totalClassTimelineCount = this.props.classTimelineStore.classTimelines.totalCount || 1;
    this.setState({ maxResultCount: totalClassTimelineCount });

    const totalClassCount = this.props.classStore.classes.totalCount || 1;
    this.setState({ maxResultClassCount: totalClassCount });

    const totalCourseCount = this.props.courseStore.courses.totalCount || 1;
    this.setState({ maxResultCourseCount: totalCourseCount });
  }

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  ModalQr = () => {
    this.setState({
      modalQR: !this.state.modalQR,
    });
  };

  handleUpdateLsWorkSheet = (newLsWorkSheet: WorkShiftDto[]): void => {
    this.setState({ lsWorkSheet: newLsWorkSheet });
  };

  async createOrUpdateModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      await this.props.classTimelineStore.createClassTimeline();
    } else {
      await this.props.classTimelineStore.get(entityDto);
    }

    this.setState({
      // selectedClassId: this.props.classTimelineStore.editClassTimeline?.class?.id,
      classTimelineId: entityDto.id,
    });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.classTimelineStore.editClassTimeline });
    }, 100);
  }

  handleCreate = () => {
    const form = this.formRef.current;

    form!.validateFields().then(async (values: any) => {
      const updateValues = { ...values };
      updateValues.ListWorkShifts = this.state.lsWorkSheet;
      if (this.state.classTimelineId === 0) {
        await this.props.classTimelineStore.create(updateValues);
      } else {
        // await this.props.scheduleStore.update({ ...updateValues, id: this.state.scheduleId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleClassChange = (value: any) => {
    const selectedClassId = value === 'Select Class' ? 0 : value;
    this.setState({ selectedClassId, maxResultClassCount: 10 });
  };

  handleCourseChange = (value: any) => {
    const selectedCourseId = value === 'Select Course' ? 0 : value;
    this.setState({ selectedCourseId, maxResultCourseCount: 10 });
  };

  handleQrCode = (id: number) => {
    this.hide(id);
    this.hashSchedule(id);
    this.ModalQr();
  };

  async hashSchedule(id: number) {
    const { classTimelineStore } = this.props;
    await classTimelineStore.hashSchedule(id);

    const result = classTimelineStore.hashString;
    this.setState({ hashSchedule: result });
  }

  hide = (item: number): void => {
    this.setState((prevState) => ({
      clicked: { ...prevState.clicked, [item]: false },
      hovered: { ...prevState.hovered, [item]: false },
    }));
  };

  handleHoverChange = (open: boolean, itemId: number): void => {
    this.setState((prevState) => ({
      hovered: { ...prevState.hovered, [itemId]: open },
      clicked: { ...prevState.clicked, [itemId]: false },
    }));
  };

  handleClickedChange = (open: boolean, itemId: number): void => {
    this.setState((prevState) => ({
      hovered: { ...prevState.hovered, [itemId]: false },
      clicked: { ...prevState.clicked, [itemId]: open },
    }));
  };

  public render() {
    const { classTimelineStore, classStore, courseStore } = this.props;
    const classeTimelines = classTimelineStore.classTimelines?.items || [];
    const classes = classStore.classes?.items || [];
    const courses = courseStore.courses?.items || [];

    const courseOptions = [
    { key: 0, value: 0, label: 'All Course' },
    ...courses.map((course) => ({
      key: course.id,
      value: course.id,
      label: course.courseName,
    }))];

    const classOptions = [
      { key: 0, value: 0, label: 'All Class' },
      ...classes.map((classroom) => ({
        key: classroom.id,
        value: classroom.id,
        label: classroom.code,
      })),
    ]

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
                title={<div style={{ textAlign: 'center' }}>{item.title}</div>}
                trigger="hover"
                visible={this.state.hovered[item.id]}
                onVisibleChange={(visible) => this.handleHoverChange(visible, item.id)}
              >
                <Popover
                  content={(
                    <Row gutter={[16, 8]}>
                      <Col span={8}>
                        <QrcodeOutlined
                          onClick={() => this.handleQrCode(item.id)}
                          style={{ fontSize: 32 }}
                        />
                      </Col>
                      <Col span={8}>
                        <EditOutlined style={{ fontSize: 32 }} />
                      </Col>
                      <Col span={8}>
                        <DeleteOutlined style={{ fontSize: 32 }} />
                      </Col>
                    </Row>
                  )}
                  title={(
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 20,
                      }}
                    >
                      <span>Action</span>
                      <CloseOutlined
                        style={{ marginLeft: 'auto' }}
                        onClick={() => this.hide(item.id)}
                      />
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
            xs={{ span: 8, offset: 2 }}
            sm={{ span: 8, offset: 2 }}
            md={{ span: 8, offset: 2 }}
            lg={{ span: 4, offset: 2 }}
            xl={{ span: 4, offset: 2 }}
            xxl={{ span: 4, offset: 2 }}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
              options={courseOptions}
              defaultValue={0} // Set the initial default value to 0
              onChange={this.handleCourseChange}
              style={{ width: 200 }}
            />
          </Col>
          <Col
            xs={{ span: 8, offset: 2 }}
            sm={{ span: 8, offset: 2 }}
            md={{ span: 8, offset: 2 }}
            lg={{ span: 4, offset: 2 }}
            xl={{ span: 4, offset: 2 }}
            xxl={{ span: 4, offset: 2 }}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
              options={classOptions}
              defaultValue={0} // Set the initial default value to 0
              onChange={this.handleClassChange}
              style={{ width: 200 }}
            />
          </Col>
          <Col
            xs={{ span: 8, offset: 8 }}
            sm={{ span: 8, offset: 8 }}
            md={{ span: 8, offset: 8 }}
            lg={{ span: 4, offset: 8 }}
            xl={{ span: 4, offset: 8 }}
            xxl={{ span: 4, offset: 8 }}
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
          <Calendar dateCellRender={dateCellRender} />
        </Row>
        <CreateQr
          hashSchedule={this.state.hashSchedule}
          visible={this.state.modalQR}
          onCancel={() => {
            this.setState({
              modalQR: false,
            });
          }}
        />
        <CreateOrUpdateSchedule
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
            this.formRef.current?.resetFields();
          }}
          modalType={this.state.classTimelineId === 0 ? 'create' : 'edit'}
          onCreate={this.handleCreate}
          classStore={this.props.classStore}
          roomStore={this.props.roomStore}
          selectedClassId={this.state.selectedClassIdInModal}
          selectedRoomId={this.state.selectedRoomId}
          onUpdateLsWorkSheet={this.handleUpdateLsWorkSheet}
        />
      </Card>
    );
  }
}

export default Schedule;
