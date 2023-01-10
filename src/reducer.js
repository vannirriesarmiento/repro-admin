export default function reducer(state, { type, payload }) {
    switch (type) {
        case "TOGGLE_LOADING":
            return {
                ...state,
                loading: payload
            }
        case "AUTHENTICATION":
            return {
                ...state,
                user: payload
            }

        case "FETCH_DETAILS":
            return {
                ...state,
                details: payload,
            };
        case "DELETE_DETAILS":
            return {
                ...state,
                details: state.details.filter(item => item.id !== payload.id)
            }
        default:
    }
}