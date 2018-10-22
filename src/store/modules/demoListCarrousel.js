// Model
const INIT = 'demoListCarrousel/INIT';
const CHANGE_SCROLLTOP = 'demoListCarrousel/CHANGE_SCROLLTOP';

const CHANGE_FILTER = 'demoListCarrousel/CHANGE_FILTER';

const GET_LIST1 = 'demoListCarrousel/GET_LIST1';
const GET_LIST1_SUCCESS = 'demoListCarrousel/GET_LIST1_SUCCESS';
const GET_LIST1_FAILURE = 'demoListCarrousel/GET_LIST1_FAILURE';

const GET_LIST2 = 'demoListCarrousel/GET_LIST2';
const GET_LIST2_SUCCESS = 'demoListCarrousel/GET_LIST2_SUCCESS';
const GET_LIST2_FAILURE = 'demoListCarrousel/GET_LIST2_FAILURE';

const CHANGE_ACTIVETAB = 'demoListCarrousel/CHANGE_ACTIVETAB'; // 切换页面盘点与查询

const initial = {
  scrollTop: 0, // 保存滚动条位置
  isLoading: true,
  rows: 20,
  list2Total: 0,
  list1Total: 0,
  list1: [],
  list1Page: 1,
  list1HasMore: -2,
  list2: [],
  list2Page: 1,
  list2HasMore: -2,
  tabActiveIndex: 0,
  tabs: [
    {caption: '第一页'},
    {caption: '第二页'},
  ]
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
      if (params.cmName !== undefined) state.cmName = params.cmName;
      return {
        ...state
      };
    case GET_LIST1:
      state.list1Page = action.params.page;
      return {
        ...state,
        list1HasMore: -2,
        isLoading: state.list1Page === 1 ? true : false
      };
    case GET_LIST1_SUCCESS:
      let list1Result = action && action.result;
      if (list1Result.code === '1') {
        // 设置数据
        let serList = list1Result.data.rebate_records;
        state.list1 = state.list1Page === 1 ? serList : state.list1.concat(serList);
        // 判断0.无更多数据, 1.头部刷新完成, 2.底部刷新完成, 404.一条数据都没有
        state.list1HasMore = state.list1Page === 1 ? 1 : 2;
        // 判断是否无更多数据
        if (state.rows > serList.length) state.list1HasMore = 0;
        // 判断是否暂无数据
        if (state.list1.length === 0) state.list1HasMore = 404;
      } else {
        state.list1HasMore = -1;
      }
      return {
        ...state,
        isLoading: false
      };
    case GET_LIST1_FAILURE:
      return {
        ...state,
        list1HasMore: -1,
        isLoading: false
      };
    case GET_LIST2:
      state.list2Page = action.params.page;
      return {
        ...state,
        list2HasMore: -2,
        isLoading: state.list2Page === 1 ? true : false
      };
    case GET_LIST2_SUCCESS:
      let list2Result = action && action.result;
      if (list2Result.code === '1') {
        // 设置数据
        let serList = list2Result.data;
        state.list2 = state.list2Page === 1 ? serList : state.list2.concat(serList);
        // 判断0.无更多数据, 1.头部刷新完成, 2.底部刷新完成, 404.一条数据都没有
        state.list2HasMore = state.list2Page === 1 ? 1 : 2;
        // 判断是否无更多数据
        if (state.rows > serList.length) state.list2HasMore = 0;
        // 判断是否暂无数据
        if (state.list2.length === 0) state.list2HasMore = 404;
      } else {
        state.list2HasMore = -1;
      }
      return {
        ...state,
        isLoading: false
      };
    case GET_LIST2_FAILURE:
      return {
        ...state,
        list2HasMore: -1,
        isLoading: false
      };
    case CHANGE_ACTIVETAB:
      return {
        ...state,
        tabActiveIndex: action.index
      }
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
export function changeActiveTab(index) {
  return {
    type: CHANGE_ACTIVETAB,
    index
  }
}
export function getList1(params) {
  return {
    types: [GET_LIST1, GET_LIST1_SUCCESS, GET_LIST1_FAILURE],
    promise: client => client.get(`/biz/std_mendian/coupon/client/v1/queryCouponRec.action`, params),
    params
  };
}
export function getList2(params) {
  return {
    types: [GET_LIST2, GET_LIST2_SUCCESS, GET_LIST2_FAILURE],
    promise: client => client.get(`/biz/std_mendian/coupon/client/v1/queryCouponRec.action`, params),
    params
  };
}
