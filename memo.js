/* Homework 11 (memo.js), by Xuanlei Ren
   CSc 337, Spring 2019 
   Purpose: this is a javascript file for html use. */

"use strict";

(function() { 

    window.onload = function() {
    	mainpage();
    	document.getElementById("memobutton").addEventListener('click', memo);
   		document.getElementById("addbutton").addEventListener('click', add);
    	document.getElementById("back").addEventListener('click', mainpage);
    };

    function mainpage(){
    	document.getElementById("memobutton").style.display = "block";
    	document.getElementById("addbutton").style.display = "block";
    	document.getElementById("memoarea").style.display = "none";
    	document.getElementById("inputarea").style.display = "none";
    }

    function memo(){
    	document.getElementById("memobutton").style.display = "none";
    	document.getElementById("addbutton").style.display = "none";
    	document.getElementById("memoarea").style.display = "block";
    	document.getElementById("inputarea").style.display = "none";
    	update();
    }

    function add(){
    	document.getElementById("memobutton").style.display = "none";
    	document.getElementById("addbutton").style.display = "none";
    	document.getElementById("memoarea").style.display = "none";
    	document.getElementById("inputarea").style.display = "block";
    	document.getElementById("save").addEventListener('click', save);
    }
    /**
 	 * function that send memo to web service.
  	 * @param {} none
 	 * @returns {} none.
 	 */
    function save(){
    	let url = "http://remindmeplz.herokuapp.com/"; 
    	let when = document.getElementById("when").value;
    	let what = document.getElementById("what").value;
    	let where = document.getElementById("where").value;
    	const memo = {when: when, where: where, what: what};
		const fetchOptions = {
			method : 'POST', 
			headers : {'Accept': 'application/json', 'Content-Type' : 'application/json'}, 
			body : JSON.stringify(memo)
		};

		document.getElementById("when").value = "";
		document.getElementById("what").value = "";
		document.getElementById("where").value = "";

		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function() {	
				alert("Memo saved successfully");
			})
			.catch(function(error) {
				alert("Memo didn't save");
				console.log(error);
			});
    }

    /**
 	 * function that refresh the page
  	 * @param {} none
 	 * @returns {} none.
 	 */
    function update(){
    	document.getElementById("memos").innerHTML = "";
    	let url = "http://remindmeplz.herokuapp.com/";
    	fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				let memos = JSON.parse(responseText).memos;
				for(let i = 0; i < memos.length; i++){
					let p = document.createElement("p");
					p.innerHTML = memos[i].when + " " + memos[i].what + " " + memos[i].where;
					document.getElementById("memos").appendChild(p);
				}
				
			})
			.catch(function(error) {
				console.log(error);
			});
    }

    /**
 	 * check status
  	 * @param {num} response
 	 * @returns {} none.
 	 */
    function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response.text();
		} else if (response.status == 500){ // no chat!
			let hint = document.createElement("p");
			hint.id = "hint";
			hint.innerHTML = "Add something...";
			document.getElementById("memos").appendChild(hint);
		} else {
			return Promise.reject(new Error(response.status + ": " + response.statusText));
		}
	}

})();
