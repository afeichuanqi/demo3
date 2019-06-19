import Types from '../../action/Types';

const defaultState = {}
/**
 * favorite:{
 *     popular:{
 *         projectModels:[],
 *         isLoading:false
 *     },
 *     trending:{
 *         projectModels:[],
 *         isLoading:false
 *     }
 * }
 * 0.state树,横向扩展
 *
 * @param state
 * @param action
 * @returns {{}}
 */

export default function onLoadingPopul(state = defaultState, action) {
    const {type, items, error, storeName} = action;
    switch (type) {
        case Types.FAVORITE_LOAD_DATA://获取数据
            return {
                ...state,
                [storeName]: {
                    ...state[storeName],
                    isLoading: true,

                }
            };
        case Types.FAVORITE_LOAD_SUCCESS://下拉获取数据成功
            return {
                ...state,
                [storeName]: {
                    ...state[storeName],
                    isLoading: false,
                    projectModels: action.projectModels,//此次要展示的数据


                }
            }
        case Types.FAVORITE_LOAD_FAIL://下拉获取数据失败
            return {
                ...state,
                [storeName]: {
                    ...state[storeName],
                    isLoading: false,
                }
            }
        default :
            return state;
    }
}