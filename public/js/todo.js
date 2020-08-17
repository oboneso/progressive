
// check off specific todos by clicking
$("ul").on("click", "li", function () {
    $(this).toggleClass("completed");
});

// click on x delete todo
$("ul").on("click", "span", function (event) {
    $(this).parent().fadeOut(500, function () {
        $(this).remove();
    });
    event.stopPropagation();
});


$(".fa-plus").click(function () {
    $("input[type='text']").fadeToggle();
})


