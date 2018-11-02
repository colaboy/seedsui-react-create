// Model
const INIT = 'checkEnd/INIT';
const CHANGE_SCROLLTOP = 'checkEnd/CHANGE_SCROLLTOP';

const CHANGE_FILTER = 'checkEnd/CHANGE_FILTER';

const GET_LIST = 'checkEnd/GET_LIST';
const GET_LIST_SUCCESS = 'checkEnd/GET_LIST_SUCCESS';
const GET_LIST_FAILURE = 'checkEnd/GET_LIST_FAILURE';

const SAVE_END = 'checkEnd/SAVE_END';
const SAVE_END_SUCCESS = 'checkEnd/SAVE_END_SUCCESS';
const SAVE_END_FAILURE = 'checkEnd/SAVE_END_FAILURE';

const initial = {
  // 过滤条件
  cm_id: '', //	客户id	string
  cm_type: '', //	客户类型	string
  district_ids: '', //	销售区域	string	逗号分隔
  submit_manager_id: '', //	客户经理id	string
  jxs_id: '', //	供货商	string
  cm_name: '',
  cm_type_name: '',
  district_name: '',
  submit_manager_name: '',
  jxs_name: '',
  // 其它
  scrollTop: 0, // 保存滚动条位置
  isLoading: true,
  rows: 20,
  list: [],
  page: 1,
  hasMore: -2
};
// Reducer
export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case CHANGE_SCROLLTOP:
      state.scrollTop = action.scrollTop;
      return {
        ...state
      };
    case INIT:
      return {
        ...initial
      };
    case CHANGE_FILTER:
      var params = action.params;
      if (params.cm_id !== undefined) state.cm_id = params.cm_id;
      if (params.cm_type !== undefined) state.cm_type = params.cm_type;
      if (params.district_ids !== undefined) state.district_ids = params.district_ids;
      if (params.submit_manager_id !== undefined) state.submit_manager_id = params.submit_manager_id;
      if (params.jxs_id !== undefined) state.jxs_id = params.jxs_id;
      if (params.cm_name !== undefined) state.cm_name = params.cm_name;
      if (params.cm_type_name !== undefined) state.cm_type_name = params.cm_type_name;
      if (params.district_name !== undefined) state.district_name = params.district_name;
      if (params.submit_manager_name !== undefined) state.submit_manager_name = params.submit_manager_name;
      if (params.jxs_name !== undefined) state.jxs_name = params.jxs_name;
      return {
        ...state
      };
    case GET_LIST:
      state.page = action.params.page;
      return {
        ...state,
        hasMore: -2,
        isLoading: state.page === 1 ? true : false
      };
    case GET_LIST_SUCCESS:
      let listResult = action && action.result;
      if (listResult.code === '1') {
        // 设置数据
        let serList = listResult.data.rebate_records;
        state.list = state.page === 1 ? serList : state.list.concat(serList);
        // 判断0.无更多数据, 1.头部刷新完成, 2.底部刷新完成, 404.一条数据都没有
        state.hasMore = state.page === 1 ? 1 : 2;
        // 判断是否无更多数据
        if (state.rows > serList.length) state.hasMore = 0;
        // 判断是否暂无数据
        if (state.list.length === 0) state.hasMore = 404;
      } else {
        state.hasMore = -1;
      }
      return {
        ...state,
        isLoading: false
      };
    case GET_LIST_FAILURE:
      return {
        ...state,
        hasMore: -1,
        isLoading: false
      };
    case SAVE_END:
      return {
        ...state,
        isLoading: true
      };
    case SAVE_END_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case SAVE_END_FAILURE:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}

// Action
export function init(){
  return (dispatch) => {
    dispatch({
      type: INIT
    });
  };
}
export function changeScrollTop(scrollTop) {
  return {
    type: CHANGE_SCROLLTOP,
    scrollTop
  }
}
export function changeFilter(params) {
  return {
    type: CHANGE_FILTER,
    params
  };
}
export function getList(params) {
  return {
    types: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAILURE],
    promise: client => client.post(`/app/std_mendian/order/rebate/queryFinalRebateList.do`, params),
    params
  };
}
export function saveEnd(params) {
  return {
    types: [SAVE_END, SAVE_END_SUCCESS, SAVE_END_FAILURE],
    promise: client => client.post(`/app/std_mendian/order/rebate/passOrBackRebate.do`, params),
    params
  };
}
