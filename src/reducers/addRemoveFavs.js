const addRemoveFavs = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TO_FAVS':
            return [...state, action.payload];
        case 'REMOVE_FROM_FAVS':
            return [
                ...state.slice(0, action.payload),
                ...state.slice(action.payload + 1)
            ];
        case 'EMPTY_FAVS':
            return [];
        case 'SORT_RATING_UP':
            return state.slice().sort((a,b) => a.guestReviews.unformattedRating - b.guestReviews.unformattedRating);
        case 'SORT_RATING_DOWN': 
            return state.slice().sort((a,b) => b.guestReviews.unformattedRating - a.guestReviews.unformattedRating);
        case 'SORT_PRICE_UP':
            return state.slice().sort((a,b) => a.ratePlan.price.exactCurrent - b.ratePlan.price.exactCurrent);
        case 'SORT_PRICE_DOWN': 
            return state.slice().sort((a,b) => b.ratePlan.price.exactCurrent - a.ratePlan.price.exactCurrent);    
        default:
            return state;
    }
};

export default addRemoveFavs;