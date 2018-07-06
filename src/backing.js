let tune = "irealb://%44%6F%78%79=%52%6F%6C%6C%69%6E%73%20%53%6F%6E%6E%79==%4D%65%64%69%75%6D%20%53%77%69%6E%67=%42%62==%31%72%33%34%4C%62%4B%63%75%37%28%37%41%20%37%62%37%20%41%37%58%37%62%42%5A%4C%37%46%20%37%43%5A%4C%37%20%47%29%37%44%28%37%62%41%5A%4C%29%37%62%45%28%79%51%7C%42%62%42%34%34%54%5B%45%7C%51%79%58%5A%41%62%37%28%20%6C%63%4B%51%79%58%37%62%42%7C%51%79%58%46%37%7C%51%79%58%37%43%5A%4C%37%47%20%29%37%44%4C%5A%45%62%37%4C%29%37%62%45%6F%37%58%79%51%7C%42%62%37%20%41%37%28%45%62%37%29%4C%5A%41%62%37%28%44%37%29%20%47%37%4C%5A%43%37%20%46%37%4C%5A%42%62%37%20%46%37%20%5A==%30=%30==="

function parseTune(tune) {
	console.log(decodeURI(tune))
}


function renderBackingUi(container, tune) {

	parseTune(tune)
    let keysWrapper = document.createElement('ol')

    container.appendChild(keysWrapper)
}




renderBackingUi(document.querySelector('.backing'), tune)