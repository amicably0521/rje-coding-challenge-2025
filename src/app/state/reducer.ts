import { createReducer, on, Action } from "@ngrx/store";
import { Contact } from "../models/contact.model";
import * as actions from "./actions";
import * as _ from 'lodash';

export interface State {
    contactList : Contact[];
    selectedContactId : number | null;
    loading : boolean;
}

const initialState: State = {
    contactList : [],
    selectedContactId : null,
    loading : false
}

//#region Helper Functions

function upsertContactList(contactList: Contact[], updatedContact: Contact): Contact[] {
    const index = _.findIndex(contactList, { id: updatedContact.id });
    if (index < 0) {
      return [...contactList, updatedContact];
    }
   
    return [...contactList.slice(0, index), updatedContact, ...contactList.slice(index + 1)];
}

//#endregion

export const reducer = createReducer(
    initialState,
    on(actions.loadContacts, (state) => ({
        ...state,
        loading: true
    })),

    on(actions.contactListReturned, (state, action) => ({
        ...state,
        contactList : action.contactList,
        loading: false
    })),

    on(actions.contactSavedSuccess, (state, action) => ({
        ...state,
        contactList : upsertContactList(state.contactList, action.contact)
    })),

    on(actions.contactSelected, (state, action) => ({
        ...state,
        selectedContactId : action.contactId
    })),

    on(actions.editContactClicked, (state, action) => ({
        ...state,
        selectedContactId : action.contact.id
    }))

)
