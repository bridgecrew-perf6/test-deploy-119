const state = {
  uploadFile: []
}

const mutations = {
  ADD_UPLOAD_FILE: (state, payload) => {
    state.uploadFile.push(payload)
  },
  DEL_UPLOAD_FILE: (state, payload) => {
    if (!payload) state.uploadFile.splice(0)
    else state.uploadFile.splice(payload, 1)
  }

}

const actions = {
  addUploadFile({ commit }, payload) {
    commit('ADD_UPLOAD_FILE', payload)
  },
  delUploadFile({ commit }, payload) {
    commit('DEL_UPLOAD_FILE', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
