/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View,Linking} from 'react-native';
import {MORE_MENU} from "../../common/MORE_MENU";
import GlobalStyles from "../../res/styles/GlobalStyles";
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon";
import config from '../../res/data/config';
import NavigationUtils from "../../navigator/NavigationUtils";
import ViewUtil from "../../util/ViewUtil";

type Props = {};
const THEME_COLOR = '#678';
export default class AboutPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: this.props.navigation,
            flagAbout: FLAG_ABOUT.flag_about,
        }, data => this.setState({...data}));
        this.state = {
            data: config,//先加载本地数据。防止卡顿
        };
    }

    componentDidMount() {
        this.aboutCommon.componentDidMount()
    }

    componentWillUnmount(): void {
        this.aboutCommon.componentWillUnmount();
    }

    onClick(menu) {
        const {theme} = this.params;
        let routeName, params = {};
        switch (menu) {
            case MORE_MENU.Tutorial:
                routeName = 'WebViewPage';
                params.url = 'https://coding.m.imooc.com/classindex.html?cid=89';
                params.title = MORE_MENU.Tutorial.name;

                break;
            case MORE_MENU.Feedback:
                const url = 'mailto://crazycodeboy@gmail.com';
                Linking.canOpenURL(url)
                    .then(bool=>{
                        if(!bool){
                            console.log('Can\'t handle url');
                        } else {
                            Linking.openURL(url);
                        }
                    }).catch(e=>{
                        console.error('An error occurred',e);
                })
                break;
            case MORE_MENU.About_Author:
                routeName='AboutMePage'
                break;

        }
        if (routeName) {
            NavigationUtils.goPage({...params,theme}, routeName)
        }
    }

    getItem(menu) {
        const {theme} = this.params;

        return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor)
    }

    render() {
        //console.log(this.state.data.app);
        const content = <View>
            {this.getItem(MORE_MENU.Tutorial)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.About_Author)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.Feedback)}
        </View>;
        return this.aboutCommon.render(content, this.state.data.app);
    }
}
