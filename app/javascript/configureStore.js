import { createStore, applyMiddleware } from "redux";

import thunk from "redux-thunk";

import { composeWithDevTools } from "redux-devtools-extension";

import reducers from "./reducers";

// export default function configureStore(initialState = {}) {
//   const store = createStore(
//     rootReducer,
//     initialState,
//     composeWithDevTools(applyMiddleware(thunk))
//   );
//   return store;
// }
export default function configureStore(initialState = {}) {
  let middleware = [thunk];
  // always push redux middle to production per medium articles regarding security
  let composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  });
  return createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
  );
}
