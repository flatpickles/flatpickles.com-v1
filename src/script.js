const categories = [
	"audio",
	"video",
	"image",
	"text",
	"etc",
];

const footers = [
	"A DJ Ham Hands Production",
	"Free Range, Grass Fed, California Beef",
	"And now, please consider going outside!",
	"Y’all come back soon now, ya hear?",
	"Be kind, stay hydrated",
	"Take a deep breath, and keep moving.",
	"Help, I'm trapped in the computer",
	"Whatever it is, stop worrying about it"
];

function selectTarget(target) {
	// Select selected selectors
	const newSelection = $(target);
	const previousSelection = $("span.selected");
	previousSelection.removeClass("selected");
	previousSelection.addClass("unselected");
	newSelection.addClass("selected");

	// Set hash parameter & history state
	const selectedClass = target.id.split("_selector")[0];
	const hashState = (selectedClass == "all") ? " " : "#" + selectedClass;
	history.replaceState(undefined, undefined, hashState);

	// Select selected rows, and unselect others
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
}

function randomizeFooter() {
	const footerIndex = Math.floor(Math.random() * footers.length);
	const randomFooter = footers[footerIndex];
	$("p.footer_text").html(randomFooter);
}

$(document).ready(function() {
	// Select category via URL hash parameter
	const hash = window.location.hash;
	const hashSelection = $(hash + "_selector");
	if (hashSelection.length) {
		selectTarget(hashSelection[0]);
	}

	// Select categories via user clicks
	$("span.category").click(function(e) {
		selectTarget(e.target);
		randomizeFooter();
	});

	// Randomly populate footer text
	randomizeFooter();
});
