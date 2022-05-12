import {MutationTree} from "vuex";
import {State} from "@/types/store";
import {User} from "@/types/dto";

export const mutations: MutationTree<State> = {
    setUser(state, user?: User) {
        state.user = user;
    }
}
