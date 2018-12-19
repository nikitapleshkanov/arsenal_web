function checkPasswordMatch(e) {
    var username = $("#name").val();
    var password = $("#password").val();
    var confirmPassword = $("#ConfirmPassword").val();
    if (password.length < 5){
        e.preventDefault();
        $(".MessagePassword:first").html("Слишком короткий пароль !");
        
    }
    else if (password != confirmPassword){
        e.preventDefault();
        $(".MessagePassword").html("Пароли не совпадают !");
    }   
    

}

$(document).ready(function () {
   $("#reg").click(checkPasswordMatch);
});