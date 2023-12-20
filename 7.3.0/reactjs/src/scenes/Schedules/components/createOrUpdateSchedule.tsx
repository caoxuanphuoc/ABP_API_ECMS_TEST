import { Modal, Tabs, Form, Row, Col, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React from 'react';
import ClassStore from '../../../stores/classStore';
import RoomStore from '../../../stores/roomStore';
import { L } from '../../../lib/abpUtility';
import { WorkShiftDto } from '../../../services/schedule/dto/workShiftDto';
import DynamicFieldSet from './lsWorkSheet';

const { TabPane } = Tabs;
export interface ICreateOrUpdateScheduleProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onCreate: () => void;
  formRef: React.RefObject<FormInstance>;
  classStore: ClassStore;
  roomStore: RoomStore;
  selectedClassId: number;
  selectedRoomId: number;
  onUpdateLsWorkSheet: (newLsWorkSheet: WorkShiftDto[]) => void;
}

export interface ICreateOrUpdateScheduleState {
  maxResultClassCount: number;
  maxResultRoomCount: number;
}

class CreateOrUpdateSchedule extends React.Component<
  ICreateOrUpdateScheduleProps,
  ICreateOrUpdateScheduleState
> {
  constructor(props: Readonly<ICreateOrUpdateScheduleProps>) {
    super(props);
    this.state = {
      maxResultClassCount: 10,
      maxResultRoomCount: 10,
    };
  }

  async componentDidMount(): Promise<void> {
    await this.getAll();
  }

  async componentDidUpdate(
    _prevProps: Readonly<ICreateOrUpdateScheduleProps>,
    prevState: { maxResultClassCount: number; maxResultRoomCount: number }
  ): Promise<void> {
    const { maxResultClassCount, maxResultRoomCount } = this.state;
    if (
      prevState.maxResultClassCount !== maxResultClassCount ||
      prevState.maxResultRoomCount !== maxResultRoomCount
    )
      {await this.getAll();}
  }

  async getAll(): Promise<void> {
    const { classStore, roomStore } = this.props;
    const { maxResultClassCount, maxResultRoomCount } = this.state;

    await classStore.getAll({
      maxResultCount: maxResultClassCount,
      skipCount: 0,
      keyword: '',
    });

    await roomStore.getAll({
      maxResultCount: maxResultRoomCount,
      skipCount: 0,
      keyword: '',
    });

    const totalClassCount = classStore.classes.totalCount;
    const totalRoomCount = roomStore.rooms.totalCount;

    this.setState({
      maxResultClassCount: totalClassCount,
      maxResultRoomCount: totalRoomCount,
    });
  }

  validClassValue = (rule: any, value: any) => {
    if (value === 'Select Class') {
      return Promise.reject(new Error('Please select value for Class'));
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

    const {
      visible,
      onCancel,
      onCreate,
      modalType,
      formRef,
      classStore,
      roomStore,
      selectedClassId,
      selectedRoomId,
      onUpdateLsWorkSheet
    } = this.props;

    const classes = classStore.classes?.items || [];
    const rooms = roomStore.rooms?.items || [];

    return (
      <Modal
        visible={visible}
        cancelText={L('Cancel')}
        okText={L('OK')}
        onCancel={onCancel}
        onOk={onCreate}
        title="Schedule"
        destroyOnClose
        width={850}
      >
        <Form
          labelAlign="left"
          ref={formRef}
          initialValues={{
            courseId: modalType === 'create' ? 'Select Class' : selectedClassId,
            roomId: modalType === 'create' ? 'Select Room' : selectedRoomId,
          }}
        >
          <Tabs defaultActiveKey="scheduleInfo" size="small" tabBarGutter={64}>
            <TabPane tab="ScheduleInfo" key="scheduleInfo">
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Form.Item
                    label={L('Class')}
                    labelCol={formItemLayout.labelCol}
                    wrapperCol={formItemLayout.wrapperCol}
                    name="classId"
                    rules={[
                      {
                        required: true,
                        message: 'Please select a class',
                      },
                      {
                        validator: this.validClassValue,
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Select class"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                      options={classes.map((classroom) => ({
                        key: classroom.id,
                        value: classroom.id,
                        label: classroom.code,
                      }))}
                    />
                  </Form.Item>
                </Col>
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
                      placeholder="Select room"
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

export default CreateOrUpdateSchedule;
