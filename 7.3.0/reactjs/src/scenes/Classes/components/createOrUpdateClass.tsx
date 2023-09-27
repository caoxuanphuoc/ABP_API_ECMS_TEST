import { FormInstance } from 'antd/lib/form';
import React from 'react';
import CourseStore from '../../../stores/courseStore';
import { L } from '../../../lib/abpUtility';
import { Modal, Form, Select, DatePicker, Input, Checkbox } from 'antd';
import rules from './createOrUpdateClass.validateion';

type PickerType = 'date';

export interface ICreateOrUpdateClassProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onCreate: () => void;
  formRef: React.RefObject<FormInstance>;
  courseStore: CourseStore;
  selectedCourseId: number;
}

export interface ICreateOrUpdateClassState {
  maxResultCount: number;
  type: PickerType;
}

class CreateOrUpdateClass extends React.Component<
  ICreateOrUpdateClassProps,
  ICreateOrUpdateClassState
> {
  constructor(props: Readonly<ICreateOrUpdateClassProps>) {
    super(props);
    this.state = {
      maxResultCount: 10,
      type: 'date',
    };
  }

  async componentDidMount() {
    this.getAll();
  }

  async getAll() {
    const { courseStore } = this.props;
    await courseStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: 0,
      keyword: '',
    });

    const totalCount = courseStore.courses.totalCount;
    this.setState({ maxResultCount: totalCount });
  }

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
        xs: { span: 18 },
        sm: { span: 18 },
        md: { span: 18 },
        lg: { span: 18 },
        xl: { span: 18 },
        xxl: { span: 18 },
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
        xs: { span: 18 },
        sm: { span: 18 },
        md: { span: 18 },
        lg: { span: 18 },
        xl: { span: 18 },
        xxl: { span: 18 },
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
    } = this.props;
    const courses = courseStore.courses === undefined ? [] : courseStore.courses.items;

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
      >
        <Form
          ref={formRef}
          initialValues={{
            courseId: modalType === 'create' ? 'Select Course' : selectedCourseId,
          }}
        >
          <Form.Item label={L('Course')} {...formItemLayout} name="courseId" rules={rules.course}>
            <Select
              style={{ width: 350 }}
              //   onChange={handleChangeTeamValue} // Không gọi hàm ngay lúc render, chỉ truyền tham chiếu đến hàm
              options={courses.map((course) => ({
                key: course.id,
                value: course.id,
                label: course.courseName,
              }))}
            />
          </Form.Item>
          <Form.Item
            label={L('StartDate')}
            {...formItemLayout}
            name="startDate"
            rules={rules.startDate}
            valuePropName={type}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label={L('EndDate')}
            {...formItemLayout}
            name="endDate"
            rules={rules.endDate}
            valuePropName={type}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label={L('LimitStudent')}
            {...formItemLayout}
            name="limitStudent"
            rules={rules.limitStudent}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={L('CurrentStudent')}
            {...formItemLayout}
            name="currentStudent"
            initialValue={0}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={L('LessionTimes')}
            {...formItemLayout}
            name="lessionTimes"
            initialValue={0}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={L('IsActive')}
            {...tailFormItemLayout}
            name={'isActive'}
            valuePropName={'checked'}
          >
            <Checkbox>Aktif</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateClass;
