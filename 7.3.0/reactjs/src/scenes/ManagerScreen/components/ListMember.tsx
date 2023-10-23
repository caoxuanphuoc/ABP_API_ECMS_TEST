import React from 'react';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import UserClassStore from '../../../stores/userClassStore';
import { Avatar, List } from 'antd';

export interface IListMemberProps {
    userClassStore: UserClassStore;
    ClassId: number
}
export interface InfoClassState {
    ClassId2: number;
}
@inject(Stores.UserClassStore)
@observer
class ListMember extends React.Component<IListMemberProps, InfoClassState>{

    constructor(props: Readonly<IListMemberProps>) {
        super(props); // Gọi constructor của lớp cha (React.Component)

    }
    async componentDidMount() {
        await this.getMember(this.props.ClassId);
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

        const { userClasses } = this.props.userClassStore
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
            
            <List
                itemLayout="horizontal"
                dataSource={listTeacher}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                           avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                            title={<a href="https://ant.design">{item.name}</a>}
                            description={ <span style={{color: "black"}}> Đã tham gia lớp: {item.class} </span>}
                        />
                    </List.Item>
                )}
            />
            <br/>
            <h2>Student</h2>
            <List
                itemLayout="horizontal"
                dataSource={listStudent}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                           avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                            title={<a href="https://ant.design">{item.name}</a>}
                            description={ <span style={{color: "black"}}> Đã tham gia lớp: {item.class} </span>}
                        />
                    </List.Item>
                )}
            />
        </div>
        );
    }
}
export default ListMember;


