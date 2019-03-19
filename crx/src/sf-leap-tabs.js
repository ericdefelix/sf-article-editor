(function(){
	var getChildren = function(n, skipMe){
	  var r = [];
	  for ( ; n; n = n.nextSibling ) 
	    if (n.nodeType == 1 && n != skipMe) r.push(n);        
	  return r;
	};

	var getSiblings = function(n) {
	  return getChildren(n.parentNode.firstChild, n);
	}

	document.addEventListener('click', function (event) {
		event.preventDefault();
  	if (event.target.classList.value.indexOf('tab-item-link') !== -1) {
  		var targetID,
  				activeTabBtn,
  				targetTab,
  				targetTabSiblings,
  				activeBtnTabSiblings;

  		targetID = event.target.getAttribute('id').split('target_')[1];
  		activeTabBtn = event.target.parentNode;

  		targetTab = document.getElementById(targetID);
  		targetTabSiblings = getSiblings(targetTab);
  		activeBtnTabSiblings = getSiblings(activeTabBtn);

  		activeTabBtn.classList.add('active');
  		targetTab.classList.add('in');
  		
  		activeBtnTabSiblings.forEach( function(element, index) {
  			if (element.classList.value.indexOf('active') !== -1) element.classList.remove('active');
  		});
  		targetTabSiblings.forEach( function(element, index) {
  			if (element.classList.value.indexOf('in') !== -1) element.classList.remove('in');
  		});
  	}
  }, false);
})();