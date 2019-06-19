/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
type Props = {};
export default class BaseItem extends Component<Props> {
    static propTypes = {
        projectModel:PropTypes.object,
        onSelect:PropTypes.func,
        onFavorite : PropTypes.func,
    }
    constructor(props){
        super(props);
        this.state={
            isFavorite:this.props.projectModel.isFavorite,
        }
        //console.log('props',props);
    }
    onItemClick(){
        this.props.onSelect(isFavorite=>{
            this.setFavoriteState(isFavorite);
        })
    }
    /**
     *  componentWillReceiveProps在新版React红不能再用了
     * @param nextProps
     * @param prevState
     */
    static getDerivedStateFromProps(nextProps,prevState){
        const isFavorite =nextProps.projectModel.isFavorite;
        if(prevState.isFavorite!==isFavorite){
            return {
                isFavorite:isFavorite,
            };
        }
        return null;
    }

    /**
     * 生成收藏项目的图标
     * @returns {*}
     * @private
     */
    _favoriteIcon(){
        const {theme} =this.props;
        return <TouchableOpacity
            style={{padding:0}}
            underlayColor='transparent'
            onPress={()=>this.onPressFavorite()}
        >
            <FontAwesome
                name={this.state.isFavorite?'star':'star-o'}
                size={26}
                style={{color:theme.themeColor}}
            />

        </TouchableOpacity>
    }
    setFavoriteState(isFavorite){
            this.props.projectModel.isFavorite=isFavorite;
            this.setState({
                isFavorite:isFavorite,
            })
    }
    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite);
        //console.log("12345",this.props.projectModel.item);
        this.props.onFavorite(this.props.projectModel.item,!this.state.isFavorite)
    }
}

