import  Vue from 'vue'
import  Vuex from 'vuex'
Vue.use(Vuex);
const state={
  deliveryNumber:''
}
const mutations={
  getDeliveryNumber(state,val){
    state.deliveryNumber=val
  }
}
const store=new Vuex.Store({
  state,
  mutations
});

export  default store
