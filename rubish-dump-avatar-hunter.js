// ==UserScript==
// @name         Rubish Dump Avatar Hunter
// @namespace    http://tampermonkey.net/
// @version      v1.1.0-beta
// @description  Automatically refreshes Rubish Dump looking for the avatar
// @author       Ramsestone
// @match        https://www.neopets.com/medieval/rubbishdump.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// ==/UserScript==

const valid_items = [
    "Apple Core",
    "Blue Paint Brush",
    "Darigan Paint Brush",
    "Dragoyle",
    "Dung Catapult",
    "Enchanted Kiko Squeeze Toy",
    "Everlasting Apple",
    "Fading Bottled Air Faerie",
    "Fading Bottled Dark Faerie",
    "Fading Bottled Earth Faerie",
    "Fading Bottled Fire Faerie",
    "Fading Bottled Light Faerie",
    "Fading Bottled Fire Faerie",
    "Fading Bottled Water Faerie",
    "Jhudora the Dark Faerie Doll",
    "Mortog",
    "Silver Paint Brush",
    "Turmac",
    "Turtum",
    "Whinny"
]
// Defines minimum and maximum wait time before page refresh
const [min_time, max_time] = [3000, 4500]

// Refresh page logic
function reloadPageAtRandomIntervals(min_time, max_time) {

    // Defines items table from rubish dump
    const rubish_items = document.querySelectorAll("#content > table > tbody > tr > td.content > table > tbody > tr td");

    // If one item from the table matches one of the valid items clicks and breaks. Returns whether has found an item or not
    function itemSearch(){
        var item_found = false
        for (let i = 0; i < valid_items.length; i++) {
            const valid_item = valid_items[i];
            for (let index = 0; index < rubish_items.length; index++) {
                const item_element = rubish_items[index];
                var text_element = item_element.innerText
                var img_element = item_element.firstChild.firstChild

                if (text_element.includes(valid_item)) {
                    item_found = true
                    setTimeout(() => {
                        img_element.click()
                        }, 500);
                    break
                }
            }
        }
        return item_found;
    }
    function getRandomInterval(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }

    // Reloads page clicking on the keeper image
    function reload() {
        const keeper_img = document.querySelector("#content > table > tbody > tr > td.content > center:nth-child(1) > a > img")
        keeper_img.click()
    }

    function scheduleNextReload() {
        const dom = document.querySelector("*")
        // If a random event occurs itemSearch function brokes, this is a workarround that reloads the page before itemSearch is called.
        // If you are very unlucky you will get a RE at the same time a valid item appears and you probably gonna lose it. (Get a rabbit foot or something lol)
        if (dom.innerText.includes("Something has happened")) {
            setTimeout(() => {
                reload();
                }, 2446);
        }
        var interval = getRandomInterval(min_time, max_time);
        var timeout_ID = setTimeout(() => {
            reload();
            scheduleNextReload();
            }, interval);

        // Stop the program in "Something has happened" page when item is found
        if (itemSearch()) {
            clearTimeout(timeout_ID)
        }
    }

    scheduleNextReload();
  }

  // Call main function
  reloadPageAtRandomIntervals(min_time, max_time);
