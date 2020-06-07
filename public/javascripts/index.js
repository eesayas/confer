//CREATE A MEETING button clicked!
$('.create-meeting-btn').on('click', function(){
    console.log('create meet btn');

    $('.create-meeting-cont').show();
    $('.home-buttons-cont').hide();

    $('.home-content .title').css("font-size", "4rem");
    $('.title-cont').css('margin-bottom', '2rem');

    $('.title-cont .subtitle').hide();

    $.post('/create-meeting', function(data){
        $('#meeting-id-input').val(data);
    });
});

//CANCEL button clicked!
$('.cancel-btn').on('click', function(){
    console.log('cancel btn clicked');

    $('.home-buttons-cont').show();
    $('.title-cont .subtitle').show();

    //if create meeting btns are visible
    if( $('.create-meeting-cont').is(':visible')){
        $('.create-meeting-cont').hide();
    }

    $('.home-content .title').css("font-size", "5rem");
    $('.title-cont').css('margin-bottom', '5rem');
});


//meeting id input clicked => copy id to clipboard!
$('#meeting-id-input').on('click', function(){

    let meetingId = document.getElementById('meeting-id-input');

    meetingId.select();
    meetingId.setSelectionRange(0, 99999); //for mobile devices

    document.execCommand('copy');

    $('.note').text('Copied to clipboard!');

    console.log(`copied id: ${ meetingId.value }`);
});

//START MEETING button clicked
$('.start-meeting-btn').on('click', function(){
    console.log('start meeting btn clicked');

    location.href = `/${ $('#meeting-id-input').val() }#init`;
});