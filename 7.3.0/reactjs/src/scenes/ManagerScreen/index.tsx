import { Card } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import AppComponentBase from '../../components/AppComponentBase';
import ScheduleStore from '../../stores/scheduleStore';
import UserClassStore from '../../stores/userClassStore';
import { CourseCreen } from '../Classes/components/Courses/courseScreen';
import Stores from '../../stores/storeIdentifier';
import CourseStore from '../../stores/courseStore';
import { EntityDto } from '../../services/dto/entityDto';

export interface IManagerScreenProps extends RouteComponentProps {
  userClassStore: UserClassStore;
  scheduleStore: ScheduleStore;
  courseStore: CourseStore;
}

export interface IManagerScreenState {
  activeTabKey: string;
  course: CourseCreen;
}

@inject(Stores.UserClassStore, Stores.ScheduleStore, Stores.CourseStore)
@observer
class ManagerScreen extends AppComponentBase<IManagerScreenProps, IManagerScreenState> {
  state = {
    activeTabKey: 'BangTin',
    course: {
      code: '',
      courseName: '',
      courseFee: 0,
      quantity: 0,
      limitStudent: 0,
      currentStudent: 0,
      lessionTimes: 0,
    },
  };

  async getCourse(
    id: EntityDto,
    code: any,
    limitStudent: any,
    currentStudent: any,
    lessionTimes: any
  ) {
    const { course } = this.state;
    const { courseStore } = this.props;
    await courseStore.get(id);

    const result = courseStore.editCourse;

    const updateCourse = {
      ...course,
      code,
      courseName: result.courseName,
      courseFee: result.courseFee,
      quatity: result.quantity,
      limitStudent,
      currentStudent,
      lessionTimes,
    };

    this.setState({ course: updateCourse });
    console.log(course);
  }

  public render() {
    const { state } = this.props.location;
     console.log(state)
    // if (state && state.courseId.) {
    //   this.getCourse(
    //     { id: state.courseId },
    //     state.code,
    //     state.limitStudent,
    //     state.currentStudent,
    //     state.lessionTimes
    //   );
    // }

    const tabList = [
      {
        key: 'BangTin',
        tab: 'Bảng Tin',
        content: 'Bảng tin content',
      },
      {
        key: 'BaiTap',
        tab: 'Bài tập trên lớp',
        content: 'Bài tập trên lớp content',
      },
      {
        key: 'MoiNguoi',
        tab: 'Mọi người',
        content: 'Mọi người content',
      },
      {
        key: 'LichHoc',
        tab: 'Lịch học',
        content: 'Lịch học calendar',
      },
    ];

    const onTabChange = (key: string) => {
      this.setState({
        activeTabKey: key,
      });
    };

    return (
      <Card
        tabList={tabList}
        accessKey={this.state.activeTabKey}
        onTabChange={(key) => onTabChange(key)}
      >
        {tabList.map(
          (tab) =>
            tab.key === this.state.activeTabKey && (
              <React.Fragment key={tab.key}>{tab.content}</React.Fragment>
            )
        )}
      </Card>
    );
  }
}

export default ManagerScreen;
