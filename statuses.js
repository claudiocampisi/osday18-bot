class Status {
    /* constructor(newUtterance = false, newQuestion = false,
        listQuestions = false, photoMessage = false, requestIntentFullFilled = false) {
            this.newUtterance = newUtterance;
            this.newQuestion = newQuestion;
            this.listQuestions = listQuestions;
            this.photoMessage = photoMessage;
            this.requestIntentFullFilled = requestIntentFullFilled;
    }
 */
    constructor() {
        this.statsVars = {
            deployStep: 0,
            monitorStep: 0,
            step: 0,
            start: false,
			chatId: 0,
			projectName: '',
			toDo: '',
			voice: false,
			file_path: ""
        };
    }

    /* set listQuestions(value) {
        if (typeof(value) === "boolean") return value;
        else return;
    }

    get listQuestions() {
        return this.listQuestions;
    } */
    
    setObj(obj) {
        this.statsVars = obj;
    } 

    getObj(){
        return this.statsVars;
    }
    
}

module.exports = Status;