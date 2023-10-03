import { Modal, Form, Input, DatePicker, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React from 'react';
import { L } from '../../../lib/abpUtility';
import rules from './createOrUpdateTeacher.validation';
import UserStore from '../../../stores/userStore';

type PickerType = 'date';

export interface ICreateOrUpdateTeacherProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onCreate: () => void;
  formRef: React.RefObject<FormInstance>;
  selectedUserId: number;
  userStore: UserStore;
}

export interface ICreateOrUpdateTeacherState {
  type: PickerType;
  maxResultCount: number;
}

class CreateOrUpdateTeacher extends React.Component<
  ICreateOrUpdateTeacherProps,
  ICreateOrUpdateTeacherState
> {
  constructor(props: Readonly<ICreateOrUpdateTeacherProps>) {
    super(props);
    this.state = {
      type: 'date',
      maxResultCount: 10,
    };
  }

  async componentDidMount() {
    this.getAll();
  }

  async getAll() {
    const { userStore } = this.props;
    const { maxResultCount } = this.state;
    await userStore.getAll({
      maxResultCount,
      skipCount: 0,
      keyword: '',
    });

    const { totalCount } = userStore.users;
    this.setState({ maxResultCount: totalCount });
  }

  validValue = (rule: any, value: any) => {
    if (value === 'Select User') {
      return Promise.reject('Please select value for User');
    }
    return Promise.resolve();
  };

  public render() {
    const {
      visible,
      onCancel,
      onCreate,
      formRef,
      selectedUserId,
      modalType,
      userStore,
    } = this.props;

    const { type } = this.state;

    const users = userStore.users === undefined ? [] : userStore.users.items;

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
    return (
      <Modal
        visible={visible}
        cancelText={L('Cancel')}
        okText={L('OK')}
        onCancel={onCancel}
        onOk={onCreate}
        title="Teacher"
        destroyOnClose
      >
        <Form
          ref={formRef}
          initialValues={{
            userId: modalType === 'create' ? 'Select User' : selectedUserId,
          }}
        >
          <Form.Item
            label={L('User')}
            {...formItemLayout}
            name="userId"
            rules={[
              {
                required: true,
                message: 'Please select a user',
              },
              {
                validator: this.validValue,
              },
            ]}
          >
            <Select
              style={{ width: 350 }}
              //   onChange={handleChangeValue}
              options={users.map((user) => ({
                key: user.id,
                value: user.id,
                label: `${user.surname} ${user.name}`,
              }))}
            />
          </Form.Item>
          <Form.Item
            label={L('SchoolName')}
            {...formItemLayout}
            name="schoolName"
            rules={rules.schoolName}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={L('Certificate')}
            {...formItemLayout}
            name="certificate"
            rules={rules.certificate}
          >
            <Input />
          </Form.Item>
          <Form.Item label={L('wage')} {...formItemLayout} name="wage" rules={rules.wage}>
            <Input suffix="VNĐ" />
          </Form.Item>
          <Form.Item
            label={L('StartTime')}
            {...formItemLayout}
            name="startTime"
            rules={[
              {
                required: true,
                message: 'Please select a start time',
              },
              {
                validator: (rule, value) => {
                  if (!value || !value.isValid || !value.isValid()) {
                    return Promise.reject('Please select a valid start time');
                  }
                  return Promise.resolve();
                },
              },
            ]}
            valuePropName={type}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateTeacher;
