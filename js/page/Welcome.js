/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Button} from 'react-native';
import NavigationUtils from '../navigator/NavigationUtils';
type Props = {};
export default class WelcomePage extends Component<Props> {
    autoToHom(navigation){
        const count = this.state.count;
        if(count==0){
            NavigationUtils.toSetHomPage(navigation);
            return ;
        }
        this.setState({
            count:count-1,
        })
    }
    componentDidMount(): void {
        const {navigation} = this.props;
        NavigationUtils.navigation = navigation;
        this.timer = setInterval(this.autoToHom.bind(this,navigation),1000)
    }
    componentWillUnmount(): void {
        this.timer && clearInterval(this.timer);
    }
    constructor(props) {
        super(props);
        this.state={
            count:3,
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>WelcomePage</Text>
                <Button onPress={()=>{
                    const {navigation } =this.props;

                    navigation.navigate('Main');

                }
                } title={"跳转到首页"} />
                <Text >页面在{this.state.count}秒后自动跳转到首页</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: '#F5FCFF',
    },
    welcome:{
        color:'red',
        fontSize:20,
        fontWeight: 'bold',
    }
});
