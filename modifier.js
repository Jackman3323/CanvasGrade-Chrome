/*
This is the main file.
*/
chrome.storage.local.set({'Test': '5'}, function(){
    console.log("In theory, test complete.");
});
console.log("MODIFIER.JS HAS BEEN ACTIVATED");
chrome.storage.sync.set({'urmom':'urmom'},function(){});
let table = document.querySelector("#grades_summary > tbody");
let outputField = document.querySelector("#student-grades-final");
let totalPoints = 0;
let earnedPoints = 0;
let weighted = (document.querySelector("#assignments-not-weighted > div:nth-child(1) > h2").textContent !== "Course assignments are not weighted.")
const shortTablePath = document.getElementById("grades_summary");

//This method returns true if the assignment contains the "grade was changed" span
function wasChanged(tr){
    let htmlPath = "#" + tr.id + " > td.assignment_score > div > span.tooltip > span";
    return document.querySelector(htmlPath).className === "grade changed";
}

//This version of the method gets the total points for the whole class
function getTotalPoints(){
    let counter = 0; //Point counter
    let rows = Array.from(table.rows); //Array object made from gradeTable rows
    let htmlPath = " > td.possible.points_possible"; //HTML path to get to the total points within the table data (td)
    rows.forEach(tr => { //tr = table row in html
        let rowName = tr.className;
        if(rowName === "student_assignment assignment_graded editable"){
            //This row of the chart pertains to an assignment, not a detail/class average/rubric row.
            //Thus, we need to add this row's possible points to the total counter
            //Assembles full HTML path that includes the id of the table row
            let fullPath = "#" + tr.id + htmlPath;
            //Converts total points text to a number, adds it to counter
            counter += parseFloat(document.querySelector(fullPath).textContent);
        }
        else if(rowName === "student_assignment editable" && wasChanged(tr)){
            //This is a not graded assignment that the user has entered a what if score into
            //Thus we must now treat it as graded and count its points.
            let fullPath = "#" + tr.id + htmlPath;
            //Converts total points text to a number, adds it to counter
            counter += parseFloat(document.querySelector(fullPath).textContent);
        }
    })
    return counter;
}

//This method returns the earned total points
function getEarnedPoints(){
    let counter = 0; //Point counter
    let rows = Array.from(table.rows); //Array object made from gradeTable rows
    let htmlPath = " > td.assignment_score > div > div > span.what_if_score "; //HTML path to get to the total points within the table data (td)
    rows.forEach(tr => { //tr = table row in html
        let rowName = tr.className;
        if(rowName === "student_assignment assignment_graded editable"){
            //This row of the chart pertains to an assignment, not a detail/class average/rubric row.
            //Thus, we need to add this row's possible points to the total counter
            //Assembles full HTML path that includes the id of the table row
            let fullPath = "#" + tr.id + htmlPath;
            //Converts total points text to a number, adds it to counter
            counter += parseFloat(document.querySelector(fullPath).textContent);
        }
        else if(rowName === "student_assignment editable" && wasChanged(tr)){
            //This is a not graded assignment that the user has entered a what if score into
            //Thus we must now treat it as graded and count its points.
            let fullPath = "#" + tr.id + htmlPath;
            //Converts total points text to a number, adds it to counter
            counter += parseFloat(document.querySelector(fullPath).textContent);
        }
    })
    return counter;
}

