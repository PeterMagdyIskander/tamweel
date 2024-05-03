import { createStore } from 'vuex'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { collection, doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
export default createStore({
  state: {
    user: null,
    loading: false,
    failed: false,
  },
  getters: {
    getUser: (state) => state.user,
    getLoading: (state) => state.loading,
    getFailed: (state) => state.failed
  },
  mutations: {
    setUser: (state, user) => (state.user = user),
    setLoading: (state, loading) => (state.loading = loading),
    setFailed: (state, failed) => (state.failed = failed)
  },
  actions: {
    login({ commit }) {
      commit('setFailed', true)
      commit('setLoading', true)
      const provider = new GoogleAuthProvider();
      signInWithPopup(getAuth(), provider).then(res => {
        const firestore = getFirestore();
        const userCollectionReference = collection(firestore, 'users');

        let allUsers = [];
        let newUser = false;
        onSnapshot(userCollectionReference, snapshot => {
          allUsers = snapshot.docs.map(doc => doc.id);
          if (!allUsers.includes(res.user.uid)) {
            newUser = true;
            setDoc(doc(firestore, "users", res.user.uid), {
              goals:[],
              tasks:[],
              name: res.user.displayName,
            }, { merge: true });


            let user = {
              id: res.user.uid,
              goals:[],
              tasks:[],
              name: res.user.displayName,
            }
            commit('setUser', user)
          }
        })
        if (!newUser) {
          const userDoc = doc(userCollectionReference, res.user.uid)
          onSnapshot(userDoc, snapshot => {
            const data = snapshot.data();
            let user = {
              id: res.user.uid
              , ...data
            }
            commit('setUser', user)
          })
        }

        commit('setFailed', false)
      }).catch(err => {
        console.error(err)
        commit('setFailed', true)
      }).finally(() => {
        commit('setLoading', false)
      })
    },
    updateUser({ commit }, user) {
      commit('setUser', user);
    },
  },
  modules: {
  }
})
