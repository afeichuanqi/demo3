import Types from '../../action/Types';

const defaultState = {}

export default function onLoadingPopul(state = defaultState, action) {
    const {type, items, error, storeName} = action;
    switch (type) {
        case Types.POPUL_LOADING://下拉刷新
            return {
                ...state,
                [storeName]: {
                    ...state[storeName],
                    isLoading: true,
                    hideLoadingMore:true,
                }
            }
        case Types.POPUL_LOADING_SUCCESS://下拉刷新成功
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
        case Types.POPUL_LOADING_FAIL://下拉刷新失败
            return {
                ...state,
                [storeName]: {
                    ...state[storeName],
                    isLoading: false,
                }
            }
        //上拉加载更多成功
        case Types.POPUL_LOAD_MORE_SUCCESS:
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
        case Types.POPUL_LOAD_MORE_FAIL:
            return {
                ...state,
                [storeName]: {
                    ...state[storeName],
                    hideLoadingMore: true,
                    pageIndex:action.pageIndex,
                }
            }
        case Types.FLUSH_POPULAR_FAVORITE:
            return {
                ...state,
                [storeName]: {
                    ...state[storeName],
                    pageIndex:action.pageIndex,
                    projectModels:action.projectModels,
                }
            }
        default :
            return state;

    }
}