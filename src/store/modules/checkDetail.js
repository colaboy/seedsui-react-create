// State
const GET_DETAIL = 'checkDetail/GET_DETAIL';
const GET_DETAIL_SUCCESS = 'checkDetail/GET_DETAIL_SUCCESS';
const GET_DETAIL_FAILURE = 'checkDetail/GET_DETAIL_FAILURE';

const SAVE = 'checkDetail/SAVE';
const SAVE_SUCCESS = 'checkDetail/SAVE_SUCCESS';
const SAVE_FAILURE = 'checkDetail/SAVE_FAILURE';

const SAVE_END = 'checkDetail/SAVE_END';
const SAVE_END_SUCCESS = 'checkDetail/SAVE_END_SUCCESS';
const SAVE_END_FAILURE = 'checkDetail/SAVE_END_FAILURE';

const initial = {
  isLoading: true,
  hasMore: -2,
  detail: {}
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
        state.detail = result.data
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
    case SAVE:
      return {
        ...state,
        isLoading: true
      };
    case SAVE_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case SAVE_FAILURE:
      return {
        ...state,
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
export function getDetail(params) {
  return {
    types: [GET_DETAIL, GET_DETAIL_SUCCESS, GET_DETAIL_FAILURE],
    promise: client => client.post(`/app/std_mendian/order/rebate/queryRebateDetail.do`, params),
    params
  };
}
export function save(params) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAILURE],
    promise: client => client.post(`/app/std_mendian/order/rebate/passOrBackForFirstRebate.do`, params),
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
