/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, ActivityIndicator, StyleSheet, Text, View, Button, FlatList, RefreshControl,DeviceInfo} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation';
import NavigationBar from '../common/NavigationBar';
import {connect} from 'react-redux';
import actions from '../action';
import PopullarItem from '../common/PopullarItem';
import Toast from 'react-native-easy-toast';
import {isIphoneX} from '../util/ScreenUtil';
import navigatorUtil from '../navigator/NavigationUtils';
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import favoriteDao from '../expand/dao/FavoriteDAO';
import FavoriteUtil from "../util/FavoriteUtil";
import TrendingItem from "../common/TrendingItem";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
type Props = {};
class FavoritePage extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        const {theme} = this.props;

        let statusBar={
            backgroundColor:theme.themeColor,
            barStyle:'light-content',
        }
        let navigationBar=<NavigationBar
            title={'收藏'}
            statusBar={statusBar}
            style={{backgroundColor:theme.themeColor}}

        />
        const TopTabNav = createMaterialTopTabNavigator({
            'Popular':{
                screen:props=> <TopTabConnect theme={theme} {...props} flag={FLAG_STORAGE.flag_popular}></TopTabConnect>,
                navigationOptions:{
                    title:'最热',
                },
            },
            'Trending':{
                screen:props=> <TopTabConnect theme={theme} {...props} flag={FLAG_STORAGE.flag_trending}></TopTabConnect>,
                navigationOptions: {
                    title:'趋势'
                }
            }
        }, {
            tabBarOptions: {
                tabStyle: styles.tabStyle,
                upperCaseLabel: false,//是否标签大写,默认为true,

                style: {
                    backgroundColor: theme.themeColor,//TABBAR的背景颜色
                    height:30,
                },
                indicatorStyle: styles.indicatorStyle,//标签指示器的样式,
                labelStyle: styles.labelStyle,
            }
        });
        return (
            <View style={{flex: 1}}>
                {navigationBar}
                <TopTabNav></TopTabNav>
            </View>
        );
    }
}
const mapFavoriteStateToProps = state => ({
    theme:state.theme.theme,
})
const mapFavoriteDispatchToProps = dispatch => ({


})
export default connect(mapFavoriteStateToProps, mapFavoriteDispatchToProps)(FavoritePage);
class FavoriteTab extends Component {
    constructor(props) {
        super(props);
        this.storeName = props.flag;
        this.favoriteDAO=new favoriteDao(this.storeName);
    }

    componentDidMount(): void {
        this.loadData();
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select,this.listener=data=>{
            if(data.to===2){
                this.loadData(false);
            }
        })
    }
    componentWillUnmount(): void {
        EventBus.getInstance().removeListener(this.listener);
    }

    loadData(isShowLoading) {
        const {onLoadFavoriteData} =this.props;
        onLoadFavoriteData(this.storeName,isShowLoading);

    }
    onFavorite(item,isFavorite){

        FavoriteUtil.onFavorite(this.favoriteDAO,item,isFavorite,this.storeName);
        if(this.storeName === FLAG_STORAGE.flag_popular){
            EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular)
        }else{
            EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending)
        }
    }

    renderItem(data) {
        const {theme} = this.props;
        //debugger
        const item = data.item;
        const Item = this.storeName === FLAG_STORAGE.flag_popular?PopullarItem:TrendingItem;
        //console.log('1234',item);
        return (
            <Item
                theme={theme}
                projectModel={item}
                onSelect={(callback)=>{
                    navigatorUtil.goPage({
                        theme,
                        projectModel:item,
                        flag:this.storeName,
                        callback,
                    },'DetailPage')
                }}
                onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}
            />
        )
    }
    /**
     * 获取与当前页面有关的数据
     * */
    _store() {
        const {favorite} = this.props;
        let store = favorite[this.storeName];
        //console.log(store);

        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],//要显示的数据
            }
        }
        return store;

    }
    render() {
        const {theme} = this.props;
        let store = this._store();
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + (item.item.id||item.item.fullName)}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(true)}
                            tintColor={theme.themeColor}
                        />
                    }

                />
                <Toast
                    ref={'toast'}
                    position={'center'}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    indicatorContainer: {
        alignItems: "center",

    },
    indicator: {
        color: 'red',
        margin: 10,
    },
    labelStyle: {
        fontSize: 13,
        margin:0,

    },
    tabStyle: {
        padding:0,
    }

});
const mapStateToProps = state => ({
    favorite:state.favorite,


})
const mapDispatchToProps = dispatch => ({
    onLoadFavoriteData: (storeName,isShowLoading)=>dispatch(actions.onLoadFavoriteData(storeName,isShowLoading)),

})
const TopTabConnect = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);


