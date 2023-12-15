import { FormInstance } from 'antd/lib/form';
import React from 'react';
import { Modal, Form, Select, Input, Checkbox, Row, Col, Tabs } from 'antd';
import CourseStore from '../../../stores/courseStore';
import { L } from '../../../lib/abpUtility';
import rules from './createOrUpdateClass.validateion';
import RoomStore from '../../../stores/roomStore';
import { WorkShiftDto } from '../../../services/schedule/dto/workShiftDto';
import DynamicFieldSet from './lsWorkSheet';

const { TabPane } = Tabs;
export interface ICreateOrUpdateClassProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onCreate: () => void;
  formRef: React.RefObject<FormInstance>;
  courseStore: CourseStore;
  selectedCourseId: number;
  roomStore: RoomStore;
  onUpdateLsWorkSheet: (newLsWorkSheet: WorkShiftDto[]) => void;
}

export interface ICreateOrUpdateClassState {
  maxResultCourseCount: number;
  maxResultRoomCount: number;
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
    };
  }

  async componentDidMount(): Promise<void> {
    this.getAll();
  }

  async componentDidUpdate(_prevProps: any, prevState: { maxResultCourseCount: number }) {
    const { maxResultCourseCount } = this.state;
    if (prevState.maxResultCourseCount !== maxResultCourseCount) await this.getAll();
  }

  async getAll(): Promise<void> {
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
      return Promise.reject(new Error('Please select value for Course'));
    }
    return Promise.resolve();
  };

  validRoomValue = (rule: any, value: any) => {
    if (value === 'Select Room') {
      return Promise.reject(new Error('Please select value for Room'));
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
      onUpdateLsWorkSheet,
    } = this.props;
    const courses = courseStore.courses?.items || [];
    const rooms = roomStore.rooms?.items || [];
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
            roomId: modalType === 'create' ? 'Select Room' : null,
          }}
        >
          <Tabs defaultActiveKey="class" size="small" tabBarGutter={64}>
            <TabPane tab="ClassInfo" key="class">
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Form.Item
                    label={L('Code')}
                    labelCol={formItemLayout.labelCol}
                    wrapperCol={formItemLayout.wrapperCol}
                    name="code"
                    rules={rules.code}
                  >
                    <Input autoFocus />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={L('LimitStudent')}
                    labelCol={formItemLayout.labelCol}
                    wrapperCol={formItemLayout.wrapperCol}
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
                    labelCol={formItemLayout.labelCol}
                    wrapperCol={formItemLayout.wrapperCol}
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
                      showSearch
                      placeholder='Select course'
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                      options={courses.map((course) => ({
                        key: course.id,
                        value: course.id,
                        label: course.courseName,
                      }))}
                    />
                  </Form.Item>
                </Col>
                {modalType === 'create' ? (
                  <Col span={12}>
                    <Form.Item
                      label={L('Room')}
                      labelCol={formItemLayout.labelCol}
                      wrapperCol={formItemLayout.wrapperCol}
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
                    >
                      <Select
                        showSearch
                        placeholder='Select room'
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                        options={rooms.map((room) => ({
                          key: room.id,
                          value: room.id,
                          label: room.roomName,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                ) : (
                  ''
                )}
              </Row>
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Form.Item
                    label={L('CurrentStudent')}
                    labelCol={formItemLayout.labelCol}
                    wrapperCol={formItemLayout.wrapperCol}
                    name="currentStudent"
                    initialValue={0}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={L('LessionTimes')}
                    labelCol={formItemLayout.labelCol}
                    wrapperCol={formItemLayout.wrapperCol}
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
                    labelCol={tailFormItemLayout.labelCol}
                    wrapperCol={tailFormItemLayout.wrapperCol}
                    name="isActive"
                    valuePropName="checked"
                  >
                    <Checkbox>Aktif</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
            <TabPane
              tab="ListWorkSheets"
              key="listWorkSheets"
              forceRender
              disabled={modalType !== 'create'}
            >
              <DynamicFieldSet onUpdateLsWorkSheet={onUpdateLsWorkSheet} />
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateClass;
