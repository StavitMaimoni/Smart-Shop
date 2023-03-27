import { CityModel } from "./city-model";
import RoleModel from "./role-model";

export class UserModel {
    public _id: string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;
    public city:CityModel;
    public cityId:string;
    public street: string;
    public role: RoleModel;
    public identityCard: number;
}
