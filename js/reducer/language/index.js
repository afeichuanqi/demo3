import Types from '../../action/Types';
import {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao";

const defaultState = {
    languages: [],
    keys: [],
}

export default function onAction(state = defaultState, action) {
    const {type} = action;
    switch (type) {
        case Types.LANGUAGE_LOAD_SUCCESS://获取数据
            if (FLAG_LANGUAGE.flag_key === action.flag) {
                return {
                    ...state,
                    keys: action.languages,

                }
            } else {
                return {
                    ...state,
                    languages: action.languages,

                }
            }


        default :
            return state;
    }
}