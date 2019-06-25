/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {createBottomTabNavigator} from 'react-navigation';
type Props = {};
import PopularPage from "../page/PopularPage";
import MIcon from 'react-native-vector-icons/MaterialIcons';
import TrendingPage from "../page/TrendingPage";
import FavoritePage from "../page/FavoritePage";
import MyPage from "../page/MyPage";
import Ionicos from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes'
import {BottomTabBar} from 'react-navigation-tabs';
import {connect} from 'react-redux';
import {View,Text} from 'react-native';
const TABS = {
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: "最热",
            tabBarIcon: ({tintColor, focused}) => (
                <MIcon
                    name={'whatshot'}
                    size={26}
                    style={{color: tintColor}}
                />
            )

        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {

            tabBarLabel: "趋势",
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicos
                    name={'md-trending-up'}
                    size={26}
                    style={{color: tintColor}}
                />
            )

        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: "收藏",
            tabBarIcon: ({tintColor, focused}) => (
                <MIcon
                    name={'favorite'}
                    size={26}
                    style={{color: tintColor}}
                />
            )

        }
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: "我的",
            tabBarIcon: ({tintColor, focused}) => (
                <Entypo
                    name={'user'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    }
};

class DynamicTabNavigator extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        // console.log('props:', props);
    }

    _tabNavigator() {
        if (this.Tabs) {
            return this.Tabs;
        }
        const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
        const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage};//根据需要定制显示的tab
        PopularPage.navigationOptions.tabBarLabel = '最新';//动态配置Tab属性
        return this.Tabs = createBottomTabNavigator(tabs, {
            tabBarComponent: props => {
                return <TabBarcompnent {...props} theme={this.props.theme}/>
            }
        });
    }

    render() {
        const Tab = this._tabNavigator();
        return (
            <Tab
                onNavigationStateChange={(prevState,nextState,action)=>{
                    EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select,{
                        from:prevState.index,
                        to:nextState.index,
                    })
                }}
            ></Tab>
        );
    }
}

class TabBarcompnent extends Component {
    render() {
        return (
            <View>

                <BottomTabBar
                    {...this.props}
                    activeTintColor={this.props.theme.themeColor}
                ></BottomTabBar>

            </View>

        )

    }
}

const mapStateToProps = state => {
    // console.log('state', state);
    return {
        theme: state.theme.theme,
    }
}
export default connect(mapStateToProps)(DynamicTabNavigator);