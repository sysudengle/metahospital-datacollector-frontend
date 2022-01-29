const API_PRE = 'http://h.test.com/api/'; // 默认前缀

export default {
  API_PRE,
  API_LOGIN: `${API_PRE}wx/auth`, // 微信静默登录
  API_DOCTOR_REG: `${API_PRE}wx/doctor/register`, // 医生注册
  API_DOCTOR_INFO: `${API_PRE}wx/doctor`, // 获取医生信息
  API_SET_PROFILE: `${API_PRE}wx/profile/upsert`, // 新建or修改个人档案
  API_GET_PROFILES: `${API_PRE}wx/profiles`, // 获取当前微信账号所有档案
  API_SET_BOOKING: `${API_PRE}wx/booking/upsert`, // 新建or修改预约
  API_DONE_BOOKING: `${API_PRE}wx/booking/complete`, // 医务人员操作完成预约接口
  API_GET_BOOKINGS: `${API_PRE}wx/bookings`, // 根据档案获取所有预约
  API_GET_BOOKING_DETAIL: `${API_PRE}wx/booking/detail`, // 根据预约ID获取详细预约信息
  API_GET_ITEMS: `${API_PRE}wx/booking/department/items`, // 根据预约iD和科室信息获取体检项详情
  API_SET_ITEMS: `${API_PRE}wx/booking/department/items/upsert`, // 医生提交体检项目输入
  API_CONFIG_HISPITAL: `${API_PRE}config/hospital`, // 获取医院配置数据
  API_CONFIG_DEP: `${API_PRE}config/department`, // 获取科室配置数据
  API_CONFIG_COMBO: `${API_PRE}config/combo`, // 获取套餐配置数据
  API_COMFIG_ITEM: `${API_PRE}config/item`, // 获取指标项配置数据
};
