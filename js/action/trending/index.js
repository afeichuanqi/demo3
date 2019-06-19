import Types from '../Types';
import DataStore,{FLAG_STORAGE} from '../../expand/dao/DataStore';
import {sendData as handleDate,_projectModels} from '../ActionUtil';
export function onLoadingTrending(storeName, url, pageSize,favoriteDAO) {
    //console.log(url);
    return dispatch => {
        dispatch({type: Types.TRENDING_REFRESH, storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url,FLAG_STORAGE.flag_trending).then((data) => {//异步action与数据流
            // console.log(data);
            handleDate(Types.TRENDING_REFRESH_SUCCESS,dispatch, data, storeName, pageSize,favoriteDAO);
        }).catch((error) => {
            dispatch({
                type: Types.TRENDING_REFRESH_FAIL,
                storeName,
                error: error.toString(),
            })
        });

    }
}
/**
 * 加载更多
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callBack 回调函数,可以通过回调函数向调用页面通信;比如异常信息的展示,没有更多等待
 * */
export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], favoriteDAO,callback) {

    return dispatch => {
        // console.log('pageindex',storeName+pageIndex);
        setTimeout(() => {//模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) {//已加载完全部数据
                if (typeof callback === "function") {
                    callback("no more");
                }
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                })

            } else {
                //本次和载入的最大数量

                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                _projectModels(dataArray.slice(0,max),favoriteDAO,projectModels=>{
                    dispatch({
                        type: Types.TRENDING_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels:projectModels,
                    })
                })


            }
        }, 500)
    }

}

export function onFlushTrendingFavorite (storeName, pageIndex, pageSize, dataArray = [], favoriteDAO,){
    return dispatch=>{
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        _projectModels(dataArray.slice(0,max),favoriteDAO,projectModels=>{
            dispatch({
                type: Types.TRENDING_FLUSH_FAVORITE,
                storeName,
                pageIndex,
                projectModels:projectModels,
            })
        })
    }
}
