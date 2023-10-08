import { FormInstance } from 'antd/lib/form';
import React from 'react';
import { Modal, Form, Select, DatePicker, Input, Checkbox, Row, Col } from 'antd';
import moment from 'moment';
import CourseStore from '../../../stores/courseStore';
import { L } from '../../../lib/abpUtility';
import rules from './createOrUpdateClass.validateion';
import RoomStore from '../../../stores/roomStore';
import DynamicFieldSet from './lsWorkSheet';
import { WorkShiftDto } from '../../../services/schedule/dto/workShiftDto';

type PickerType = 'date';
export interface ICreateOrUpdateClassProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onCreate: () => void;
  formRef: React.RefObject<FormInstance>;
  courseStore: CourseStore;
  selectedCourseId: number;
  roomStore: RoomStore;
  selectedRoomId: number;
  onUpdateLsWorkSheet: (newLsWorkSheet: WorkShiftDto[]) => void;
}

export interface ICreateOrUpdateClassState {
  maxResultCourseCount: number;
  maxResultRoomCount: number;
  type: PickerType;
}

class CreateOrUpdateClass extends React.Component<
  ICreateOrUpdateClassProps,
  ICreateOrUpdateClassState
> {
  constructor(props: Readonly<ICreateOrUpdateClassProps>) {
    super(props);
    this.state = {
      maxResultCourseCount: 10,
      maxResultRoomCount: 10,
      type: 'date',
    };
  }

  async componentDidMount() {
    this.getAll();
  }

  async getAll() {
    const { courseStore, roomStore } = this.props;
    const { maxResultCourseCount, maxResultRoomCount } = this.state;

    await courseStore.getAll({
      maxResultCount: maxResultCourseCount,
      skipCount: 0,
      keyword: '',
    });

    await roomStore.getAll({
      maxResultCount: maxResultRoomCount,
      skipCount: 0,
      keyword: '',
    });

    const totalCourseCount = courseStore.courses.totalCount;
    this.setState({ maxResultCourseCount: totalCourseCount });

    const totalRoomCount = roomStore.rooms.totalCount;
    this.setState({ maxResultRoomCount: totalRoomCount });
  }

  validCourseValue = (rule: any, value: any) => {
    if (value === 'Select Course') {
      return Promise.reject('Please select value for Course');
    }
    return Promise.resolve();
  };

  validRoomValue = (rule: any, value: any) => {
    if (value === 'Select Room') {
      return Promise.reject('Please select value for Room');
    }
    return Promise.resolve();
  };

  validateStartDate = (rule: any, value: any) => {
    const now = moment().startOf('day');
    if (!value || !value.isValid()) {
      return Promise.reject('Please select a valid start date');
    }

    if (value.isBefore(now)) {
      return Promise.reject('Start date must be greater than or equal to the current date');
    }

    return Promise.resolve();
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
        md: { span: 6 },
        lg: { span: 6 },
        xl: { span: 6 },
        xxl: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 16, offset: 1 },
        sm: { span: 16, offset: 1 },
        md: { span: 16, offset: 1 },
        lg: { span: 16, offset: 1 },
        xl: { span: 16, offset: 1 },
        xxl: { span: 16, offset: 1 },
      },
    };

    const tailFormItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
        md: { span: 6 },
        lg: { span: 6 },
        xl: { span: 6 },
        xxl: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 16, offset: 1 },
        sm: { span: 16, offset: 1 },
        md: { span: 16, offset: 1 },
        lg: { span: 16, offset: 1 },
        xl: { span: 16, offset: 1 },
        xxl: { span: 16, offset: 1 },
      },
    };

    const {
      visible,
      onCancel,
      onCreate,
      modalType,
      formRef,
      courseStore,
      selectedCourseId,
      roomStore,
      selectedRoomId,
      onUpdateLsWorkSheet,
    } = this.props;
    const courses = courseStore.courses === undefined ? [] : courseStore.courses.items;
    const rooms = roomStore.rooms === undefined ? [] : roomStore.rooms.items;
    const { type } = this.state;
    return (
      <Modal
        visible={visible}
        cancelText={L('Cancel')}
        okText={L('OK')}
        onCancel={onCancel}
        onOk={onCreate}
        title="Class"
        destroyOnClose
        width={850}
      >
        <Form
          labelAlign="left"
          ref={formRef}
          initialValues={{
            courseId: modalType === 'create' ? 'Select Course' : selectedCourseId,
            roomId: modalType === 'create' ? 'Select Room' : selectedRoomId,
          }}
        >
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item label={L('Code')} {...formItemLayout} name="code" rules={rules.code}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={L('LimitStudent')}
                {...formItemLayout}
                name="limitStudent"
                rules={rules.limitStudent}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item
                label={L('Course')}
                {...formItemLayout}
                name="courseId"
                rules={[
                  {
                    required: true,
                    message: 'Please select a course',
                  },
                  {
                    validator: this.validCourseValue,
                  },
                ]}
              >
                <Select
                  options={courses.map((course) => ({
                    key: course.id,
                    value: course.id,
                    label: course.courseName,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={L('Room')}
                {...formItemLayout}
                name="roomId"
                rules={[
                  {
                    required: true,
                    message: 'Please select a room',
                  },
                  {
                    validator: this.validRoomValue,
                  },
                ]}
                // initialValue={this.state.type}
              >
                <Select
                  options={rooms.map((room) => ({
                    key: room.id,
                    value: room.id,
                    label: room.roomName,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item
                label={L('Start Date')}
                {...formItemLayout}
                name={['startDate']}
                rules={[
                  {
                    required: true,
                    message: 'Please select a start date',
                  },
                  {
                    validator: this.validateStartDate,
                  },
                ]}
                valuePropName={type}
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={L('End Date')}
                {...formItemLayout}
                name={['endDate']}
                rules={[
                  {
                    required: true,
                    message: 'Please select an end date',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const startDate = getFieldValue('startDate');

                      if (!value || !startDate || !startDate.isValid() || !value.isValid()) {
                        return Promise.reject('Please select valid dates');
                      }

                      if (startDate.isAfter(value)) {
                        return Promise.reject('End date must be after start date');
                      }

                      return Promise.resolve();
                    },
                  }),
                ]}
                valuePropName={type}
              >
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item
                label={L('CurrentStudent')}
                {...formItemLayout}
                name="currentStudent"
                initialValue={0}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={L('LessionTimes')}
                {...formItemLayout}
                name="lessionTimes"
                initialValue={0}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item
                label={L('IsActive')}
                {...tailFormItemLayout}
                name="isActive"
                valuePropName="checked"
              >
                <Checkbox>Aktif</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <DynamicFieldSet onUpdateLsWorkSheet={onUpdateLsWorkSheet} />
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateClass;
