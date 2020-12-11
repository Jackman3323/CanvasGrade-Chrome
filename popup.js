/*
THIS IS THE POPUP SCRIPT
WHEN INVOKED, IT CALCULATES GPA WITH ALL MOST RECENT STORED GRADES.
INCLUDES A BUTTON TO OPEN, UPDATE, THEN CLOSE ALL SAVED CLASSES AS
A PAINLESS QUICK WAY TO UPDATE GPA.
 */

/*
This is a class object--makes organizing grades easier. (For GPA calculation)
 */


class classGrade {
    letterGrade;
    honorsBool;
    gpaScaleFloat;
    className;
    updateCode;
    fullCode;
    constructor(nameOfClass, letterGrade, isHonors, updateCode, full) {
        this.letterGrade = letterGrade;
        this.className = nameOfClass;
        this.honorsBool = isHonors;
        this.gpaScaleFloat = 0.0;
        this.updateCode = updateCode;
        this.fullCode = full;
    }
    getFullCode(){
        return this.fullCode;
    }
    getLetterGrade() {
        return this.letterGrade;
    }

    getGpaFloat() {
        switch (this.letterGrade) {
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
        if (this.honorsBool) {
            this.gpaScaleFloat = this.gpaScaleFloat * 1.1;
        }
        return this.gpaScaleFloat;
    }

    isHonors() {
        return this.honorsBool;
    }

    getName() {
        return this.className;
    }

    getUpdateLink() {
        return 'https://kentdenver.instructure.com/courses/' + this.updateCode + '/grades';
    }
    toString(){
        return 'Name: ' + this.getName() + '. Grade: ' + this.getLetterGrade() + '. GPA: ' + this.getGpaFloat();
    }
}

//START ACTUAL SCRIPT HERE
let numClasses = 0;
let classArray = [];
let GPA = 0;

function getGPA() {
    let total = 0;
    for (let i = 0; i < numClasses; i++) {
        total += classArray[i].getGpaFloat();
    }
    GPA = total / numClasses;
    return total / numClasses;
}

function createObj(nameOfClass, letterGrade) {
    let full = nameOfClass;
    let isHonors = nameOfClass.includes('__HONORS');
    let link = nameOfClass.split('___')[1];
    nameOfClass = nameOfClass.split('_')[1]; //Get just the name of the class; no encoding garbage
    nameOfClass = nameOfClass.replaceAll('-',' '); //Return hyphens to spaces for nice formatting
    for (let i = 0; i < letterGrade.length; i++) {
        if (letterGrade.charAt(i) === '(' || letterGrade.charAt(i) === ')') {
            letterGrade = letterGrade.replace(letterGrade.charAt(i), '');
            //Remove parentheses.
        }
    }
    console.log(letterGrade);
    return new classGrade(nameOfClass, letterGrade, isHonors, link,full);
}

function deleteClass(classNumber) {
    console.log("DELETE");
    chrome.storage.sync.remove([classArray[classNumber].getFullCode()],function(){
        console.log("Delete?");
        window.location.reload();
        classArray.splice(classNumber,1);
        numClasses--;
    });
}

function updateClass(link) {
    console.log("UPDATE");
    chrome.tabs.create({url: link});
}
function checkStorage(){
    numClasses = 0;
    classArray = [];
    resetHtmlLoop();
    chrome.storage.sync.get(null, function (items) {
        let entries = Object.entries(items);
        entries.forEach(entry => {
            console.log("Trying");
            console.log(entry[0]);
            if (entry[0].includes('CanvasClass_')) {
                console.log("Class found");
                numClasses = numClasses +1;
                classArray = classArray.concat(createObj(entry[0], entry[1]));
                htmlLoop(numClasses);
            }
        });

    });
}
function resetHtmlLoop(){
    let elem = document.getElementById("specialcooldiv");
    elem.innerHTML = "<div style=\"margin: 0 auto\">\n" +
        "        <h1 id=\"MAIN\" style=\"text-align:center\">Go to the grade page of each class once.</h1>\n" +
        "    </div>\n" +
        "    <div style = \"padding-left: 10px; padding-right: 20px; padding-bottom: 10px\">\n" +
        "        <h4 style=\"margin-top: 10px; margin-bottom: 10px;\">Courses:</h4>\n" +
        "        <hr class=\"classLine\">\n" +
        "        <div id=\"CanvasGradeCourse0\"></div>\n" +
        "        <div id=\"CanvasGradeCourse1\"></div>\n" +
        "        <div id=\"CanvasGradeCourse2\"></div>\n" +
        "        <div id=\"CanvasGradeCourse3\"></div>\n" +
        "        <div id=\"CanvasGradeCourse4\"></div>\n" +
        "        <div id=\"CanvasGradeCourse5\"></div>\n" +
        "        <div id=\"CanvasGradeCourse6\"></div>\n" +
        "        <div id=\"CanvasGradeCourse7\"></div>\n" +
        "        <div id=\"CanvasGradeCourse8\"></div>\n" +
        "        <div id=\"CanvasGradeCourse9\"></div>\n" +
        "    </div>";
}
function htmlLoop(times){
    for (let i = 0; i < times; i++) {
        let updateButtonId = 'updateButton' + i;
        let removeButtonId = 'removeButton' + i;
        let courseID = 'CanvasGradeCourse' + i;
        console.log("In loop");
        console.log(classArray[i].toString());


        let htmlThing =
        `<div class = 'CanvasGradeClass'>
            <div class = 'nameOfClass'>
                <p class = 'name'>${classArray[i].getName()}</p>
            </div>
            <div class = 'GPAOfClass'>
                <p class = 'gpa'>${classArray[i].getGpaFloat()}</p>
            </div>
            <div class = 'gradeOfClass'>
                <p class = 'grade'>${classArray[i].getLetterGrade()}</p>
            </div>
        </div>
        <div class = 'CanvasButtonClass'>
            <div class = 'updateClass'>
                <button class = 'updateButton' id = ${updateButtonId}>Update Class</button>
            </div>
            <div class = 'removeClass'>
                <button class = 'removeButton' id=${removeButtonId}>Remove Class</button>
            </div>
        </div>
        <hr class = "classLine">`;


        document.getElementById(courseID).innerHTML = htmlThing;
        document.getElementById(removeButtonId).addEventListener("click", function () {
            deleteClass(i);
        });
        document.getElementById(updateButtonId).addEventListener("click", function () {
            updateClass(classArray[i].getUpdateLink());
        });
        //GPA!!
        document.getElementById('MAIN').textContent = 'GPA: ' + getGPA().toFixed(3);
    }
}
function update() {
    GPA = 0;
    checkStorage();
    console.log(numClasses);

}

window.addEventListener('load', function () {
    update();
});
chrome.storage.sync.onChanged.addListener(function(){
    console.log("Diid it.")
    update();
});