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
    const selectedClassId = value === "Select Class" ? 0 : value;
    this.setState({ selectedClassId }, async () => {
      // Call getAll after the state is updated
      await this.getAll();
    });
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

      const matchingSchedules = schedules.filter((schedule) =>
        moment(schedule.date.toString().split('T')[0]).isSame(value, 'day')
      );

      if (matchingSchedules.length > 0) {
        listData = matchingSchedules.map((matchingSchedule) => {
          const shiftValue: Shift = Shift[matchingSchedule.shift as unknown as keyof typeof Shift];
          return {
            type: 'success',
            content: `${shiftNames[shiftValue]} - 
                      ${matchingSchedule.class.code} - 
                      ${matchingSchedule.class.course.courseName}`,
            id: matchingSchedule.id
          };
        });
      }
    
      return listData || [];
    };

    const dateCellRender = (value: Moment) => {
      const listData = getListData(value);
      const hasEvents = listData.length > 0
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
            xs={{ span: 6, offset: 0 }}
            sm={{ span: 6, offset: 0 }}
            md={{ span: 6, offset: 0 }}
            lg={{ span: 4, offset: 0 }}
            xl={{ span: 4, offset: 0 }}
            xxl={{ span: 4, offset: 0 }}
          >
            <Select
              options={[
                { key: 0, value: 0, label: "Select Class" },
                ...classes.map((classroom) => ({
                  key: classroom.id,
                  value: classroom.id,
                  label: classroom.code,
                })),
              ]}
              defaultValue={0} // Set the initial default value to 0
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
