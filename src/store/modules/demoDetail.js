// State
const GET_DETAIL = 'demoDetail/GET_DETAIL';
const GET_DETAIL_SUCCESS = 'demoDetail/GET_DETAIL_SUCCESS';
const GET_DETAIL_FAILURE = 'demoDetail/GET_DETAIL_FAILURE';

const initial = {
  isLoading: true,
  hasMore: -2,
  detail: null
};

// Reducer
export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case GET_DETAIL:
      return {
        ...initial
      };
    case GET_DETAIL_SUCCESS:
      let result = action && action.result;
      if (result.code === '1') {
        state.detail = result
        if (!state.detail || Object.isEmptyObject(state.detail)) {
          state.hasMore = 404
        } else {
          state.hasMore = 0
        }
      } else {
        state.hasMore = -1
      }
      return {
        ...state,
        isLoading: false
      };
    case GET_DETAIL_FAILURE:
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
export function getDetail(params) {
  return {
    types: [GET_DETAIL, GET_DETAIL_SUCCESS, GET_DETAIL_FAILURE],
    promise: client => client.post(`/app/std_mendian/order/rebate/queryRebateDetail.do`, params),
    params
  };
}
