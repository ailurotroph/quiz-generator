let test = {
	var1: "string",
	var2: 92,
	var3: "the one i call",
	var4: "last thing"
}
testFunction(test);
function testFunction({var1, var2, var3, var4}) {
	console.log(var1);
}