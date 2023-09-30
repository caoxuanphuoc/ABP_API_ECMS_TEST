import { FormInstance } from 'antd/lib/form';
import React from 'react';
import { Modal, Form, Select, DatePicker, Input, Checkbox } from 'antd';
import CourseStore from '../../../stores/courseStore';
import { L } from '../../../lib/abpUtility';
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
  showCourseDetail: boolean;
  courseFee: number;
  quantity: number;
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
      showCourseDetail: false,
      courseFee: 0,
      quantity: 0,
    };
  }

  async componentDidMount() {
    this.getAll();
  }

  async getAll() {
    const { courseStore } = this.props;
    const { maxResultCount } = this.state;
    await courseStore.getAll({
      maxResultCount,
      skipCount: 0,
      keyword: '',
    });

    const { totalCount } = courseStore.courses;
    this.setState({ maxResultCount: totalCount });
  }

  validValue = (rule: any, value: any) => {
    if (value === 'Select Course') {
      return Promise.reject('Please select value for Course');
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

    const { type, showCourseDetail, courseFee, quantity } = this.state;

    const handleChangeValue = (value: any) => {
      if (value === 'Select Course') {
        this.setState({ showCourseDetail: false });
      } else {
        const selectedCourse = courses.find((course) => course.id === value);
        this.setState({
          showCourseDetail: true,
          courseFee: selectedCourse?.courseFee || 0,
          quantity: selectedCourse?.quantity || 0,
        });
      }
    };

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
          <Form.Item label={L('Code')} {...formItemLayout} name="code" rules={rules.code}>
            <Input />
          </Form.Item>
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
                validator: this.validValue,
              },
            ]}
          >
            <Select
              style={{ width: 350 }}
              onChange={handleChangeValue}
              options={courses.map((course) => ({
                key: course.id,
                value: course.id,
                label: course.courseName,
              }))}
            />
          </Form.Item>
          {showCourseDetail ? (
            <>
              <Form.Item label={L('CourseFee')} {...formItemLayout}>
                <Input value={courseFee} disabled />
              </Form.Item>
              <Form.Item label={L('Quantity')} {...formItemLayout}>
                <Input value={quantity} disabled />
              </Form.Item>
            </>
          ) : (
            ''
          )}
          <Form.Item
            label={L('StartDate')}
            {...formItemLayout}
            name="startDate"
            rules={[
              {
                required: true,
                message: 'Please select a start date',
              },
              {
                validator: (rule, value) => {
                  if (!value || !value.isValid || !value.isValid()) {
                    return Promise.reject('Please select a valid end time');
                  }
                  return Promise.resolve();
                },
              },
            ]}
            valuePropName={type}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label={L('EndDate')}
            {...formItemLayout}
            name="endDate"
            rules={[
              {
                required: true,
                message: 'Please select a end date',
              },
              {
                validator: (rule, value) => {
                  if (!value || !value.isValid || !value.isValid()) {
                    return Promise.reject('Please select a valid end time');
                  }
                  return Promise.resolve();
                },
              },
            ]}
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
            name="isActive"
            valuePropName="checked"
          >
            <Checkbox>Aktif</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateClass;
