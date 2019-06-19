/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import AppNavigators from './navigator/AppNavigators';
import {Provider} from 'react-redux';
import store from './store';

type Props = {}
export default class App extends Component<Props> {
    render() {
        return (
            <Provider store={store}>
                <AppNavigators/>
            </Provider>
        );
    }
}
