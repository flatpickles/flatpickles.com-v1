function log(message) {
	console.log(message);
}

function selectTarget(target) {
	const newSelection = $(target);
	const previousSelection = $("span.selected");
	previousSelection.removeClass("selected");
	previousSelection.addClass("unselected");
	newSelection.addClass("selected");
}

const categories = [
	"audio",
	"video",
	"image",
	"text",
	"etc",
];

$(document).ready(function() {
	$("span.category").click(function(e) {
		// Apply category selection
		selectTarget(e.target);
		
		// Select selected selectors
		const selectedClass = e.target.id.split("_selector")[0];
		const unselectedClasses = categories.filter(function(type) {
			return (type != selectedClass);
		});
		var selectedRows = $("tr." + selectedClass);
		var unselectedSelector = unselectedClasses.reduce(function(currentSelectorString, unselectedClass) {
			return currentSelectorString + "tr." + unselectedClass + ", ";
		}, "").slice(0, -2);
		var unselectedRows = $(unselectedSelector);

		// "all" isn't actually a category, so unselected -> selected in this case
		if (selectedClass === "all") {
			selectedRows = unselectedRows;
			unselectedRows = $();
		}
		
		// Show & hide babyyy
		selectedRows.show();
		unselectedRows.hide();
	});
});