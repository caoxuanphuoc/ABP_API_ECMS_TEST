import React from 'react';
import { Avatar, List } from 'antd';
import UserClassStore from '../../../stores/userClassStore';

export interface IListMemberProps {
  userClassStore: UserClassStore;
  ClassId: number;
}
export interface InfoClassState {
  ClassId2: number;
}
// @inject(Stores.UserClassStore)
// @observer
class ListMember extends React.Component<IListMemberProps, InfoClassState> {
  constructor(props: Readonly<IListMemberProps>) {
    super(props); // Gọi constructor của lớp cha (React.Component)
    this.setState({
      ClassId2: 0,
    });
  }

  async componentDidMount() {
    const { ClassId } = this.props;
    await this.getMember(ClassId);
  }

  async getMember(idClass: number) {
    const { userClassStore } = this.props;
    console.log(userClassStore);

    await userClassStore.getAll({
      ClassId: this.props.ClassId,
      maxResultCount: 999999,
      skipCount: 0,
    });
  }

  public render() {
    const { userClassStore } = this.props;
    const { userClasses } = userClassStore;
    const listTeacher = userClasses
      ? userClasses.items
          .filter((e) => e.roleMember === 'Teacher')
          .map((e) => ({
            name: e.user.fullName,
            class: e.class.code,
          }))
      : [];
    const listStudent = userClasses
      ? userClasses.items
          .filter((e) => e.roleMember === 'Student')
          .map((e) => ({
            name: e.user.fullName,
            class: e.class.code,
          }))
      : [];
    return (
      <div>
        <h2>Teacher</h2>
        {/* https://xsgames.co/randomusers/assets/avatars/pixel/${index}.jpg chỉ có tối đa 54 ảnh bao gồm ảnh có giá trị index = 0 */}
        <List
          itemLayout="horizontal"
          dataSource={listTeacher}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />
                }
                title={<a href="https://ant.design">{item.name}</a>}
                description={
                  <span style={{ color: 'black' }}> Đã tham gia lớp: {item.class} </span>
                }
              />
            </List.Item>
          )}
        />
        <br />
        <h2>Student</h2>
        <List
          itemLayout="horizontal"
          dataSource={listStudent}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />
                }
                title={<a href="https://ant.design">{item.name}</a>}
                description={
                  <span style={{ color: 'black' }}> Đã tham gia lớp: {item.class} </span>
                }
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}
export default ListMember;
