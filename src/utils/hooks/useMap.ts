import { computed } from 'vue'
import { mapGetters, mapState, useStore, createNamespacedHelpers, mapActions, mapMutations } from 'vuex'

const useMapper = (mapper, mapFn, isFn = false) => {
  const store = useStore()

  const storeStateFns = mapFn(mapper)
  const storeState = {}
  Object.keys(storeStateFns).forEach((keyFn) => {
    const fn = storeStateFns[keyFn].bind({ $store: store })
    storeState[keyFn] = isFn ? fn : computed(fn)
  })

  return storeState
}

export const useState = (mapper) => {
  let mapperFn = mapState
  return useMapper(mapper, mapperFn)
}

export const useGetters = (mapper) => {
  let mapperFn = mapGetters
  return useMapper(mapper, mapperFn)
}

export const useActions = (mapper) => {
  let mapperFn = mapActions
 
  return useMapper(mapper, mapperFn, true)
}

export const useMutations = (mapper) => {
  let mapperFn = mapMutations
  return useMapper(mapper, mapperFn, true)
}
