/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationUtils from "../navigator/NavigationUtils";
import {isIphoneX} from "../util/ScreenUtil";
import BackPressComponent from "../common/BackPressComponent";
import  favoriteDao from '../expand/dao/FavoriteDAO';
const TRENDING_URL = "https://github.com/";
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
type Props = {};
export default class DetailPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        const {projectModel,flag} = this.params;
        this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;//兼容最热和趋势
        const title = projectModel.item.full_name||projectModel.item.fullName;
        this.favoriteDAO = new favoriteDao(flag);
        this.state = {
            title:title,
            url:this.url,
            canGoBack:false,
            isFavorite:projectModel.isFavorite
        }
        this.backPress = new BackPressComponent({backPress:()=>this.onBackPress()})
        //console.log('TrendingDialog constructor');
    }
    componentDidMount(): void {
        this.backPress.componentDidMount()
    }
    componentWillUnmount(): void {
        this.backPress.componentWillUnmount()
    }
    onBackPress(){
        this.onBack();
        return true;
    }
    onBack() {
        if(this.state.canGoBack){
            this.webView.goBack();
        }else{
            NavigationUtils.goBack(this.props.navigation)
        }
    }
    onFavoriteButtonClick(){
        const {projectModel,callback} = this.params;
        const isFavorite = projectModel.isFavorite=!projectModel.isFavorite;
        this.setState({
            isFavorite:isFavorite
        });
        callback(isFavorite)//回传到item
        let key = projectModel.item.fullName ? projectModel.item.fullName:projectModel.item.id.toString();
        if(projectModel.isFavorite){
            this.favoriteDAO.saveFavoriteItem(key,JSON.stringify(projectModel))
        }else{
            this.favoriteDAO.removeFavoriteItem(key);
        }
    }
    renderRightButton(){
        return (
            <View
                style={{flexDirection: 'row'}}
            >
                <TouchableOpacity
                    onPress={()=>{
                        this.onFavoriteButtonClick();
                    }}
                >
                    <FontAwesome
                        name={this.state.isFavorite?'star':'star-o'}
                        size={20}
                        style={{color:'white',marginRight:10}}
                    />
                </TouchableOpacity>
                {ViewUtil.getShareButton(()=>{

                })}
            </View>
        )
    }
    onNavigationStateChange(navState){
        this.setState({
            canGoBack:navState.canGoBack,
            url:navState.url,
        })
    }
    render() {
        //const leftButton = ;
        const {theme} =this.params;

        const titleLayoutStyle = this.state.title.length>20?{paddingRight: 30}:null;
        let navigationBar = <NavigationBar
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            titleLayoutStyle={titleLayoutStyle}
            title={this.state.title}
            style={theme.styles.navBar}
            rightButton={this.renderRightButton()}
        />;

        return (
            <SafeAreaViewPlus
                topColor={theme.themeColor}
            >
                {navigationBar}
                <WebView
                    ref={webview=>this.webView=webview}
                    startInLoadingState={true}
                    onNavigationStateChange={e=>this.onNavigationStateChange(e)}
                    source={{uri:this.state.url}}
                />
            </SafeAreaViewPlus>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: isIphoneX()?30:0,

    },

});
