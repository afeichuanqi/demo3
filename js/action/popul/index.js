import Types from '../Types';
import DataStore,{FLAG_STORAGE} from '../../expand/dao/DataStore';
import {_projectModels, sendData} from '../ActionUtil';
export function onLoadingPopul(storeName, url, pageSize,favoriteDAO) {
    return dispatch => {
        dispatch({type: Types.POPUL_LOADING, storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url,FLAG_STORAGE.flag_popular).then((data) => {//异步action与数据流
            // console.log(data);
            sendData(Types.POPUL_LOADING_SUCCESS,dispatch, data, storeName, pageSize,favoriteDAO);
        }).catch((error) => {
            dispatch({
                type: Types.POPUL_LOADING_FAIL,
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
 * @param pageSize每页展示条数
 * @param dataArray 原始数据
 * @param favoriteDAO
 * @param callBack 回调函数,可以通过回调函数向调用页面通信;比如异常信息的展示,没有更多等待
 * */
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], favoriteDAO,callback) {

    return dispatch => {
        // console.log('pageindex',storeName+pageIndex);
        setTimeout(() => {//模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) {//已加载完全部数据
                if (typeof callback === "function") {
                    callback("no more");
                }
                dispatch({
                    type: Types.POPUL_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                })

            } else {
                //本次和载入的最大数量
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;

                _projectModels(dataArray.slice(0,max),favoriteDAO,projectModes=>{
                    dispatch({
                        type: Types.POPUL_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels:projectModes,
                    })
                })

            }
        }, 500)
    }

}
export function onFlushPopularFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDAO){
    return dispatch=>{
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        _projectModels(dataArray.slice(0,max),favoriteDAO,projectModes=>{
            dispatch({
                type: Types.FLUSH_POPULAR_FAVORITE,
                storeName,
                pageIndex,
                projectModels:projectModes,
            })
        })
    }
}

