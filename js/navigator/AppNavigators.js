import {createStackNavigator,
        createSwitchNavigator
    } from 'react-navigation';
import WelcomePage from '../page/Welcome';
import HomePage from '../page/Homepage';
import DetailPage from '../page/DetailPage';
import FetchDemoPage from "../page/FetchDemoPage";
import DynamicTabNavigator from "./DynamicTabNavigator";
import WebViewPage from "../page/WebViewPage";
import AboutPage from '../page/about/AboutPage';
import AboutMePage from '../page/about/AboutMePage';
import CustomKeyPage from '../page/CustomKeyPage';
import SortKeyPage from '../page/SortKeyPage';
import SearchPage from '../page/SearchPage';
import {createReactNavigationReduxMiddleware, createReduxContainer} from "react-navigation-redux-helpers";
export const rootCom="Init";//设置根路由
import {connect} from 'react-redux';
const InitNavigator = createStackNavigator({
    Welcome:{
        screen:WelcomePage,
        navigationOptions:{
            header:null,
        }
    }
});
const MainNavigator = createStackNavigator({
    HomePage:{
        screen:HomePage,
        navigationOptions: {
            header:null,
        }
    },
    DetailPage:{
        screen:DetailPage,
        navigationOptions:{
            header:null,
        }
    },
    DynamicTabNavigator:{
        screen:DynamicTabNavigator,
        navigationOptions:{

        }
    },
    FetchDemoPage:{
        screen:FetchDemoPage,
        navigationOptions:{

        }
    },
    WebViewPage:{
        screen:WebViewPage,
        navigationOptions:{
            header:null,
        }
    },
    AboutPage:{
        screen:AboutPage,
        navigationOptions:{
            header:null,
        }
    },
    AboutMePage:{
        screen:AboutMePage,
        navigationOptions:{
            header:null,
        }
    },
    CustomKeyPage:{
        screen:CustomKeyPage,
        navigationOptions:{
            header:null
        }
    },
    SortKeyPage:{
        screen:SortKeyPage,
        navigationOptions:{
            header:null
        }
    },
    SearchPage:{
        screen:SearchPage,
        navigationOptions:{
            header:null
        }
    }})
export const RootNavigator = createSwitchNavigator({
    Init:InitNavigator,
    Main:MainNavigator,
},{
    navigationOptions:{
        header:null,
    }
});
/**
 * 1。初始化react-
 navigation与redux的中间件
 该方法的一个很大的作用就是为了reduxifyNavigator的key设置actionSubscribers(行为订阅者)

 */
export const middleware = createReactNavigationReduxMiddleware(
    state=>state.nav,
    'root',
)
/**
 * 2。将根导航器组件传递给reduxifyNavigator函数，
 * 并返回一个将
 navigation'state和dispatch函数作为props的新组件
 注意：要在createNavigationReduxMiddleware之后执行
 */
const AppWithNavigationState = createReduxContainer(RootNavigator,'root');
/**
 * 3.State到Props的映射关系
 */
const mapStateToProps = state =>({
    state:state.nav,//V2
});
/**
 * 4.连接React组件与redux Store
 *
 * */
export default connect(mapStateToProps)(AppWithNavigationState);