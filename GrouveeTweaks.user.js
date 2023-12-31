// ==UserScript==
// @name         Grouvee Tweaks
// @namespace    https://ligature.me/
// @version      1.2
// @description  Add features to Grouvee.
// @author       You
// @match        https://www.grouvee.com/user/*/shelves/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';


  function waitFor(selector, cb) {
    // set up the mutation observer
    const observer = new MutationObserver(function (mutations, me) {
      // `mutations` is an array of mutations that occurred
      // `me` is the MutationObserver instance
      var element = document.querySelector(selector)
      if (element) {
        cb(element)
        me.disconnect() // stop observing
        return
      }
    });

    // start observing
    observer.observe(document, {
      childList: true,
      subtree: true
    })
  }

  function getVrLink(url) {
    const div = document.createElement('div')
    div.innerHTML = `
    <a href="${url}">Backlog VR</a>
    `
    return div
  }

  function addBacklogVr() {
    const backlogLink = document.querySelector('div>a[href*="backlog"]')
    const vrLink = getVrLink(backlogLink.href + '&and-shelves=605216')
    //backlogLink.parentElement.parentElement.insertBefore(vrLink, backlogLink.parentElement)
    backlogLink.parentElement.insertAdjacentElement('afterend', vrLink)
  }

  function gameSearch(shelves, term) {
    const searchTerm = encodeURIComponent(term)
    if (shelves.includes('Quest') || shelves.includes('Rift')) return `https://store.steampowered.com/search/?term=${searchTerm}`
    return `https://store.steampowered.com/search/?term=${searchTerm}`
  }

  //Add custom shelves
  addBacklogVr()
  //Link the games somewhere actually useful
  Array.from(document.querySelectorAll('table.table tbody tr')).forEach(row => {
    const gameLink = row.querySelector('div.wrapper a')
    const shelves = Array.from(row.querySelectorAll('input[data-shelf-id][checked]'))
      .map(i => i.parentElement.innerText.trim())

    gameLink.href = gameSearch(shelves, gameLink.innerText)
    gameLink.target = '_blank'
  })

})();
