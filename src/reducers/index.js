import { combineReducers } from 'redux';
import addRemoveFavs from './addRemoveFavs';
import hardcodedImages from './hardcodedImages';
import getHotels from './getHotels';

export default combineReducers({
    addRemoveFavs, 
    hardcodedImages,
    getHotels
})