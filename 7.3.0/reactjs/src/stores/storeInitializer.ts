import RoleStore from './roleStore';
import TenantStore from './tenantStore';
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import AccountStore from './accountStore';
import CourseStore from './courseStore';
import ClassStore from './classStore';
import ScheduleStore from './scheduleStore';
import TeacherStore from './teacherStore';
import UserClassStore from './userClassStore';
import RoomStore from './roomStore';
import ClassTimelineStore from './classTimelineStore';

export default function initializeStores() {
  return {
    authenticationStore: new AuthenticationStore(),
    roleStore: new RoleStore(),
    tenantStore: new TenantStore(),
    userStore: new UserStore(),
    sessionStore: new SessionStore(),
    accountStore: new AccountStore(),
    courseStore: new CourseStore(),
    classStore: new ClassStore(),
    scheduleStore: new ScheduleStore(),
    teacherStore: new TeacherStore(),
    userClassStore: new UserClassStore(),
    roomStore: new RoomStore(),
    classTimelineStore: new ClassTimelineStore(),
  };
}
