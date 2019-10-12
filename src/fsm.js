class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error ('Add config');
        } else {
            this.initialState = config.initial;
            this.currentState = config.initial;
            this.states = config.states;
            this.transitions = this.states[this.currentState].transitions;

            this.historyForUndo = [];
            this.historyForRedo = [];
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.states[state]) {
            throw new Error ('No such state');
        } else {
            this.historyForUndo.push(this.currentState);
            this.currentState = state;
            this.transitions = this.states[this.currentState].transitions;
            this.historyForRedo = [];
            //console.log ("current state: ", this.currentState);
        }



    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        ////console.log (this.transitions[event]);
        if (!this.transitions[event]) {
            throw new Error ('No such event in this state');
        } else {
            this.changeState(this.transitions[event]);
        }
        ////console.log (this.transitions[event], this.currentState);

    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.initialState);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let resultArray = new Array();
        ////console.log (Object.keys(this.states));

        if (!event) {
            resultArray = Object.keys(this.states);
        } else {
        ////console.log (Object.entries(this.states));
            let arr = Object.entries(this.states);
            for (let i = 0; i < arr.length; i++) {
                let arr2 = Object.keys(arr[i][1].transitions);
                ////console.log (arr2);
                if (arr2.includes(event) == true) {
                    resultArray.push(arr[i][0]);
                    ////console.log (resultArray);
                }
            }
        }
        ////console.log (resultArray);
        return resultArray;

        
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.historyForUndo.length == 0) {
            return false;
        } else {
            this.historyForRedo.push(this.currentState);
            //console.log ('history for redo', this.historyForRedo);
            let previousState = this.historyForUndo.pop();
            //console.log (previousState, this.historyForUndo);
            this.currentState = previousState;
            this.transitions = this.states[this.currentState].transitions;
            return true;

        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.historyForRedo.length == 0) {
            return false;
        } else {
            let canceledState = this.historyForRedo.pop();
            ////console.log ('canceledState^ ', canceledState, this.historyForRedo);
            this.currentState = canceledState;
            this.historyForUndo.push(this.currentState);
            
            this.transitions = this.states[this.currentState].transitions;
            return true;

        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.historyForUndo = [];
        this.historyForRedo = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
