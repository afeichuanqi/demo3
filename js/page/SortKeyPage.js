/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    TouchableHighlight
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import {connect} from 'react-redux';
import actions from '../action';
import navigatorUtil from '../navigator/NavigationUtils';
import BackPressComponent from "../common/BackPressComponent";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import LanguageDao from "../expand/dao/LanguageDao";
import ViewUtil from "../util/ViewUtil";
import ArrayUtil from "../util/ArrayUtil";
import SortableListView from 'react-native-sortable-listview'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
type Props = {};

class SortKeyPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
        this.languageDao = new LanguageDao(this.params.flag);
        this.state = {
            checkedArray: SortKeyPage._keys(this.props)
        }
    }

    componentDidMount() {
        this.backPress.componentDidMount();
        //如果props中标签为空则从本地存储中获取标签
        if (SortKeyPage._keys(this.props).length === 0) {
            let {onLoadLanguage} = this.props;
            onLoadLanguage(this.params.flag);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const checkedArray = SortKeyPage._keys(nextProps, prevState);

        if (prevState.keys !== checkedArray) {
            return {
                keys: checkedArray
            }
        }
        return null;
    }
    /**
     *  获取标签
     * @param props
     * @param original 移除标签时使用，是否从props获取原始对的标签
     * @param state 移除标签时使用
     * @private
     */
    static _keys(props, state) {
        //如果state中有checkedArray则使用state中的checkedArray
        if (state && state.checkedArray && state.checkedArray.length) {
            return state.checkedArray;
        }
        //否则从原始数据中获取checkedArray
        const flag = SortKeyPage._flag(props);
        let dataArray = props.language[flag] || [];
        let keys = [];
        for (let i = 0, j = dataArray.length; i < j; i++) {
            let data = dataArray[i];
            if (data.checked) {
                keys.push(data);
            }
        }
        return keys;

    }

    static _flag(props) {
        const {flag} = props.navigation.state.params;
        return flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages";

    }

    componentWillUnmount(): void {
        this.backPress.componentWillUnmount();

    }

    onBackPress() {
        navigatorUtil.goBack(this.props.navigation);
        return true;
    }

    onClick(data, index) {

        data.checked = !data.checked;
        ArrayUtil.updateArray(this.changeValues, data);
        this.setState({
            keys: data
        })
        this.state.keys[index] = data;//刷新state中keys的数据
        this.setState({//将keys保存在state以便render
            keys: this.state.keys,
        })
        //console.log( data.checked);
    }

    onBack() {
        if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props),this.state.checkedArray)) {
            Alert.alert('提示', '要保存修改吗?', [
                {
                    text: '否', onPress: () => {
                        navigatorUtil.goBack(this.props.navigation)
                    }
                }, {
                    text: '是', onPress: () => {
                        this.onSave();
                    }
                }
            ])
        } else {
            navigatorUtil.goBack(this.props.navigation);
        }

    }

    render() {
        const {theme} = this.params;

        let title = this.params.flag === FLAG_LANGUAGE.flag_langage ? "语言排序" : '标签排序';
        let navigationBar = <NavigationBar
            title={title}
            style={{backgroundColor: theme.themeColor}}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
        />
        return <SafeAreaViewPlus
                topColor={theme.themeColor}
        >

            {navigationBar}
            <SortableListView
                data={this.state.checkedArray}
                order={Object.keys(this.state.checkedArray)}
                onRowMoved={e => {
                    this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
                    this.forceUpdate()
                }}
                renderRow={row => <SortCell data={row} {...this.params} theme={theme}/>}
            />

        </SafeAreaViewPlus>
    }


    onSave(hasChecked) {
        if (!hasChecked) { // 如果没有排序则直接返回
            if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
                navigatorUtil.goBack(this.props.navigation);
                return;
            }
        }
        //todo 保存排序后的数据
        //获取排序后的数据
        //更新本地数据
        this.languageDao.save(this.getSortResult());
        const {onLoadLanguage} = this.props;
        //更新store
        onLoadLanguage(this.params.flag);
        navigatorUtil.goBack(this.props.navigation);
    }

    /**
     * 获取排序后的标签结果
     */
    getSortResult() {
        const flag = SortKeyPage._flag(this.props);
        //从原始数据中复制一份数据出来,以便对这份数据进行排序
        let sortResultArray = ArrayUtil.clone(this.props.language[flag]);
        //获取排序之前的排列顺序
        const originaCheckedArray = SortKeyPage._keys(this.props);
        //遍历排序之前的数据,用排序后的数据checkArray进行替换
        for (let i = 0, j = originaCheckedArray.length; i < j; i++) {
            let item = originaCheckedArray[i];
            //找到要替换的元素所在位置
            let index = this.props.language[flag].indexOf(item);
            //进行替换
            sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
        return sortResultArray;
    }
}

class SortCell extends Component {
    render() {
        const {theme} = this.props;

        return <TouchableHighlight
            underlayColor={'#eee'}
            style={this.props.data.checked ? styles.item : styles.hidden}
            {...this.props.sortHandlers}
        >
            <View style={{marginLeft: 10, flexDirection: 'row'}}>
                <MaterialCommunityIcons
                    name={'sort'}
                    size={16}
                    style={{marginRight: 10, color: theme.themeColor}}
                />
                <Text>{this.props.data.name}</Text>
            </View>


        </TouchableHighlight>
    }
}

const mapStateToProps = state => ({
    language: state.language,

})
const mapDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),

})
export default connect(mapStateToProps, mapDispatchToProps)(SortKeyPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#F5FCFF',
    },
    item: {
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: "center",
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: "darkgray",
    }
    ,
    hidden: {
        height: 0,

    }

});
