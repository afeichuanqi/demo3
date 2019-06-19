/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, TextInput} from 'react-native';

type Props = {};
export default class FetchDemoPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            data: ''
        }
    }

    render() {
        return (
            <View>
                <View style={styles.inputcontainer}>
                    <TextInput style={styles.textinput} onChangeText={(text) => {
                        this.value = text
                    }
                    }></TextInput>
                    <Button title={'提交'} onPress={() => {
                        this.getDate();
                    }}/>
                </View>
                <Text>{this.state.data}</Text>
            </View>
        );
    }

    getDate() {
        let url = `https://api.github.com/search/repositories?q=${this.value}`;

        fetch(url).then((response) => (response.text()))
            .then((responsetext) => {
                //console.log(responsetext);
                this.setState(() => ({
                    data: responsetext
                }))
            })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    inputcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textinput: {
        height: 50,
        flex: 1,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
    }
});
