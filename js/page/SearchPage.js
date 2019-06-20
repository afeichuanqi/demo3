/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    FlatList,
    RefreshControl,
    TouchableOpacity, TextInput,
    DeviceInfo
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';
import PopullarItem from '../common/PopullarItem';
import Toast from 'react-native-easy-toast';
import navigatorUtil from '../navigator/NavigationUtils';
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import favoriteDao from '../expand/dao/FavoriteDAO';
import FavoriteUtil from "../util/FavoriteUtil";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import LanguageDao from "../expand/dao/LanguageDao";
import GlobalStyles from "../res/styles/GlobalStyles";
import ViewUtil from "../util/ViewUtil";
import Utils from "../util/Utils";
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';

type Props = {};
const favoriteDAO = new favoriteDao(FLAG_STORAGE.flag_popular);
const pageSize = 10;//设为常量,防止修改
class SearchPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.favoriteDao = new favoriteDao(FLAG_STORAGE.flag_popular);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.isKeyChange = false;
    }

    componentDidMount(): void {
        this.backPress.componentDidMount();
    }

    componentWillUnmount(): void {
        this.backPress.componentWillUnmount();
    }

    loadData(loadMore) {
        const {onLoadMoreSearch, onSearch, search, keys} = this.props;
        if (loadMore) {

            onLoadMoreSearch(++search.pageIndex, pageSize, search.items, this.favoriteDao, () => {
                this.refs.toast.show('没有更多数据了');
                return;
            });
        } else {
            onSearch(this.inputKey, pageSize, this.searchToken = new Date().getTime(), this.favoriteDao, keys, message => {
                this.refs.toast.show(message);
                return;
            });
        }

    }

    onBackPress() {
        const {onSearchCancel, onLoadLanguage} = this.props;
        onSearchCancel();//退出时取消搜索
        this.refs.input.blur();//收起键盘
        navigatorUtil.goBack(this.props.navigation);
        if (this.isKeyChange) {
            onLoadLanguage(FLAG_LANGUAGE.flag_key);//重新加载标签
        }
    }

    renderItem(data) {
        const item = data.item;
        const {theme} = this.params;
        return (
            <PopullarItem
                projectModel={item}
                theme={theme}
                onSelect={(callback) => {
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
        const {search} = this.props;

        return search.hideLoadingMore ? null :
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多</Text>
            </View>
    }

    onRightButtonClick() {
        const {onSearchCancel, search} = this.props;
        if (search.showText === '搜索') {
            this.loadData();
        } else {
            onSearchCancel(this.searchToken);
        }
    }

    renderNavBar() {
        const {theme} = this.params;
        const {showText, inputKey} = this.props.search;
        const placeholder = inputKey || '请输入';
        let backButton = ViewUtil.getLeftBackButton(() => this.onBackPress());
        let inputView = <TextInput
            ref='input'
            placeholder={placeholder}
            onChangeText={text => this.inputKey = text}
            style={styles.textInput}
        >
        </TextInput>;
        let rightButton = <TouchableOpacity
            onPress={() => {
                this.refs.input.blur();
                this.onRightButtonClick();
            }
            }
        >
            <View style={{marginRight: 10}}>
                <Text style={styles.title}>{showText}1</Text>
            </View>
        </TouchableOpacity>;

        return <View style={{
            backgroundColor: theme.themeColor,
            flexDirection: 'row',
            alignItems: 'center',
            height: (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android,
        }}>
            {backButton}
            {inputView}
            {rightButton}
        </View>
    }

    render() {
        const {isLoading, projectModels, showBottomButton, hideLoadingMore} = this.props.search;
        const {theme} = this.params;
        let statusBar = null;
        if (Platform.OS === 'ios') {
            statusBar = <View style={[styles.statusBar, {backgroundColor: this.params.theme.themeColor}]}/>;
        }
        let listView = !isLoading ? <FlatList
            data={projectModels}
            renderItem={data => this.renderItem(data)}
            keyExtractor={item => "" + item.item.id}
            contentInset={
                {
                    bottom: 45
                }
            }
            refreshControl={
                <RefreshControl
                    title={'Loading'}
                    titleColor={theme.themeColor}
                    colors={[theme.themeColor]}
                    refreshing={isLoading}
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
            onEndReachedThreshold={0.2}
            onMomentumScrollBegin={() => {
                this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
                //console.log(this.canLoadMore);
                //this.loadData(true);
                //console.log('---onMomentumScrollBegin-----')
            }}
        /> : null;
        let bottomButton = showBottomButton ?
            <TouchableOpacity
                style={[styles.bottomButton, {backgroundColor: theme.themeColor}]}
                onPress={() => {
                    this.saveKey();
                }}
            >
                <View
                    style={{justifyContent: 'center'}}>
                    <Text style={styles.title}>我收下了</Text>
                </View>
            </TouchableOpacity> : null;
        let indicatorView = isLoading ? <ActivityIndicator
            style={styles.centering}
            size={'large'}
            animating={isLoading}
        /> : null;
        let resultView = <View style={{flex: 1}}>
            {indicatorView}
            {listView}
        </View>;
        return (
            <SafeAreaViewPlus
                topColor={theme.themeColor}
            >
                {statusBar}
                {this.renderNavBar()}
                {resultView}
                {bottomButton}
                <Toast
                    ref={'toast'}
                    position={'center'}
                />
            </SafeAreaViewPlus>
        )
    }

    /**
     * 添加标签
     */
    saveKey() {
        const {keys} = this.props;
        let key = this.inputKey;
        if (Utils.checkKeyIsExist(keys, key)) {
            this.refs.toast.show(key + "已经存在");

        } else {
            key = {
                "path": key,
                "name": key,
                "checked": true,

            };
            keys.unshift(key);//将key添加到数组的开头
            this.languageDao.save(keys);
            this.refs.toast.show(key.name + '保存成功');
            this.isKeyChange = true;
        }
    }
}

const mapStateToProps = state => {
    return (
        {
            search: state.search,
            keys: state.language.keys,


        }
    )
}
const mapDispatchToProps = dispatch => ({
    onSearch: (inputKey, pageSize, token, favoriteDao, popularKeys, callback) => dispatch(actions.onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callback)),
    onSearchCancel: (token) => dispatch(actions.onSearchCancel(token)),
    onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callback) => dispatch(actions.onLoadMoreSearch(pageIndex, pageSize, dataArray, favoriteDao, callback)),
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
})
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusBar: {
        height: 20,
    },
    bottomButton: {
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
        height: 40,
        position: 'absolute',
        left: 10,
        top: GlobalStyles.window_height - 70 + (DeviceInfo.isIPhoneX_deprecated ? 20 : 0),
        right: 10,
        borderRadius: 3,
    },
    centering: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    textInput: {
        flex: 1,
        height: (Platform.OS === 'ios' ? 26 : 36),
        borderWidth: (Platform.OS === 'ios' ? 1 : 0),
        borderColor: 'white',
        alignSelf: 'center',
        paddingLeft: 5,
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 3,
        opacity: 0.7,
        color: 'white',
    },
    title: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
    },
    indicatorContainer: {
        alignItems: "center",

    },

});