//This version of the method goes through a category and gets total points of category
function getCategoryTotalPoints(category){
    let counter = 0; //Point counter
    let rows = Array.from(table.rows); //Array object made from gradeTable rows
    let htmlPath = " > td.possible.points_possible"; //HTML path to get to the total points within the table data (td)
    rows.forEach(tr => { //tr = table row in html
        let rowName = tr.className;
        if(rowName === "student_assignment assignment_graded editable"){
            let path = "#" + tr.id + " > th > div";
            let curCategory = document.querySelector(path).textContent; //Gets the category of this assignment
            if(curCategory === category){
                //This row of the chart pertains to an assignment in the passed category,
                //not a detail/class average/rubric row.
                //Thus, we need to add this row's possible points to the total counter
                //Assembles full HTML path that includes the id of the table row
                let fullPath = "#" + tr.id + htmlPath;
                //Converts total points text to a number, adds it to counter
                counter += parseFloat(document.querySelector(fullPath).textContent);
            }
        }
        else if(rowName === "student_assignment editable" && wasChanged(tr)){
            let curCategory = document.querySelector(path).textContent; //Gets the category of this assignment
            if(curCategory === category){
                //This is a not graded assignment that the user has entered a what if score into
                //Thus we must now treat it as graded and count its points.
                let fullPath = "#" + tr.id + htmlPath;
                //Converts total points text to a number, adds it to counter
                counter += parseFloat(document.querySelector(fullPath).textContent);
            }
        }
    })
    return counter;
}
//Returns earned points in a category
function getCategoryEarnedPoints(category){
    let counter = 0; //Point counter
    let rows = Array.from(table.rows); //Array object made from gradeTable rows
    let htmlPath = " > td.assignment_score > div > div > span.what_if_score"; //HTML path to get to the total points within the table data (td)
    rows.forEach(tr => { //tr = table row in html
        let rowName = tr.className;
        if(rowName === "student_assignment assignment_graded editable"){
            let path = "#" + tr.id + " > th > div";
            let curCategory = document.querySelector(path).textContent; //Gets the category of this assignment
            if(curCategory === category){
                //This row of the chart pertains to an assignment in the passed category,
                //not a detail/class average/rubric row.
                //Thus, we need to add this row's possible points to the total counter
                //Assembles full HTML path that includes the id of the table row
                let fullPath = "#" + tr.id + htmlPath;
                //Converts total points text to a number, adds it to counter
                counter += parseFloat(document.querySelector(fullPath).textContent);
            }
        }
        else if(rowName === "student_assignment editable" && wasChanged(tr)){
            let curCategory = document.querySelector(path).textContent; //Gets the category of this assignment
            if(curCategory === category){
                //This is a not graded assignment that the user has entered a what if score into
                //Thus we must now treat it as graded and count its points.
                let fullPath = "#" + tr.id + htmlPath;
                //Converts total points text to a number, adds it to counter
                counter += parseFloat(document.querySelector(fullPath).textContent);
            }
        }
    })
    return counter;
}

//This method calculates a percnentage.
function calculatePercentage(earned, total){
    if(Number.isNaN(earned) || Number.isNaN(total)){
        //If either number is NaN, return something applicable
        return "--%"
    }
    let step1 = earned/total;
    return (100 * step1).toFixed(2);
}

//This method removes all spaces up to the first non space and all spaces after the last non-space in a string.
function removeEdgeSpaces(input){
    return input.trim();
}
//This method passes in a category, it goes through the table and finds the total row of the entered category.
//Then, it formats it to say the correct thing.
function updateCategoryTotalRow(category, weight){
    let rows = Array.from(table.rows); //Array object made from gradeTable rows
    let counter = 0;
    let titlePath = " > th";
    let earnedPath = " > td.assignment_score";
    let totalPath = " > td.possible.points_possible";
    let detailsPath = " >  td.details";
    //Now we find the index of the total row and then do some stuff with it
    rows.forEach(tr => {
        let rowName = tr.className;
        if(rowName === "student_assignment hard_coded group_total"){
            let path = "#" + tr.id + " > th";
            let curCategory = document.querySelector(path).textContent; //Gets the category of this assignment
            let curCategoryFormatted = removeEdgeSpaces(curCategory);
            if(curCategoryFormatted === category){
                //Total row of the desired category found.
                //Begin updating.
                //Paths to get to data in the row so that we can change it easily
                let finalTitlePath = "#" + tr.id + titlePath;
                let finalEarnedPath = "#" + tr.id + earnedPath;
                let finalTotalPath = "#" + tr.id + totalPath;
                let finalDetailsPath = "#" + tr.id + detailsPath;
                //Begin changing data:
                let percentString = String(calculatePercentage(getCategoryEarnedPoints(category),getCategoryTotalPoints(category)).toFixed(2)) + "%";
                let titleString = category + " (" + weight + "% of final grade)";
                document.querySelector(finalTitlePath).innerHTML = "<p style=\"font-size:100%\"> <b>" + titleString + "</b> </p>";

                document.querySelector(finalEarnedPath).innerHTML = getCategoryEarnedPoints(category).toFixed(2);

                document.querySelector(finalTotalPath).innerHTML = "<p style=\"font-size:130%\" title> <b>" + getCategoryTotalPoints(category) + "</b> </p>";

                document.querySelector(finalDetailsPath).innerHTML = "<p style=\"font-size:120%\"> <b>" + percentString + "</b> </p>";

            }
        }
    })
}

