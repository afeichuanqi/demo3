/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtils from "../navigator/NavigationUtils";
import {isIphoneX} from "../util/ScreenUtil";
import BackPressComponent from "../common/BackPressComponent";
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';

type Props = {};
export default class WebViewPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        const {title, url} = this.params;

        this.state = {
            title: title,
            url: url,
            canGoBack: false,
        }
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
    }

    componentDidMount(): void {
        this.backPress.componentDidMount()
    }

    componentWillUnmount(): void {
        this.backPress.componentWillUnmount()
    }

    onBackPress() {
        this.onBack();
        return true;
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            NavigationUtils.goBack(this.props.navigation)
        }
    }


    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        })
    }

    render() {
        const {theme} = this.params;
        let navigationBar = <NavigationBar
            title={this.state.title}
            style={{backgroundColor: theme.themeColor}}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
        />;

        return (
            <SafeAreaViewPlus
                topColor={theme.themeColor}
            >
                {navigationBar}
                <WebView
                    ref={webview => this.webView = webview}
                    startInLoadingState={true}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                    source={{uri: this.state.url}}
                />
            </SafeAreaViewPlus>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: isIphoneX() ? 30 : 0,
    },

});
