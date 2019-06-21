import {BackHandler} from 'react-native';
//处理安卓物理返回键
export default class BackPressComponent{
    constructor(props){
        this._hardwareBackPress = this.onHardwareBackPress.bind(this);//让this指向
        this.props=props;//继承父类参数
    }
    componentDidMount() {
        if(this.props.backPress) BackHandler.addEventListener('hardwareBackPress',this._hardwareBackPress);
    }
    componentWillUnmount() {
        if(this.props.backPress) BackHandler.removeEventListener('hardwareBackPress',this._hardwareBackPress)
    }
    onHardwareBackPress(){
        return this.props.backPress();
    }
}