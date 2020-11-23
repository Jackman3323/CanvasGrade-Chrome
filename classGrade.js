/*
This is a class object--makes organizing grades easier. (For GPA calculation)
 */
class classGrade{
    letterGrade;
    honorsBool;
    gpaScaleFloat;
    nameOfClass;

    constructor(nameOfClass, letterGrade, isHonors){
        this.letterGrade = letterGrade;
        this.nameOfClass = nameOfClass;
        this.honorsBool = isHonors;
        this.gpaScaleFloat = 0.0;
    }

    getGpaFloat(){
        switch(this.letterGrade){
            case "A+":
                this.gpaScaleFloat = 4.3;
                break;
            case "A":
                this.gpaScaleFloat = 4.0;
                break;
            case "A-":
                this.gpaScaleFloat = 3.7;
                break;
            case "B+":
                this.gpaScaleFloat = 3.3;
                break;
            case "B":
                this.gpaScaleFloat = 3.0;
                break;
            case "B-":
                this.gpaScaleFloat = 2.7;
                break;
            case "C+":
                this.gpaScaleFloat = 2.3;
                break;
            case "C":
                this.gpaScaleFloat = 2.0;
                break;
            case "C-":
                this.gpaScaleFloat = 1.7;
                break;
            case "D+":
                this.gpaScaleFloat = 1.3;
                break;
            case "D":
                this.gpaScaleFloat = 1.0;
                break;
            case "D-":
                this.gpaScaleFloat = 0.7;
                break;
            case "F":
                this.gpaScaleFloat = 0.3;
                break;
        }
        if(this.honorsBool) {
            this.gpaScaleFloat = this.gpaScaleFloat * 1.1;
        }
        return this.gpaScaleFloat;
    }

    isHonors(){
        return this.honorsBool;
    }

    getName(){
        return this.nameOfClass;
    }


}