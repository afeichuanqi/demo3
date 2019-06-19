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
    View,
    FlatList,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation';
import NavigationBar from '../common/NavigationBar';
import {connect} from 'react-redux';
import actions from '../action';
import PopullarItem from '../common/PopullarItem';
import Toast from 'react-native-easy-toast';
import navigatorUtil from '../navigator/NavigationUtils';
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import favoriteDao from '../expand/dao/FavoriteDAO';
import FavoriteUtil from "../util/FavoriteUtil";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnalyticsUtil from '../util/AnalyticsUtil'
type Props = {};
const URL = "http://api.github.com/search/repositories?q=";
const QUERY_STR = '&sort=stars';
const favoriteDAO = new favoriteDao(FLAG_STORAGE.flag_popular);

class PopularPage extends Component<Props> {
    constructor(props) {
        super(props);
        const {onLoadLanguage} = this.props;
        onLoadLanguage(FLAG_LANGUAGE.flag_key);
    }

    _TopTabNav() {

        let Tabs = {};
        const {keys, theme} = this.props;

        keys.forEach((item, index) => {
            //console.log(item.name);
            if (item.checked) {
                Tabs[`TopTab${index}`] = {
                    screen: props => (
                        <TopTabConnect theme={theme} {...props} storeName={item.name}></TopTabConnect>
                    ),
                    navigationOptions: {
                        title: `${item.name}`
                    }
                }
            }

        });

        return Tabs;
    }

    renderRightButton() {
        const {theme} = this.props;
        return <TouchableOpacity
            onPress={() => {
                navigatorUtil.goPage({theme}, 'SearchPage')
            }}
        >
            <View style={{padding: 5, marginRight: 8}}>
                <Ionicons
                    name={'ios-search'}
                    size={24}
                    style={{
                        marginRight: 8,
                        alignSelf: 'center',
                        color: 'white',
                    }}
                />
            </View>
        </TouchableOpacity>
    }

    render() {
        const {keys, theme} = this.props;
        const Tabs = this._TopTabNav();
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
        }
        let navigationBar = <NavigationBar
            title={'最热'}
            statusBar={statusBar}
            style={{backgroundColor: theme.themeColor}}
            rightButton={this.renderRightButton()}

        />
        const TopTabNav = keys.length ? createMaterialTopTabNavigator(Tabs, {
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
            lazy: true
        }) : null;
        return (
            <View style={{flex: 1}}>
                {navigationBar}

                {TopTabNav ? <TopTabNav></TopTabNav> : null}
            </View>
        );
    }
}

const mapPopularStateToProps = state => {
    return (
        {
            theme: state.theme.theme,
            keys: state.language.keys,
        }
    )
}
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),

})
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage);
const pageSize = 10;//设为常量,防止修改
class TopTab extends Component {
    constructor(props) {
        super(props);
        this.storeName = props.storeName;
        this.isFavoriteChanged = false;

    }

    componentDidMount(): void {
        this.loadData();
        EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
            this.isFavoriteChanged = true;
        });
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
            if (data.to === 0 && this.isFavoriteChanged) {
                this.loadData(null, true);
            }
        })
    }

    componentWillUnmount(): void {
        EventBus.getInstance().removeListener(this.favoriteChangeListener);
        EventBus.getInstance().removeListener(this.bottomTabSelectListener);
    }

    loadData(loadMore, refreshFavorite) {
        const {onLoadingPopul, onLoadMorePopular, onFlushPopularFavorite} = this.props;
        const store = this._store();
        const url = this.getUrl(this.storeName);
        if (loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDAO, () => {
                this.refs.toast.show('没有更多数据了');
                return;
            });

        } else if (refreshFavorite) {
            onFlushPopularFavorite(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDAO);
            this.isFavoriteChanged = false;
        } else {
            onLoadingPopul(this.storeName, url, pageSize, favoriteDAO);
        }

    }

    /**
     * 获取与当前页面有关的数据
     * */
    _store() {
        const {popul} = this.props;
        let store = popul[this.storeName];
        //console.log(store);

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

    getUrl(key) {
        return URL + key + QUERY_STR;
    }

    renderItem(data) {
        const item = data.item;
        const {theme} = this.props;
        return (
            <PopullarItem
                projectModel={item}
                theme={theme}
                onSelect={(callback) => {
                    AnalyticsUtil.onPageStart("DetailPage");
                    navigatorUtil.goPage({
                        theme,
                        projectModel: item,
                        flag: FLAG_STORAGE.flag_popular,
                        callback,
                    }, 'DetailPage')
                }}
                onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDAO, item, isFavorite, FLAG_STORAGE.flag_popular)}
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

    render() {
        let store = this._store();
        const {theme} = this.props;
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + item.item.id}
                    refreshControl={
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
                        console.log('---onEndReached----');

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
                        console.log('---onMomentumScrollBegin-----')
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
    return (
        {
            popul: state.popul
        }
    )
}
const mapDispatchToProps = dispatch => ({
    onFlushPopularFavorite: (storeName, pageIndex, pageSize, dataArray, favoriteDAO) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, dataArray, favoriteDAO)),
    onLoadingPopul: (storeName, url, pageSize, favoriteDAO) => dispatch(actions.onLoadingPopul(storeName, url, pageSize, favoriteDAO)),
    onLoadMorePopular: (storeName, pageIndex, pageSize, dataArray, favoriteDAO, callback) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, dataArray, favoriteDAO, callback)),


})
const TopTabConnect = connect(mapStateToProps, mapDispatchToProps)(TopTab);


