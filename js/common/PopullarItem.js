import React, {Component} from 'react';
import {Image,Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BaseItem from "./BaseItem";

export default class PopullarItem extends BaseItem {
    render() {
        const {projectModel} = this.props;
        const {item} = projectModel;
        if (!item || !item.owner) {
            return null

        }
        // let favoritemButton =
        //     <TouchableOpacity
        //         style={{pading: 6}}
        //         onPress={() => {
        //         }
        //         }
        //         underlayColor={'transparent'}
        //     >
        //         <FontAwesome
        //             name={'star-o'}
        //             size={26}
        //             style={{color:"red"}}
        //         />
        //     </TouchableOpacity>
        return (
            <TouchableOpacity
                onPress={()=>this.onItemClick()}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>
                        {item.full_name}
                    </Text>
                    <Text style={styles.description}>
                        {item.description}
                    </Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>Author:</Text>
                            <Image style={{height: 22, width: 22}}
                                   source={{uri: item.owner.avatar_url}}
                            />
                        </View>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row',}}>
                            <Text>Start:</Text>
                            <Text>{item.stargazers_count}</Text>

                        </View>
                        {this._favoriteIcon()}
                    </View>

                </View>

            </TouchableOpacity>
        )

    }
}
const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    cell_container: {
        width:width-10,
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,//垂直的margin
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,//ios阴影的颜色
        shadowRadius: 1,
        elevation: 2,//安卓的阴影
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121',
    },
    description: {

        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
    }
})