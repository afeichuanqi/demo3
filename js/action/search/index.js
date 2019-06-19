import Types from '../Types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {_projectModels, doCallBack, sendData as handleData} from '../ActionUtil';
import ArrayUtil from "../../util/ArrayUtil";
import Utils from "../../util/Utils";

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=starts';
const CANCEL_TOKENS = [];

/**
 *
 * @param inputKey 搜索key
 * @param pageSize
 * @param token 与该搜索关联的唯一token
 * @param favoriteDAO
 * @param popularKeys
 * @param callback
 * @returns {Function}
 */
export function onSearch(inputKey, pageSize, token, favoriteDAO, popularKeys, callback) {
    return dispatch => {
        dispatch({type: Types.SEARCH_REFRESH});
        fetch(genFetchUrl(inputKey)).then(response => {//如果任务取消，则不做任何处理
            return hasCancel(token) ? null : response.json();
        }).then(responseData => {

            if (hasCancel(token, true)) {//如果任务取消则不做任何处理
                console.log('use cancel');
                return;
            }
            if (!responseData || !responseData.items || responseData.items.length === 0) {
                dispatch({type: Types.SEARCH_FAIL, message: `没找到关于${inputKey}的项目`});
                doCallBack(callback, `没找到关于${inputKey}的项目`);
                return;
            }
            let items = responseData.items;
            handleData(Types.SEARCH_REFRESH_SUCCESS, dispatch, {data: items}, '', pageSize, favoriteDAO, {
                showBottomButton: !Utils.checkKeyIsExist(popularKeys, inputKey),
                inputKey,
            });

        }).catch(e => {
            console.log(e);
            dispatch({type: Types.SEARCH_FAIL, error: e});
        })

    }
}

/**
 * 取消一个异步任务
 */
export function onSearchCancel(token) {
    return dispatch => {
        CANCEL_TOKENS.push(token);
        dispatch({type: Types.SEARCH_CANCEL})
    }
}

/**
 * 检查指定token是否已经取消
 * @param token
 * @param isRemove
 * @returns {boolean}
 */
function hasCancel(token, isRemove) {
    if (CANCEL_TOKENS.includes(token)) {
        isRemove && ArrayUtil.remove(CANCEL_TOKENS, token);
        return true;
    }
    return false;
}

/**
 *
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param favoriteDAO
 * @param callback 回调函数,可以通过回调函数像调用页面通信:比如异常信息的展示,没有更多等待
 * @returns {Function}
 */
export function onLoadMoreSearch( pageIndex, pageSize, dataArray = [], favoriteDAO, callback) {

    return dispatch => {
        setTimeout(() => {//模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) {//已加载完全部数据
                if (typeof callback === "function") {
                    callback("no more");
                }
                dispatch({
                    type: Types.SEARCH_LOAD_MORE_FAIL,
                    error: 'no more',
                    pageIndex: --pageIndex,

                })

            } else {
                //本次和载入的最大数量
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                _projectModels(dataArray.slice(0, max), favoriteDAO, projectModes => {
                    dispatch({
                        type: Types.SEARCH_LOAD_MORE_SUCCESS,
                        pageIndex,
                        projectModels: projectModes,
                    })
                })

            }
        }, 500)
    }

}

function genFetchUrl(key) {
    return API_URL + key + QUERY_STR;
}

