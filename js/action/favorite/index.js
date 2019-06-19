import Types from '../Types';
import FavoriteDao from "../../expand/dao/FavoriteDAO";
import ProjectModel from "../../model/ProjectModel";

/**
 * 加载收藏的项目
 * @param flag 标示
 * @param isShowLoading 是否显示loading
 * @returns {Function}
 */
export function onLoadFavoriteData(flag, isShowLoading) {
    return dispatch => {
        if(isShowLoading){
            dispatch({type: Types.FAVORITE_LOAD_DATA, flag});
        }

        new FavoriteDao(flag).getAllItems()
            .then(items=>{
                let resultData=[];

                for (let i=0 ,len=items.length;i<len;i++){
                    resultData.push(new ProjectModel(items[i],true));
                }
                dispatch({type:Types.FAVORITE_LOAD_SUCCESS,projectModels:resultData,storeName:flag});
            }).catch(e=>{

            dispatch({type:Types.FAVORITE_LOAD_FAIL,error:e,storeName:flag});
        })


    }
}
