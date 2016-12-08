// ==UserScript==
// @name         Better WooWee
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       SebRut
// @match        https://woowee.de/aufgaben/
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==


var timeRegEx = /(\d+) Min. (\d+) Sek./;
var secsTillNextTask = 0;

function updateTaskTimer() {
    secsTillNextTask--;
    if(secsTillNextTask < 0) {
        location.reload();
        return;
    }
    taskTimer.text((secsTillNextTask > 60 ? Math.floor(secsTillNextTask / 60) + " Minute(s), " : "") + secsTillNextTask%60 + " Second(s)");

    setTimeout(updateTaskTimer, 1000);
}

function prepareTaskTimer() {
    var nextTaskEl = $("body > div.body > div > div:nth-child(4) > div > div.col-md-9 > div:nth-child(7) > table > tbody > tr").first();

    if(nextTaskEl !== null) {
        var timeEl = $(nextTaskEl).find("td:nth-child(4)");
        if(timeEl !== null) {
            var mins = timeEl.text().match(timeRegEx)[1];
            var secs = timeEl.text().match(timeRegEx)[2];
            secsTillNextTask = eval(mins * 60) + eval(secs);
            console.log(mins + " " + secs + " " + secsTillNextTask);
            setTimeout(updateTaskTimer, 1000);
            return;
        }
    }
    taskTimer.text("No task available");
}

var taskTimer;

function setUpUI() {
    $("body > div.body > div > div:nth-child(4) > div > div.col-md-9 > p").hide();
    
    var dashboardRoot = $("body > div.body > div > div:nth-child(2)");
    dashboardRoot.empty();

    var tDiv = $(document.createElement('div'));
    tDiv.addClass("table-responsive");

    var table = $(document.createElement('table'));
    table.addClass("table");

    var tBody = $(document.createElement('tbody'));

    var row = $(document.createElement('tr'));
    var leftCell = $(document.createElement('td'));
    leftCell.text("Time till next task");
    row.append(leftCell);
    var taskTimerCell = $(document.createElement('td'));
    taskTimerCell.addClass("alignright");
    taskTimer = $(document.createElement('strong'));
    taskTimer.text("unknown");
    taskTimerCell.append(taskTimer);
    row.append(taskTimerCell);
    tBody.append(row);
    
    row = $(document.createElement('tr'));
    var leftCell = $(document.createElement('td'));
    leftCell.text("Revenue/Payout Limit");
    row.append(leftCell);
    var rightCell = $(document.createElement('td'));
    rightCell.addClass("alignright");
    var val = $(document.createElement('strong'));
    var rev = $("body > div.body > div > div:nth-child(4) > div > div.col-md-3 > div > aside > p > strong:nth-child(3)").text().replace(" €", "").replace(",",".");
    var percentage = Math.floor(eval(rev)/5 * 100);
    val.text(rev + "€ / " + percentage + "%");
    rightCell.append(val);
    row.append(rightCell);
    
    
    tBody.append(row);
    table.append(tBody);
    tDiv.append(table);
    dashboardRoot.append(tDiv);

    prepareTaskTimer();
}

(function() {
    'use strict';

    setUpUI();
    $("body > div.body > div > div:nth-child(4) > div > div.col-md-9 > div:nth-child(3) > table > tbody > tr:nth-child(1)").trigger("click");
setTimeout(function() {$("#submit").trigger("click");}, 500);
})();