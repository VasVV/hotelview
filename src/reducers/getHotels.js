const getHotels = (state = {}, action) => {
    switch(action.type) {
        case 'PASS_INFO':
            return {...state, info: action.payload};
        case 'GET_HOTELS':
            return {...state, hotels: action.payload}
        default: 
            return state;
    }
}

export default getHotels;