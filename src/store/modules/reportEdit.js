// State
const SAVE = 'reportEdit/SAVE';
const SAVE_SUCCESS = 'reportEdit/SAVE_SUCCESS';
const SAVE_FAILURE = 'reportEdit/SAVE_FAILURE';

const REPORT_PARAMS = 'reportEdit/REPORT_PARAMS';
const REPORT_PARAMS_SUCCESS = 'reportEdit/REPORT_PARAMS_SUCCESS';
const REPORT_PARAMS_FAILURE = 'reportEdit/REPORT_PARAMS_FAILURE';

const EDIT_DETAIL = 'reportEdit/EDIT_DETAIL';

const CHANGE_DETAIL = 'reportEdit/CHANGE_DETAIL';

const detailDefault = {
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

const initial = {
  isLoading: false,
  detail: {...detailDefault}
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
    case EDIT_DETAIL:
      state.detail = action.detail;
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
        isLoading: false
      };
    case REPORT_PARAMS:
      return {
        ...state,
        isLoading: true
      };
    case REPORT_PARAMS_SUCCESS:
      if (action.result && action.result.code === '1') {
        state.detail.banquet_id = action.result.data.banquet_id;
        state.detail.dir = action.result.data.dir;
        state.detail.limit_days = action.result.data.limit_days;
        state.detail = Object.assign({}, detailDefault, state.detail);
      }
      return {
        ...state,
        isLoading: false
      };
    case REPORT_PARAMS_FAILURE:
      return {
        ...state,
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
    promise: client => client.post(`/app/client/yjn/report/startReport.do`, params),
    params
  };
}
export function reportParams (params) {
  return {
    types: [REPORT_PARAMS, REPORT_PARAMS_SUCCESS, REPORT_PARAMS_FAILURE],
    promise: client => client.post(`/app/client/yjn/report/getReportParameters.do`, params),
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
export function editDetail () {
  return (dispatch, getState) => {
    const detail = Object.assign({}, detailDefault, getState().reportDetail.detail);
    // 宴会类型
    let banquet_type_name = '';
    const banquet_type_selected = detailDefault.banquet_type_list.filter(item => {
      return item.key === detail.banquet_type
    });
    if (banquet_type_selected && banquet_type_selected.length) banquet_type_name = banquet_type_selected[0].value;
    detail.banquet_type_name = banquet_type_name;
    // 跟单方式
    let documentary_mode_name = '';
    const documentary_mode_selected = detailDefault.documentary_mode_list.filter(item => {
      return item.key === detail.documentary_mode
    });
    if (documentary_mode_selected && documentary_mode_selected.length) documentary_mode_name = documentary_mode_selected[0].value;
    detail.documentary_mode_name = documentary_mode_name;
    // 扫码清单
    if (detail.wine_code) {
      detail.wine_code = detail.wine_code.split(',');
    }
    // 照片
    if (detail.pic_path) {
      detail.pic_path_list = detail.pic_path.split(',').map((pic) => {
        return {
          upload: true,
          id: pic,
          thumb: pic,
          src: pic
        }
      });
    }
    dispatch({
      type: EDIT_DETAIL,
      detail: detail
    });
  };
}