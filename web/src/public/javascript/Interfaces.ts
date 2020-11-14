/**
 * 状态数据类型管理
 */
export interface validLoginParams {
	phone: string
	token: string
}
export interface roleType {
	roleId: string
	roleName: string
}
export interface UserInfo {
    id: string;
    userName: string;
    phone: string;
    email: string;
    roleList: Array<roleType>
}
export interface GlobalRouter {
    url: string;
    params: object;
    go: string;
    replace: boolean;
}
export interface State {
    userInfo: UserInfo;
    token: string;
    globalRouter: GlobalRouter;
}