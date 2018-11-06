// State
const SAVE = 'reportEdit/SAVE';
const SAVE_SUCCESS = 'reportEdit/SAVE_SUCCESS';
const SAVE_FAILURE = 'reportEdit/SAVE_FAILURE';

const CHANGE_DETAIL = 'reportEdit/CHANGE_DETAIL';

const initial = {
  isLoading: false,
  hasMore: -2,
  detail: {
    limit_days: '3', // 宴会申报提前天数, 后端返回
    banquet_id: '1234', // 宴会id
    dir: 'test/01', // 目录
    banquet_type_list: [{ // 宴会类型列表, 写死
      key: '1',
      value: '公司年会'
    }, {
      key: '2',
      value: '家宴'
    }, {
      key: '3',
      value: '开业庆典'
    }, {
      key: '4',
      value: '满月宴'
    }, {
      key: '5',
      value: '乔迁'
    }, {
      key: '6',
      value: '周岁宴'
    }, {
      key: '7',
      value: '同学聚会'
    }, {
      key: '8',
      value: '婚宴'
    }, {
      key: '9',
      value: '升学宴'
    }, {
      key: '10',
      value: '白事'
    }, {
      key: '11',
      value: '寿宴'
    }, {
      key: '12',
      value: '其他'
    }],
    documentary_mode_list: [{
      key: '1',
      value: '自己跟单'
    }, {
      key: '2',
      value: '帮手跟单'
    }]
  }
};

// Reducer
export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case CHANGE_DETAIL:
      let detailCopy = Object.clone(state.detail);
      detailCopy[action.name] = action.value;
      state.detail = detailCopy;
      return {
        ...state
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
        hasMore: -1,
        isLoading: false
      };
    default:
      return state;
  }
}

// Action
export function save(params) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAILURE],
    promise: client => client.post(`/app/std_mendian/order/rebate/queryRebateDetail.do`, params),
    params
  };
}
export function changeDetail (name, value) {
  return {
    type: CHANGE_DETAIL,
    name,
    value
  };
}