//This method does not pass in a category. It is for unweighted classes.
function updateTotalRow(){
    let rows = Array.from(table.rows); //Array object made from gradeTable rows
    let counter = 0;
    let titlePath = " > th";
    let earnedPath = " > td.assignment_score";
    let totalPath = " > td.possible.points_possible";
    let detailsPath = " >  td.details";
    let foundMainRow = false;
    //Now we find the index of the total row and then do some stuff with it
    rows.forEach(tr => {
        let rowName = tr.className;
        if(foundMainRow){
            tr.remove(); //Remove per-category rows if it's not a weighted class
        }
        else if(rowName === "student_assignment hard_coded group_total"){
            foundMainRow = true;
            //Total row of the desired category found.
            //Begin updating.
            //Paths to get to data in the row so that we can change it easily
            let finalTitlePath = "#" + tr.id + titlePath;
            let finalEarnedPath = "#" + tr.id + earnedPath;
            let finalTotalPath = "#" + tr.id + totalPath;
            let finalDetailsPath = "#" + tr.id + detailsPath;
            //Begin changing data:
            let percentString = String(calculatePercentage(getEarnedPoints(),getTotalPoints()) + "%");
            document.querySelector(finalTitlePath).innerHTML = "Total:";
            document.querySelector(finalEarnedPath).innerHTML = getEarnedPoints().toFixed(2);
            //toFixed is for rounding--otherwise canvas produces this really really weird formatting issue where it has a number that's
            // eight decimal places when it should be a whole number
            document.querySelector(finalTotalPath).innerHTML = "<p style=\"font-size:130%\" title> <b>" + getTotalPoints() + "</b> </p>";
            document.querySelector(finalDetailsPath).innerHTML = percentString;
        }
    })
}

//This method displays the final grade that is passed into it
function displayFinalGrade(grade){
    //LetterGrade Section:
    let letterGrade = "F";
    if(grade >= 60 && grade < 63){letterGrade = "(D-)";}
    else if(grade >= 63 && grade < 67) {letterGrade = "(D)";}
    else if(grade >= 67 && grade < 70) {letterGrade = "(D+)";}
    else if(grade >= 70 && grade < 73) {letterGrade = "(C-)";}
    else if(grade >= 73 && grade < 77) {letterGrade = "(C)";}
    else if(grade >= 77 && grade < 80) {letterGrade = "(C+)";}
    else if(grade >= 80 && grade < 83) {letterGrade = "(B-)";}
    else if(grade >= 83 && grade < 87) {letterGrade = "(B+)";}
    else if(grade >= 87 && grade < 90) {letterGrade = "(B+)";}
    else if(grade >= 90 && grade < 93) {letterGrade = "(A-)";}
    else if(grade >= 93 && grade < 97) {letterGrade = "(A)";}
    else if(grade >= 97) {letterGrade = "(A+)";}
    outputField.textContent = String(grade + "% " + letterGrade);
    return letterGrade;
}
function main(){
    console.log("PROCESS ENGAGED");
    //main section
    let finalGrade = 0.0;
    if(weighted) {
        //Class is weighted
        //Running total of grade
        //HTML shmorgeshborg of weights and categories
        let categoryWeightsHTML = document.querySelector("#assignments-not-weighted > div:nth-child(1) > table > tbody");
        for (let row of categoryWeightsHTML.rows) {
            //Set up all above arrays
            let category = row.cells[0].textContent; //current category number
            let weight = parseFloat(row.cells[1].textContent);
            //Update format
            updateCategoryTotalRow(category, weight);
            //Update running grade total
            let curGrade = (weight * (getCategoryEarnedPoints(category) / getCategoryTotalPoints(category)));
            if (!Number.isNaN(curGrade)) {
                //add curGrade to the total
                finalGrade += curGrade
            }
        }
    }
    else{
        //Class is not weighted
        finalGrade = calculatePercentage(getEarnedPoints(),getTotalPoints());
        updateTotalRow();
    }
    let nameOfClass;
    let nameOfClassFull = String(document.querySelector("#breadcrumbs > ul > li:nth-child(2) > a > span").textContent);
    if(nameOfClassFull.indexOf("-") !== -1){
        let nameOfClassArray = nameOfClassFull.split("-");
        nameOfClass = nameOfClassArray[1];
    }
    else{
        nameOfClass = nameOfClassFull;
    }
    let isHonors = nameOfClass.indexOf(" Honors") !== -1 || nameOfClass.indexOf(" honors") !== -1 || nameOfClass.indexOf(" AP") !== -1;
    if(isHonors){
        nameOfClass += '+';
    }
    console.log(finalGrade);
    let letterGrade = displayFinalGrade(finalGrade);
    chrome.storage.local.set({nameOfClass: letterGrade}, function(){
        console.log("Supposedly, we did it...");
        console.log(nameOfClass + letterGrade);
    });
    chrome.storage.local.get([nameOfClass], function(result) {
        console.log('Class name is: ' + result.key)
        console.log('Value is currently: ' + result.value);
    })
}

const mutationObserver = new MutationObserver(function (mutations) {
    let done = false; //Variable to shoddily improve performance:
    mutationObserver.disconnect();
    // No longer runs six times per textbox edit--only once (or in edge cases, twice)
    // Does this by only recalculating on the first mutation
    mutations.forEach(function (mutation) {
        if(!done) {
            main(mutationObserver);
        }
        done = true;
    });
    mutationObserver.observe(shortTablePath, {
        childList: true,
        subtree: true
    });
});

mutationObserver.observe(shortTablePath, {
    childList: true,
    subtree: true
});

main(mutationObserver);
