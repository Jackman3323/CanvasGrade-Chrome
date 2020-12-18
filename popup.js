/*
popup.js

This file is the javascript file for the popup window. It handles all the buttons and updating the html of the popup to reflect
any and all relevant information in chrome.storage.

Authors: Jack Hughes

Date of Creation: 11-8-20

-JBH
 */

/*
|                       |
|    GLOBAL-VARIABLES   |
|                       |
 */

//classGrade: a class for grade management (makes my life and readability better)
class classGrade {
    //INSTANCE-DATA
    //All of this is self explanatory
    letterGrade;
    honorsBool;
    gpaScaleFloat;
    className;
    //These two are for the update class button which is further explained in modifier.js in global-variables
    updateCode;
    fullCode;

    //CONSTRUCTORS
    //default constructor
    constructor(nameOfClass, letterGrade, isHonors, updateCode, full) {
        this.letterGrade = letterGrade;
        this.className = nameOfClass;
        this.honorsBool = isHonors;
        this.gpaScaleFloat = 0.0;
        this.updateCode = updateCode;
        this.fullCode = full;
    }

    //METHODS
    //get the full update code
    getFullCode(){
        return this.fullCode;
    }
    //get the letter grade
    getLetterGrade() {
        return this.letterGrade;
    }
    //get the GPA scale float
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
    //return honors status
    isHonors() {
        return this.honorsBool;
    }
    //return class name
    getName() {
        return this.className;
    }
    //return update hyperlink
    getUpdateLink() {
        return 'https://kentdenver.instructure.com/courses/' + this.updateCode + '/grades';
    }
    //return all class info
    toString(){
        return 'Name: ' + this.getName() + '. Grade: ' + this.getLetterGrade() + '. GPA: ' + this.getGpaFloat();
    }
}

//numClasses: the number of classes found in storage
let numClasses = 0;
//classArray: array of class objects (class above)
let classArray = [];
//GPA: global GPA variable
let GPA = 0;

/*
|                       |
|    HELPER-METHODS     |
|                       |
 */

//getGPA: gets the total GPA
function getGPA() {
    let total = 0;
    for (let i = 0; i < numClasses; i++) {
        //get GPA float of every stored class
        total += classArray[i].getGpaFloat();
    }
    //calculate GPA
    GPA = total / numClasses;
    return total / numClasses;
}
//createObj: input a name and a letter grade, output a new classGrade object (class defined above)
function createObj(nameOfClass, letterGrade) {
    let full = nameOfClass;
    //get stuff from storage data
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
    //console.log(letterGrade);
    return new classGrade(nameOfClass, letterGrade, isHonors, link,full);
}
//deleteClass: deletes the relevant class from the popup window and storage
function deleteClass(classNumber) {
    //console.log("DELETE");
    chrome.storage.sync.remove([classArray[classNumber].getFullCode()],function(){
        //console.log("Delete?");
        //delete the class
        classArray.splice(classNumber,1);
        numClasses--;
        //reload the window so that it displays correctly
        window.location.reload();
    });
}
//updateClass: open a new tab with the relevant hyperlink
function updateClass(link) {
    //console.log("UPDATE");
    chrome.tabs.create({url: link});
}
//checkStorage: output an array of classGrade objects made from all classes in storage
function checkStorage(){
    numClasses = 0;
    classArray = [];
    //reset the html of the popup window in case # of classes shrinks, we need to wipe classes farther down
    resetHtmlLoop();
    chrome.storage.sync.get(null, function (items) {
        let entries = Object.entries(items);
        entries.forEach(entry => {
            //console.log("Trying");
            //console.log(entry[0]);
            if (entry[0].includes('CanvasClass_')) {
                //console.log("Class found");
                //We found a claass!
                //Increment numClasses
                numClasses = numClasses +1;
                //update classArray with a new object
                classArray = classArray.concat(createObj(entry[0], entry[1]));
                //update the HTML
                htmlLoop(numClasses);
            }
        });
    });
}
//resetHtmlLoop: reset the html of the popup window to the default so that no garbage happens when deleting classes
function resetHtmlLoop(){
    //target element to reset
    let elem = document.getElementById("specialcooldiv");
    //reset the element to the following default html:
    elem.innerHTML =
    `<div style=\"margin: 0 auto\">
        <h1 id=\"MAIN\" style=\"text-align:center\">Go to the grade page of each class once.</h1>
    </div>
    <div style = \"padding-left: 10px; padding-right: 20px; padding-bottom: 10px\">
        <h4 style=\"margin-top: 10px; margin-bottom: 10px;\">Courses:</h4>
        <hr class=\"classLine\">
        <div id=\"CanvasGradeCourse0\"></div> 
        <div id=\"CanvasGradeCourse1\"></div> 
        <div id=\"CanvasGradeCourse2\"></div> 
        <div id=\"CanvasGradeCourse3\"></div> 
        <div id=\"CanvasGradeCourse4\"></div> 
        <div id=\"CanvasGradeCourse5\"></div> 
        <div id=\"CanvasGradeCourse6\"></div> 
        <div id=\"CanvasGradeCourse7\"></div> 
        <div id=\"CanvasGradeCourse8\"></div> 
        <div id=\"CanvasGradeCourse9\"></div>
    </div>`;
}
//htmlLoop: updates the html of the popup by adding a row for a class (runs once per class, hence the input)
function htmlLoop(times){
    //run once per class
    for (let i = 0; i < times; i++) {
        let updateButtonId = 'updateButton' + i;
        let removeButtonId = 'removeButton' + i;
        let courseID = 'CanvasGradeCourse' + i;
        //console.log("In loop");
        //console.log(classArray[i].toString());

        //html variable:
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

        //set target element to above html
        document.getElementById(courseID).innerHTML = htmlThing;
        //add remove button
        document.getElementById(removeButtonId).addEventListener("click", function () {
            deleteClass(i);
        });
        //add update button
        document.getElementById(updateButtonId).addEventListener("click", function () {
            updateClass(classArray[i].getUpdateLink());
        });
        //update GPA!
        document.getElementById('MAIN').textContent = 'GPA: ' + getGPA().toFixed(3);
    }
}

/*
|                       |
|     MAIN-METHODS      |
|                       |
 */

//update: updates the entire popup.
function update() {
    //reset GPA
    GPA = 0;
    //check storage (which then calls everything else)
    checkStorage();
    //console.log(numClasses);
}

/*
|                       |
|       EXECUTION       |
|                       |
 */

//when the window is loaded or reloaded, update the popup window
window.addEventListener('load', function () {
    update();
});

//when anything in storage is changed or something is added, update the popup window
chrome.storage.sync.onChanged.addListener(function(){
    update();
});