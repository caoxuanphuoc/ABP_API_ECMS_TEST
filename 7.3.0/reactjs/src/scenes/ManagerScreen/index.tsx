import { Card, PageHeader } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import AppComponentBase from '../../components/AppComponentBase';
import ScheduleStore from '../../stores/scheduleStore';
import UserClassStore from '../../stores/userClassStore';
import Stores from '../../stores/storeIdentifier';
import CourseStore from '../../stores/courseStore';
import ListMember from './components/ListMember';
import { L } from '../../lib/abpUtility';

export interface IManagerScreenProps extends RouteComponentProps {
  userClassStore: UserClassStore;
  scheduleStore: ScheduleStore;
  courseStore: CourseStore;
}

export interface IManagerScreenState {
  activeTabKey: string;
}

interface StateType {
  idClass: number;
  courseId: number;
  code: string;
  limitStudent: number;
  currentStudent: number;
  lessionTimes: number;
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

  // async getCourse(
  //   id: any,
  //   code: any,
  //   limitStudent: any,
  //   currentStudent: any,
  //   lessionTimes: any
  // ) {
  //   // const { course } = this.state;
  //   const { courseStore } = this.props;
  //   await courseStore.get(id);

    // const result = courseStore.editCourse;

  //   const updateCourse = {
  //     ...course,
  //     code,
  //     courseName: result.courseName,
  //     courseFee: result.courseFee,
  //     quatity: result.quantity,
  //     limitStudent,
  //     currentStudent,
  //     lessionTimes,
  //   };

  //   this.setState({ course: updateCourse });
  //   console.log(course);
  // }

  public render() {
    console.log(this.props.location.state);
    // const idClass =this.props.location.state.idClass;
    // this.props.location.state.item.idClass;
    const { state } = this.props.location;
    const StateObject = state == null ? null : (state as StateType);
    console.log(StateObject);
    
    
    // if (state && state.courseId) {
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
        content: <ListMember
          userClassStore={this.props.userClassStore}
          ClassId={Number(StateObject?.idClass)}
        />,
      },
      {
        key: 'LichHoc',
        tab: 'Lịch học',
        content: "Lịch Học"
      },
    ];

    const onTabChange = (key: string) => {
      this.setState({
        activeTabKey: key,
      });
    };

    return (
      <>
        <PageHeader
          onBack={() => {
            window.location.href = '/classes';
          }}
          title={L('List Class')}
        />

        <Card
          tabList={tabList}
          // accessKey={this.state.activeTabKey}
          onTabChange={(key) => onTabChange(key)}
        >
          {tabList.map(
            (tab) => tab.key === this.state.activeTabKey && (
              <React.Fragment key={tab.key}>{tab.content}</React.Fragment>
            )

          )}
        </Card></>
    );
  }
}

export default ManagerScreen;
