// State
const INIT = 'demoList/INIT';

const CHANGE_SCROLLTOP = 'demoList/CHANGE_SCROLLTOP';

const GET_LIST = 'demoList/GET_LIST';
const GET_LIST_SUCCESS = 'demoList/GET_LIST_SUCCESS';
const GET_LIST_FAILURE = 'demoList/GET_LIST_FAILURE';

const initial = {
  scrollTop: 0, // 保存滚动条位置
  isLoading: true,
  page: 1,
  rows: 50,
  hasMore: -2,
  list: []
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
    case GET_LIST:
      state.page = action.params.page;
      return {
        ...state,
        hasMore: -2,
        isLoading: state.page === 1 ? true : false
      };
    case GET_LIST_SUCCESS:
      let result = action && action.result;
      if (result.code === '1') {
        const serList = result.data;
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
// 修改滚动条位置
export function changeScrollTop(scrollTop) {
  return {
    type: CHANGE_SCROLLTOP,
    scrollTop
  }
}
// 获取执行类的活动
export function getList(params) {
  return {
    types: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAILURE],
    promise: client => client.post(`/app/std_mendian/order/rebate/queryFinalRebateList.do`, params),
    params
  };
}
