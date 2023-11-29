import { Badge, Calendar, Card, Col, Row, Select, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import moment, { Moment } from 'moment';
import { FormInstance } from 'antd/lib/form';
import React from 'react';
import { BadgeProps } from 'antd/lib/badge';
import ScheduleStore from '../../stores/scheduleStore';
import AppComponentBase from '../../components/AppComponentBase';
import { EntityDto } from '../../services/dto/entityDto';
import ClassStore from '../../stores/classStore';
import Stores from '../../stores/storeIdentifier';
import './index.css';
import CreateQr from './components/createQr';
import { Shift, shiftNames } from '../../services/schedule/dto/shift';

export interface IScheduleProps {
  scheduleStore: ScheduleStore;
  classStore: ClassStore;
}

export interface IScheduleState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  filter: string;
  scheduleId: number;
  selectedClassId: number;
  maxResultClassCount: number;
  hashSchedule: any
}

// const { confirm } = Modal;

@inject(Stores.ScheduleStore, Stores.ClassStore)
@observer
class Schedule extends AppComponentBase<IScheduleProps, IScheduleState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    filter: '',
    scheduleId: 0,
    selectedClassId: 0,
    maxResultClassCount: 10,
    hashSchedule: null,
  };

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    const { maxResultClassCount } = this.state;

    await this.props.scheduleStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      keyword: this.state.filter,
      classId: this.state.selectedClassId,
    });

    await this.props.classStore.getAll({
      maxResultCount: maxResultClassCount,
      skipCount: 0,
      keyword: '',
    });

    const totalClassCount = this.props.classStore.classes.totalCount;
    this.setState({ maxResultClassCount: totalClassCount });
  }

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  async createOrUpdateModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      await this.props.scheduleStore.createSchedule();
    } else {
      await this.props.scheduleStore.get(entityDto);
    }

    this.setState({
      selectedClassId: this.props.scheduleStore.editSchedule?.class?.id,
      scheduleId: entityDto.id,
    });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.scheduleStore.editSchedule });
    }, 100);
  }

  handleCreate = () => {
    const form = this.formRef.current;

    form!.validateFields().then(async (values: any) => {
      const updateValues = { ...values };
      if (this.state.scheduleId === 0) {
        await this.props.scheduleStore.create(updateValues);
      } else {
        await this.props.scheduleStore.update({ ...updateValues, id: this.state.scheduleId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleChange = (value: any) => {
    this.setState({ selectedClassId: value });
  };

  handleQrCode = (id: number) => {
    this.hashSchedule(id);
    this.Modal();
  }

  async hashSchedule(id: number) {
    const { scheduleStore } = this.props;
    await scheduleStore.hashSchedule(id);
    
    const result = scheduleStore.hashString
    this.setState({hashSchedule: result});
  };

  public render() {
    const { classStore, scheduleStore } = this.props;
    const classes = classStore.classes?.items || [];
    const schedules = scheduleStore.schedules?.items || [];

    const getListData = (value: Moment) => {
      let listData;

      const matchingSchedule = schedules.find((schedule) =>
        moment(schedule.date.toString().split('T')[0]).isSame(value, 'day')
      );

      if (matchingSchedule) {
        const shiftValue: Shift = Shift[matchingSchedule.shift as unknown as keyof typeof Shift];
        listData = [
          {
            type: 'success',
            content: `${shiftNames[shiftValue]} - 
                      ${matchingSchedule.class.code} - 
                      ${matchingSchedule.class.course.courseName}`,
            id: matchingSchedule.id
          },
        ];
      }

      return listData || [];
    };

    const dateCellRender = (value: Moment) => {
      const listData = getListData(value);
      return (
        <ul className="events">
          {listData.map((item) => (
            <li key={item.content} onClick={() => this.handleQrCode(item.id)}>
              <Tooltip title={item.content}>
                <Badge status={item.type as BadgeProps['status']} text={item.content} />
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
            xs={{ span: 6, offset: 0 }}
            sm={{ span: 6, offset: 0 }}
            md={{ span: 6, offset: 0 }}
            lg={{ span: 4, offset: 0 }}
            xl={{ span: 4, offset: 0 }}
            xxl={{ span: 4, offset: 0 }}
          >
            <Select
              options={classes.map((classroom) => ({
                key: classroom.id,
                value: classroom.id,
                label: classroom.code,
              }))}
              defaultValue="Select Class"
              onChange={this.handleChange}
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
