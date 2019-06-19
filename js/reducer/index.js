import {combineReducers} from "redux";
import theme from './theme';
import popul from './popul'
import trending from './trending';
import favorite from './favorite';
import language from './language';
import search from './search';
import {rootCom,RootNavigator} from "../navigator/AppNavigators";
//1.指定默认state
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));
/**
 * 创建自己的navigation reducer
 */
const navReducer = (state = navState,action)=>{
    const nextState = RootNavigator.router.getStateForAction(action,state);
    return nextState|| state;
}
/**
 * 3.合并reducer
 *
 * */
const index  = combineReducers({
    nav:navReducer,
    theme,
    popul,
    trending,
    favorite,
    language,
    search,
})
export default index;