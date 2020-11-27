var ROOM_ID = "";

// go to start-meeting menu
$("#create-room").on("click", () => {
    // hide start-menu
    $("#start-menu").removeClass("d-flex").addClass("d-none");

    // show start-meeting menu
    $("#start-meeting").removeClass("d-none").addClass("d-flex");

    // send a post request to server to get room_id
    $.post("/", 
        // on success
        (data) => {
            // data.room_id;
            $("#room-id-input").val(data.room_id);
            ROOM_ID = data.room_id;
        }
    );
});

// cancel start meeting
$("#cancel-start").on("click", () => {
    // show start-menu again
    $("#start-menu").removeClass("d-none").addClass("d-flex");

    // hide start-meeting menu
    $("#start-meeting").removeClass("d-flex").addClass("d-none");
});

// go to join-meeting menu
$("#join-room").on("click", () => {
    // hide start-menu
    $("#start-menu").removeClass("d-flex").addClass("d-none");

    // show join-meeting-menu
    $("#join-meeting").removeClass("d-none").addClass("d-flex");
});

// cancel join meeting
$("#cancel-join").on("click", () => {
    // show start-menu again
    $("#start-menu").removeClass("d-none").addClass("d-flex");

    // hide start-meeting menu
    $("#join-meeting").removeClass("d-flex").addClass("d-none");
});

// start meeting
$("#start-meet").on("click", () => {
    if(ROOM_ID.length) window.location.href = `/${ROOM_ID}`
});

// join meeting
$("#join-meet").on("click", () => {
    if( $("#join-room-input").val().length ) window.location.href = `/${$("#join-room-input").val()}`
});