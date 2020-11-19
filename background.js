var newtabUrl="chrome://newtab/"
var created=false;
function checkAndCreate(){
	if (!created){
		chrome.tabs.query({},(tabs)=>{
			console.log(tabs[tabs.length-1].url);
			if (tabs[tabs.length-1].url!=newtabUrl){
				chrome.tabs.create({active:false, selected:false},()=>{});
			}
		});
		created=true;
		setTimeout(()=>{created=false;}, 2000);
	}
}

function checkAndDelete(i=-2){
	chrome.tabs.query({},(tabs)=>{
		var tar=tabs[(i>=0)?i:tabs.length+i];
		if (tar.url==newtabUrl && !tar.active){
			chrome.tabs.remove(tar.id,()=>{});
		}
	});
}

function removeEnd(){
	chrome.tabs.query({}, (tabs)=>{
		if (tabs[tabs.length-1].url==newtabUrl){
			for(var i=tabs.length-2; i>=0; i--){
				if (tabs[i].url==newtabUrl && !tabs[i].active)
					chrome.tabs.remove(tar.id,()=>{});
				else
					break;
			}
		}
	});
}
function removeAll(){
	chrome.tabs.query({}, (tabs)=>{
		if (tabs[tabs.length-1].url==newtabUrl){
			for(var i=tabs.length-2; i>=0; i--){
				if (tabs[i].url==newtabUrl && !tabs[i].active)
					chrome.tabs.remove(tabs[i].id,()=>{});
			}
		}
	});
}

checkAndCreate();
removeAll();

chrome.tabs.onUpdated.addListener((tabId, chInfo, tab)=>{
	removeAll();
	if (tab.url != newtabUrl){
		checkAndCreate();
	}
});

chrome.tabs.onCreated.addListener(()=>{
	removeAll();
});

chrome.tabs.onRemoved.addListener(()=>{
	checkAndCreate();
});

chrome.tabs.onMoved.addListener(()=>{
	removeAll();
	setTimeout(()=>{checkAndCreate();removeAll();},1000);
	setTimeout(()=>{checkAndCreate();removeAll();},5000);
});

chrome.tabs.onDetached.addListener((tabId, detInfo)=>{
	setTimeout(()=>{
	chrome.tabs.query({windowId:detInfo.oldWindowId}, (tabs)=>{
		if (tabs.length==1 && tabs[0].url == newtabUrl){
			chrome.tabs.remove(tabs[0].id,()=>{});
		}
	});

	}, 5000);
})

