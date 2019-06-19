import Types from '../../action/Types';

const defaultState = {};

export default function onLoadingTrending(state = defaultState, action) {
    const {type, items, error, storeName} = action;
    switch (type) {
        case Types.TRENDING_REFRESH://下拉刷新
            return {
                ...state,
                [storeName]: {
                    ...state[storeName],
                    isLoading: true,
                    hideLoadingMore:true,
                }
            }
        case Types.TRENDING_REFRESH_SUCCESS://下拉刷新成功
            return {
                ...state,
                [storeName]: {
                    ...state[storeName],
                    items: items,//原始数据
                    isLoading: false,
                    projectModels: action.projectModels,//此次要展示的数据
                    hideLoadingMore:false,
                    pageIndex:action.pageIndex,
                }
            }
        case Types.TRENDING_REFRESH_FAIL://下拉刷新失败
            return {
                ...state,
                [storeName]: {
                    ...state[storeName],
                    isLoading: false,
                }
            }
        //上拉加载更多成功
        case Types.TRENDING_LOAD_MORE_SUCCESS:
            return {
                ...state,
                [storeName]: {
                    ...state[storeName],
                    projectModels:action.projectModels,
                    hideLoadingMore: false,
                    pageIndex:action.pageIndex,
                }
            }
        //上拉加载更多失败
        case Types.TRENDING_LOAD_MORE_FAIL:
            return {
                ...state,
                [storeName]: {
                    ...state[storeName],
                    hideLoadingMore: true,
                    pageIndex:action.pageIndex,
                }
            }
        case Types.TRENDING_FLUSH_FAVORITE:
            return {
                ...state,
                [storeName]: {
                    ...state[storeName],
                    pageIndex:action.pageIndex,
                    projectModels: action.projectModels,//此次要展示的数据
                }
            }
        default :
            return state;
    }
}