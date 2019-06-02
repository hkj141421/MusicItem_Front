import { comment } from './comment';

export class commentDetail{
    public comment:comment=new comment(); //评论信息
    public replys:Array<comment>=[]; //回复评论的信息
    public replyInput:any; //绑定回复框的值
    public replyVisible:boolean=false; //回复列表是否可见

}