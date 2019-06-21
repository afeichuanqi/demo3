/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View} from 'react-native';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import BackPressComponent from "../common/BackPressComponent";
import {connect} from 'react-redux';
import CustomTheme from '../page/CustomTheme';
import {onShowCustomThemeView} from "../action/theme";
import actions from "../action";
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {NavigationActions} from "react-navigation";
type Props = {};

class Homepage extends Component<Props> {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress:()=>this.onBackPress()})
    }

    componentDidMount(): void {
        this.backPress.componentDidMount()
    }

    componentWillUnmount(): void {
        this.backPress.componentWillUnmount()
    }

    onBackPress = () => {
        const {dispatch, nav} = this.props;
        //console.log(nav.routes[1].index);

        if (nav.routes[1].index === 0) {//如果RootNavigator中的MainNavigator的index为0，则不处理返回事件
            return false;
        }
        //console.log("NavigationActions.back()",NavigationActions.back());
        dispatch(NavigationActions.back());
        return true;//不处理返回键
    };

    renderCustomThemeView() {
        const {customThemeViewVisible,onShowCustomThemeView} =this.props;
        return (
            <CustomTheme
                visible={customThemeViewVisible}
                {...this.props}
                onClose={() => onShowCustomThemeView(false)}
            />
        )
    }

    render() {
        const {theme} = this.props;

        return <SafeAreaViewPlus
            topColor={theme.themeColor}
        >
            <DynamicTabNavigator/>
            {this.renderCustomThemeView()}
        </SafeAreaViewPlus>;
    }
}

const mapStateToProps = state => ({
    theme:state.theme.theme,
    nav: state.nav,
    customThemeViewVisible: state.theme.customThemeViewVisible,

});
const mapDispatchToProps = dispatch => ({
    onShowCustomThemeView:(show)=>dispatch(actions.onShowCustomThemeView(show))
})
export default connect(mapStateToProps,mapDispatchToProps)(Homepage);