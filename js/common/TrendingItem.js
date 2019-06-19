import React, {Component} from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HTMLView from 'react-native-htmlview';
import BaseItem from "./BaseItem";

export default class TrendingItem extends BaseItem {
    render() {

        const {projectModel} = this.props;
        //console.log("projectModel",projectModel);
        const {item} =projectModel;
        if (!item || item.item) {
            return null
        }
        //console.log("contributors",item);
            let description = `<p>${item.description}</p>`;
        return (
            <TouchableOpacity
                onPress={()=>this.onItemClick()}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>
                        {item.fullName}
                    </Text>
                    {/*<Text style={styles.description}>*/}
                        {/*{item.description}*/}
                    {/*</Text>*/}
                    <HTMLView
                        value={description}
                        onLinkPress={(url)=>{

                        }}
                        stylesheet={{
                            p:styles.description,
                            a:styles.description,
                        }}
                    />
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>Built by :</Text>
                            {item.contributors.map((result, i, arr) => {
                                return <Image
                                    key={i}
                                    style={{height: 22, width: 22, margin: 2}}
                                              source={{uri: arr[i]}}
                                />
                            })}

                        </View>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row',}}>
                            <Text>forkCount:</Text>
                            <Text>{item.forkCount}</Text>

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