/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    RefreshControl,
    DeviceEventEmitter, InteractionManager,
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation';
import NavigationBar from '../common/NavigationBar';
import {connect} from 'react-redux';
import actions from '../action';
import Toast from 'react-native-easy-toast';
import TrendingItem from '../common/TrendingItem';
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import navigatorUtil from '../navigator/NavigationUtils';
import FavoriteUtil from "../util/FavoriteUtil";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import favoriteDao from '../expand/dao/FavoriteDAO';
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import ArrayUtil from "../util/ArrayUtil";

type Props = {};
const favoriteDAO = new favoriteDao(FLAG_STORAGE.flag_trending);
const URL = "https://github.com/trending/";
const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";
class TrendingPage extends Component<Props> {
    constructor(props) {
        super(props);
        const {onLoadLanguage} = this.props;
        onLoadLanguage(FLAG_LANGUAGE.flag_langage);
        this.state = {
            timeSpan: TimeSpans[0],
        };
        this.preKeys=[];

    }

    _TopTabNav() {
        const {theme} =this.props;
        let Tabs = {};
        const {languages} = this.props;
        this.preKeys = languages;
        languages.forEach((item, index) => {

            if(item.checked){
               // console.log(item.path);
                Tabs[`TopTab${index}`] = {
                    screen: props => (
                        <TopTabConnect theme={theme} {...props} timeSpan={this.state.timeSpan} storeName={item.path}></TopTabConnect>
                    ),
                    navigationOptions: {
                        title: `${item.name}`
                    }
                }
            }
        });
        return Tabs;
    }

    _tabNav() {
        const {theme} =this.props;
        if (!this.tabNav || !ArrayUtil.isEqual(this.preKeys,this.props.languages) || this.themeColor !==theme.themeColor) {
            this.themeColor = theme.themeColor;
            this.tabNav = createMaterialTopTabNavigator(this._TopTabNav(), {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false,//是否标签大写,默认为true,
                    scrollEnabled: true,//是否支持选项卡滚动，默认为false
                    style: {
                        backgroundColor: theme.themeColor,//TABBAR的背景颜色
                        height: 30,
                    },
                    indicatorStyle: styles.indicatorStyle,//标签指示器的样式,
                    labelStyle: styles.labelStyle,
                },
                lazy:true,
            });
        }
        return this.tabNav;


    }

    renderTitleView() {
        return <View>
            <TouchableOpacity
                ref={'button'}
                underlayColor={'transparent'}
                onPress={() => this.dialog.show()}
            >
                <View
                    style={{flexDirection: 'row', alignItems: 'center'}}
                >
                    <Text style={{
                        fontSize: 18,
                        color: '#FFFFFF',
                        fontWeight: '400'
                    }}
                    >趋势 {this.state.timeSpan.showText}</Text>
                    <MaterialIcons
                        name={'arrow-drop-down'}
                        size={22}
                        style={{color: 'white'}}
                    ></MaterialIcons>
                </View>
            </TouchableOpacity>
        </View>;
    }

    render() {
        const {languages,theme} = this.props;
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
        }
        let navigationBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={{backgroundColor: theme.themeColor}}
        />
        const TopTabNav = languages.length?this._tabNav():null;
        return (
            <View style={{flex: 1}}>
                {navigationBar}
                {TopTabNav?<TopTabNav/>:null}

                {this.renderTrendingDialog()}
            </View>
        );
    }

    renderTrendingDialog() {
        return <TrendingDialog
            ref={dialog => this.dialog = dialog}
            onSelect={tab => this.onSelectTimeSpan(tab)}
        />
    }

    onSelectTimeSpan(tab) {
        this.dialog.dismiss();
        this.setState({
            timeSpan: tab
        })

        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);

    }


}

const mapTrendingStateToProps = state => {
    return (
        {
            languages: state.language.languages,
            theme:state.theme.theme,
        }
    )
}
const mapTrendingDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),

})
export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage);
const pageSize = 10;//设为常量,防止修改
class TopTab extends Component {
    constructor(props) {
        super(props);
        this.storeName = props.storeName;
        this.timeSpan = props.timeSpan;
    }

    componentDidMount(): void {
        InteractionManager.runAfterInteractions(()=>{
            this.loadData();
            this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
                this.timeSpan = timeSpan;
                this.loadData();
            });
            EventBus.getInstance().addListener(EventTypes.favorite_changed_trending, this.favoriteChangeListener = () => {
                this.isFavoriteChanged = true;
            });
            EventBus.getInstance().addListener(EventTypes.bottom_tab_select, (data) => {
                if (data.to === 1 && this.isFavoriteChanged) {
                    this.loadData(null, true);
                }
            });
        })



    }

    componentWillUnmount(): void {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove();
        }
    }

    loadData(loadMore, refreshFavorite) {
        const {onLoadingTrending, onLoadMoreTrending, onFlushTrendingFavorite} = this.props;
        const store = this._store();
        const url = this.getUrl(this.storeName);

        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDAO, () => {
                this.refs.toast.show('没有更多数据了');
            });
        } else if (refreshFavorite) {
            onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDAO);
            this.isFavoriteChanged = false;
        } else {
            onLoadingTrending(this.storeName, url, pageSize, favoriteDAO);
        }

    }


    getUrl(key) {
        return URL + key + "?" + this.timeSpan.searchText;
    }

    renderItem(data) {
        const {theme} =this.props;
        const item = data.item;
        //console.log("123",item);
        return (
            <TrendingItem
                theme={theme}
                projectModel={item}
                onSelect={(callback) => {
                    navigatorUtil.goPage({
                        theme,
                        projectModel: item,
                        flag: FLAG_STORAGE.flag_trending,
                        callback,
                    }, 'DetailPage')

                }}
                onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDAO, item, isFavorite, FLAG_STORAGE.flag_trending)}
            />
        )
    }

    genIndIcator() {
        return this._store().hideLoadingMore ? null :
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多</Text>
            </View>
    }

    /**
     * 获取与当前页面有关的数据
     * */
    _store() {
        const {trending} = this.props;
        let store = trending[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],//要显示的数据
                hideLoadingMore: true,//默认隐藏加载更多
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
                    keyExtractor={item => "" + (item.item.id || item.item.fullName)}
                    refreshControl={//下拉刷新
                        <RefreshControl
                            title={'Loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={theme.themeColor}
                        />
                    }
                    ListFooterComponent={() => this.genIndIcator()}

                    onEndReached={() => {
                        //console.log('---onEndReached----');
                        setTimeout(() => {
                            if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                                this.loadData(true);
                                this.canLoadMore = false;
                            }
                        }, 100);
                    }}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
                        //console.log('---onMomentumScrollBegin-----')
                    }}
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
        margin: 0,

    },
    tabStyle: {
        padding: 0,
    }
});
const mapStateToProps = state => {
    //console.log('popul', state.popul);
    return (
        {
            trending: state.trending
        }
    )
}
const mapDispatchToProps = dispatch => ({
    onLoadingTrending: (storeName, url, pageSize, favoriteDAO) => dispatch(actions.onLoadingTrending(storeName, url, pageSize, favoriteDAO)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, dataArray, favoriteDAO, callback) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray, favoriteDAO, callback)),
    onFlushTrendingFavorite: (storeName, pageIndex, pageSize, dataArray, favoriteDAO) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, dataArray, favoriteDAO)),
})
const TopTabConnect = connect(mapStateToProps, mapDispatchToProps)(TopTab);


