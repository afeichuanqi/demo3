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
    Alert
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import {connect} from 'react-redux';
import actions from '../action';
import navigatorUtil from '../navigator/NavigationUtils';
import CheckBox from 'react-native-check-box';
import BackPressComponent from "../common/BackPressComponent";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import LanguageDao from "../expand/dao/LanguageDao";
import ViewUtil from "../util/ViewUtil";
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArrayUtil from "../util/ArrayUtil";
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
type Props = {};

class CustomKeyPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
        this.changeValues = [];
        this.isRemoveKey = !!this.params.isRemoveKey;
        this.languageDao = new LanguageDao(this.params.flag);
        this.state = {
            keys: []
        }
    }

    componentDidMount() {
        this.backPress.componentDidMount();
        //如果props中标签为空则从本地存储中获取标签
        if (CustomKeyPage._keys(this.props).length === 0) {
            let {onLoadLanguage} = this.props;
            onLoadLanguage(this.params.flag);
        }
        this.setState({
            keys: CustomKeyPage._keys(this.props),
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
            return {
                keys: CustomKeyPage._keys(nextProps, null, prevState)
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
    static _keys(props, original, state) {
        const {flag, isRemoveKey} = props.navigation.state.params;
        let key = flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages";
        if (isRemoveKey && !original) {
            //如果state中的keys为空则从props中取
            return state && state.keys && state.keys.length !== 0 && state.keys || props.language[key].map(val => {
                return {//注意 :不直接修改props,copy一份
                    ...val,
                    checked: false,
                }
            })
        } else {
            return props.language[key];
        }
    }

    componentWillUnmount(): void {
        this.backPress.componentWillUnmount();

    }

    onBackPress() {
        navigatorUtil.goBack(this.props.navigation);
        return true;
    }

    renderView() {
        let dataArray = this.state.keys;
        if (!dataArray || dataArray.length === 0) return;
        let len = dataArray.length;
        let views = [];
        for (let i = 0, l = len; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(dataArray[i], i)}
                        {i + 1 < len && this.renderCheckBox(dataArray[i + 1], i + 1)}
                    </View>
                    <View style={styles.line}></View>
                </View>
            );
        }
        return views;
    }


    renderCheckBox(data, index) {
        return <CheckBox
            style={{flex: 1, padding: 10}}
            onClick={() => this.onClick(data, index)}
            isChecked={data.checked}
            leftText={data.name}
            checkedImage={this._checkedImage(true)}
            unCheckedImage={this._checkedImage(false)}
        />
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

    _checkedImage(checked) {
        const {theme} = this.params;
        return <Ionicons
            name={checked ? 'ios-checkbox' : 'md-square-outline'}
            size={20}
            style={{
                color: theme.themeColor,
            }}
        />
    }

    onBack() {
        if (this.changeValues.length > 0) {
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
        let title = this.isRemoveKey ? "标签移除" : "自定义标签";
        title = this.params.flag === FLAG_LANGUAGE.flag_langage ? "自定义语言" : title;
        let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';

        let navigationBar = <NavigationBar
            title={title}
            style={{backgroundColor: theme.themeColor}}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
        />
        return <SafeAreaViewPlus
            topColor={theme.themeColor}
        >
            {navigationBar}
            <ScrollView>
                {this.renderView()}

            </ScrollView>
        </SafeAreaViewPlus>
    }

    onSave() {
        if (this.changeValues.length === 0) {
            navigatorUtil.goBack(this.props.navigation);
            return;
        }
        let keys;
        if (this.isRemoveKey) {//移除标签的特殊处理
            for (let i = 0, l = this.changeValues.length; i < l; i++) {
                ArrayUtil.remove(keys = CustomKeyPage._keys(this.props, true), this.changeValues[i], 'name');
            }
        }
        //更新本地数据
        this.languageDao.save(keys || this.state.keys);
        const {onLoadLanguage} = this.props;
        //更新store
        onLoadLanguage(this.params.flag);
        navigatorUtil.goBack(this.props.navigation);
    }
}

const mapStateToProps = state => ({
    language: state.language,

})
const mapDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),

})
export default connect(mapStateToProps, mapDispatchToProps)(CustomKeyPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#F5FCFF',
    },
    item: {
        flexDirection: 'row',
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: "darkgray",
    }

});
