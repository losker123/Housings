import { makeAutoObservable } from "mobx"

export default class HousingStore {
    constructor() {
        this._categories = []
        this._housing = []
        this._selectedCategory = null 
        this._searchName = '' 
        this._date = ''
        makeAutoObservable(this)
    }

    setSelectedCategory(category) {
        this._selectedCategory = category
    }

    setDate(date) {
        this._date = date 
    }

    setSearchName(searchName) {
        this._searchName = searchName 
    }

    setCategory(categories) {
        this._categories = categories 
    }
    setHousing(housing) {
        this._housing = housing
    }

    get categories() {
        return this._categories
    }
    get housing() {
        return this._housing
    }
    get selectedCategory() {
        return this._selectedCategory
    }

    get searchName(){
        return this._searchName
    }
    get date() {
        return this._date
    }
}